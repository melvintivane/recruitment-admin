/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { withSwal } from "react-sweetalert2";
import PageMetaData from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import Spinner from "@/components/Spinner";
import { getAllVacancies, deleteVacancy } from "@/services/vacancyService";
import { VacancyApiResponse } from "@/types/vacancy";

const VacanciesList = withSwal((props: any) => {
  const { swal } = props;
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: "createdAt,desc",
  });
  const [vacancies, setVacancies] = useState<VacancyApiResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const data = await getAllVacancies(pagination.page, pagination.size);
        setVacancies(data);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [pagination]);

  const deleteMutation = useMutation(deleteVacancy, {
    onSuccess: () => {
      queryClient.invalidateQueries("vacancies");
    },
    onError: (error) => {
      console.error("Error deleting vacancy:", error);
    },
  });

  const handleDelete = (vacancyId: string) => {
    swal
      .fire({
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
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          deleteMutation.mutate(vacancyId, {
            onSuccess: () => {
              swal.fire({
                title: "Deleted!",
                text: "The vacancy has been deleted.",
                icon: "success",
                customClass: {
                  confirmButton: "btn btn-success",
                },
              });
            },
            onError: () => {
              swal.fire({
                title: "Error!",
                text: "An error occurred while deleting the vacancy.",
                icon: "error",
                customClass: {
                  confirmButton: "btn btn-danger",
                },
              });
            },
          });
        }
      });
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  return (
    <>
      <PageMetaData title="Job Vacancies" />

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
                    placeholder="Search vacancies..."
                  />
                </div>
                <div>
                  <Link to="/vacancies/create" className="btn btn-success ms-2">
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    Post New Job
                  </Link>
                </div>
              </div>
            </CardBody>
            <div>
              <div className="table-responsive table-centered">
                <table className="table text-nowrap mb-0">
                  <thead className="bg-light bg-opacity-50">
                    <tr>
                      <th className="border-0 py-2">Job Title</th>
                      <th className="border-0 py-2">Company</th>
                      <th className="border-0 py-2">Location</th>
                      <th className="border-0 py-2">Type</th>
                      <th className="border-0 py-2">Posted Date</th>
                      <th className="border-0 py-2">Status</th>
                      <th className="border-0 py-2">Applications</th>
                      <th className="border-0 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-2">
                              <Spinner type="bordered" className="m-2" color="primary"/>
                              <Spinner type="bordered" className="m-2" color="secondary"/>
                              <Spinner type="bordered" className="m-2" color="success"/>
                              <Spinner type="bordered" className="m-2" color="danger"/>
                            </div>
                            <span className="text-center">
                              Loading vacancies...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : vacancies?.content?.length ? (
                      vacancies.content.map((vacancy, idx) => (
                        <tr key={idx}>
                          <td>
                            <Link
                              to={`/vacancies/${vacancy.id}`}
                              className="fw-medium"
                            >
                              {vacancy.title}
                            </Link>
                          </td>
                          <td>{vacancy.company.name}</td>
                          <td>{`${vacancy.city.name}, ${vacancy.city.state.name}`}</td>
                          <td>{vacancy.type}</td>
                          <td>
                            {new Date(vacancy.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`badge badge-soft-${
                                vacancy.status === "CLOSED"
                                  ? "danger"
                                  : vacancy.status === "PENDING"
                                    ? "warning"
                                    : "success"
                              }`}
                            >
                              {vacancy.status}
                            </span>
                          </td>
                          <td>{vacancy.applicationCount}</td>
                          <td>
                            <Button
                              variant="soft-secondary"
                              size="sm"
                              type="button"
                              className="me-2"
                            >
                              <IconifyIcon icon="bx:edit" className="fs-16" />
                            </Button>
                            <Button
                              variant="soft-danger"
                              size="sm"
                              type="button"
                              onClick={() => handleDelete(vacancy.id)}
                              disabled={deleteMutation.isLoading}
                            >
                              <IconifyIcon
                                icon="bx:trash"
                                className="bx bx-trash fs-16"
                              />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          No vacancies found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {!isLoading && (
                <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
                  <div className="col-sm">
                    <div className="text-muted">
                      Showing{" "}
                      <span className="fw-semibold">
                        {vacancies?.numberOfElements}
                      </span>{" "}
                      of{" "}
                      <span className="fw-semibold">
                        {vacancies?.totalElements}
                      </span>{" "}
                      jobs
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
                      <li
                        className={`page-item ${vacancies?.first ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(0)}
                          disabled={vacancies?.first}
                        >
                          <IconifyIcon icon="bx:left-arrow-alt" />
                        </button>
                      </li>
                      <li
                        className={`page-item ${vacancies?.first ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={vacancies?.first}
                        >
                          Prev
                        </button>
                      </li>

                      {Array.from(
                        { length: Math.min(5, vacancies?.totalPages ?? 0) },
                        (_, i) => {
                          const totalPages = vacancies?.totalPages ?? 0;
                          let pageNum: number;

                          if (totalPages <= 5) {
                            pageNum = i;
                          } else if (pagination.page <= 2) {
                            pageNum = i;
                          } else if (pagination.page >= totalPages - 3) {
                            pageNum = totalPages - 5 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }

                          pageNum = Math.max(
                            0,
                            Math.min(pageNum, totalPages - 1)
                          );

                          return (
                            <li
                              key={pageNum}
                              className={`page-item ${pagination.page === pageNum ? "active" : ""}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(pageNum)}
                                disabled={pageNum === pagination.page}
                              >
                                {pageNum + 1}
                              </button>
                            </li>
                          );
                        }
                      )}

                      <li
                        className={`page-item ${vacancies?.last ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={vacancies?.last}
                        >
                          Next
                        </button>
                      </li>
                      <li
                        className={`page-item ${vacancies?.last ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange((vacancies?.totalPages || 1) - 1)
                          }
                          disabled={vacancies?.last}
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

export default VacanciesList;
