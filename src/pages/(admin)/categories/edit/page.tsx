import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { getCategoryById, updateCategory } from "@/services/categoryService";
import { CategoryType, CategoryUpdateDTO } from "@/types/category";
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
  const { categoryId } = useParams<{ categoryId: string }>(); // Changed to string
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
  } = useQuery<CategoryType, Error>(
    ["blogCategory", categoryId],
    () => {
      if (!categoryId) throw new Error("Category ID is required");
      return getCategoryById(categoryId);
    },
    {
      enabled: !!categoryId,
      onSuccess: (data) => {
        setFormData({
          name: data.name,
          code: data.code,
          description: data.description || "", // Handle potential undefined
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to load category");
        navigate("/blogs/categories"); // Changed to categories
      },
    }
  );

  const mutation = useMutation(
    (data: CategoryUpdateDTO) => {
      if (!categoryId) throw new Error("Category ID is required");
      return updateCategory({ id: categoryId, data });
    },
    {
      onSuccess: () => {
        toast.success("Category updated successfully!");
        navigate("/blogs/categories"); // Changed to categories
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to update category");
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData: CategoryUpdateDTO = {
      name: formData.name,
      description: formData.description,
    };

    mutation.mutate(updatedData);
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
      <PageMetaData title={`Edit ${categoryData.name || "Category"}`} />

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
