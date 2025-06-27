import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { getBlogCategoryById, updateBlogCategory } from "@/services/blogCategoryService";
import { BlogCategoryType, BlogCategoryUpdateDto } from "@/types/blogCategory";
import { useState } from "react";
import {
  Spinner as BootstrapSpinner,
  Button,
  Col,
  Form,
  Row,
} from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface BlogCategoryFormData {
  name: string;
  code: string;
  description: string;
}

const BlogCategoryEdit = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const [formData, setFormData] = useState<BlogCategoryFormData>({
    name: "",
    code: "",
    description: "",
  });

  const {
    data: categoryData,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery<BlogCategoryType, Error>(
    ["blogCategory", categoryId],
    () => {
      if (!categoryId) throw new Error("Category ID is required");
      return getBlogCategoryById(categoryId);
    },
    {
      enabled: !!categoryId,
      onSuccess: (data) => {
        setFormData({
          name: data.name,
          code: data.code,
          description: data.description,
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to load category");
        navigate("/blogs/categories");
      },
    }
  );

 const mutation = useMutation(
  (params: { categoryId: string; data: BlogCategoryUpdateDto }) => 
    updateBlogCategory(params.categoryId, params.data),
  {
    onSuccess: () => {
      toast.success("Category updated successfully!");
      navigate("/blogs/categories");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  }
);

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData: BlogCategoryUpdateDto = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
    };

    mutation.mutate({ categoryId: categoryId!, data: updatedData });
  };

  if (isFetching) {
    return (
      <div className="d-flex justify-content-center py-5">
        <BootstrapSpinner animation="border" variant="primary" />
      </div>
    );
  }

  if (fetchError || !categoryData) {
    return (
      <div className="alert alert-danger mx-3 my-5">
        {fetchError?.message || "Category not found"}
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Edit ${formData.name || "Category"}`} />

      <Row>
        <Col>
          <ComponentContainerCard
            id="blog-category-edit-form"
            title={`Edit ${formData.name || "Blog Category"}`}
            description="Update the blog category details below"
          >
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="code" className="mb-3">
                    <Form.Label>Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="e.g.CAT-001,generated automatically"
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label>Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
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
                  placeholder="Write a short description of the category..."
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
                    "Update Category"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/blogs/categories")}
                  disabled={mutation.isLoading}
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

export default BlogCategoryEdit;
