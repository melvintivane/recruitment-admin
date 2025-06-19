/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import { createVacancy } from "@/services/vacancyService";
import { useNavigate } from "react-router-dom";
import { getAllCompanies } from "@/services/companyService";
import PageMetaData from "@/components/PageTitle";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import { getAllCategories } from "@/services/categoryService";
import { CompanyType } from "@/types/company";
import { CategoryApiResponse } from "@/types/category";
import LocationSelector from "@/components/LocationSelector";

const VacanciesCreate = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [categories, setCategories] = useState<CategoryApiResponse>({
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: 0,
      sort: {
        sorted: true,
        empty: true,
        unsorted: true,
      },
      offset: 0,
      paged: true,
      unpaged: true,
    },
    sort: {
      sorted: true,
      empty: true,
      unsorted: true,
    },
    last: true,
    totalElements: 0,
    totalPages: 0,
    first: true,
    size: 0,
    number: 0,
    numberOfElements: 0,
    empty: true,
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companyId: "",
    jobCategoryId: "",
    remoteAllowed: false,
    type: "FULL_TIME",
    status: "ACTIVE",
    country: "",
    state: "",
    city: "",
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
      toast.success("Vacancy created successfully!");
      navigate("/vacancies");
    },
    onError: (error: any) => {
      console.error("Error creating vacancy:", error.message);
      toast.error(error.message || "Failed to create vacancy");
    },
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      const companies = await getAllCompanies();
      const categories = await getAllCategories();

      setCategories(categories);
      setCompanies(companies);
    };
    fetchCompanies();
  }, []);

  const handleSkillChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: value,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

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

  const handleLocationChange = (newLocation: {
    country: string;
    state: string;
    city: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...newLocation // Atualiza country, state e city diretamente no formData
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extrai skills do ReactQuill (formato HTML) e converte para array de strings
    const skillsArray = formData.requiredSkills
      ? formData.requiredSkills
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .split(/[\n,]+/) // Divide por vírgulas ou quebras de linha
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0)
      : [];

    const descriptionText = formData.description
      ? formData.description.replace(/<[^>]*>/g, "").trim()
      : "";

    const vacancyData = {
      title: formData.title,
      description: descriptionText,
      companyId: formData.companyId,
      jobCategoryId: formData.jobCategoryId,
      type: formData.type,
      status: formData.status,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      yearsOfExperience: Number(formData.yearsOfExperience),
      careerLevel: formData.careerLevel,
      degreeRequired: formData.educationRequired,
      minSalary: formData.minSalary,
      maxSalary: formData.maxSalary,
      applicationDeadline: formData.applicationDeadline,
      genderPreference: formData.genderPreference,
      skills: skillsArray,
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
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4}>
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
                  <Col md={4}>
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
                  <Col md={4}>
                    <Form.Group controlId="companyId">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="jobCategoryId"
                        value={formData.jobCategoryId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.content.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
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
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <h5 className="mb-3">Requirements</h5>

                <Row className="mb-3">
                  <Col md={4}>
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
                  <Col md={4}>
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
                  <Col md={4}>
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
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="requiredSkills">
                      <Form.Label>Skills *</Form.Label>
                      <ReactQuill
                        theme="snow"
                        value={formData.requiredSkills}
                        onChange={handleSkillChange}
                        modules={modules}
                        // style={{ height: "100px", marginBottom: "50px" }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Compensation */}
              <div className="mb-4">
                <h5 className="mb-3">Compensation</h5>

                <Row className="mb-3">
                  <Col md={4}>
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
                  <Col md={4}>
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

              {/* Description */}
              <div className="mb-4">
                <h5 className="mb-3">Job Description *</h5>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={modules}
                />
              </div>

              {/* Dates */}
              <div className="mb-4">
                <h5 className="mb-3">Dates</h5>

                <Row className="mb-3">
                  <Col md={4}>
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
