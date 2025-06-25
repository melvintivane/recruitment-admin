import PageMetaData from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { deleteUser, getAllUsers } from "@/services/userService";
import { UserApiResponse, UserResponseDTO } from "@/types/user";
import { useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { withSwal } from "react-sweetalert2";
import { SweetAlertResult } from "sweetalert2";

interface UsersListProps {
  swal: {
    fire: (options: object) => Promise<SweetAlertResult>;
  };
}

interface PaginationState {
  page: number;
  size: number;
  sort: string;
}

const UsersList = withSwal(({ swal }: UsersListProps) => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: 10,
    sort: "createdAt,desc",
  });

  const queryClient = useQueryClient();

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery<UserApiResponse | UserResponseDTO[], Error>(
    ["users", pagination],
    () => getAllUsers(pagination.page, pagination.size),
    {
      keepPreviousData: true,
      staleTime: 5000,
      select: (data) => {
        // Transform the response into a consistent format
        if (Array.isArray(data)) {
          // If the response is already an array, wrap it in pagination structure
          return {
            content: data,
            totalElements: data.length,
            totalPages: 1,
            number: 0,
            size: data.length,
            first: true,
            last: true,
            numberOfElements: data.length,
            empty: data.length === 0,
            pageable: {
              pageNumber: 0,
              pageSize: data.length,
              sort: {
                empty: true,
                sorted: false,
                unsorted: true,
              },
              offset: 0,
              paged: true,
              unpaged: false,
            },
            sort: {
              empty: true,
              sorted: false,
              unsorted: true,
            },
          };
        } else if ((data as UserApiResponse).content) {
          // If the response is in Page format, use it as is
          return data as UserApiResponse;
        } else {
          // If the response is a single object, wrap it in an array and pagination structure
          return {
            content: [data as UserResponseDTO],
            totalElements: 1,
            totalPages: 1,
            number: 0,
            size: 1,
            first: true,
            last: true,
            numberOfElements: 1,
            empty: false,
            pageable: {
              pageNumber: 0,
              pageSize: 1,
              sort: {
                empty: true,
                sorted: false,
                unsorted: true,
              },
              offset: 0,
              paged: true,
              unpaged: false,
            },
            sort: {
              empty: true,
              sorted: false,
              unsorted: true,
            },
          };
        }
      },
    }
  );

  // Create a normalized users object that always has the same structure
  const users = apiResponse || {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 0,
    first: true,
    last: true,
    numberOfElements: 0,
    empty: true,
    pageable: {
      pageNumber: 0,
      pageSize: 0,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
      offset: 0,
      paged: false,
      unpaged: true,
    },
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
  };

  const deleteMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      swal.fire({
        title: "Deleted!",
        text: "The user has been deleted.",
        icon: "success",
        customClass: {
          confirmButton: "btn btn-success",
        },
      });
    },
    onError: () => {
      swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the user.",
        icon: "error",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
    },
  });

  const handleDelete = async (userId: string) => {
    const result = await swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-danger me-2",
        cancelButton: "btn btn-secondary",
      },
      buttonsStyling: false,
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(userId);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  const renderPaginationButtons = () => {
    if (!users?.totalPages) return null;

    const totalPages = users.totalPages;
    const currentPage = pagination.page;
    const buttons = [];

    // Always show first page
    buttons.push(
      <li key={0} className={`page-item ${currentPage === 0 ? "active" : ""}`}>
        <button className="page-link" onClick={() => handlePageChange(0)}>
          1
        </button>
      </li>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      buttons.push(
        <li key="left-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Show current page and neighbors
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages - 2, currentPage + 1);
      i++
    ) {
      buttons.push(
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i + 1}
          </button>
        </li>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 4) {
      buttons.push(
        <li key="right-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      buttons.push(
        <li
          key={totalPages - 1}
          className={`page-item ${currentPage === totalPages - 1 ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => handlePageChange(totalPages - 1)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return buttons;
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading users: {error.message}
      </div>
    );
  }

  return (
    <>
      <PageMetaData title="Users" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <div className="search-bar">
                  <span>
                    <IconifyIcon icon="bx:search-alt" className="mb-1" />
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    id="search"
                    placeholder="Search users..."
                  />
                </div>
                <div>
                  <Link to="/users/create" className="btn btn-success ms-2">
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    Add New User
                  </Link>
                </div>
              </div>
            </CardBody>
            <div>
              <div className="table-responsive table-centered">
                <table className="table text-nowrap mb-0">
                  <thead className="bg-light bg-opacity-50">
                    <tr>
                      <th className="border-0 py-2">Name</th>
                      <th className="border-0 py-2">Email</th>
                      <th className="border-0 py-2">Type</th>
                      <th className="border-0 py-2">Created At</th>
                       <th className="border-0 py-2">Updated At</th>
                      <th className="border-0 py-2">Status</th>
                      <th className="border-0 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-2">
                              <Spinner type="bordered" className="m-2" color="primary" />
                              <Spinner type="bordered" className="m-2" color="secondary" />
                              <Spinner type="bordered" className="m-2" color="success" />
                              <Spinner type="bordered" className="m-2" color="danger" />
                            </div>
                            <span className="text-center">Loading users...</span>
                          </div>
                        </td>
                      </tr>
                    ) : users?.content?.length ? (
                      users.content.map((user) => (
                        <tr key={user.id}>
                          <td>
                          
                              {user.firstName} {user.lastName}
                       
                          </td>
                          <td>{user.email}</td>
                          <td>{user.userType}</td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                          <td>
                            <span className="badge bg-success">Active</span>
                          </td>
                          <td>
                            <Button
                              onClick={() => navigate(`/users/edit/${user.id}`)}
                              variant="soft-secondary"
                              size="sm"
                              className="me-2"
                            >
                              <IconifyIcon icon="bx:edit" className="fs-16" />
                            </Button>
                            <Button
                              variant="soft-danger"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              disabled={deleteMutation.isLoading}
                            >
                              <IconifyIcon icon="bx:trash" className="fs-16" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {!isLoading && users && users.totalElements > 0 && (
                <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
                  <div className="col-sm">
                    <div className="text-muted">
                      Showing{" "}
                      <span className="fw-semibold">
                        {users.numberOfElements}
                      </span>{" "}
                      of{" "}
                      <span className="fw-semibold">
                        {users.totalElements}
                      </span>{" "}
                      users
                      <select
                        className="form-select form-select-sm ms-2 d-inline-block w-auto"
                        value={pagination.size}
                        onChange={(e) =>
                          handlePageSizeChange(Number(e.target.value))
                        }
                      >
                        {[5, 10, 20, 50].map((size) => (
                          <option key={size} value={size}>
                            {size} per page
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Col sm="auto" className="mt-3 mt-sm-0">
                    <ul className="pagination pagination-rounded m-0">
                      <li className={`page-item ${users.first ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(0)}
                          disabled={users.first}
                        >
                          <IconifyIcon icon="bx:left-arrow-alt" />
                        </button>
                      </li>
                      <li className={`page-item ${users.first ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={users.first}
                        >
                          Prev
                        </button>
                      </li>

                      {renderPaginationButtons()}

                      <li className={`page-item ${users.last ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={users.last}
                        >
                          Next
                        </button>
                      </li>
                      <li className={`page-item ${users.last ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(users.totalPages - 1)}
                          disabled={users.last}
                        >
                          <IconifyIcon icon="bx:right-arrow-alt" />
                        </button>
                      </li>
                    </ul>
                  </Col>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
});

export default UsersList;