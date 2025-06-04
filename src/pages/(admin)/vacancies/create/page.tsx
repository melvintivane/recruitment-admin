/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageMetaData from "@/components/PageTitle";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import { useMutation } from "react-query";
import { createVacancy } from "@/services/vacancyService";
import { useState } from "react";

const VacanciesCreate = () => {
  const navigate = useNavigate();
  // const [companies, setCompanies] = useState([]);

  // useEffect(() => {
  //   const fetchCompanies = async () => {
  //     const response = await fetch(`${API_ENDPOINTS.COMPANIES}`);
  //     const data = await response.json();
  //     setCompanies(data);
  //   };
  //   fetchCompanies();
  // }, []);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyId: "",
    type: "FULL_TIME",
    status: "ACTIVE",
    location: "",
    cityId: 1004,
    yearsOfExperience: 0,
    careerLevel: "JUNIOR",
    educationRequired: "",
    degreeRequired: "",
    genderPreference: "UNSPECIFIED",
    minSalary: 0,
    maxSalary: 0,
    applicationDeadline: "",
    requiredSkills: "",
    requiredSkillIds: [602],
  });

  const mutation = useMutation(createVacancy, {
    onSuccess: () => {
      navigate("/vacancies");
    },
    onError: (error: any) => {
      console.error("Error creating vacancy:", error);
      // Adicione tratamento de erro aqui (ex: toast notification)
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Transforma os dados para corresponder à API
    const vacancyData = {
      ...formData,
      // Mapeia os campos que têm nomes diferentes
      degreeRequired: formData.educationRequired,
      // Converte valores numéricos
      yearsOfExperience: Number(formData.yearsOfExperience),
      minSalary: Number(formData.minSalary),
      maxSalary: Number(formData.maxSalary),
      // Remove campos não usados na API
      educationRequired: "",
      requiredSkills: "",
      location: "",
      requiredSkillIds: formData.requiredSkills 
      ? formData.requiredSkills.split(",").map(skill => parseInt(skill.trim()))
      : [602], // Fallback para valor padrão
    };

    mutation.mutate(vacancyData);
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
                    <Form.Group controlId="title">
                      <Form.Label>Job Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="e.g. Frontend Developer"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="companyId">
                      <Form.Label>Company *</Form.Label>
                      <Form.Select
                        name="companyId"
                        value={formData.companyId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select company</option>
                        {/* Você precisará buscar as empresas da API */}
                        <option value="0cdf58d1-a700-46bc-9d87-b6a2dbc40678">
                          EP Management & Consultancy Services
                        </option>
                        <option value="ac19d71e-921f-46b1-88dc-7ca2a842e40b">
                          Krei Tech Industries
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="jobType">
                      <Form.Label>Job Type *</Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select job type</option>
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="FIXED_TERM">Contract</option>
                        <option value="FREELANCE">Freelance</option>
                        <option value="INTERNSHIP">Internship</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="status">
                      <Form.Label>Status *</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="CLOSED">Closed</option>
                        <option value="PENDING">Pending</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Group controlId="location">
                    <Form.Label>Location *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Maputo, Alto Maé"
                      name="cityId"
                      value={formData.cityId}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  {/* <Col md={6}>
                    <Form.Group controlId="remoteAllowed">
                      <Form.Label>Remote Work</Form.Label>
                      <Form.Check
                        type="switch"
                        id="remoteSwitch"
                        label="Allow remote work"
                      />
                    </Form.Group>
                  </Col> */}
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
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        placeholder="e.g. 3"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="careerLevel">
                      <Form.Label>Career Level *</Form.Label>
                      <Form.Select
                        name="careerLevel"
                        value={formData.careerLevel}
                        onChange={handleChange}
                        required
                      >
                        <option value="TRAINEE">Trainee Level</option>
                        <option value="JUNIOR">Junior Level</option>
                        <option value="MID">Mid Level</option>
                        <option value="SENIOR">Senior Level</option>
                        <option value="HEAD">Head Level</option>
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
                        name="educationRequired"
                        value={formData.educationRequired}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="genderPreference">
                      <Form.Label>Gender Preference</Form.Label>
                      <Form.Select
                        name="genderPreference"
                        value={formData.genderPreference}
                        onChange={handleChange}
                      >
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
                        name="minSalary"
                        value={formData.minSalary}
                        onChange={handleChange}
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
                        name="maxSalary"
                        value={formData.maxSalary}
                        onChange={handleChange}
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
                    <Form.Group controlId="applicationDeadline">
                      <Form.Label>Application Deadline *</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={handleChange}
                        required
                      />
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
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              {/* Skills */}
              {/* <div className="mb-4">
                <h5 className="mb-3">Required Skills</h5>

                <Form.Group controlId="requiredSkills">
                  <Form.Label>Skills (comma separated) *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. React, JavaScript, TypeScript"
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div> */}

              <div className="mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={mutation.isLoading}
                  className="me-1"
                >
                  {mutation.isLoading ? "Creating..." : "Create"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/vacancies")}
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

export default VacanciesCreate;
