import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { getBlogCommentaryById, updateBlogCommentary } from "@/services/blogCommentaryService";
import { BlogCommentaryResponseDTO, BlogCommentaryUpdateDTO } from "@/types/blogCommentary";
import { ErrorType } from "@/types/common";
import { useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BlogCommentaryEdit = () => {
  const { commentaryId } = useParams<{ commentaryId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BlogCommentaryUpdateDTO>({
    commentary: "",
  });

  // Fetch commentary data
  const {
    data: commentaryData,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery<BlogCommentaryResponseDTO>(
    ["blogCommentary", commentaryId],
    () => {
      if (!commentaryId) throw new Error("Commentary ID is required");
      return getBlogCommentaryById(commentaryId);
    },
    {
      enabled: !!commentaryId,
      onSuccess: (data) => {
        setFormData({
          commentary: data.commentary,
        });
      },
      onError: (err: unknown) => {
        const error = err as ErrorType;
        toast.error(error.message || "Failed to load commentary");
        navigate("/blogs/commentaries");
      },
    }
  );

  // Update commentary mutation
  const mutation = useMutation(
    (updateData: BlogCommentaryUpdateDTO) => {
      if (!commentaryId) throw new Error("Commentary ID is required");
      return updateBlogCommentary(commentaryId, updateData);
    },
    {
      onSuccess: () => {
        toast.success("Commentary updated successfully!");
        navigate(`/blogs/commentaries/${commentaryId}`);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to update commentary");
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isFetching) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (fetchError || !commentaryData) {
    const errorMessage = fetchError instanceof Error ? fetchError.message : "Commentary not found";

    return (
      <Alert variant="danger" className="mx-3 my-5">
        {errorMessage}
      </Alert>
    );
  }

  return (
    <>
      <PageMetaData title="Edit Commentary" />

      <Row>
        <Col>
          <ComponentContainerCard
            id="blog-commentary-edit"
            title="Edit Commentary"
            description="Update the content of your commentary"
          >
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="commentary">
                    <Form.Label>Comment Content *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="commentary"
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
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    navigate(`/blogs/commentaries/${commentaryId}`)
                  }
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

export default BlogCommentaryEdit;
