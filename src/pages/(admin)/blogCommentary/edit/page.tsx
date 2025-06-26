import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { getBlogCommentaryById, updateBlogCommentary } from "@/services/blogCommentaryService";
import { BlogCommentaryResponseDTO, BlogCommentaryUpdateDTO } from "@/types/blogCommentary";
import { useState } from "react";
import { Spinner as BootstrapSpinner, Button, Col, Form, Row } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface BlogCommentaryFormData {
  commentary: string;
}

const BlogCommentaryEdit = () => {
  const { commentaryId } = useParams<{ commentaryId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BlogCommentaryFormData>({
    commentary: "",
  });

  const {
    data: commentaryData,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery<BlogCommentaryResponseDTO, Error>(
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
      onError: (error) => {
        toast.error(error.message || "Failed to load commentary");
        navigate(-1); // Volta para a página anterior
      },
    }
  );

  const mutation = useMutation(
    (params: { commentaryId: string; data: BlogCommentaryUpdateDTO }) =>
      updateBlogCommentary(params.commentaryId, params.data),
    {
      onSuccess: () => {
        toast.success("Commentary updated successfully!");
        navigate(-1); // Volta para a página anterior após edição
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update commentary");
      },
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData: BlogCommentaryUpdateDTO = {
      commentary: formData.commentary,
    };

    mutation.mutate({ commentaryId: commentaryId!, data: updatedData });
  };

  if (isFetching) {
    return (
      <div className="d-flex justify-content-center py-5">
        <BootstrapSpinner animation="border" variant="primary" />
      </div>
    );
  }

  if (fetchError || !commentaryData) {
    return (
      <div className="alert alert-danger mx-3 my-5">
        {fetchError?.message || "Commentary not found"}
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Edit Commentary`} />

      <Row>
        <Col>
          <ComponentContainerCard
            id="blog-commentary-edit-form"
            title="Edit Blog Commentary"
            description="Update the commentary content below"
          >
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="commentary" className="mb-3">
                    <Form.Label>Commentary *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="commentary"
                      value={formData.commentary}
                      onChange={handleChange}
                      required
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
                    "Update Commentary"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(-1)}
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