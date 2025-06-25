import PageMetaData from "@/components/PageTitle";
import { getCompanyById } from "@/services/companyService";
import type { CompanyType } from "@/types/company";
import { useEffect, useState } from "react";
import { Badge, Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import logoDark from "@/assets/images/logo-dark-full.png";
import logoLight from "@/assets/images/logo-light-full.png";

const CompanyDetails = () => {
  const [company, setCompany] = useState<CompanyType>();
  const { companyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (companyId) {
        const data = await getCompanyById(companyId);
        if (data) setCompany(data);
        else navigate("/pages/error-404-alt");
      }
    })();
  }, [companyId, navigate]);

  return (
    <>
      <PageMetaData title={company?.name ?? "Company Details"} />

      <Row>
        <Col xs={12}>
          {company && (
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
                      {company.country || "Address not specified"}
                      <br />
                      {company.city || "City not specified"}
                      <br />
                      <abbr title="Phone">P:</abbr> {company.mobileNumber}
                    </address>
                  </div>
                  <div className="float-sm-start">
                    <CardTitle as={"h5"} className="mb-2">
                      {company.name}
                    </CardTitle>
                    <div className="d-flex gap-2 align-items-center">
                      <Badge pill bg="info">
                        {company.industry}
                      </Badge>
                      <span className="text-muted">#{company.id}</span>
                    </div>
                  </div>
                </div>

                <Row className="mt-4">
                  <Col md={6}>
                    <h6 className="fw-normal text-muted">Company Details</h6>
                    <div className="mb-2">
                      <strong>Business Type:</strong> {company.businessType}
                    </div>
                    <div className="mb-2">
                      <strong>Founded:</strong> {company.foundedYear}
                    </div>
                    <div className="mb-2">
                      <strong>Employees:</strong> {company.numberOfEmployees}
                    </div>
                    <div className="mb-2">
                      <strong>Website:</strong>{" "}
                      {company.website ? (
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          Visit
                        </a>
                      ) : (
                        "Not specified"
                      )}
                    </div>
                    <div className="mb-2">
                      <strong>LinkedIn:</strong>{" "}
                      {company.linkedin ? (
                        <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                          Profile
                        </a>
                      ) : (
                        "Not specified"
                      )}
                    </div>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <h6 className="fw-normal text-muted">About Us</h6>
                    <div className="p-3 bg-light rounded">
                      {company.description || "No description provided"}
                    </div>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <h6 className="fw-normal text-muted">Contact Information</h6>
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <thead className="bg-light bg-opacity-50">
                          <tr>
                            <th className="border-0 py-2">Contact Method</th>
                            <th className="border-0 py-2">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Email</td>
                            <td>
                              {company.email ? (
                                <a href={`mailto:${company.email}`}>{company.email}</a>
                              ) : (
                                "Not specified"
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Phone</td>
                            <td>
                              {company.mobileNumber || "Not specified"}
                            </td>
                          </tr>
                          <tr>
                            <td>Location</td>
                            <td>
                              {company.city || "Not specified"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>

                {/*<Row className="mt-3">
                  <Col sm={12}>
                    <div className="clearfix pt-xl-3 pt-0">
                      <h6 className="text-muted">Additional Information:</h6>
                      <small className="text-muted">
                        {company.additionalInfo || 
                         "No additional information provided about this company."}
                      </small>
                    </div>
                  </Col>
                </Row>*/}
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
};

export default CompanyDetails;