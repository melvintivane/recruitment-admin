/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PageMetaData from "@/components/PageTitle";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import { useMutation } from "react-query";
import { createCategory } from "@/services/categoryService";
import { useState } from "react";
import { toast } from "react-toastify";

const CategoriesCreate = () => {
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    status: "ACTIVE",
  });

  const mutation = useMutation(createCategory, {
    onSuccess: () => {
      toast.success("Category created successfully!");
      navigate("/categories");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <>
      <PageMetaData title="Create Category" />

      <Row>
        <Col>
          <ComponentContainerCard
            id="category-create-form"
            title="Create New Category"
            description="Fill in the form below to create a new category"
          >
            <Form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="mb-4">
                <h5 className="mb-3">Basic Information</h5>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="code">
                      <Form.Label>Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="code"
                        placeholder="e.g. CAT-001, generated automatically"
                        value={formData.code}
                        onChange={handleChange}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="name">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="e.g. Technology"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5 className="mb-3">Description</h5>

                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Enter category description..."
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={mutation.isLoading}
                  className="me-1"
                >
                  {mutation.isLoading ? "Creating..." : "Create Category"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/categories")}
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

export default CategoriesCreate;