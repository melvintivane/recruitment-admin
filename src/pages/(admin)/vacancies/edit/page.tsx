/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { getAllCategories } from "@/services/categoryService";
import { getAllCompanies } from "@/services/companyService";
import { getVacancyById, updateVacancy } from "@/services/vacancyService";
import { CategoryApiResponse } from "@/types/category";
import { CompanyApiResponse } from "@/types/company";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import LocationSelector from "@/components/LocationSelector";
import "react-quill/dist/quill.snow.css";

interface VacancyFormData {
  id: string;
  title: string;
  description: string;
  companyId: string;
  jobCategoryId: string;
  remoteAllowed: boolean;
  type: string;
  status: string;
  country: string; // Changed from cityId
  state: string;
  city: string;
  yearsOfExperience: number;
  careerLevel: string;
  degreeRequired: string;
  genderPreference: string;
  minSalary: number;
  maxSalary: number;
  deadline: string;
  skills: string;
  responsibilities: string;
  qualifications: string;
}

const VacancyEdit = () => {
  const { id } = useParams();
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

  const [formData, setFormData] = useState<VacancyFormData>({
    id: "",
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
    degreeRequired: "",
    genderPreference: "UNSPECIFIED",
    minSalary: 0,
    maxSalary: 0,
    deadline: "",
    skills: "",
    responsibilities: "",
    qualifications: "",
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

  // Fetch vacancy data
  const { isLoading: isVacancyLoading } = useQuery(
    ["vacancy", id],
    () => getVacancyById(id!),
    {
      enabled: !!id,
      onSuccess: (data: any) => {
        setFormData({
          id: data.id,
          title: data.title,
          description: data.description,
          companyId: data.company.id,
          jobCategoryId: data.jobCategory.id,
          remoteAllowed: data.remoteAllowed || false,
          type: data.type,
          status: data.status,
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          yearsOfExperience: data.yearsOfExperience,
          careerLevel: data.careerLevel,
          degreeRequired: data.degreeRequired,
          genderPreference: data.genderPreference,
          minSalary: data.minSalary,
          maxSalary: data.maxSalary,
          deadline: data.deadline,
          skills: data.skills.map((s: { name: string }) => s.name).join("; "),
          responsibilities: data.responsibilities
            .map((s: { name: string }) => s.name)
            .join("; "),
          qualifications: data.qualifications
            .map((s: { name: string }) => s.name)
            .join("; "),
        });
      },
      onError: (error: any) => {
        toast.error(error.message);
        navigate("/vacancies");
      },
    }
  );

  // Fetch companies and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, categoriesData] = await Promise.all([
          getAllCompanies(),
          getAllCategories(),
        ]);
        setCompanies(companiesData);
        setCategories(categoriesData);
      } catch (error) {
        toast.error("Failed to load required data");
      }
    };
    fetchData();
  }, []);

  const mutation = useMutation(updateVacancy, {
    onSuccess: () => {
      toast.success("Vacancy updated successfully!");
      navigate("/vacancies");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

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
    setFormData((prev) => ({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const processHtmlFieldToArray = (fieldValue?: string) => {
      if (!fieldValue) return [];

      return fieldValue
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .split(/[;\n]/) // Divide por ponto-vírgula ou quebras de linha
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    };

    const vacancyData = {
      title: formData.title,
      description: formData.description,
      companyId: formData.companyId,
      jobCategoryId: formData.jobCategoryId,
      type: formData.type,
      status: formData.status,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      yearsOfExperience: formData.yearsOfExperience,
      careerLevel: formData.careerLevel,
      degreeRequired: formData.degreeRequired,
      minSalary: formData.minSalary,
      maxSalary: formData.maxSalary,
      deadline: formData.deadline,
      genderPreference: formData.genderPreference,
      skills: processHtmlFieldToArray(formData.skills),
      responsibilities: processHtmlFieldToArray(formData.responsibilities),
      qualifications: processHtmlFieldToArray(formData.qualifications),
    };

    mutation.mutate({ id: id!, data: vacancyData });
  };
  if (isVacancyLoading) {
    return <div className="text-center py-4">Loading vacancy data...</div>;
  }

  return (
    <>
      <PageMetaData title="Edit Vacancy" />

      <Row>
        <Col>
          <ComponentContainerCard
            id="vacancy-edit-form"
            title="Edit Job Vacancy"
            description="Update the vacancy details below"
          >
            <Form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="mb-5">
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
                        {companies.content.map((company) => (
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
                    <Form.Group controlId="jobCategoryId">
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
              </div>
              <LocationSelector
                onLocationChange={handleLocationChange}
                initialValues={{
                  country: formData.country,
                  state: formData.state,
                  city: formData.city,
                }}
              />

              {/* Requirements */}
              <div className="mb-5">
                <h5 className="mb-3">Requirements</h5>

                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="degreeRequired">
                      <Form.Label>Degree Required *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. Bachelor's degree in Computer Science"
                        name="degreeRequired"
                        value={formData.degreeRequired}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
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
                  <Col md={3}>
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
                  <Col md={3}>
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
                  <Col>
                    <Form.Group controlId="responsibilities">
                      <Form.Label>
                        Responsibilities *
                        <small className="text-muted">
                          (Separate each responsibility with a semicolon or new
                          line)
                        </small>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="e.g. Develop user interfaces; Collaborate with backend team"
                        rows={4}
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="skills">
                      <Form.Label>
                        Skills *
                        <small className="text-muted">
                          (Separate each skill with a semicolon or new line)
                        </small>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="e.g. Strong communication skills; Team player"
                        rows={4}
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="qualifications">
                      <Form.Label>
                        Qualifications *{" "}
                        <small className="text-muted">
                          (Separate each qualification with a semicolon or new
                          line)
                        </small>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="e.g. Experience with React; Knowledge of REST APIs"
                        rows={4}
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Compensation */}
              <div className="mb-5">
                <h5 className="mb-3">Compensation</h5>

                <Row className="mb-3">
                  <Col md={3}>
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
                  <Col md={3}>
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
              <div className="mb-5">
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
                  <Col md={3}>
                    <Form.Group controlId="deadline">
                      <Form.Label>Application Deadline *</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="remoteAllowed">
                      <Form.Label>Remote Work</Form.Label>
                      <Form.Check
                        type="switch"
                        id="remoteSwitch"
                        label="Allow remote work"
                        checked={formData.remoteAllowed}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            remoteAllowed: !prev.remoteAllowed,
                          }))
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
                  {mutation.isLoading ? "Updating..." : "Update Vacancy"}
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

export default VacancyEdit;
