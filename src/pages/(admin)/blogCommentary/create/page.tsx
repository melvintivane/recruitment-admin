/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { createBlogTag } from "@/services/blogTagService"; // novo service
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BlogTagCreate = () => {
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

  const mutation = useMutation(createBlogTag, {
    onSuccess: () => {
      toast.success("Blog tag created successfully!");
      navigate("/blogs/tags");
    },
    onError: (error: any) => {
      console.error("Error creating blog tag:", error.message);
      toast.error(error.message || "Failed to create tag");
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
      <PageMetaData title="Create Blog Tag" />

      <Row>
        <Col>
          <ComponentContainerCard
            id="blog-tag-create-form"
            title="Create New Blog Tag"
            description="Fill in the form to add a new blog tag"
          >
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="name">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="e.g. React"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="code">
                    <Form.Label>Code *</Form.Label>
                    <Form.Control
                      type="text"
                      name="code"
                      placeholder="e.g. react"
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
                  {mutation.isLoading ? "Creating..." : "Create Tag"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/blogs/tags")}
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

export default BlogTagCreate;
