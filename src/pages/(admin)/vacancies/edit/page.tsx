import ComponentContainerCard from "@/components/ComponentContainerCard";
import SwitchCheckBox from "@/components/form/SwitchCheckBox";
import TextAreaFormInput from "@/components/form/TextAreaFormInput";
import LocationSelector from "@/components/LocationSelector";
import PageMetaData from "@/components/PageTitle";
import { getAllCategories } from "@/services/categoryService";
import { getAllCompanies } from "@/services/companyService";
import { getVacancyById, updateVacancy } from "@/services/vacancyService";
import { CategoryApiResponse } from "@/types/category";
import { CompanyApiResponse } from "@/types/company";
import { VacancyUpdateDto } from "@/types/vacancy";
import { useEffect, useState } from "react";
import { Alert, Button, Card, CardBody, Col, Form, Row, Spinner } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const VacancyEdit = () => {
  const { control } = useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [companies, setCompanies] = useState<CompanyApiResponse>({
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: 0,
      sort: { sorted: false, empty: true, unsorted: true },
      offset: 0,
      paged: false,
      unpaged: false,
    },
    last: true,
    totalElements: 0,
    totalPages: 0,
    first: true,
    size: 0,
    number: 0,
    sort: { sorted: false, empty: true, unsorted: true },
    numberOfElements: 0,
    empty: true,
  });

  const [categories, setCategories] = useState<CategoryApiResponse>({
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: 0,
      sort: { sorted: false, empty: true, unsorted: true },
      offset: 0,
      paged: false,
      unpaged: false,
    },
    last: true,
    totalElements: 0,
    totalPages: 0,
    first: true,
    size: 0,
    number: 0,
    sort: { sorted: false, empty: true, unsorted: true },
    numberOfElements: 0,
    empty: true,
  });

  const [formData, setFormData] = useState<Omit<VacancyUpdateDto, 'skills' | 'qualifications' | 'responsibilities'> & {
    skills: string[];
    qualifications: string[];
    responsibilities: string[];
    jobCategoryId: string;
  }>({
    title: "",
    description: "",
    companyId: "",
    type: "FULL_TIME",
    status: "ACTIVE",
    country: "",
    state: "",
    jobCategoryId: "",
    city: "",
    yearsOfExperience: 0,
    careerLevel: "JUNIOR",
    degreeRequired: "",
    minSalary: 0,
    maxSalary: 0,
    deadline: "",
    genderPreference: "UNSPECIFIED",
    remoteAllowed: false,
    skills: [],
    qualifications: [],
    responsibilities: [],
  });

  // Fetch initial data
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
        toast.error("Error loading initial data");
      }
    };
    fetchData();
  }, []);

  // Fetch vacancy data
 // Fetch vacancy data
const { isLoading: isVacancyLoading, error: fetchError } = useQuery(
  ["vacancy", id],
  () => getVacancyById(id!),
  {
    enabled: !!id,
    onSuccess: (data: any) => {
      console.log("Dados recebidos da API:", data); // Adicione este log para depuração
      
      // Mapeamento seguro dos arrays
      const mapArrayItems = (items: any[] | undefined) => {
        if (!items) return [];
        return items.map(item => item?.name || "").filter(name => name);
      };

      setFormData({
        title: data.title,
        description: data.description,
        companyId: data.company.id,
        type: data.type,
        status: data.status,
        jobCategoryId: data.jobCategory.id,
        country: data.country || "",
        state: data.state || "",
        city: data.city || "",
        yearsOfExperience: data.yearsOfExperience,
        careerLevel: data.careerLevel,
        degreeRequired: data.degreeRequired,
        minSalary: data.minSalary,
        maxSalary: data.maxSalary,
        deadline: data.applicationDeadline,
        genderPreference: data.genderPreference,
        remoteAllowed: data.remoteAllowed || false,
        skills: mapArrayItems(data.skills),
        qualifications: mapArrayItems(data.qualifications),
        responsibilities: mapArrayItems(data.responsibilities),
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to load vacancy");
      navigate("/vacancies");
    },
  }
);

  const mutation = useMutation(updateVacancy, {
    onSuccess: () => {
      toast.success("Vacancy updated successfully!");
      navigate("/vacancies");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update vacancy");
    },
  });

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

    const vacancyData: VacancyUpdateDto = {
      title: formData.title,
      description: formData.description,
      companyId: formData.companyId,
      type: formData.type,
      jobCategoryId: formData.jobCategoryId,
      status: formData.status,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      yearsOfExperience: Number(formData.yearsOfExperience),
      careerLevel: formData.careerLevel,
      degreeRequired: formData.degreeRequired,
      minSalary: formData.minSalary,
      maxSalary: formData.maxSalary,
      deadline: formData.deadline,
      genderPreference: formData.genderPreference,
      remoteAllowed: formData.remoteAllowed,
      skills: formData.skills.map(name => ({ name })),
      qualifications: formData.qualifications.map(name => ({ name })),
      responsibilities: formData.responsibilities.map(name => ({ name })),
    };

    mutation.mutate({ id: id!, data: vacancyData });
  };

  // Quill editor modules
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

  if (isVacancyLoading) {
    return (
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 mb-0">Loading vacancy details...</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }

  if (fetchError) {
    return (
      <Row>
        <Col xs={12}>
          <Alert variant="danger" className="my-3">
            {fetchError.message || "Vacancy not found"}
          </Alert>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <PageMetaData title="Edit Vacancy" />

      <Row>
        <Col>
          <ComponentContainerCard
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
                  <Col md={6}>
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
                        <option value="PENDING">Pending</option>
                        <option value="CLOSED">Closed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
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
                        <option value="TRAINEE">Trainee</option>
                        <option value="JUNIOR">Junior</option>
                        <option value="MID">Mid Level</option>
                        <option value="SENIOR">Senior</option>
                        <option value="LEAD">Lead</option>
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
                    <Form.Group controlId="degreeRequired">
                      <Form.Label>Education Requirement *</Form.Label>
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
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="qualifications">
                      <Form.Label>Qualifications * <small className="text-danger">(Separate each qualification with a semicolon)</small></Form.Label>
                      <TextAreaFormInput
                        name="qualifications"
                        rows={3}
                        control={control}
                        onChange={(e) => handleArrayChange('qualifications', e.target.value)}
                        value={formData.qualifications.join('; ')}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="responsibilities">
                      <Form.Label>Responsibilities * <small className="text-danger">(Separate each responsibility with a semicolon)</small></Form.Label>
                      <TextAreaFormInput
                        name="responsibilities"
                        rows={3}
                        control={control}
                        onChange={(e) => handleArrayChange('responsibilities', e.target.value)}
                        value={formData.responsibilities.join('; ')}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="skills">
                      <Form.Label>Skills * <small className="text-danger">(Separate each skill with a semicolon)</small></Form.Label>
                      <TextAreaFormInput
                        name="skills"
                        rows={3}
                        control={control}
                        onChange={(e) => handleArrayChange('skills', e.target.value)}
                        value={formData.skills.join('; ')}
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
                >
                  {mutation.isLoading ? "Updating..." : "Update Vacancy"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/vacancies")}
                  className="ms-2"
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