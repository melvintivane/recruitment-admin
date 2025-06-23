import { useState } from "react";
import { Alert, Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { withSwal } from "react-sweetalert2";
import PageMetaData from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import Spinner from "@/components/Spinner";
import { SweetAlertResult } from "sweetalert2";
import { ApplicationApiResponse } from "@/types/application";
import {
  deleteApplication,
  getApplications,
} from "@/services/applicationService";

interface ApplicationsListProps {
  swal: {
    fire: (options: object) => Promise<SweetAlertResult>;
  };
  jobId?: string; // Opcional para filtrar por vaga específica
}

interface PaginationState {
  page: number;
  size: number;
  sort: string;
}

const ApplicationsList = withSwal(({ swal, jobId }: ApplicationsListProps) => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: 10,
    sort: "createdAt,desc",
  });

  const queryClient = useQueryClient();

  // Query para buscar candidaturas
  const {
    data: applications,
    isLoading,
    error,
  } = useQuery<ApplicationApiResponse, Error>(
    ["applications", pagination, jobId],
    () => getApplications(pagination.page, pagination.size),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  // Mutação para deletar candidatura
  const deleteMutation = useMutation(deleteApplication, {
    onSuccess: () => {
      queryClient.invalidateQueries(["applications"]);
      swal.fire({
        title: "Deleted!",
        text: "The application has been deleted.",
        icon: "success",
        customClass: {
          confirmButton: "btn btn-success",
        },
      });
    },
    onError: () => {
      swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the application.",
        icon: "error",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
    },
  });

  const handleDelete = async (applicationId: string) => {
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
      deleteMutation.mutate(applicationId);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  const renderPaginationButtons = () => {
    if (!applications?.totalPages) return null;

    const totalPages = applications.totalPages;
    const currentPage = pagination.page;
    const buttons = [];

    // Sempre mostra primeira página
    buttons.push(
      <li key={0} className={`page-item ${currentPage === 0 ? "active" : ""}`}>
        <button className="page-link" onClick={() => handlePageChange(0)}>
          1
        </button>
      </li>
    );

    // Mostra ellipsis se necessário
    if (currentPage > 3) {
      buttons.push(
        <li key="left-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Mostra página atual e vizinhas
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages - 2, currentPage + 1);
      i++
    ) {
      buttons.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i + 1}
          </button>
        </li>
      );
    }

    // Mostra ellipsis se necessário
    if (currentPage < totalPages - 4) {
      buttons.push(
        <li key="right-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Sempre mostra última página se houver mais de uma página
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
        Error loading applications: {error.message}
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={jobId ? "Job Applications" : "All Applications"} />

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
                    placeholder="Search applications..."
                  />
                </div>
                {!jobId && (
                  <div>
                    <Link
                      to="/applications/create"
                      className="btn btn-success ms-2"
                    >
                      <IconifyIcon icon="bx:plus" className="me-1" />
                      New Application
                    </Link>
                  </div>
                )}
              </div>
            </CardBody>
            <div>
              <div className="table-responsive table-centered">
                <table className="table text-nowrap mb-0">
                  <thead className="bg-light bg-opacity-50">
                    <tr>
                      {!jobId && <th className="border-0 py-2">Job Title</th>}
                      <th className="border-0 py-2">Candidate</th>
                      <th className="border-0 py-2">Application Date</th>
                      <th className="border-0 py-2">Status</th>
                      <th className="border-0 py-2">Source</th>
                      <th className="border-0 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={jobId ? 5 : 6}
                          className="text-center py-4"
                        >
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
                              Loading applications...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : applications?.content?.length ? (
                      applications.content.map((application) => (
                        <tr key={application.id}>
                          {!jobId && (
                            <td>
                              <Link
                                to={`/vacancies/${application.job.id}/applications`}
                                className="fw-medium"
                              >
                                {application.job.title}
                              </Link>
                            </td>
                          )}
                          <td>
                            <Link
                              to={`/candidates/${application.candidate.id}`}
                              className="fw-medium"
                            >
                              {application.candidate.user.firstName +
                                " " +
                                application.candidate.user.lastName}
                            </Link>
                          </td>
                          <td>
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`badge badge-soft-${
                                application.status === "REJECTED"
                                  ? "danger"
                                  : application.status === "APPLIED"
                                    ? "primary"
                                    : application.status === "INTERVIEW"
                                      ? "warning"
                                      : application.status === "HIRED"
                                        ? "sucess"
                                        : application.status === "SHORTLISTED"
                                          ? "info"
                                          : "secondary"
                              }`}
                            >
                              {application.status}
                            </span>
                          </td>
                          <td>{application.applicationSource || "N/A"}</td>
                          <td>
                            <Button
                              variant="soft-secondary"
                              size="sm"
                              className="me-2"
                              onClick={() =>
                                navigate(`/applications/edit/${application.id}`)
                              }
                            >
                              <IconifyIcon icon="bx:edit" className="fs-16" />
                            </Button>
                            <Button
                              variant="soft-danger"
                              size="sm"
                              onClick={() => handleDelete(application.id)}
                              disabled={deleteMutation.isLoading}
                            >
                              <IconifyIcon icon="bx:trash" className="fs-16" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={jobId ? 5 : 6}
                          className="text-center py-4"
                        >
                          <Alert variant="info" className="text-center">
                            No applications found.
                          </Alert>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {!isLoading && applications && applications.totalElements > 0 && (
                <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
                  <div className="col-sm">
                    <div className="text-muted">
                      Showing{" "}
                      <span className="fw-semibold">
                        {applications.numberOfElements}
                      </span>{" "}
                      of{" "}
                      <span className="fw-semibold">
                        {applications.totalElements}
                      </span>{" "}
                      applications
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
                        className={`page-item ${applications.first ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(0)}
                          disabled={applications.first}
                        >
                          <IconifyIcon icon="bx:left-arrow-alt" />
                        </button>
                      </li>
                      <li
                        className={`page-item ${applications.first ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={applications.first}
                        >
                          Prev
                        </button>
                      </li>

                      {renderPaginationButtons()}

                      <li
                        className={`page-item ${applications.last ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={applications.last}
                        >
                          Next
                        </button>
                      </li>
                      <li
                        className={`page-item ${applications.last ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() =>
                            handlePageChange(applications.totalPages - 1)
                          }
                          disabled={applications.last}
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

export default ApplicationsList;
