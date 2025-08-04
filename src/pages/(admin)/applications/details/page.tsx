import logoDark from "@/assets/images/logo-dark-full.png";
import logoLight from "@/assets/images/logo-light-full.png";
import PageMetaData from "@/components/PageTitle";
import { downloadCv, getApplicationById } from "@/services/applicationService";
import { Application } from "@/types/application";
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Card,
  CardBody,
  CardTitle,
  Col,
  ListGroup,
  Row,
  Table,
  Tab,
  Tabs,
  Button,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import SubmissionButton from "./components/SubmissionButton";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { toast } from "react-toastify";

const ApplicationDetails = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("job");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        if (!id) {
          navigate("/pages/error-404-alt");
          return;
        }

        setLoading(true);
        const data = await getApplicationById(id);
        setApplication(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load application"
        );
        navigate("/pages/error-404-alt");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id, navigate]);

  if (loading) {
    return (
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 mb-0">Loading application details...</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }

  if (error) {
    return (
      <Row>
        <Col xs={12}>
          <Alert variant="danger" className="my-3">
            {error}
          </Alert>
        </Col>
      </Row>
    );
  }

  if (!application) {
    return null;
  }

  const statusVariant = {
    APPLIED: "primary",
    SHORTLISTED: "info",
    INTERVIEWED: "warning",
    HIRED: "success",
    REJECTED: "danger",
  }[application.status];

  const priorityVariant = {
    UNDEFINED: "secondary",
    LOW: "info",
    MEDIUM: "warning",
    HIGH: "danger",
  }[application.priority];

  return (
    <>
      <PageMetaData title={`Application for ${application.job.title}`} />

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="clearfix">
                <div className="float-sm-end">
                  <div className="auth-logo">
                    <img
                      className="logo-dark me-1"
                      height={24}
                      src={logoDark}
                      alt="logo-dark"
                    />
                    <img
                      className="logo-light me-1"
                      height={24}
                      src={logoLight}
                      alt="logo-light"
                    />
                  </div>
                  <address className="mt-3">
                    {application.job.company.city || "City not specified"},{" "}
                    {application.job.company.country} <br />
                    <abbr title="Phone">P:</abbr>{" "}
                    {application.job.company.mobileNumber}
                  </address>
                </div>
                <div className="float-sm-start">
                  <CardTitle as="h5" className="mb-2">
                    Application for: {application.job.title}
                  </CardTitle>
                  <div className="d-flex gap-2 align-items-center">
                    <Badge pill bg={statusVariant}>
                      {application.status}
                    </Badge>
                    <Badge pill bg={priorityVariant}>
                      {application.priority}
                    </Badge>
                    <span className="text-muted">#{application.id}</span>
                  </div>
                </div>
              </div>

              {/* Application Summary */}
              <Row className="mt-4">
                <Col md={6}>
                  <h6 className="fw-normal text-muted">Application Summary</h6>
                  <div className="mb-2">
                    <strong>Candidate:</strong>{" "}
                    {application.candidate.user.firstName}{" "}
                    {application.candidate.user.lastName}
                  </div>
                  <div className="mb-2">
                    <strong>Applied Date:</strong>{" "}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </div>
                  <div className="mb-2">
                    <strong>Source:</strong>{" "}
                    {application.applicationSource || "Not specified"}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-2">
                    <strong>Last Updated:</strong>{" "}
                    {new Date(application.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="mb-2">
                    {application.candidate.cvPath && (
                      <Button
                        variant="outline-primary"
                        className="text-decoration-none"
                        onClick={() => handleDownloadCv(application.candidate.cvPath)}
                      >
                        <IconifyIcon icon="bx:download" className="me-2" />
                        Download CV
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>

              {/* Main Content Tabs */}
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || "job")}
                className="mt-4"
                id="application-tabs"
              >
                <Tab eventKey="job" title="Job Details">
                  <div className="mt-3">
                    <Row>
                      <Col md={6}>
                        <h6 className="fw-normal text-muted">
                          Basic Information
                        </h6>
                        <div className="mb-2">
                          <strong>Company:</strong>{" "}
                          {application.job.company.name}
                        </div>
                        <div className="mb-2">
                          <strong>Location:</strong> {application.job.city},{" "}
                          {application.job.state}, {application.job.country}
                        </div>
                        <div className="mb-2">
                          <strong>Remote Allowed:</strong>{" "}
                          {application.job.remoteAllowed ? "Yes" : "No"}
                        </div>
                        <div className="mb-2">
                          <strong>Salary Range:</strong> $
                          {application.job.minSalary.toLocaleString()} - $
                          {application.job.maxSalary.toLocaleString()}
                        </div>
                        <div className="mb-2">
                          <strong>Experience Required:</strong>{" "}
                          {application.job.yearsOfExperience > 0
                            ? `${application.job.yearsOfExperience}+ years`
                            : "Not specified"}
                        </div>
                      </Col>
                      <Col md={6}>
                        <h6 className="fw-normal text-muted">
                          Additional Information
                        </h6>
                        <div className="mb-2">
                          <strong>Degree Required:</strong>{" "}
                          {application.job.degreeRequired || "Not specified"}
                        </div>
                        <div className="mb-2">
                          <strong>Career Level:</strong>{" "}
                          {application.job.careerLevel}
                        </div>
                        <div className="mb-2">
                          <strong>Job Type:</strong> {application.job.type}
                        </div>
                        <div className="mb-2">
                          <strong>Application Count:</strong>{" "}
                          {application.job.applicationCount}
                        </div>
                        <div className="mb-2">
                          <strong>View Count:</strong>{" "}
                          {application.job.viewCount}
                        </div>
                        <div className="mb-2">
                          <strong>Deadline:</strong>{" "}
                          {new Date(
                            application.job.deadline
                          ).toLocaleDateString()}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col xs={12}>
                        <h6 className="fw-normal text-muted">
                          Job Description
                        </h6>
                        <div className="p-3 bg-light rounded">
                          {application.job.description}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={6}>
                        <h6 className="fw-normal text-muted">
                          Required Skills
                        </h6>
                        <ListGroup>
                          {application.job.skills.length > 0 ? (
                            application.job.skills.map((skill) => (
                              <ListGroup.Item key={skill.id}>
                                {skill.name}
                              </ListGroup.Item>
                            ))
                          ) : (
                            <ListGroup.Item>
                              No specific skills required
                            </ListGroup.Item>
                          )}
                        </ListGroup>
                      </Col>

                      <Col md={6}>
                        <h6 className="fw-normal text-muted">Qualifications</h6>
                        <ListGroup>
                          {application.job.qualifications.length > 0 ? (
                            application.job.qualifications.map(
                              (qualification) => (
                                <ListGroup.Item key={qualification.id}>
                                  {qualification.name}
                                </ListGroup.Item>
                              )
                            )
                          ) : (
                            <ListGroup.Item>
                              No specific qualifications required
                            </ListGroup.Item>
                          )}
                        </ListGroup>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col xs={12}>
                        <h6 className="fw-normal text-muted">
                          Responsibilities
                        </h6>
                        <ListGroup>
                          {application.job.responsibilities.length > 0 ? (
                            application.job.responsibilities.map(
                              (responsibility) => (
                                <ListGroup.Item key={responsibility.id}>
                                  {responsibility.name}
                                </ListGroup.Item>
                              )
                            )
                          ) : (
                            <ListGroup.Item>
                              No specific responsibilities listed
                            </ListGroup.Item>
                          )}
                        </ListGroup>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col xs={12}>
                        <h6 className="fw-normal text-muted">
                          Company Details
                        </h6>
                        <div className="p-3 bg-light rounded">
                          <Row>
                            <Col md={4}>
                              <div className="mb-2">
                                <strong>Industry:</strong>{" "}
                                {application.job.company.industry}
                              </div>
                              <div className="mb-2">
                                <strong>Founded Year:</strong>{" "}
                                {application.job.company.foundedYear}
                              </div>
                              <div className="mb-2">
                                <strong>Employees:</strong>{" "}
                                {application.job.company.numberOfEmployees}
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="mb-2">
                                <strong>Business Type:</strong>{" "}
                                {application.job.company.businessType}
                              </div>
                              <div className="mb-2">
                                <strong>Website:</strong>{" "}
                                {application.job.company.website}
                              </div>
                              <div className="mb-2">
                                <strong>LinkedIn:</strong>{" "}
                                {application.job.company.linkedin}
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="mb-2">
                                <strong>Email:</strong>{" "}
                                {application.job.company.email}
                              </div>
                              <div className="mb-2">
                                <strong>Created At:</strong>{" "}
                                {new Date(
                                  application.job.company.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </Col>
                          </Row>
                          <div className="mt-2">
                            <strong>Company Description:</strong>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: application.job.company.description,
                              }}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Tab>

                <Tab eventKey="candidate" title="Candidate Details">
                  <div className="mt-3">
                    <Row>
                      <Col md={6}>
                        <h6 className="fw-normal text-muted">
                          Personal Information
                        </h6>
                        <div className="mb-2">
                          <strong>Full Name:</strong>{" "}
                          {application.candidate.user.firstName}{" "}
                          {application.candidate.user.lastName}
                        </div>
                        <div className="mb-2">
                          <strong>Email:</strong>{" "}
                          {application.candidate.user.email}
                        </div>
                        <div className="mb-2">
                          <strong>Phone:</strong>{" "}
                          {application.candidate.phone || "Not specified"}
                        </div>
                        <div className="mb-2">
                          <strong>LinkedIn:</strong>{" "}
                          {application.candidate.linkedin || "Not specified"}
                        </div>
                        <div className="mb-2">
                          <strong>Birth Date:</strong>{" "}
                          {application.candidate.birthDate
                            ? new Date(
                                application.candidate.birthDate
                              ).toLocaleDateString()
                            : "Not specified"}
                        </div>
                        <div className="mb-2">
                          <strong>Gender:</strong>{" "}
                          {application.candidate.user.gender}
                        </div>
                      </Col>
                      <Col md={6}>
                        <h6 className="fw-normal text-muted">
                          Location Information
                        </h6>
                        <div className="mb-2">
                          <strong>Address:</strong>{" "}
                          {application.candidate.address || "Not specified"}
                        </div>
                        <div className="mb-2">
                          <strong>City:</strong>{" "}
                          {application.candidate.city || "Not specified"}
                        </div>
                        <div className="mb-2">
                          <strong>State:</strong>{" "}
                          {application.candidate.state || "Not specified"}
                        </div>
                        <div className="mb-2">
                          <strong>Country:</strong>{" "}
                          {application.candidate.country || "Not specified"}
                        </div>
                        <div className="mb-2">
                          <strong>Nationality:</strong>{" "}
                          {application.candidate.country || "Not specified"}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col xs={12}>
                        <h6 className="fw-normal text-muted">
                          Professional Summary
                        </h6>
                        <div className="p-3 bg-light rounded">
                          {application.candidate.professionalSummary ||
                            "Not specified"}
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={6}>
                        <h6 className="fw-normal text-muted">Skills</h6>
                        <ListGroup>
                          {application.candidate.skills.length > 0 ? (
                            application.candidate.skills.map((skill) => (
                              <ListGroup.Item key={skill.id}>
                                {skill.name}
                              </ListGroup.Item>
                            ))
                          ) : (
                            <ListGroup.Item>No skills listed</ListGroup.Item>
                          )}
                        </ListGroup>
                      </Col>

                      <Col md={6}>
                        <h6 className="fw-normal text-muted">Languages</h6>
                        <ListGroup>
                          {application.candidate.languages.length > 0 ? (
                            application.candidate.languages.map((language) => (
                              <ListGroup.Item key={language.id}>
                                {language.name}
                              </ListGroup.Item>
                            ))
                          ) : (
                            <ListGroup.Item>No languages listed</ListGroup.Item>
                          )}
                        </ListGroup>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col xs={12}>
                        <h6 className="fw-normal text-muted">
                          Work Experience
                        </h6>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Company</th>
                              <th>Position</th>
                              <th>Location</th>
                              <th>Duties</th>
                            </tr>
                          </thead>
                          <tbody>
                            {application.candidate.experiences.length > 0 ? (
                              application.candidate.experiences.map((exp) => (
                                <tr key={exp.id}>
                                  <td>{exp.company || "Not specified"}</td>
                                  <td>{exp.position || "Not specified"}</td>
                                  <td>{exp.location || "Not specified"}</td>
                                  <td>{exp.duties || "Not specified"}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="text-center">
                                  No work experience listed
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col xs={12}>
                        <h6 className="fw-normal text-muted">Education</h6>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Institution</th>
                              <th>Degree</th>
                              <th>Course</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {application.candidate.educations.length > 0 ? (
                              application.candidate.educations.map((edu) => (
                                <tr key={edu.id}>
                                  <td>{edu.institution || "Not specified"}</td>
                                  <td>{edu.degree || "Not specified"}</td>
                                  <td>{edu.course || "Not specified"}</td>
                                  <td>{edu.description || "Not specified"}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="text-center">
                                  No education listed
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col xs={12}>
                        <h6 className="fw-normal text-muted">Trainings</h6>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Institution</th>
                              <th>Course</th>
                              <th>Description</th>
                              <th>Location</th>
                            </tr>
                          </thead>
                          <tbody>
                            {application.candidate.trainings.length > 0 ? (
                              application.candidate.trainings.map(
                                (training) => (
                                  <tr key={training.id}>
                                    <td>
                                      {training.institution || "Not specified"}
                                    </td>
                                    <td>
                                      {training.course || "Not specified"}
                                    </td>
                                    <td>
                                      {training.description || "Not specified"}
                                    </td>
                                    <td>
                                      {training.location || "Not specified"}
                                    </td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td colSpan={4} className="text-center">
                                  No trainings listed
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </div>
                </Tab>
              </Tabs>

              {application.feedback && (
                <Row className="mt-3">
                  <Col xs={12}>
                    <h6 className="fw-normal text-muted">Feedback</h6>
                    <div className="p-3 bg-light rounded">
                      {application.feedback}
                    </div>
                  </Col>
                </Row>
              )}
            </CardBody>
            <div className="mt-4 m-2 d-print-none">
              <SubmissionButton />
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ApplicationDetails;

const handleDownloadCv = async (cvPath: string) => {
  try {
    const filename = cvPath.split("/").pop() || "CV.pdf";
    const blob = await downloadCv(filename);

    // Cria um link temporário para download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // Define o nome do arquivo
    document.body.appendChild(a);
    a.click();

    // Limpeza
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success(`Download do CV iniciado`);
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Erro ao baixar o CV");
  }
};
