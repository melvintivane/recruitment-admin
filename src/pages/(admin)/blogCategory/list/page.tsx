import PageMetaData from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import {
  deleteBlogCategory,
  getAllBlogCategories,
} from "@/services/blogCategoryService";
import { BlogCategoryApiResponse } from "@/types/blogCategory";
import { useState } from "react";
import { Alert, Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { withSwal } from "react-sweetalert2";
import { SweetAlertResult } from "sweetalert2";

interface BlogCategoryListProps {
  swal: {
    fire: (options: object) => Promise<SweetAlertResult>;
  };
}

interface PaginationState {
  page: number;
  size: number;
  sort: string;
}

const BlogCategoryList = withSwal(({ swal }: BlogCategoryListProps) => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: 10,
    sort: "createdAt,desc",
  });

  const queryClient = useQueryClient();

  const {
    data: blogCategories,
    isLoading,
    error,
  } = useQuery<BlogCategoryApiResponse, Error>(
    ["blogCategories", pagination],
    () => getAllBlogCategories(),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const deleteMutation = useMutation(deleteBlogCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries(["blogCategories"]);
      swal.fire({
        title: "Deleted!",
        text: "The category has been deleted.",
        icon: "success",
        customClass: { confirmButton: "btn btn-success" },
      });
    },
    onError: () => {
      swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the category.",
        icon: "error",
        customClass: { confirmButton: "btn btn-danger" },
      });
    },
  });

  const handleDelete = async (categoryId: string) => {
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
      deleteMutation.mutate(categoryId);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  const renderPaginationButtons = () => {
    if (!blogCategories?.totalPages) return null;
    const totalPages = blogCategories.totalPages;
    const currentPage = pagination.page;
    const buttons = [];

    buttons.push(
      <li key={0} className={`page-item ${currentPage === 0 ? "active" : ""}`}>
        <button className="page-link" onClick={() => handlePageChange(0)}>1</button>
      </li>
    );

    if (currentPage > 3) {
      buttons.push(<li key="left-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
    }

    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages - 2, currentPage + 1);
      i++
    ) {
      buttons.push(
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>{i + 1}</button>
        </li>
      );
    }

    if (currentPage < totalPages - 4) {
      buttons.push(<li key="right-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
    }

    if (totalPages > 1) {
      buttons.push(
        <li key={totalPages - 1} className={`page-item ${currentPage === totalPages - 1 ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(totalPages - 1)}>{totalPages}</button>
        </li>
      );
    }

    return buttons;
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading blog categories: {error.message}
      </div>
    );
  }

  return (
    <>
      <PageMetaData title="Blog Categories" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <div className="search-bar">
                  <span><IconifyIcon icon="bx:search-alt" className="mb-1" /></span>
                  <input type="search" className="form-control" placeholder="Search blog categories..." />
                </div>
                <Link to="/blogs/categories/create" className="btn btn-success ms-2">
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Add New Category
                </Link>
              </div>
            </CardBody>
            <div className="table-responsive table-centered">
              <table className="table text-nowrap mb-0">
                <thead className="bg-light bg-opacity-50">
                  <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4">
                        <div className="flex flex-col items-center gap-4">
                          <div className="flex gap-2">
                            <Spinner
                              type="bordered"
                              className="m-2"
                              color="primary"
                            />
                            <Spinner
                              type="bordered"
                              className="m-2"
                              color="secondary"
                            />
                            <Spinner
                              type="bordered"
                              className="m-2"
                              color="success"
                            />
                            <Spinner
                              type="bordered"
                              className="m-2"
                              color="danger"
                            />
                          </div>
                          <span className="text-center">
                            Loading blog-categories...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : blogCategories?.content?.length ? (
                    blogCategories.content.map((category) => (
                      <tr key={category.id}>
                        <td>{category.name}</td>
                        <td>{category.code}</td>
                        <td>{category.description}</td>
                        <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button onClick={() => navigate(`/blogs/categories/edit/${category.id}`)} variant="soft-secondary" size="sm" className="me-2">
                            <IconifyIcon icon="bx:edit" className="fs-16" />
                          </Button>
                          <Button onClick={() => handleDelete(String(category.id))} variant="soft-danger" size="sm" disabled={deleteMutation.isLoading}>
                            <IconifyIcon icon="bx:trash" className="fs-16" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-4"
                      >
                        <Alert variant="info" className="text-center">
                          No blog categories found.
                        </Alert>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {!isLoading && blogCategories && blogCategories.totalElements > 0 && (
                <div className="row g-0 p-3 border-top justify-content-between align-items-center">
                  <div className="col-sm-auto text-muted">
                    Showing {blogCategories.numberOfElements} of {blogCategories.totalElements} categories
                    <select className="form-select form-select-sm ms-2 d-inline-block w-auto" value={pagination.size} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
                      {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>{size} per page</option>
                      ))}
                    </select>
                  </div>
                  <Col sm="auto" className="mt-3 mt-sm-0">
                    <ul className="pagination pagination-rounded m-0">
                      <li className={`page-item ${blogCategories.first ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(0)} disabled={blogCategories.first}>
                          <IconifyIcon icon="bx:left-arrow-alt" />
                        </button>
                      </li>
                      <li className={`page-item ${blogCategories.first ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(pagination.page - 1)} disabled={blogCategories.first}>Prev</button>
                      </li>
                      {renderPaginationButtons()}
                      <li className={`page-item ${blogCategories.last ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(pagination.page + 1)} disabled={blogCategories.last}>Next</button>
                      </li>
                      <li className={`page-item ${blogCategories.last ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(blogCategories.totalPages - 1)} disabled={blogCategories.last}>
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

export default BlogCategoryList;
