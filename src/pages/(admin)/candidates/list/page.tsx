import PageMetaData from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { deleteCandidate, getAllCandidates } from "@/services/candidateService";
import { CandidateApiResponse, CandidateStatus } from "@/types/candidate";
import { useState } from "react";
import { Alert, Badge, Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { withSwal } from "react-sweetalert2";
import { SweetAlertResult } from "sweetalert2";

interface CandidatesListProps {
  swal: {
    fire: (options: object) => Promise<SweetAlertResult>;
  };
}

interface PaginationState {
  page: number;
  size: number;
  sort: string;
}

const CandidatesList = withSwal(({ swal }: CandidatesListProps) => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: 10,
    sort: "createdAt,desc",
  });

  const queryClient = useQueryClient();

  const {
    data: candidates,
    isLoading,
    error,
  } = useQuery<CandidateApiResponse, Error>(
    ["candidates", pagination],
    () => getAllCandidates(pagination.page, pagination.size),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const deleteMutation = useMutation(deleteCandidate, {
    onSuccess: () => {
      queryClient.invalidateQueries(["candidates"]);
      swal.fire({
        title: "Deleted!",
        text: "The candidate has been deleted.",
        icon: "success",
        customClass: {
          confirmButton: "btn btn-success",
        },
      });
    },
    onError: () => {
      swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the candidate.",
        icon: "error",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
    },
  });

  const handleDelete = async (candidateId: string) => {
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
      deleteMutation.mutate(candidateId);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  const renderPaginationButtons = () => {
    if (!candidates?.totalPages) return null;

    const totalPages = candidates.totalPages;
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
        Error loading candidates: {error.message}
      </div>
    );
  }

  return (
    <>
      <PageMetaData title="Candidates" />

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
                    placeholder="Search candidates..."
                  />
                </div>
                <div>
                  <Link to="/candidates/create" className="btn btn-success ms-2">
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    Add New Candidate
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
                      <th className="border-0 py-2">Contact</th>
                      <th className="border-0 py-2">Location</th>
                      <th className="border-0 py-2">Experience</th>
                      <th className="border-0 py-2">Desired Role</th>
                      <th className="border-0 py-2">Status</th>
                      <th className="border-0 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-2">
                              <Spinner type="bordered" className="m-2" color="primary" />
                              <Spinner type="bordered" className="m-2" color="secondary" />
                              <Spinner type="bordered" className="m-2" color="success" />
                              <Spinner type="bordered" className="m-2" color="danger" />
                            </div>
                            <span className="text-center">Loading candidates...</span>
                          </div>
                        </td>
                      </tr>
                    ) : candidates?.content?.length ? (
                      candidates.content.map((candidate) => (
                        <tr key={candidate.id}>
                          <td>
                            <Link to={`/candidates/${candidate.id}`} className="fw-medium">
                              {candidate.user?.firstName} {candidate.user?.lastName}
                            </Link>
                          </td>
                          <td>
                            <div>{candidate.phone}</div>
                            <div className="text-muted small">{candidate.user?.email}</div>
                          </td>
                          <td>
                            {[candidate.city, candidate.state, candidate.country]
                              .filter(Boolean)
                              .join(", ")}
                          </td>
                          <td>
                            {candidate.yearsOfExperience || 0} years
                          </td>
                          <td>
                            {candidate.desiredJobTitle || 'Not specified'}
                          </td>
                          <td>
                            <Badge
                              bg={
                                candidate.status === CandidateStatus.ACTIVE
                                  ? "success"
                                  : candidate.status === CandidateStatus.BLOCKED
                                    ? "danger"
                                    : candidate.status === CandidateStatus.PENDING
                                      ? "warning"
                                      : "secondary"
                              }
                            >
                              {candidate.status}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              onClick={() => navigate(`/candidates/edit/${candidate.id}`)}
                              variant="soft-secondary"
                              size="sm"
                              className="me-2"
                            >
                              <IconifyIcon icon="bx:edit" className="fs-16" />
                            </Button>
                            <Button
                              variant="soft-danger"
                              size="sm"
                              onClick={() => handleDelete(candidate.id)}
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
                          colSpan={6}
                          className="text-center py-4"
                        >
                          <Alert variant="info" className="text-center">
                            No candidates found.
                          </Alert>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {!isLoading && candidates && candidates.totalElements > 0 && (
                <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
                  <div className="col-sm">
                    <div className="text-muted">
                      Showing{" "}
                      <span className="fw-semibold">
                        {candidates.numberOfElements}
                      </span>{" "}
                      of{" "}
                      <span className="fw-semibold">
                        {candidates.totalElements}
                      </span>{" "}
                      candidates
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
                      <li className={`page-item ${candidates.first ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(0)}
                          disabled={candidates.first}
                        >
                          <IconifyIcon icon="bx:left-arrow-alt" />
                        </button>
                      </li>
                      <li className={`page-item ${candidates.first ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={candidates.first}
                        >
                          Prev
                        </button>
                      </li>

                      {renderPaginationButtons()}

                      <li className={`page-item ${candidates.last ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={candidates.last}
                        >
                          Next
                        </button>
                      </li>
                      <li className={`page-item ${candidates.last ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(candidates.totalPages - 1)}
                          disabled={candidates.last}
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

export default CandidatesList;