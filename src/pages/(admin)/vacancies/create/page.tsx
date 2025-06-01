import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageMetaData from "@/components/PageTitle";
import ComponentContainerCard from "@/components/ComponentContainerCard";

const VacanciesCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    console.log("Form submitted");
    navigate("/vacancies");
  };

  return (
    <>
      <PageMetaData title="Create Vacancy" />

      <Row>
        <Col>
          <ComponentContainerCard
            id="vacancy-create-form"
            title="Create New Job Vacancy"
            description="Fill in the form below to post a new job opening"
          >
            <Form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="mb-4">
                <h5 className="mb-3">Basic Information</h5>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="jobTitle">
                      <Form.Label>Job Title *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. Frontend Developer"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="department">
                      <Form.Label>Department *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. Engineering"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="jobType">
                      <Form.Label>Job Type *</Form.Label>
                      <Form.Select required>
                        <option value="">Select job type</option>
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="TEMPORARY">Temporary</option>
                        <option value="INTERNSHIP">Internship</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="jobStatus">
                      <Form.Label>Status *</Form.Label>
                      <Form.Select required>
                        <option value="OPEN">Open</option>
                        <option value="CLOSED">Closed</option>
                        <option value="DRAFT">Draft</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="location">
                      <Form.Label>Location *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. New York, NY"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="remoteAllowed">
                      <Form.Label>Remote Work</Form.Label>
                      <Form.Check
                        type="switch"
                        id="remoteSwitch"
                        label="Allow remote work"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <h5 className="mb-3">Requirements</h5>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="yearsOfExperience">
                      <Form.Label>Years of Experience *</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="e.g. 3"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="careerLevel">
                      <Form.Label>Career Level *</Form.Label>
                      <Form.Select required>
                        <option value="ENTRY">Entry Level</option>
                        <option value="MID">Mid Level</option>
                        <option value="SENIOR">Senior Level</option>
                        <option value="MANAGEMENT">Management</option>
                        <option value="EXECUTIVE">Executive</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="degreeRequired">
                      <Form.Label>Education Requirement *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. Bachelor's degree in Computer Science"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="genderPreference">
                      <Form.Label>Gender Preference</Form.Label>
                      <Form.Select>
                        <option value="UNSPECIFIED">No Preference</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Compensation */}
              <div className="mb-4">
                <h5 className="mb-3">Compensation</h5>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="minSalary">
                      <Form.Label>Minimum Salary *</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="e.g. 50000"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="maxSalary">
                      <Form.Label>Maximum Salary *</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="e.g. 80000"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Dates */}
              <div className="mb-4">
                <h5 className="mb-3">Dates</h5>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="postedDate">
                      <Form.Label>Posted Date *</Form.Label>
                      <Form.Control type="date" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="applicationDeadline">
                      <Form.Label>Application Deadline *</Form.Label>
                      <Form.Control type="datetime-local" required />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5 className="mb-3">Job Description</h5>

                <Form.Group controlId="description">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Enter detailed job description..."
                    required
                  />
                </Form.Group>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <h5 className="mb-3">Required Skills</h5>

                <Form.Group controlId="requiredSkills">
                  <Form.Label>Skills (comma separated) *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. React, JavaScript, TypeScript"
                    required
                  />
                </Form.Group>
              </div>

              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={() => window.print()}
                  className="me-1"
                >
                  Create
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  );
};

export default VacanciesCreate;
