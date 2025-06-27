import ComponentContainerCard from "@/components/ComponentContainerCard";
import LocationSelector from "@/components/LocationSelector";
import PageMetaData from "@/components/PageTitle";
import SwitchCheckBox from "@/components/form/SwitchCheckBox";
import { getAllCategories } from "@/services/categoryService";
import { getAllCompanies } from "@/services/companyService";
import { getVacancyById, updateVacancy } from "@/services/vacancyService";
import { useState } from "react";
import { Spinner as BootstrapSpinner, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface VacancyFormData {
  id: string;
  title: string;
  description: string;
  companyId: string;
  jobCategoryId: string;
  remoteAllowed: boolean;
  type: string;
  status: string;
  sector: string;
  country: string;
  state: string;
  city: string;
  yearsOfExperience: number;
  careerLevel: string;
  educationRequired: string;
  genderPreference: string;
  minSalary: number;
  maxSalary: number;
  applicationDeadline: string;
  skills: string[];
  qualifications: string[];
  responsibilities: string[];
}

const VacancyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch companies and categories
  const { data: companies, isLoading: isLoadingCompanies } = useQuery(
    "companies",
    getAllCompanies
  );
  const { data: categories, isLoading: isLoadingCategories } = useQuery(
    "categories",
    getAllCategories
  );

  const [formData, setFormData] = useState<VacancyFormData>({
    id: "",
    title: "",
    description: "",
    companyId: "",
    jobCategoryId: "",
    remoteAllowed: false,
    type: "FULL_TIME",
    status: "ACTIVE",
    sector: "PRIVATE",
    country: "",
    state: "",
    city: "",
    yearsOfExperience: 0,
    careerLevel: "JUNIOR",
    educationRequired: "",
    genderPreference: "UNSPECIFIED",
    minSalary: 0,
    maxSalary: 0,
    applicationDeadline: "",
    skills: [],
    qualifications: [],
    responsibilities: [],
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
  const { isLoading: isVacancyLoading ,error: fetchError} = useQuery(
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
          sector: data.sector || "PRIVATE",
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          yearsOfExperience: data.yearsOfExperience,
          careerLevel: data.careerLevel,
          educationRequired: data.degreeRequired,
          genderPreference: data.genderPreference,
          minSalary: data.minSalary,
          maxSalary: data.maxSalary,
          applicationDeadline: data.applicationDeadline,
          skills: data.skills?.map((s: any) => s.name) || [],
          qualifications: data.qualifications?.map((q: any) => q.name) || [],
          responsibilities: data.responsibilities?.map((r: any) => r.name) || [],
        });
      },
      onError: (error: any) => {
        toast.error(error.message);
        navigate("/vacancies");
      },
    }
  );

  const mutation = useMutation(updateVacancy, {
    onSuccess: () => {
      toast.success("Vacancy updated successfully!");
      navigate("/vacancies");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleTextChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string) => {
    const items = value
      .split(';')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (newLocation: {
    country: string;
    state: string;
    city: string;
  }) => {
    setFormData((prev) => ({ ...prev, ...newLocation }));
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
      minSalary: Number(formData.minSalary),
      maxSalary: Number(formData.maxSalary),
      applicationDeadline: formData.applicationDeadline,
      genderPreference: formData.genderPreference,
      remoteAllowed: formData.remoteAllowed,
      skills: formData.skills.map((name) => ({ name })),
      qualifications: formData.qualifications.map((name) => ({ name })),
      responsibilities: formData.responsibilities.map((name) => ({ name })),
    };

    mutation.mutate({ id: id!, data: vacancyData });
  };

  if (isVacancyLoading || isLoadingCompanies || isLoadingCategories) {
      return (
        <div className="d-flex justify-content-center py-5">
          <BootstrapSpinner animation="border" variant="primary" />
        </div>
      );
    }
  
    if (fetchError || !formData) {
      return (
        <div className="alert alert-danger mx-3 my-5">
          {fetchError?.message || "Vacancie not found"}
        </div>
      );
    }
  if (isVacancyLoading || isLoadingCompanies || isLoadingCategories) {
    return <Spinner animation="border" />;
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
                        {companies?.content?.map((company) => (
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
                        <option value="CONTRACT">Contract</option>
                        <option value="INTERNSHIP">Internship</option>
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
                        {categories?.content?.map((category) => (
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
                    city: formData.city,
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
                      <Form.Label>Qualifications * <small>(Separate with semicolons)</small></Form.Label>
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
                      <Form.Label>Responsibilities * <small>(Separate with semicolons)</small></Form.Label>
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
                      <Form.Label>Skills * <small>(Separate with semicolons)</small></Form.Label>
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