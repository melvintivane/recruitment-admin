import ComponentContainerCard from "@/components/ComponentContainerCard";
import ChoicesFormInput from "@/components/form/ChoicesFormInput";
import PageMetaData from "@/components/PageTitle";
import { getAllBlogCategories } from "@/services/blogCategoryService";
import { getBlogById, updateBlog } from "@/services/blogService";
import { getAllBlogTags } from "@/services/blogTagService"; // Added for tags
import { BlogResponseDTO } from "@/types/blog";
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
  imageFile?: File | null; // Changed to handle file upload
  currentImage?: string; // To show existing image
  author?: string;
  categoryId: string;
  tagIds: number[];
}

const BlogEdit = () => {
  const { blogId } = useParams<{ blogId: string }>();
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

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    subtitle: "",
    body: "",
    quote: "",
    currentImage: "",
    author: "",
    categoryId: "",
    tagIds: [] as number[],
  });

  // Fetch blog data
  const {
    data: blogData,
    isLoading: isFetching,
    error: fetchError
  } = useQuery<BlogResponseDTO, Error>(
    ["blog", blogId],
    () => {
      if (!blogId) throw new Error("Blog ID is required");
      return getBlogById(blogId);
    },
    {
      enabled: !!blogId,
      onSuccess: (data) => {
        const categoryId = data.blogCategory?.id?.toString() || "";
        const tagIds = data.blogTags?.map(tag => tag.id) || [];

        setFormData({
          title: data.title,
          subtitle: data.subtitle,
          body: data.body,
          quote: data.quote || "",
          currentImage: data.image || "",
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
  const { data: tags } = useQuery("blogTags", getAllBlogTags);

  const mutation = useMutation(
    (data: { blogId: string; data: FormData }) => {
      return updateBlog(data.blogId, data.data);
    },
    {
      onSuccess: () => {
        toast.success("Blog updated successfully!");
        navigate("/blogs");
      },
      onError: (error: Error) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        imageFile: e.target.files![0]
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

  const removeTag = (id: number) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.filter(t => t !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blogId) {
      toast.error("Blog ID is missing");
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.subtitle || !formData.body || !formData.categoryId) {
      toast.error("Please fill all required fields");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("subtitle", formData.subtitle);
    formDataToSend.append("body", formData.body);
    formDataToSend.append("categoryId", formData.categoryId);

    if (formData.quote) formDataToSend.append("quote", formData.quote);
    if (formData.author) formDataToSend.append("author", formData.author);
    if (formData.imageFile) formDataToSend.append("image", formData.imageFile);
    formData.tagIds.forEach(tagId => formDataToSend.append("tagIds", tagId.toString()));

    mutation.mutate({ blogId, data: formDataToSend });
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
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    {formData.currentImage && (
                      <div className="mt-2 small text-muted">
                        Current image: {formData.currentImage}
                      </div>
                    )}
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
                    <ChoicesFormInput
                      multiple
                      onChange={handleTagSelect}
                      options={{
                        removeItemButton: true,
                        searchEnabled: true,
                        duplicateItemsAllowed: false,
                      }}
                  
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