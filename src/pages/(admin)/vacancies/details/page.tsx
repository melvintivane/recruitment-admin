import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Col, Row, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { getVacancyById } from "@/services/vacancyService";
import PageMetaData from "@/components/PageTitle";
import type { VacancyType } from "@/types/vacancy";
import SubmissionButton from "./components/SubmissionButton";

import logoDark from "@/assets/images/logo-dark-full.png";
import logoLight from "@/assets/images/logo-light-full.png";

const VacancyDetails = () => {
  const [vacancy, setVacancy] = useState<VacancyType>();
  const { vacancyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (vacancyId) {
        const data = await getVacancyById(vacancyId);
        if (data) setVacancy(data);
        else navigate("/pages/error-404-alt");
      }
    })();
  }, [vacancyId, navigate]);

  return (
    <>
      <PageMetaData title={vacancy?.title ?? "Vacancy Details"} />

      <Row>
        <Col xs={12}>
          {vacancy && (
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
                      Rua da Amizade, 41
                      <br />
                      Maputo 1101, MZ <br />
                      <abbr title="Telefone">T:</abbr> (+258) 82 530 9675
                    </address>
                  </div>
                  <div className="float-sm-start">
                    <CardTitle as={"h5"} className="mb-2">
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
                      <strong>Location:</strong> {vacancy.city.name},{" "}
                      {vacancy.city.state.name}
                    </div>
                    <div className="mb-2">
                      <strong>Type:</strong> {vacancy.type}
                    </div>
                    <div className="mb-2">
                      <strong>Salary:</strong> ${vacancy.minSalary} - $
                      {vacancy.maxSalary}
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
                      {vacancy.description}
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
                              {vacancy.degreeRequired
                                ? vacancy.degreeRequired
                                : "Not specified"}
                            </td>
                          </tr>
                          <tr>
                            <td>Experience</td>
                            <td>
                              {vacancy.yearsOfExperience
                                ? `${vacancy.yearsOfExperience}+ years of experience`
                                : "Not specified"}
                            </td>
                          </tr>
                          <tr>
                            <td>Skills</td>
                            <td>
                              {vacancy.requiredSkills.map((skill) => skill.name).join(", ") ||
                                "Not specified"}
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
                        This position may require occasional travel. We offer
                        competitive benefits including health insurance, 401(k)
                        matching, and flexible work arrangements. Applications
                        will be reviewed on a rolling basis.
                      </small>
                    </div>
                  </Col>
                  <Col sm={5}>
                    <div className="float-end">
                      <p>
                        <span className="fw-medium">Application Deadline:</span>
                        <span className="float-end">
                          {new Date(
                            new Date(vacancy.applicationDeadline).setDate(
                              new Date(vacancy.applicationDeadline).getDate() +
                                30
                            )
                          ).toLocaleDateString()}
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
          )}
        </Col>
      </Row>
    </>
  );
};

export default VacancyDetails;
