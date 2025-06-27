import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { createBlogCommentary } from "@/services/blogCommentaryService";
import { getAllBlogs } from "@/services/blogService";
import { BlogSummaryDTO } from "@/types/blog";
import { BlogCommentaryCreationDTO } from "@/types/blogCommentary";
import { useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BlogCommentaryCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BlogCommentaryCreationDTO>({
    blogId: "",
    commentary: ""
  });

  // Busca todos os blogs para o select
  const { data: blogs, isLoading: isLoadingBlogs, error: blogsError } = useQuery<BlogSummaryDTO[]>(
    "blogsForCommentary",
    getAllBlogs,
    {
      select: (response) => response.content, // Extrai o array de blogs da resposta paginada
      onError: () => {
        toast.error("Falha ao carregar a lista de blogs");
      }
    }
  );

  const mutation = useMutation(createBlogCommentary, {
    onSuccess: () => {
      toast.success("Comentário criado com sucesso!");
      navigate("/blogs/commentaries");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Falha ao criar comentário");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.blogId) {
      toast.error("Selecione um blog");
      return;
    }

    if (!formData.commentary.trim()) {
      toast.error("Digite o comentário");
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <>
      <PageMetaData title="Criar Comentário" />

      <Row>
        <Col>
          <ComponentContainerCard
            id="blog-commentary-create-form"
            title="Novo Comentário"
            description="Adicione um comentário ao blog selecionado"
          >
            {isLoadingBlogs ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p>Carregando blogs...</p>
              </div>
            ) : blogsError ? (
              <div className="text-center py-4 text-danger">
                Falha ao carregar a lista de blogs
              </div>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="blogId">
                      <Form.Label>Selecione o Blog *</Form.Label>
                      <Form.Select
                        name="blogId"
                        value={formData.blogId}
                        onChange={handleChange}
                        required
                        disabled={mutation.isLoading}
                      >
                        <option value="">Selecione um blog</option>
                        {blogs?.map(blog => (
                          <option key={blog.id} value={blog.id}>
                            {blog.title} {blog.author && `| ${blog.author}`}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="commentary">
                      <Form.Label>Comentário *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="commentary"
                        placeholder="Digite seu comentário..."
                        value={formData.commentary}
                        onChange={handleChange}
                        required
                        disabled={mutation.isLoading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={mutation.isLoading}
                    className="me-2"
                  >
                    {mutation.isLoading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Enviando...
                      </>
                    ) : (
                      "Publicar Comentário"
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/blogs/commentaries")}
                    disabled={mutation.isLoading}
                  >
                    Cancelar
                  </Button>
                </div>
              </Form>
            )}
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  );
};

export default BlogCommentaryCreate;