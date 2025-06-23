import ComponentContainerCard from "@/components/ComponentContainerCard";
import LocationSelector from "@/components/LocationSelector";
import PageMetaData from "@/components/PageTitle";
import { getCandidateById, updateCandidate } from "@/services/candidateService";
import { CandidateUpdateDto } from "@/types/candidate";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const CandidateEdit = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    // User fields
    email: "",
    firstName: "",
    lastName: "",
    picture: "",
    gender: "",

    // Candidate fields
    country: "",
    phone: "",
    birthDate: formatDate(new Date().toString()),
    state: "",
    city: "",
    address: "",
    yearsOfExperience: 0,
    desiredJobTitle: "",
    status: "PENDING"
  });

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!candidateId) return;
      try {
        setIsLoading(true);
        const candidate = await getCandidateById(candidateId);
        if (candidate) {
          setFormData({
            email: candidate.user?.email || "",
            firstName: candidate.user?.firstName || "",
            lastName: candidate.user?.lastName || "",
            picture: candidate.user?.picture || "",
            gender: candidate.user?.gender || "",
            country: candidate.country || "",
            phone: candidate.phone || "",
            birthDate: candidate.birthDate ? formatDate(candidate.birthDate) : formatDate(new Date().toString()),
            state: candidate.state || "",
            city: candidate.city || "",
            address: candidate.address || "",
            yearsOfExperience: candidate.yearsOfExperience || 0,
            desiredJobTitle: candidate.desiredJobTitle || "",
            status: candidate.status || "PENDING"
          });
        }
      } catch (error) {
        console.error("Error fetching candidate:", error);
        toast.error("Failed to load candidate data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidate();
  }, [candidateId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (newLocation: {
    country: string;
    state: string;
    city: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...newLocation
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidateId) return;

    const formattedBirthDate = formatDate(formData.birthDate);
    if (!formattedBirthDate) {
      toast.error("Invalid birth date");
      return;
    }

    const updatedData: CandidateUpdateDto = {
      // User fields
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      picture: formData.picture,
      gender: formData.gender,

      // Candidate fields
      phone: formData.phone,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      address: formData.address,
      birthDate: formattedBirthDate,
      yearsOfExperience: Number(formData.yearsOfExperience),
      desiredJobTitle: formData.desiredJobTitle,
      status: formData.status
    };

    try {
      await updateCandidate({
        candidateId: candidateId,
        data: updatedData
      });
      toast.success("Candidate updated successfully!");
      navigate(`/candidates/${candidateId}`);
    } catch (error: any) {
      console.error("Error updating candidate:", error.message);
      toast.error(error.message || "Failed to update candidate");
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMetaData title="Edit Candidate" />
      <Row>
        <Col>
          <ComponentContainerCard
            id="candidate-edit-form"
            title="Edit Candidate"
            description="Update the candidate information below"
          >
            <Form onSubmit={handleSubmit}>
              {/* User Info */}
              <div className="mb-4">
                <h5 className="mb-3">User Information</h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="firstName">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="E.g.: John"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="lastName">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="E.g.: Doe"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="email">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                 
                        placeholder="E.g.: example@gmail.com"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="gender">
                      <Form.Label>Gender *</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group controlId="picture">
                      <Form.Label>Profile Picture URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="picture"
                        value={formData.picture}
                        onChange={handleChange}
                        placeholder="E.g.: https://example.com/profile.jpg"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Candidate Info */}
              <div className="mb-4">
                <h5 className="mb-3">Candidate Information</h5>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="phone">
                      <Form.Label>Phone Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="E.g.: +1234567890"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="birthDate">
                      <Form.Label>Birth Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="desiredJobTitle">
                      <Form.Label>Desired Job Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="desiredJobTitle"
                        value={formData.desiredJobTitle}
                        onChange={handleChange}
                        required
                        placeholder="E.g.: Software Engineer"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="yearsOfExperience">
                      <Form.Label>Years of Experience</Form.Label>
                      <Form.Control
                        type="number"
                        name="yearsOfExperience"
                        min="0"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <LocationSelector 
                  onLocationChange={handleLocationChange}
                  initialValues={{
                    country: formData.country,
                    state: formData.state,
                    city: formData.city
                  }}
                />

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group controlId="address">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="E.g.: 123 Main St, City, State, Zip"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="status">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="BLOCKED">Blocked</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  className="me-1"
                >
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/candidates/${candidateId}`)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  );
};

export default CandidateEdit;