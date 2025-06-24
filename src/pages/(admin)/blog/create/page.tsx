/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { createBlog } from "@/services/blogService";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BlogCreate = () => {
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    body: "",
    quote: "",
    image: "",
    author: "",
    categoryId: "",      // UUID
    tagIds: [] as number[], // IDs de tags (números long)
  });

  const mutation = useMutation(createBlog, {
    onSuccess: () => {
      toast.success("Blog created successfully!");
      navigate("/blogs");
    },
    onError: (error: any) => {
      console.error("Error creating blog:", error.message);
      toast.error(error.message || "Failed to create blog");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBodyChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      body: value,
    }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(option => Number(option.value));
    setFormData(prev => ({
      ...prev,
      tagIds: selected,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const blogData = {
      title: formData.title,
      subtitle: formData.subtitle,
      body: formData.body,
      quote: formData.quote,
      image: formData.image,
      author: formData.author,
      categoryId: formData.categoryId,
      tagIds: formData.tagIds,
    };

    mutation.mutate(blogData);
  };

  return (
    <>
      <PageMetaData title="Create Blog" />

      <Row>
        <Col>
          <ComponentContainerCard
            id="blog-create-form"
            title="Create New Blog"
            description="Fill in the form to publish a new blog post"
          >
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="title">
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="subtitle">
                    <Form.Label>Subtitle *</Form.Label>
                    <Form.Control
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="author">
                    <Form.Label>Author *</Form.Label>
                    <Form.Control
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="image">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="categoryId">
                    <Form.Label>Category *</Form.Label>
                    <Form.Control
                      type="text"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      placeholder="Insert category UUID"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="tagIds">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                      as="select"
                      multiple
                      name="tagIds"
                      value={formData.tagIds.map(String)}
                      onChange={handleTagChange}
                    >
                      {/* Este trecho deve ser dinâmico com base nas tags disponíveis */}
                      <option value="1">Java</option>
                      <option value="2">Spring Boot</option>
                      <option value="3">React</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="quote">
                    <Form.Label>Quote</Form.Label>
                    <Form.Control
                      type="text"
                      name="quote"
                      value={formData.quote}
                      onChange={handleChange}
                      placeholder="Optional quote"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="mb-4">
                <h5 className="mb-3">Body *</h5>
                <ReactQuill
                  theme="snow"
                  value={formData.body}
                  onChange={handleBodyChange}
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
                  {mutation.isLoading ? "Creating..." : "Create Blog"}
                </Button>
                <Button variant="secondary" onClick={() => navigate("/blogs")}>
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

export default BlogCreate;
