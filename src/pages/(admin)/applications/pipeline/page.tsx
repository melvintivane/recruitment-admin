/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Form, Table, Dropdown, Alert } from 'react-bootstrap';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

// Mock data for demonstration
const mockApplications = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp',
    appliedDate: '2024-06-15',
    status: 'Applied',
    priority: 'High',
    salary: '$120,000',
    location: 'San Francisco, CA',
    notes: 'Applied through LinkedIn',
    nextAction: 'Follow up in 1 week',
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sarah.j@techcorp.com'
  },
  {
    id: '2',
    jobTitle: 'React Developer',
    company: 'StartupXYZ',
    appliedDate: '2024-06-18',
    status: 'Shortlisted',
    priority: 'Medium',
    salary: '$95,000',
    location: 'Remote',
    notes: 'Recruiter reached out',
    nextAction: 'interviewed scheduled',
    contactPerson: 'Mike Chen',
    contactEmail: 'mike@startupxyz.com'
  },
  {
    id: '3',
    jobTitle: 'Full Stack Engineer',
    company: 'InnovateLabs',
    appliedDate: '2024-06-20',
    status: 'Interviewed',
    priority: 'High',
    salary: '$130,000',
    location: 'New York, NY',
    notes: 'Great company culture',
    nextAction: 'Waiting for feedback',
    contactPerson: 'Emma Davis',
    contactEmail: 'emma@innovatelabs.com'
  },
  {
    id: '4',
    jobTitle: 'UI/UX Developer',
    company: 'DesignPro',
    appliedDate: '2024-06-12',
    status: 'Rejected',
    priority: 'Low',
    salary: '$85,000',
    location: 'Austin, TX',
    notes: 'Not a good fit for role',
    nextAction: 'None',
    contactPerson: 'Alex Wilson',
    contactEmail: 'alex@designpro.com'
  },
  {
    id: '5',
    jobTitle: 'Senior Software Engineer',
    company: 'MegaCorp',
    appliedDate: '2024-06-22',
    status: 'Hired',
    priority: 'High',
    salary: '$140,000',
    location: 'Seattle, WA',
    notes: 'Excellent benefits package',
    nextAction: 'Negotiate salary',
    contactPerson: 'Jennifer Lee',
    contactEmail: 'jennifer.lee@megacorp.com'
  }
];

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: string;
  priority: string;
  salary: string;
  location: string;
  notes: string;
  nextAction: string;
  contactPerson: string;
  contactEmail: string;
}

const statusOptions = ['Applied', 'Shortlisted', 'Interviewed', 'Rejected', 'Hired'];
const priorityOptions = ['Low', 'Medium', 'High'];

const JobApplicationPipeline = () => {
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Applied': return 'primary';
      case 'Shortlisted': return 'info';
      case 'Interviewed': return 'warning';
      case 'Rejected': return 'danger';
      case 'Hired': return 'success';
      default: return 'secondary';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'secondary';
    }
  };

  const statusCounts = useMemo(() => {
    return statusOptions.reduce((acc, status) => {
      acc[status] = applications.filter(app => app.status === status).length;
      return acc;
    }, {} as Record<string, number>);
  }, [applications]);

  const columns = useMemo<ColumnDef<JobApplication>[]>(
    () => [
      {
        accessorKey: 'jobTitle',
        header: 'Job Title',
        cell: ({ row }) => (
          <div>
            <strong>{row.original.jobTitle}</strong>
            <br />
            <small className="text-muted">{row.original.company}</small>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge bg={getStatusVariant(row.original.status)}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: ({ row }) => (
          <Badge bg={getPriorityVariant(row.original.priority)}>
            {row.original.priority}
          </Badge>
        ),
      },
      {
        accessorKey: 'appliedDate',
        header: 'Applied Date',
        cell: ({ row }) => dayjs(row.original.appliedDate).format('MMM DD, YYYY'),
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
      },
      {
        accessorKey: 'location',
        header: 'Location',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              Actions
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleViewEdit(row.original)}>
                View/Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange(row.original, 'Shortlisted')}>
                Move to Shortlisted
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange(row.original, 'Interviewed')}>
                Move to Technical
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange(row.original, 'Hired')}>
                Mark as Hired
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger" onClick={() => handleDelete(row.original.id)}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ),
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    let filtered = applications;
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    if (globalFilter) {
      filtered = filtered.filter(app =>
        app.jobTitle.toLowerCase().includes(globalFilter.toLowerCase()) ||
        app.company.toLowerCase().includes(globalFilter.toLowerCase()) ||
        app.location.toLowerCase().includes(globalFilter.toLowerCase())
      );
    }
    
    return filtered;
  }, [applications, statusFilter, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleViewEdit = (application: JobApplication) => {
    setSelectedApp(application);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleStatusChange = (application: JobApplication, newStatus: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === application.id 
          ? { ...app, status: newStatus }
          : app
      )
    );
    toast.success(`Application status updated to ${newStatus}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      setApplications(prev => prev.filter(app => app.id !== id));
      toast.success('Application deleted successfully');
    }
  };

  const handleSave = (formData: any) => {
    if (selectedApp) {
      setApplications(prev => 
        prev.map(app => 
          app.id === selectedApp.id 
            ? { ...app, ...formData }
            : app
        )
      );
      toast.success('Application updated successfully');
    } else {
      const newApp = {
        ...formData,
        id: Date.now().toString(),
        appliedDate: dayjs().format('YYYY-MM-DD')
      };
      setApplications(prev => [...prev, newApp]);
      toast.success('New application added successfully');
    }
    setShowModal(false);
    setSelectedApp(null);
  };

  const handleAddNew = () => {
    setSelectedApp(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // No change in position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Get the application being dragged
    const draggedApp = applications.find(app => app.id === result.draggableId);
    if (!draggedApp) return;

    // Update status based on the destination column
    const newStatus = destination.droppableId;
    if (draggedApp.status !== newStatus) {
      handleStatusChange(draggedApp, newStatus);
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Job Application Pipeline</h2>
        <Button variant="primary" onClick={handleAddNew}>
          + Add New Application
        </Button>
      </div>

      {/* Status Overview Cards */}
      <Row className="mb-4">
        {statusOptions.map(status => (
          <Col md={3} key={status} className="mb-3">
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="display-6 mb-2">{statusCounts[status] || 0}</div>
                <Badge bg={getStatusVariant(status)} className="mb-2">
                  {status}
                </Badge>
                <div className="small text-muted">Applications</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search Applications</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by job title, company, or location..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Applications Table */}
      <Card className="mt-4">
        <Card.Body>
          <Table responsive hover>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
          
          {filteredData.length === 0 && (
            <Alert variant="info" className="text-center">
              No applications found matching your criteria.
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Row>
          {statusOptions.map(status => (
            <Col md={4} key={status} className="mb-4">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">{status}</h5>
                    <Badge bg={getStatusVariant(status)} pill>
                      {applications.filter(app => app.status === status).length}
                    </Badge>
                  </div>
                  
                  <Droppable droppableId={status}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="kanban-column"
                        style={{ minHeight: '100px' }}
                      >
                        {applications
                          .filter(app => app.status === status)
                          .map((app, index) => (
                            <Draggable key={app.id} draggableId={app.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-3"
                                >
                                  <Card>
                                    <Card.Body>
                                      <div className="d-flex justify-content-between">
                                        <div>
                                          <h6>{app.jobTitle}</h6>
                                          <small className="text-muted">{app.company}</small>
                                        </div>
                                        <Badge bg={getPriorityVariant(app.priority)}>
                                          {app.priority}
                                        </Badge>
                                      </div>
                                      <div className="mt-2">
                                        <small className="text-muted d-block">
                                          Applied: {dayjs(app.appliedDate).format('MMM DD')}
                                        </small>
                                        <small className="text-muted">
                                          {app.location}
                                        </small>
                                      </div>
                                    </Card.Body>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </DragDropContext>

      {/* Application Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedApp ? 'Edit Application' : 'Add New Application'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ApplicationForm
            application={selectedApp}
            onSave={handleSave}
            onCancel={() => setShowModal(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

// Application Form Component
const ApplicationForm: React.FC<{
  application: JobApplication | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}> = ({ application, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    jobTitle: application?.jobTitle || '',
    company: application?.company || '',
    status: application?.status || 'Applied',
    priority: application?.priority || 'Medium',
    salary: application?.salary || '',
    location: application?.location || '',
    notes: application?.notes || '',
    nextAction: application?.nextAction || '',
    contactPerson: application?.contactPerson || '',
    contactEmail: application?.contactEmail || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Job Title *</Form.Label>
            <Form.Control
              type="text"
              value={formData.jobTitle}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Company *</Form.Label>
            <Form.Control
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              {priorityOptions.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Salary</Form.Label>
            <Form.Control
              type="text"
              value={formData.salary}
              onChange={(e) => handleChange('salary', e.target.value)}
              placeholder="e.g., $120,000"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., San Francisco, CA"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Contact Person</Form.Label>
            <Form.Control
              type="text"
              value={formData.contactPerson}
              onChange={(e) => handleChange('contactPerson', e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Contact Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Notes</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Next Action</Form.Label>
        <Form.Control
          type="text"
          value={formData.nextAction}
          onChange={(e) => handleChange('nextAction', e.target.value)}
          placeholder="e.g., Follow up in 1 week"
        />
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Application
        </Button>
      </div>
    </Form>
  );
};

export default JobApplicationPipeline;