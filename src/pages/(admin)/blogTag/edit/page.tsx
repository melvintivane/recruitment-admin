import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { getBlogTagById, updateBlogTag } from "@/services/blogTagService";
import { BlogTagType, BlogTagUpdateDto } from "@/types/blogTag";
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

interface BlogTagFormData {
  name: string;
  code: string;
  description: string;
}

const BlogTagEdit = () => {
  const { tagId } = useParams<{ tagId: string }>();
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const [formData, setFormData] = useState<BlogTagFormData>({
    name: "",
    code: "",
    description: "",
  });

  const {
    data: tagData,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery<BlogTagType, Error>(
    ["blogTag", tagId],
    () => {
      if (!tagId) throw new Error("Tag ID is required");
      return getBlogTagById(tagId);
    },
    {
      enabled: !!tagId,
      onSuccess: (data) => {
        setFormData({
          name: data.name,
          code: data.code,
          description: data.description,
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to load tag");
        navigate("/blogs/tags");
      },
    }
  );

  const mutation = useMutation(
    (params: { tagId: string; data: BlogTagUpdateDto }) =>
      updateBlogTag(params.tagId, params.data),
    {
      onSuccess: () => {
        toast.success("Tag updated successfully!");
        navigate("/blogs/tags");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update tag");
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

    const updatedData: BlogTagUpdateDto = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
    };

    mutation.mutate({ tagId: tagId!, data: updatedData });
  };

  if (isFetching) {
    return (
      <div className="d-flex justify-content-center py-5">
        <BootstrapSpinner animation="border" variant="primary" />
      </div>
    );
  }

  if (fetchError || !tagData) {
    return (
      <div className="alert alert-danger mx-3 my-5">
        {fetchError?.message || "Tag not found"}
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Edit ${formData.name || "Tag"}`} />

      <Row>
        <Col>
          <ComponentContainerCard
            id="blog-tag-edit-form"
            title={`Edit ${formData.name || "Blog Tag"}`}
            description="Update the blog tag details below"
          >
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="code" className="mb-3">
                    <Form.Label>Code </Form.Label>
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
                  placeholder="Write a short description of the tag..."
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
                    "Update Tag"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/blogs/tags")}
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

export default BlogTagEdit;
