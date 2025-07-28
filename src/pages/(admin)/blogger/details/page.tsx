import PageMetaData from "@/components/PageTitle";
import { getBlogById } from "@/services/blogService";
import type { BlogResponseDTO } from "@/types/blog";
import { useEffect, useState } from "react";
import { Badge, Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const BlogDetails = () => {
  const [blog, setBlog] = useState<BlogResponseDTO>();
  const { blogId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (blogId) {
        const data = await getBlogById(blogId);
        if (data) setBlog(data);
        else navigate("/pages/error-404-alt");
      }
    })();
  }, [blogId, navigate]);

  return (
    <>
      <PageMetaData title={blog?.title ?? "Blog Details"} />

      <Row>
        <Col xs={12}>
          {blog && (
            <Card>
              <CardBody>
                <div className="clearfix">
                  <div className="float-sm-end">
                    <div className="text-muted">
                      Created: {blog.createdAt}
                    </div>
                    <div className="mt-2">
                      <Badge bg="primary" className="me-1">
                        {blog.blogCategory?.name || "Uncategorized"}
                      </Badge>
                      {blog.blogTags?.map(tag => (
                        <Badge key={tag.id} bg="secondary" className="me-1">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="float-sm-start">
                    <CardTitle as="h4" className="mb-2">
                      {blog.title}
                    </CardTitle>
                    <h5 className="text-muted">{blog.subtitle}</h5>
                    {blog.author && (
                      <div className="mt-2">
                        <strong>Author:</strong> {blog.author}
                      </div>
                    )}
                  </div>
                </div>

                {blog.image && (
                  <Row className="mt-4">
                    <Col xs={12}>
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="img-fluid rounded"
                        style={{ maxHeight: "400px", objectFit: "cover" }}
                      />
                    </Col>
                  </Row>
                )}

                <Row className="mt-4">
                  <Col xs={12}>
                    <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.body }} />
                  </Col>
                </Row>

                {blog.quote && (
                  <Row className="mt-4">
                    <Col xs={12}>
                      <blockquote className="blockquote bg-light p-3 rounded">
                        <p className="mb-0">{blog.quote}</p>
                      </blockquote>
                    </Col>
                  </Row>
                )}

                <Row className="mt-4">
                  <Col md={6}>
                    <h6 className="fw-normal text-muted">Blog Details</h6>
                    <div className="mb-2">
                      <strong>Comments:</strong> {blog.commentsCount}
                    </div>
                    <div className="mb-2">
                      <strong>Created:</strong> {blog.createdAt}
                    </div>
                    <div className="mb-2">
                      <strong>Updated:</strong> {blog.updatedAt}
                    </div>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col xs={12}>
                    <div className="d-flex justify-content-between border-top pt-3">
                      <div>
                        {blog.blogCategory && (
                          <Badge bg="primary">
                            {blog.blogCategory.name}
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted">
                        <small>
                          Updated: {blog.updatedAt}
                        </small>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
};

export default BlogDetails;