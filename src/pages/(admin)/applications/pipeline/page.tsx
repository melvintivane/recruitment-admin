/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Badge,
  Button,
  Modal,
  Form,
  Dropdown,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useMutation, useQuery } from "react-query";
import {
  getApplicationsByJob,
  updateApplication,
  updateApplicationStatus,
} from "@/services/applicationService";
import { ApplicationApiResponse, Application } from "@/types/application";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import Spinner from "@/components/Spinner";
import { useParams } from "react-router-dom";
import { withSwal } from "react-sweetalert2";
import { SweetAlertResult } from "sweetalert2";

// Constants moved to top level for better organization
const STATUS_OPTIONS = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEWED",
  "REJECTED",
  "HIRED",
] as const;

const PRIORITY_OPTIONS = ["UNDEFINED", "LOW", "MEDIUM", "HIGH"] as const;

const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  SHORTLISTED: "Shortlisted",
  INTERVIEWED: "Interviewed",
  REJECTED: "Rejected",
  HIRED: "Hired",
} as const;

const PRIORITY_LABELS: Record<string, string> = {
  UNDEFINED: "Undefined",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
} as const;

const STATUS_VARIANTS: Record<string, string> = {
  APPLIED: "primary",
  SHORTLISTED: "info",
  INTERVIEWED: "warning",
  REJECTED: "danger",
  HIRED: "success",
} as const;

const PRIORITY_VARIANTS: Record<string, string> = {
  HIGH: "danger",
  MEDIUM: "warning",
  LOW: "success",
  UNDEFINED: "secondary",
} as const;

// Types
interface PaginationState {
  page: number;
  size: number;
  sort: string;
}

interface VacanciesListProps {
  swal: {
    fire: (options: object) => Promise<SweetAlertResult>;
  };
}

type StatusType = (typeof STATUS_OPTIONS)[number];

// Custom hooks for better separation of concerns
const useApplicationFilters = (applications: Application[]) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredApplications = useMemo(() => {
    let filtered = applications;

    if (statusFilter !== "All") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.job.title.toLowerCase().includes(searchTerm) ||
          app.job.company.name.toLowerCase().includes(searchTerm) ||
          `${app.candidate.user.firstName} ${app.candidate.user.lastName}`
            .toLowerCase()
            .includes(searchTerm)
      );
    }

    return filtered;
  }, [applications, statusFilter, globalFilter]);

  return {
    globalFilter,
    setGlobalFilter,
    statusFilter,
    setStatusFilter,
    filteredApplications,
  };
};

const useStatusCounts = (applications: Application[]) => {
  return useMemo(() => {
    return STATUS_OPTIONS.reduce(
      (acc, status) => {
        acc[status] = applications.filter(
          (app) => app.status === status
        ).length;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [applications]);
};

// Utility functions
const getStatusVariant = (status: string): string =>
  STATUS_VARIANTS[status] || "secondary";

const getPriorityVariant = (priority: string): string =>
  PRIORITY_VARIANTS[priority] || "secondary";

// Main component
const JobApplicationPipeline = withSwal(({ swal }: VacanciesListProps) => {
  const { id } = useParams<{ id: string }>();

  // State management
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: 10,
    sort: "createdAt,desc",
  });

  // Data fetching
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<ApplicationApiResponse, Error>(
    ["applications", pagination, id],
    () => getApplicationsByJob(id!),
    {
      keepPreviousData: true,
      staleTime: 5000,
      enabled: !!id,
    }
  );

  const applications = useMemo(() => apiResponse?.content || [], [apiResponse]);

  // Custom hooks usage
  const {
    globalFilter,
    setGlobalFilter,
    statusFilter,
    setStatusFilter,
    filteredApplications,
  } = useApplicationFilters(applications);

  const statusCounts = useStatusCounts(applications);

  // Mutations
  const mutation = useMutation(updateApplication, {
    onSuccess: () => {
      toast.success("Application updated successfully!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update application");
    },
  });

  // Event handlers with useCallback for optimization
  const handleViewEdit = useCallback((application: Application) => {
    setSelectedApp(application);
    setIsEditing(true);
    setShowModal(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setSelectedApp(null);
    setIsEditing(false);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedApp(null);
  }, []);

  const handleStatusChange = useCallback(
    async (application: Application, newStatus: StatusType) => {
      try {
        if (newStatus === "REJECTED") {
          const confirmation = await swal.fire({
            title: "Confirm Rejection",
            html: `Are you sure you want to reject <b>${application.candidate.user.firstName} ${application.candidate.user.lastName}</b>?`,
            icon: "warning",
            input: "textarea",
            inputLabel: "Rejection reason (optional)",
            inputPlaceholder: "Enter the reason for rejection...",
            showCancelButton: true,
            confirmButtonText: "Confirm Rejection",
            cancelButtonText: "Cancel",
            customClass: {
              confirmButton: "btn btn-danger me-2",
              cancelButton: "btn btn-secondary",
            },
            buttonsStyling: false,
            reverseButtons: true,
          });

          if (!confirmation.isConfirmed) return;
        }

        await updateApplicationStatus(application.id, newStatus);
        toast.success(`Status updated to ${STATUS_LABELS[newStatus]}`);
        await refetch();
      } catch (error: any) {
        toast.error(`Failed to update status: ${error.message}`);
      }
    },
    [refetch, swal]
  );

  const handleSave = useCallback(
    async (formData: any) => {
      try {
        if (selectedApp) {
          await mutation.mutateAsync({ data: formData });
          toast.success("Application updated successfully");
        } else {
          // For new applications - implement creation logic
          toast.success("New application added successfully");
        }
        handleCloseModal();
        await refetch();
      } catch (error) {
        toast.error("Failed to save application");
      }
    },
    [selectedApp, mutation, refetch, handleCloseModal]
  );

  const onDragEnd = useCallback(
    (result: any) => {
      const { source, destination } = result;

      if (
        !destination ||
        (source.droppableId === destination.droppableId &&
          source.index === destination.index)
      ) {
        return;
      }

      const draggedApp = applications.find(
        (app) => app.id === result.draggableId
      );
      if (!draggedApp) return;

      const newStatus = destination.droppableId as StatusType;
      if (draggedApp.status !== newStatus) {
        handleStatusChange(draggedApp, newStatus);
      }
    },
    [applications, handleStatusChange]
  );

  const handlePaginationChange = useCallback((direction: "prev" | "next") => {
    setPagination((prev) => ({
      ...prev,
      page: direction === "prev" ? prev.page - 1 : prev.page + 1,
    }));
  }, []);

  // Loading and error states
  if (error) {
    return (
      <Alert variant="danger" className="m-4">
        <IconifyIcon icon="bx:error" className="me-2" />
        Error loading applications: {error.message}
      </Alert>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Job Application Pipeline</h3>
          <small className="text-muted">
            Manage and track job applications efficiently
          </small>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant={viewMode === "table" ? "primary" : "outline-primary"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <IconifyIcon icon="bx:table" className="me-1" />
            Table View
          </Button>
          <Button
            variant={viewMode === "kanban" ? "primary" : "outline-primary"}
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            <IconifyIcon icon="bx:columns" className="me-1" />
            Kanban View
          </Button>
          <Button variant="primary" onClick={handleAddNew}>
            <IconifyIcon icon="bx:plus" className="me-1" />
            Add Application
          </Button>
        </div>
      </div>

      {/* Status Overview Cards */}
      <Row className="mb-4">
        {STATUS_OPTIONS.map((status) => (
          <Col lg={2} md={4} sm={6} key={status} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-3">
                <div className="display-6 fw-bold mb-2 text-primary">
                  {statusCounts[status] || 0}
                </div>
                <Badge bg={getStatusVariant(status)} className="mb-2 px-3 py-2">
                  {STATUS_LABELS[status]}
                </Badge>
                <div className="small text-muted">Applications</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={8}>
              <Form.Group>
                <Form.Label>Search Applications</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <IconifyIcon icon="bx:search" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by job title, company, or candidate..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                  />
                  {globalFilter && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => setGlobalFilter("")}
                    >
                      <IconifyIcon icon="bx:x" />
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">
                    All Statuses ({applications.length})
                  </option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]} ({statusCounts[status] || 0})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {(globalFilter || statusFilter !== "All") && (
            <div className="mt-3 pt-3 border-top">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">
                  Showing {filteredApplications.length} of {applications.length}{" "}
                  applications
                </span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setGlobalFilter("");
                    setStatusFilter("All");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Content based on view mode */}
      {viewMode === "table" ? (
        <TableView
          applications={filteredApplications}
          isLoading={isLoading}
          onViewEdit={handleViewEdit}
          onStatusChange={handleStatusChange}
          apiResponse={apiResponse}
          onPaginationChange={handlePaginationChange}
          onDownloadCV={handleDownloadCV}
        />
      ) : (
        <KanbanView
          applications={filteredApplications}
          onDragEnd={onDragEnd}
          onViewEdit={handleViewEdit}
        />
      )}

      {/* Application Modal */}
      <ApplicationModal
        show={showModal}
        onHide={handleCloseModal}
        application={selectedApp}
        isEditing={isEditing}
        onSave={handleSave}
      />
    </div>
  );
});

// Separate components for better organization
const TableView: React.FC<{
  applications: Application[];
  isLoading: boolean;
  onViewEdit: (app: Application) => void;
  onStatusChange: (app: Application, status: StatusType) => void;
  apiResponse?: ApplicationApiResponse;
  onPaginationChange: (direction: "prev" | "next") => void;
  onDownloadCV: (cvPath: string, candidateName: string) => void;
}> = ({
  applications,
  isLoading,
  onViewEdit,
  onStatusChange,
  apiResponse,
  onPaginationChange,
  onDownloadCV,
}) => (
  <Card className="border-0 shadow-sm">
    <Card.Body className="p-0">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="bg-light">
            <tr>
              <th className="border-0 fw-semibold">Job Title</th>
              <th className="border-0 fw-semibold">Company</th>
              <th className="border-0 fw-semibold">Candidate</th>
              <th className="border-0 fw-semibold">Applied Date</th>
              <th className="border-0 fw-semibold">Status</th>
              <th className="border-0 fw-semibold">Priority</th>
              <th className="border-0 fw-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-5">
                  <Spinner type="grow" className="me-2" color="primary" />
                  Loading applications...
                </td>
              </tr>
            ) : applications.length > 0 ? (
              applications.map((application) => (
                <tr key={application.id} className="align-middle">
                  <td>
                    <div>
                      <strong className="d-block">
                        {application.job.title}
                      </strong>
                      <small className="text-muted">
                        {application.job.country}
                      </small>
                    </div>
                  </td>
                  <td>
                    <span className="fw-medium">
                      {application.job.company.name}
                    </span>
                  </td>
                  <td>
                    <div>
                      <span className="fw-medium">
                        {application.candidate.user.firstName}{" "}
                        {application.candidate.user.lastName}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted">
                      {dayjs(application.createdAt).format("MMM DD, YYYY")}
                    </span>
                  </td>
                  <td>
                    <Badge
                      bg={getStatusVariant(application.status)}
                      className="px-3 py-2"
                    >
                      {STATUS_LABELS[application.status]}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      bg={getPriorityVariant(application.priority)}
                      className="px-3 py-2"
                    >
                      {PRIORITY_LABELS[application.priority]}
                    </Badge>
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-info" size="sm">
                        Actions
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => onViewEdit(application)}>
                          <IconifyIcon icon="bx:edit" className="me-2" />
                          View/Edit
                        </Dropdown.Item>

                        {application.cvPath && (
                          <Dropdown.Item
                            onClick={() =>
                              onDownloadCV(
                                application.cvPath,
                                `${application.candidate.user.firstName} ${application.candidate.user.lastName}`
                              )
                            }
                          >
                            <IconifyIcon icon="bx:download" className="me-2" />
                            Download CV
                          </Dropdown.Item>
                        )}
                        <Dropdown.Divider />
                        <Dropdown.Header>Move to Status</Dropdown.Header>
                        {STATUS_OPTIONS.filter(
                          (status) => status !== application.status
                        ).map((status) => (
                          <Dropdown.Item
                            key={status}
                            onClick={() => onStatusChange(application, status)}
                          >
                            <Badge
                              bg={getStatusVariant(status)}
                              className="me-2"
                            >
                              {STATUS_LABELS[status]}
                            </Badge>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-5">
                  <div className="text-muted">
                    <IconifyIcon icon="bx:search" className="d-block mb-3" />
                    <h5>No applications found</h5>
                    <p>Try adjusting your search criteria or filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {apiResponse && apiResponse.totalElements > 0 && (
        <div className="d-flex justify-content-between align-items-center p-3 border-top">
          <div className="text-muted">
            Showing {apiResponse.numberOfElements} of{" "}
            {apiResponse.totalElements} applications
          </div>
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              disabled={apiResponse.first}
              onClick={() => onPaginationChange("prev")}
              className="me-2"
            >
              <IconifyIcon icon="bx:chevron-left" className="me-1" />
              Previous
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              disabled={apiResponse.last}
              onClick={() => onPaginationChange("next")}
            >
              Next
              <IconifyIcon icon="bx:chevron-right" className="ms-1" />
            </Button>
          </div>
        </div>
      )}
    </Card.Body>
  </Card>
);

const KanbanView: React.FC<{
  applications: Application[];
  onDragEnd: (result: any) => void;
  onViewEdit: (app: Application) => void;
}> = ({ applications, onDragEnd, onViewEdit }) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Row>
      {STATUS_OPTIONS.map((status) => (
        <Col lg={2} md={4} key={status} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-semibold">{STATUS_LABELS[status]}</h6>
                <Badge bg={getStatusVariant(status)} pill>
                  {applications.filter((app) => app.status === status).length}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="pt-3">
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-column ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                    style={{ minHeight: "200px" }}
                  >
                    {applications
                      .filter((app) => app.status === status)
                      .map((app, index) => (
                        <Draggable
                          key={app.id}
                          draggableId={app.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3"
                            >
                              <Card
                                className={`border-0 shadow-sm ${snapshot.isDragging ? "shadow" : ""}`}
                                style={{ cursor: "grab" }}
                              >
                                <Card.Body className="p-3">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div className="flex-grow-1">
                                      <h6 className="mb-1 fw-semibold">
                                        {app.job.title}
                                      </h6>
                                      <small className="text-muted d-block">
                                        {app.job.company.name}
                                      </small>
                                    </div>
                                    <Badge
                                      bg={getPriorityVariant(app.priority)}
                                      className="ms-2"
                                    >
                                      {PRIORITY_LABELS[app.priority]}
                                    </Badge>
                                  </div>

                                  <div className="mb-3">
                                    <small className="text-muted d-block">
                                      <IconifyIcon
                                        icon="bx:user"
                                        className="me-1"
                                      />
                                      {app.candidate.user.firstName}{" "}
                                      {app.candidate.user.lastName}
                                    </small>
                                    <small className="text-muted d-block">
                                      <IconifyIcon
                                        icon="bx:calendar"
                                        className="me-1"
                                      />
                                      {dayjs(app.createdAt).format(
                                        "MMM DD, YYYY"
                                      )}
                                    </small>
                                    <small className="text-muted">
                                      <IconifyIcon
                                        icon="bx:map"
                                        className="me-1"
                                      />
                                      {app.job.country}
                                    </small>
                                  </div>

                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="w-100 mb-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onViewEdit(app);
                                    }}
                                  >
                                    <IconifyIcon
                                      icon="bx:show"
                                      className="me-1"
                                    />
                                    View Details
                                  </Button>
                                  {app.cvPath && (
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      className="w-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadCV(
                                          app.cvPath,
                                          `${app.candidate.user.firstName} ${app.candidate.user.lastName}`
                                        );
                                      }}
                                    >
                                      <IconifyIcon
                                        icon="bx:download"
                                        className="me-1"
                                      />
                                      Download CV
                                    </Button>
                                  )}
                                </Card.Body>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}

                    {applications.filter((app) => app.status === status)
                      .length === 0 && (
                      <div className="text-center text-muted py-4">
                        <IconifyIcon
                          icon="bx:folder-open"
                          className="d-block mb-2"
                        />
                        <small>No applications</small>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </DragDropContext>
);

const ApplicationModal: React.FC<{
  show: boolean;
  onHide: () => void;
  application: Application | null;
  isEditing: boolean;
  onSave: (data: any) => void;
}> = ({ show, onHide, application, isEditing, onSave }) => (
  <Modal show={show} onHide={onHide} size="lg" centered>
    <Modal.Header closeButton className="border-0 pb-0">
      <Modal.Title className="fw-semibold">
        {isEditing ? "Edit Application" : "Add New Application"}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="pt-0">
      <ApplicationForm
        application={application}
        onSave={onSave}
        onCancel={onHide}
      />
    </Modal.Body>
  </Modal>
);

// Enhanced Application Form Component
const ApplicationForm: React.FC<{
  application: Application | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}> = ({ application, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: application?.id,
    jobTitle: application?.job.title || "",
    company: application?.job.company.name || "",
    status: application?.status || "APPLIED",
    priority: application?.priority || "MEDIUM",
    location: application?.job.country || "",
    notes: application?.notes || "",
    candidateName: application
      ? `${application.candidate.user.firstName} ${application.candidate.user.lastName}`
      : "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Job Title *</Form.Label>
            <Form.Control
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              readOnly={!!application}
              disabled={!!application}
              className={application ? "bg-light" : ""}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Company *</Form.Label>
            <Form.Control
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              readOnly={!!application}
              disabled={!!application}
              className={application ? "bg-light" : ""}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Candidate *</Form.Label>
            <Form.Control
              type="text"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleChange}
              readOnly={!!application}
              disabled={!!application}
              className={application ? "bg-light" : ""}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              readOnly={!!application}
              disabled={!!application}
              className={application ? "bg-light" : ""}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Priority</Form.Label>
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              {PRIORITY_OPTIONS.map((priority) => (
                <option key={priority} value={priority}>
                  {PRIORITY_LABELS[priority]}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label className="fw-semibold">Notes</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional notes or comments..."
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2 pt-3 border-top">
        <Button
          variant="outline-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          className="d-flex align-items-center"
        >
          {isSubmitting && <Spinner size="sm" className="me-2" />}
          <IconifyIcon icon="bx:save" className="me-1" />
          {application ? "Update" : "Save"} Application
        </Button>
      </div>
    </Form>
  );
};

export default JobApplicationPipeline;

// Utility function for downloading CV
const handleDownloadCV = async (cvPath: string, candidateName: string) => {
  try {
    // Extrai apenas o nome do arquivo do caminho completo
    const filename =
      cvPath.split("/").pop() || `CV_${candidateName.replace(/\s+/g, "_")}.pdf`;

    // Cria um link temporário para o download
    const downloadUrl = `/cv/download?filename=${encodeURIComponent(filename)}`;

    // Cria um link invisível e dispara o click
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Download do CV iniciado`);
  } catch (error) {
    toast.error("Erro ao baixar o CV");
    console.error("Download error:", error);
  }
};
