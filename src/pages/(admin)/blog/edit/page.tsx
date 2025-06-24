/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentContainerCard from "@/components/ComponentContainerCard";
import LocationSelector from "@/components/LocationSelector";
import PageMetaData from "@/components/PageTitle";
import { getCompanyById, updateCompany } from "@/services/companyService";
import { CompanyType, CompanyUpdateDto } from "@/types/company";
import { useState } from "react";
import {
  Spinner as BootstrapSpinner,
  Button,
  Col,
  Form,
  Row,
} from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface CompanyFormData {
  name: string;
  slug: string;
  mobileNumber: string;
  email: string;
  website: string;
  linkedin: string;
  country: string;
  state: string;
  city: string;
  industry: string;
  foundedYear: number;
  numberOfEmployees: number;
  businessType: string;
  description: string;
}

const CompanyEdit = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  // Quill editor configuration
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

  // Form state with TypeScript interface
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    slug: "",
    mobileNumber: "",
    email: "",
    website: "",
    linkedin: "",
    country: "",
    state: "",
    city: "",
    industry: "",
    foundedYear: new Date().getFullYear(),
    numberOfEmployees: 0,
    businessType: "",
    description: "",
  });

  // Fetch company data
  const {
    data: companyData,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery<CompanyType, Error>(
    ["company", companyId],
    () => {
      if (!companyId) throw new Error("Company ID is required");
      return getCompanyById(companyId);
    },
    {
      enabled: !!companyId,
      onSuccess: (data) => {
        setFormData({
          name: data.name,
          slug: data.slug,
          mobileNumber: data.mobileNumber,
          email: data.email,
          website: data.website,
          linkedin: data.linkedin,
          country: data.country,
          state: data.state,
          city: data.city,
          industry: data.industry,
          foundedYear: data.foundedYear,
          numberOfEmployees: data.numberOfEmployees,
          businessType: data.businessType,
          description: data.description,
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to load company data");
        navigate("/companies");
      },
    }
  );

  // Update company mutation
  const mutation = useMutation(updateCompany, {
    onSuccess: () => {
      toast.success("Company updated successfully!");
      navigate("/companies");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Handle description change for Quill editor
  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  // Handle form field changes
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
    setFormData((prev) => ({
      ...prev,
      ...newLocation, // Atualiza country, state e city diretamente no formData
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = {
      name: formData.name,
      slug: formData.slug,
      mobileNumber: formData.mobileNumber,
      email: formData.email,
      website: formData.website,
      linkedin: formData.linkedin,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      industry: formData.industry,
      foundedYear: formData.foundedYear,
      numberOfEmployees: formData.numberOfEmployees,
      businessType: formData.businessType,
      description: formData.description,
    } as CompanyUpdateDto;

    mutation.mutate({ companyId: companyId!, data: updatedData });
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="d-flex justify-content-center py-5">
        <BootstrapSpinner animation="border" variant="primary" />
      </div>
    );
  }

  // Error state
  if (fetchError || !companyData) {
    return (
      <div className="alert alert-danger mx-3 my-5">
        {fetchError?.message || "Company not found"}
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Edit ${formData.name || "Company"}`} />

      <Row>
        <Col>
          <ComponentContainerCard
            id="company-edit-form"
            title={`Edit ${formData.name || "Company"}`}
            description="Update the company information below"
          >
            <Form onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <div className="mb-4">
                <h5 className="mb-3">Basic Information</h5>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="name" className="mb-3">
                      <Form.Label>Company Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="slug" className="mb-3">
                      <Form.Label>Slug *</Form.Label>
                      <Form.Control
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="mobileNumber" className="mb-3">
                      <Form.Label>Phone Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                        placeholder="+1234567890"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="contact@company.com"
                      />
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
                  key={`${formData.country}-${formData.state}-${formData.city}`}
                />
              </div>

              {/* Company Details Section */}
              <div className="mb-4">
                <h5 className="mb-3">Company Details</h5>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="industry" className="mb-3">
                      <Form.Label>Industry *</Form.Label>
                      <Form.Control
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Technology"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="businessType" className="mb-3">
                      <Form.Label>Business Type *</Form.Label>
                      <Form.Control
                        type="text"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Corporation, LLC"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="foundedYear" className="mb-3">
                      <Form.Label>Founded Year *</Form.Label>
                      <Form.Control
                        type="number"
                        name="foundedYear"
                        value={formData.foundedYear}
                        onChange={handleChange}
                        required
                        min="1800"
                        max={new Date().getFullYear()}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="numberOfEmployees" className="mb-3">
                      <Form.Label>Number of Employees *</Form.Label>
                      <Form.Control
                        type="number"
                        name="numberOfEmployees"
                        value={formData.numberOfEmployees}
                        onChange={handleChange}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="website" className="mb-3">
                      <Form.Label>Website</Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://company.com"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="linkedin" className="mb-3">
                      <Form.Label>LinkedIn</Form.Label>
                      <Form.Control
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/company"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Description Section */}
              <div className="mb-4">
                <h5 className="mb-3">Company Description *</h5>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={modules}
                  placeholder="Describe your company..."
                />
              </div>

              {/* Form Actions */}
              <div className="mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={mutation.isLoading}
                  className="me-2"
                >
                  {mutation.isLoading ? (
                    <>
                      <BootstrapSpinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                      />
                      Updating...
                    </>
                  ) : (
                    "Update Company"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/companies")}
                  disabled={mutation.isLoading}
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

export default CompanyEdit;
