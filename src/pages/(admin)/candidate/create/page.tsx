import ComponentContainerCard from "@/components/ComponentContainerCard";
import LocationSelector from "@/components/LocationSelector";
import PageMetaData from "@/components/PageTitle";
import { createCandidate } from "@/services/candidateService";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return ""; // Invalid date
  return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

const CandidatesCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // User fields
    email: "",
    password: "",
    comfirmPassword: "",
    firstName: "",
    lastName: "",
    picture: "",
    gender: "",

    // Candidate fields
    country: "",
    phone: "",
    birthDate: formatDate(new Date().toString()), // default to today
    state: "",
    city: "",
    address: "",
    yearsOfExperience: 0,
    desiredJobTitle: "",
    status: "PENDING"
  });

  const [passwordError, setPasswordError] = useState("");

  const mutation = useMutation(createCandidate, {
    onSuccess: () => {
      toast.success("Candidate created successfully!");
      navigate("/candidates");
    },
    onError: (error: any) => {
      console.error("Error creating candidate:", error.message);
      toast.error(error.message || "Failed to create candidate");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" || name === "comfirmPassword") {
      setPasswordError("");
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.comfirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const formattedBirthDate = formatDate(formData.birthDate);
    if (!formattedBirthDate) {
      toast.error("Invalid birth date");
      return;
    }

    const userData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      picture: formData.picture,
      gender: formData.gender,
    };

    const candidateData = {
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

    const payload = {
      ...userData,
      ...candidateData
    };

    mutation.mutate(payload);
  };

  return (
    <>
      <PageMetaData title="Create Candidate" />
      <Row>
        <Col>
          <ComponentContainerCard
            id="candidate-create-form"
            title="Create New Candidate"
            description="Fill in the form below to register a new candidate"
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
                        placeholder="E.g.: Jhon Doe"
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
                        placeholder="E.g.: Smith"
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
                  <Col md={6}>
                    <Form.Group controlId="password">
                      <Form.Label>Password *</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="comfirmPassword">
                      <Form.Label>Confirm Password *</Form.Label>
                      <Form.Control
                        type="password"
                        name="comfirmPassword"
                        value={formData.comfirmPassword}
                        onChange={handleChange}
                        required
                      />
                      {passwordError && (
                        <Form.Text className="text-danger">
                          {passwordError}
                        </Form.Text>
                      )}
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
                        placeholder="E.g.: +258841234567"
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
                  disabled={mutation.isLoading}
                  className="me-1"
                >
                  {mutation.isLoading ? "Creating..." : "Create Candidate"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/candidates")}
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

export default CandidatesCreate;
