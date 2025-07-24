/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { createBlogger } from "@/services/bloggerService";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BloggerCreate = () => {
  const navigate = useNavigate();

  // Configuração do editor
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


  // Estado do formulário
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    avatar: "",
    about: "",
    email: "",
    linkedin: "",
    twitter: "",
    facebook : "",
    password : ""
  });

  // Mutação para criação
  const mutation = useMutation(createBlogger, {
    onSuccess: () => {
      toast.success("Blogger criado com sucesso!");
      navigate("/bloggers");
    },
    onError: (error: Error) => {
      console.error("Erro ao criar blogger:", error.message);
      toast.error(error.message || "Falha ao criar blogger");
    },
  });

  // Manipuladores de eventos
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBodyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, about: value }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Preparar dados no formato esperado pelo backend
    const bloggerData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      avatar: formData.avatar,
      about: formData.about,
      email: formData.email,
      linkedin : formData.linkedin,
      twitter : formData.twitter,
      facebook : formData.facebook,
      password: formData.password,
    };

    mutation.mutate(bloggerData);
  };

  return (
    <>
      <PageMetaData title="Create Blog" />

      <Row>
        <Col>
          <ComponentContainerCard
            id="blog-create"
            title="Create New Blog"
            description="Fill in the form to publish a new blog post"
          >
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="firstName">
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="lastName">
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="gender">
                    <Form.Label>Gender *</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    
                    >
                      <option value="">Select a gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="linkedin">
                    <Form.Label>Linkedin URL*</Form.Label>
                    <Form.Control
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                     
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="twitter">
                    <Form.Label>Twitter URL*</Form.Label>
                    <Form.Control
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                     
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="facebook">
                    <Form.Label>Facebook URL *</Form.Label>
                    <Form.Control
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                     
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="avatar">
                    <Form.Label>Avatar URL</Form.Label>
                    <Form.Control
                      type="file"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      placeholder="Paste image URL"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="mb-4">
                <h5 className="mb-3">About *</h5>
                <ReactQuill
                  theme="snow"
                  value={formData.about}
                  onChange={handleBodyChange}
                  modules={modules}
                  placeholder="Enter about content..."
                />
              </div>

              <div className="mt-4">
                <Button
                  variant="primary"
                  type="submit"
                >
                  {mutation.isLoading ? "Creating..." : "Create Blogger"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/bloggers")}
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

export default BloggerCreate;
