/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentContainerCard from "@/components/ComponentContainerCard";
import SwitchCheckBox from "@/components/form/SwitchCheckBox";
import LocationSelector from "@/components/LocationSelector";
import PageMetaData from "@/components/PageTitle";
import { getAllCategories } from "@/services/categoryService";
import { getAllCompanies } from "@/services/companyService";
import { createVacancy } from "@/services/vacancyService";
import { CategoryApiResponse } from "@/types/category";
import { CompanyApiResponse } from "@/types/company";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VacanciesCreate = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyApiResponse>({
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
    sector: "PRIVATE", // Novo campo
    country: "",
    state: "",
    city: "",
    yearsOfExperience: 0,
    careerLevel: "JUNIOR",
    educationRequired: "",
    minSalary: 0,
    maxSalary: 0,
    applicationDeadline: "",
    skills: [""],
    qualifications: [""],
    responsibilities: [""],
    genderPreference: "UNSPECIFIED"
  });

  const mutation = useMutation(createVacancy, {
    onSuccess: () => {
      toast.success("Vaga criada com sucesso!");
      navigate("/vacancies");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, categoriesData] = await Promise.all([
          getAllCompanies(),
          getAllCategories()
        ]);
        setCompanies(companiesData);
        setCategories(categoriesData);
      } catch (error) {
        toast.error("Erro ao carregar dados iniciais");
      }
    };
    fetchData();
  }, []);

  const handleTextChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string) => {
    const items = value
      .split(';')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (newLocation: { country: string; state: string; city: string }) => {
    setFormData(prev => ({ ...prev, ...newLocation }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vacancyData = {
      title: formData.title,
      description: formData.description,
      companyId: formData.companyId,
      jobCategoryId: formData.jobCategoryId,
      type: formData.type,
      status: formData.status,
      sector: formData.sector,
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
      remoteAllowed: formData.remoteAllowed,
      skills: formData.skills.map(name => ({ name })),
      qualifications: formData.qualifications.map(name => ({ name })),
      responsibilities: formData.responsibilities.map(name => ({ name }))
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
                        {companies.content?.map((company) => (
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
                    <Form.Group controlId="type">
                      <Form.Label>Job Type *</Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                   
                      >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="FIXED_TERM">Fixed Term</option>
                        <option value="FREELANCE">Freelance</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="sector">
                      <Form.Label>Sector *</Form.Label>
                      <Form.Select
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        required
                      >
                        <option value="PRIVATE">Private</option>
                        <option value="PUBLIC">Public</option>
                        <option value="ONG">NGO</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="jobCategoryId">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="jobCategoryId"
                        value={formData.jobCategoryId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.content?.map((category) => (
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
                        <option value="JUNIOR">Junior</option>
                        <option value="MID">Mid Level</option>
                        <option value="SENIOR">Senior</option>
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
                        <option value="UNSPECIFIED">Unspecified</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="educationRequired">
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
                    <Form.Group controlId="qualifications">
                      <Form.Label>Qualifications * <small style={{color:'red'}}>(Separate each qualification with a semicolon ";")</small></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={formData.qualifications.join('; ')}
                        onChange={(e) => handleArrayChange('qualifications', e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="responsibilities">
                      <Form.Label>Responsibilities * <small style={{color:'red'}}>(Separate each responsabilitie with a semicolon ";")</small></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={formData.responsibilities.join('; ')}
                        onChange={(e) => handleArrayChange('responsibilities', e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="skills">
                      <Form.Label>Skills * <small style={{color:'red'}}>(Separate each skill with a semicolon ";")</small></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={formData.skills.join('; ')}
                        onChange={(e) => handleArrayChange('skills', e.target.value)}
                        required
                      />
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

              {/* Description */}
              <div className="mb-4">
                <h5 className="mb-3">Job Description *</h5>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) => handleTextChange('description', value)}
                  modules={modules}
                />
              </div>

              {/* Dates & Settings */}
              <div className="mb-4">
                <h5 className="mb-3">Dates & Settings</h5>

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
                  <Col md={6}>
                    <Form.Group controlId="remoteAllowed">
                      <Form.Label>Remote Work</Form.Label>
                      <SwitchCheckBox
                        name="remoteAllowed"
                        label="Allowed"
                        initialValue={formData.remoteAllowed}
                        onChange={(checked) => 
                          setFormData(prev => ({ ...prev, remoteAllowed: checked }))
                        }
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
                  {mutation.isLoading ? "Creating..." : "Create Vacancy"}
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
