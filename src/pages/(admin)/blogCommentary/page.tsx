import { useState } from "react";
import { Button, Card, CardBody, Col, Row, Spinner } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PageMetaData from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { getBlogCommentaries } from "@/services/blogCommentaryService";
import type { BlogCommentaryResponseDTO } from "@/types/blogCommentary";

const BlogCommentariesList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Properly typed query using BlogCommentaryResponseDTO
  const { 
    data: paginatedResponse, 
    isLoading, 
    error 
  } = useQuery<{
    content: BlogCommentaryResponseDTO[];
    totalElements: number;
  }>(
    ['blogCommentaries', page, size],
    () => getBlogCommentaries("", page, size),
    {
      keepPreviousData: true,
      onError: () => {
        toast.error("Failed to load commentaries");
      }
    }
  );

  const commentaries = paginatedResponse?.content || [];
  const totalCommentaries = paginatedResponse?.totalElements || 0;

  const filteredCommentaries = commentaries.filter(commentary =>
    commentary.commentary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commentary.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <PageMetaData title="Blog Commentaries" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <div className="search-bar">
                  <IconifyIcon icon="bx:search-alt" className="mb-1" />
                  <input
                    type="search"
                    placeholder="Search commentaries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  variant="success"
                  onClick={() => navigate("/blogs/commentaries/create")}
                >
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Add Commentary
                </Button>
              </div>
            </CardBody>

            {isLoading ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
                <p>Loading commentaries...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4 text-danger">
                Error loading commentaries
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Comment</th>
                        <th>Author</th>
                        <th>Blog Post</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCommentaries.map((commentary: BlogCommentaryResponseDTO) => (
                        <tr key={commentary.id}>
                          <td>
                            <Link to={`/blogs/commentaries/${commentary.id}`}>
                              {commentary.commentary.substring(0, 60)}...
                            </Link>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              {commentary.user.avatar && (
                                <img
                                  src={commentary.user.avatar}
                                  alt={commentary.user.name}
                                  className="avatar-xs rounded-circle me-2"
                                />
                              )}
                              <span>{commentary.user.name}</span>
                            </div>
                          </td>
                          <td>
                            <Link to={`/blogs/${commentary.blog.id}`}>
                              {commentary.blog.title.substring(0, 30)}...
                            </Link>
                          </td>
                          <td>
                            {new Date(commentary.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => navigate(`/blogs/commentaries/edit/${commentary.id}`)}
                            >
                              <IconifyIcon icon="bx:edit" />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="ms-2"
                              onClick={() => toast.info("Delete functionality coming soon")}
                            >
                              <IconifyIcon icon="bx:trash" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between p-3">
                  <div>
                    Showing {commentaries.length} of {totalCommentaries} commentaries
                  </div>
                  <div>
                    <Button
                      variant="outline-secondary"
                      disabled={page === 0}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="ms-2"
                      disabled={page + 1 >= Math.ceil(totalCommentaries / size)}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BlogCommentariesList;