import PageMetaData from "@/components/PageTitle";
import { getCandidateById } from "@/services/candidateService";
import type { CandidateType } from "@/types/candidate";
import { useEffect, useState } from "react";
import { Badge, Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import logoDark from "@/assets/images/logo-dark-full.png";
import logoLight from "@/assets/images/logo-light-full.png";

const CandidateDetails = () => {
  const [candidate, setCandidate] = useState<CandidateType>();
  const { candidateId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (candidateId) {
        const data = await getCandidateById(candidateId);
        if (data) setCandidate(data);
        else navigate("/pages/error-404-alt");
      }
    })();
  }, [candidateId, navigate]);

  const formatBirthDate = (dateStr?: string) => {
  if (!dateStr) return "Not specified";

  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day} of ${month} of ${year}`;
};

  return (
    <>
      <PageMetaData title={`${candidate?.user.firstName}  ${candidate?.user.lastName}` || "Not specified"} />

      <Row>
        <Col xs={12}>
          {candidate && (
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
                      {candidate.country || "Address not specified"}
                      <br />
                      {candidate.city || "City not specified"}
                      <br />
                      <abbr title="Phone">Phone:</abbr> {candidate.phone || "Not specified"}
                    </address>
                  </div>

                  <div className="float-sm-start">
                    <CardTitle as={"h5"} className="mb-2">
                      {candidate.user.firstName} {candidate.user.lastName}
                    </CardTitle>
                    <div className="d-flex gap-2 align-items-center">
                      <Badge pill bg="primary">
                        {candidate.desiredJobTitle || "Candidate"}
                      </Badge>
                      <span className="text-muted">#{candidate.id}</span>
                    </div>
                  </div>
                </div>

                <Row className="mt-4">
                  <Col md={6}>
                    <h6 className="fw-normal text-muted">Profile</h6>
                    <div className="mb-2">
                      <strong>Email:</strong> {candidate.user.email}
                    </div>
                    <div className="mb-2">
                      <strong>Phone:</strong> {candidate.phone}
                    </div>
                    <div className="mb-2">
                      <strong>Date of Birth:</strong> {formatBirthDate(candidate.birthDate)}
                    </div>
                   
                    <div className="mb-2">
                      <strong>Experience:</strong> {`${candidate.yearsOfExperience} years` || "Not specified"}
                    </div>
                    
                  </Col>
                </Row>

                {/*<Row className="mt-3">
                  <Col xs={12}>
                    <h6 className="fw-normal text-muted">About</h6>
                    <div className="p-3 bg-light rounded">
                      {candidate.bio || "No biography provided"}
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

export default CandidateDetails;
