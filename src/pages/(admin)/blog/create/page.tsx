/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { createBlog } from "@/services/blogService";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const allCategories = [
  { id: "uuid-1", name: "Tech" },
  { id: "uuid-2", name: "Business" },
  { id: "uuid-3", name: "Lifestyle" },
];

const allTags = [
  { id: 1, name: "Java" },
  { id: 2, name: "Spring Boot" },
  { id: 3, name: "React" },
  { id: 4, name: "Tailwind" },
];

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
    categoryIds: [] as string[], // UUIDs
    tagIds: [] as number[], // IDs
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBodyChange = (value: string) => {
    setFormData(prev => ({ ...prev, body: value }));
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected && !formData.categoryIds.includes(selected)) {
      setFormData(prev => ({
        ...prev,
        categoryIds: [...prev.categoryIds, selected],
      }));
    }
  };

  const handleTagSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Number(e.target.value);
    if (selected && !formData.tagIds.includes(selected)) {
      setFormData(prev => ({
        ...prev,
        tagIds: [...prev.tagIds, selected],
      }));
    }
  };

  const removeCategory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.filter(c => c !== id),
    }));
  };

  const removeTag = (id: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.filter(t => t !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const blogData = {
      ...formData,
      categoryId: formData.categoryIds[0] || "", // se necessário enviar apenas um
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
                    <Form.Label>Categories *</Form.Label>
                    <Form.Select onChange={handleCategorySelect}>
                      <option value="">Select a category</option>
                      {allCategories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Form.Select>
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      {formData.categoryIds.map(id => {
                        const cat = allCategories.find(c => c.id === id);
                        return (
                          <span
                            key={id}
                            className="badge bg-primary d-flex align-items-center gap-1"
                          >
                            {cat?.name}
                            <Icon
                              icon="mdi:close-circle"
                              className="text-danger cursor-pointer"
                              onClick={() => removeCategory(id)}
                            />
                          </span>
                        );
                      })}
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="tagIds">
                    <Form.Label>Tags</Form.Label>
                    <Form.Select onChange={handleTagSelect}>
                      <option value="">Select a tag</option>
                      {allTags.map(tag => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </Form.Select>
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      {formData.tagIds.map(id => {
                        const tag = allTags.find(t => t.id === id);
                        return (
                          <span
                            key={id}
                            className="badge bg-secondary d-flex align-items-center gap-1"
                          >
                            {tag?.name}
                            <Icon
                              icon="mdi:close-circle"
                              className="text-danger cursor-pointer"
                              onClick={() => removeTag(id)}
                            />
                          </span>
                        );
                      })}
                    </div>
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
