import ComponentContainerCard from "@/components/ComponentContainerCard";
import ChoicesFormInput from "@/components/form/ChoicesFormInput";
import PageMetaData from "@/components/PageTitle";
import { getAllBlogCategories } from "@/services/blogCategoryService";
import { createBlog } from "@/services/blogService";
import { getAllBlogTags } from "@/services/blogTagService"; // Novo serviço para tags
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BlogCreate = () => {
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

  // Busca categorias e tags da API
  const { data: categories, isLoading: isLoadingCategories } = useQuery(
    "blogCategories",
    getAllBlogCategories
  );

  const { data: tags, isLoading: isLoadingTags } = useQuery(
    "blogTags",
    getAllBlogTags
  );

  // Estado do formulário
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    body: "",
    quote: "",
    image: "",
    author: "",
    categoryId: "",
    tagIds: [] as number[],
  });

  // Mutação para criação
  const mutation = useMutation(createBlog, {
    onSuccess: () => {
      toast.success("Blog criado com sucesso!");
      navigate("/blogs");
    },
    onError: (error: Error) => {
      console.error("Erro ao criar blog:", error.message);
      toast.error(error.message || "Falha ao criar blog");
    },
  });

  // Manipuladores de eventos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBodyChange = (value: string) => {
    setFormData(prev => ({ ...prev, body: value }));
  };

  const handleTagSelect = (value: string) => {
    const selected = Number(value);
    if (selected && !formData.tagIds.includes(selected)) {
      setFormData(prev => ({
        ...prev,
        tagIds: [...prev.tagIds, selected],
      }));
    }
  };

  const removeTag = (id: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.filter(t => t !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    if (!formData.title || !formData.subtitle || !formData.body || !formData.categoryId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Preparar dados no formato esperado pelo backend
    const blogData = {
      title: formData.title,
      subtitle: formData.subtitle,
      body: formData.body,
      quote: formData.quote || undefined,
      image: formData.image || undefined,
      author: formData.author || undefined,
      categoryId: formData.categoryId,
      tagIds: formData.tagIds.length > 0 ? formData.tagIds : undefined,
    };

    mutation.mutate(blogData);
  };

  return (
    <>
      <PageMetaData title="Create Blog" />

      <Row>
        <Col>
          <ComponentContainerCard
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
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="image">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Paste image URL"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="categoryId">
                    <Form.Label>Category *</Form.Label>
                    <Form.Select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      required
                      disabled={isLoadingCategories}
                    >
                      <option value="">Select a category</option>
                      {categories?.content?.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="tagIds">
                    <Form.Label>Tags</Form.Label>
                    <ChoicesFormInput
                      multiple
                      onChange={handleTagSelect}
                      options={{
                        removeItemButton: true,
                        searchEnabled: true,
                        duplicateItemsAllowed: false,
                      }}
                      disabled={isLoadingTags}
                    >
                      {tags?.content?.map(tag => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    </ChoicesFormInput>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="quote">
                    <Form.Label>Quote</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
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
                  placeholder="Enter blog content..."
                />
              </div>

              <div className="mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={mutation.isLoading || isLoadingCategories || isLoadingTags}
                >
                  {mutation.isLoading ? "Creating..." : "Create Blog"}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate("/blogs")}
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

export default BlogCreate;