/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { createCompany } from "@/services/companyService";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CompaniesCreate = () => {
  const navigate = useNavigate();

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
    name: "",
    slug: "",
    picture: "",
    mobileNumber: "",
    email: "",
    website: "",
    linkedin: "",
    city: {
      id: ""
    },
    industry: "",
    foundedYear: new Date().getFullYear(),
    numberOfEmployees: 0,
    businessType: "",
    description: ""
  });

  const mutation = useMutation(createCompany, {
    onSuccess: () => {
      toast.success("Company created successfully!");
      navigate("/companies");
    },
    onError: (error: any) => {
      console.error("Error creating company:", error.message);
      toast.error(error.message || "Failed to create company");
    },
  });

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle nested city.id separately
    if (name === "cityId") {
      setFormData(prev => ({
        ...prev,
        city: {
       
          id: value
        }
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const companyData = {
      ...formData,
      foundedYear: Number(formData.foundedYear),
      numberOfEmployees: Number(formData.numberOfEmployees),

    };

    mutation.mutate(companyData);
  };

  return (
    <>
      <PageMetaData title="Create Company" />

      <Row>
        <Col>
          <ComponentContainerCard
            id="company-create-form"
            title="Create New Company"
            description="Fill in the form below to register a new company"
          >
            <Form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="mb-4">
                <h5 className="mb-3">Basic Information</h5>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="name">
                      <Form.Label>Company Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="e.g. Tech Solutions Inc."
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="slug">
                      <Form.Label>Slug *</Form.Label>
                      <Form.Control
                        type="text"
                        name="slug"
                        placeholder="e.g. tech-solutions-inc"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="picture">
                      <Form.Label>Logo URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="picture"
                        placeholder="https://example.com/logo.jpg"
                        value={formData.picture}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="mobileNumber">
                      <Form.Label>Phone Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="mobileNumber"
                        placeholder="+5511999999999"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
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
                        placeholder="contact@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="website">
                      <Form.Label>Website</Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="linkedin">
                      <Form.Label>LinkedIn</Form.Label>
                      <Form.Control
                        type="url"
                        name="linkedin"
                        placeholder="https://linkedin.com/company/example"
                        value={formData.linkedin}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="cityId">
                      <Form.Label>City ID *</Form.Label>
                      <Form.Control
                        type="text"
                        name="cityId"
                        placeholder="Enter city UUID"
                        value={formData.city.id}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Company Details */}
              <div className="mb-4">
                <h5 className="mb-3">Company Details</h5>

                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group controlId="industry">
                      <Form.Label>Industry *</Form.Label>
                      <Form.Control
                        type="text"
                        name="industry"
                        placeholder="e.g. Technology"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="foundedYear">
                      <Form.Label>Founded Year *</Form.Label>
                      <Form.Control
                        type="number"
                        name="foundedYear"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={formData.foundedYear}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="numberOfEmployees">
                      <Form.Label>Number of Employees *</Form.Label>
                      <Form.Control
                        type="number"
                        name="numberOfEmployees"
                        min="0"
                        value={formData.numberOfEmployees}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="businessType">
                      <Form.Label>Business Type *</Form.Label>
                      <Form.Control
                        type="text"
                        name="businessType"
                        placeholder="e.g. Services, Product, etc."
                        value={formData.businessType}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5 className="mb-3">Company Description *</h5>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={modules}
                />
              </div>

              <div className="mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={mutation.isLoading}
                  className="me-1"
                >
                  {mutation.isLoading ? "Creating..." : "Create Company"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/companies")}
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

export default CompaniesCreate;