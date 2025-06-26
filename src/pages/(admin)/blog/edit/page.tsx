/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { getAllBlogCategories } from "@/services/blogCategoryService";
import { getBlogById, updateBlog } from "@/services/blogService";
import { BlogResponseDTO, BlogUpdateDTO } from "@/types/blog";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Spinner as BootstrapSpinner, Button, Col, Form, Row } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface BlogFormData {
  title: string;
  subtitle: string;
  body: string;
  quote?: string;
  image?: string;
  author?: string;
  categoryId: string;
  tagIds: number[];
}

const BlogEdit = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();

  // Quill editor configuration
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

  // Form state
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    subtitle: "",
    body: "",
    quote: "",
    image: "",
    author: "",
    categoryId: "",
    tagIds: [],
  });

  // Fetch blog data
  const {
    data: blogData,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery<BlogResponseDTO, Error>(
    ["blog", blogId],
    () => {
      if (!blogId) throw new Error("Blog ID is required");
      return getBlogById(blogId);
    },
    {
      enabled: !!blogId,
      onSuccess: (data) => {
        // Handle cases where blogCategory or blogTags might be empty strings
        const categoryId = typeof data.blogCategory === 'object' ?
          data.blogCategory?.id || "" : "";

        const tagIds = Array.isArray(data.blogTags) ?
          data.blogTags.map(tag => typeof tag === 'object' ? tag.id : 0).filter(id => id !== 0) :
          [];

        setFormData({
          title: data.title,
          subtitle: data.subtitle,
          body: data.body,
          quote: data.quote || "",
          image: data.image || "",
          author: data.author || "",
          categoryId,
          tagIds,
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to load blog data");
        navigate("/blogs");
      },
    }
  );

  // Fetch categories and tags
  const { data: categories } = useQuery("blogCategories", getAllBlogCategories);
  const allTags = [
    { id: 1, name: "Java" },
    { id: 2, name: "Spring Boot" },
    { id: 3, name: "React" },
    { id: 4, name: "Tailwind" },
  ];

  // Update blog mutation
  const mutation = useMutation(
    (data: { blogId: string; data: BlogUpdateDTO }) =>
      updateBlog(data.blogId, data.data),
    {
      onSuccess: () => {
        toast.success("Blog updated successfully!");
        navigate("/blogs");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update blog");
      },
    }
  );

  const handleBodyChange = (value: string) => {
    setFormData(prev => ({ ...prev, body: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const removeTag = (id: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.filter(t => t !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data according to BlogUpdateDTO
    const updatedData: BlogUpdateDTO = {
      title: formData.title,
      subtitle: formData.subtitle,
      body: formData.body,
      ...(formData.quote && { quote: formData.quote }),
      ...(formData.image && { image: formData.image }),
      ...(formData.author && { author: formData.author }),
      ...(formData.categoryId && { categoryId: formData.categoryId }),
      ...(formData.tagIds.length > 0 && { tagIds: formData.tagIds }),
    };

    if (!blogId) {
      toast.error("Blog ID is missing");
      return;
    }

    mutation.mutate({ blogId, data: updatedData });
  };

  if (isFetching) {
    return (
      <div className="d-flex justify-content-center py-5">
        <BootstrapSpinner animation="border" variant="primary" />
      </div>
    );
  }

  if (fetchError || !blogData) {
    return (
      <div className="alert alert-danger mx-3 my-5">
        {fetchError?.message || "Blog not found"}
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Edit ${formData.title || "Blog"}`} />

      <Row>
        <Col>
          <ComponentContainerCard
            id="blog-edit-form"
            title={`Edit ${formData.title || "Blog"}`}
            description="Update the blog post below"
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
                    <Form.Select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories?.content?.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
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
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="mb-4">
                <h5 className="mb-3">Content *</h5>
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
                    "Update Blog"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/blogs")}
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

export default BlogEdit;