/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { createBlogCategory } from "@/services/blogCategoryService";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BlogCategoryCreate = () => {
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: ""
  });

  const mutation = useMutation(createBlogCategory, {
    onSuccess: () => {
      toast.success("Blog category created successfully!");
      navigate("/blogs/categories");
    },
    onError: (error: any) => {
      console.error("Error creating blog category:", error.message);
      toast.error(error.message || "Failed to create category");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <>
      <PageMetaData title="Create Blog Category" />

      <Row>
        <Col>
          <ComponentContainerCard
            id="blog-category-create-form"
            title="Create New Blog Category"
            description="Fill in the form to add a new blog category"
          >
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
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
                <Col md={6}>
                  <Form.Group controlId="code">
                    <Form.Label>code *</Form.Label>
                    <Form.Control
                      type="text"
                      name="code"
                      placeholder="e.g. technology"
                      value={formData.code}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="mb-4">
                <Form.Label>Description</Form.Label>
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
                  className="me-2"
                >
                  {mutation.isLoading ? "Creating..." : "Create Category"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/blog-categories")}
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

export default BlogCategoryCreate;
