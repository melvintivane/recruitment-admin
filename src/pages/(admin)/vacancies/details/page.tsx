import logoDark from "@/assets/images/logo-dark-full.png";
import logoLight from "@/assets/images/logo-light-full.png";
import PageMetaData from "@/components/PageTitle";
import { getVacancyById } from "@/services/vacancyService";
import { VacancyType } from "@/types/vacancy";
import { useEffect, useState } from "react";
import { Alert, Badge, Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import SubmissionButton from "./components/SubmissionButton";

const VacancyDetails = () => {
  const [vacancy, setVacancy] = useState<VacancyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        if (!id) {
          navigate("/pages/error-404-alt");
          return;
        }

        setLoading(true);
        const data = await getVacancyById(id);
        setVacancy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load vacancy");
        navigate("/pages/error-404-alt");
      } finally {
        setLoading(false);
      }
    };

    fetchVacancy();
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
              <p className="mt-2 mb-0">Loading vacancy details...</p>
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

  if (!vacancy) {
    return null;
  }

  const formatJobType = (type: string) => {
    switch (type) {
      case 'FULL_TIME':
        return 'Full-time';
      case 'PART_TIME':
        return 'Part-time';
      case 'CONTRACT':
        return 'Contract';
      case 'INTERNSHIP':
        return 'Internship';
      default:
        return type;
    }
  };

  return (
    <>
      <PageMetaData title={vacancy.title || "Vacancy Details"} />

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
                    {vacancy.company.city || 'City not specified'}, {vacancy.company.country} <br />
                    <abbr title="Phone">P:</abbr> {vacancy.company.mobileNumber}
                  </address>
                </div>
                <div className="float-sm-start">
                  <CardTitle as="h5" className="mb-2">
                    {vacancy.title}
                  </CardTitle>
                  <div className="d-flex gap-2 align-items-center">
                    <Badge
                      pill
                      bg={
                        vacancy.status === "ACTIVE"
                          ? "success"
                          : vacancy.status === "CLOSED"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {vacancy.status}
                    </Badge>
                    <span className="text-muted">#{vacancy.id}</span>
                  </div>
                </div>
              </div>

              <Row className="mt-4">
                <Col md={6}>
                  <h6 className="fw-normal text-muted">Position Details</h6>
                  <div className="mb-2">
                    <strong>Company:</strong> {vacancy.company.name}
                  </div>
                  <div className="mb-2">
                    <strong>Location:</strong> {vacancy.city}, {vacancy.country}
                  </div>
                  <div className="mb-2">
                    <strong>Type:</strong> {formatJobType(vacancy.type)}
                  </div>
                  <div className="mb-2">
                    <strong>Salary Range:</strong> ${vacancy.minSalary.toLocaleString()} - $
                    {vacancy.maxSalary.toLocaleString()}
                  </div>
                  <div className="mb-2">
                    <strong>Posted Date:</strong>{" "}
                    {new Date(vacancy.createdAt).toLocaleDateString()}
                  </div>
                  <div className="mb-2">
                    <strong>Applications:</strong> {vacancy.applicationCount}
                  </div>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col xs={12}>
                  <h6 className="fw-normal text-muted">Job Description</h6>
                  <div className="p-3 bg-light rounded">
                    <div dangerouslySetInnerHTML={{ __html: vacancy.description }} />
                  </div>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col xs={12}>
                  <h6 className="fw-normal text-muted">Requirements</h6>
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead className="bg-light bg-opacity-50">
                        <tr>
                          <th className="border-0 py-2">Category</th>
                          <th className="border-0 py-2">Requirements</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Education</td>
                          <td>
                            {vacancy.degreeRequired || "Not specified"}
                          </td>
                        </tr>
                        <tr>
                          <td>Experience</td>
                          <td>
                            {vacancy.yearsOfExperience > 0
                              ? `${vacancy.yearsOfExperience}+ years`
                              : "Not specified"}
                          </td>
                        </tr>
                        <tr>
                          <td>Skills</td>
                          <td>
                            {vacancy.skills.length > 0
                              ? vacancy.skills.map(skill => skill.name).join(", ")
                              : "Not specified"}
                          </td>
                        </tr>
                        <tr>
                          <td>Career Level</td>
                          <td>
                            {vacancy.careerLevel.charAt(0) + vacancy.careerLevel.slice(1).toLowerCase()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col sm={7}>
                  <div className="clearfix pt-xl-3 pt-0">
                    <h6 className="text-muted">Notes:</h6>
                    <small className="text-muted">
                      {vacancy.remoteAllowed ? "This position allows remote work. " : ""}
                      Applications will be reviewed on a rolling basis until the deadline.
                    </small>
                  </div>
                </Col>
                <Col sm={5}>
                  <div className="float-end">
                    <p>
                      <span className="fw-medium">Application Deadline:</span>
                      <span className="float-end">
                        {new Date(vacancy.deadline).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <div className="clearfix" />
                </Col>
              </Row>

              <div className="mt-5 mb-1">
                <SubmissionButton />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default VacancyDetails;