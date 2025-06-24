import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import PageMetaData from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { getAllPosts } from "@/helpers/data";
import type { BlogPost } from "@/types/data";

const BlogPosts = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>();

  useEffect(() => {
    (async () => {
      const data = await getAllPosts();
      setAllPosts(data);
    })();
  }, []);

  return (
    <>
      <PageMetaData title="Blog Posts" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <div className="search-bar">
                  <span>
                    <IconifyIcon icon="bx:search-alt" className="mb-1" />
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    id="search"
                    placeholder="Search posts..."
                  />
                </div>
                <div>
                  <Button 
                    variant="success" 
                    // as={Link}
                    // to="/posts/create"
                  >
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    Create Post
                  </Button>
                </div>
              </div>
            </CardBody>
            <div>
              <div className="table-responsive table-centered">
                <table className="table text-nowrap mb-0">
                  <thead className="bg-light bg-opacity-50">
                    <tr>
                      <th className="border-0 py-2">Post ID</th>
                      <th className="border-0 py-2">Title</th>
                      <th className="border-0 py-2">Author</th>
                      <th className="border-0 py-2">Category</th>
                      <th className="border-0 py-2">Created Date</th>
                      <th className="border-0 py-2">Status</th>
                      <th className="border-0 py-2">Views</th>
                      <th className="border-0 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPosts?.map((post, idx) => (
                      <tr key={idx}>
                        <td>
                          <Link
                            to={`/posts/${post.id}`}
                            className="fw-medium"
                          >
                            #{post.id}
                          </Link>
                        </td>
                        <td>{post.title}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {post.author && (
                              <>
                                <img
                                  src={post.avatar}
                                  alt="author"
                                  className="avatar-xs rounded-circle me-2"
                                />
                                <span>{post.author}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary">
                            {post.category}
                          </span>
                        </td>
                        <td>
                          {post.createdAt && 
                            new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <span
                            className={`badge badge-soft-${
                              post.status === "Draft" ? "warning" : "success"
                            }`}
                          >
                            {post.status}
                          </span>
                        </td>
                        <td>{post.views?.toLocaleString()}</td>
                        <td>
                          <Button
                            variant="soft-secondary"
                            size="sm"
                            type="button"
                            className="me-2"
                            // as={Link}
                            // to={`/posts/edit/${post.id}`}
                          >
                            <IconifyIcon icon="bx:edit" className="fs-16" />
                          </Button>
                          <Button variant="soft-danger" size="sm" type="button">
                            <IconifyIcon
                              icon="bx:trash"
                              className="bx bx-trash fs-16"
                            />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="align-items-center justify-content-between row g-0 text-center text-sm-start p-3 border-top">
                <div className="col-sm">
                  <div className="text-muted">
                    Showing&nbsp;
                    <span className="fw-semibold">10</span>&nbsp; of&nbsp;
                    <span className="fw-semibold">{allPosts?.length}</span>&nbsp; posts
                  </div>
                </div>
                <Col sm="auto" className="mt-3 mt-sm-0">
                  <ul className="pagination pagination-rounded m-0">
                    <li className="page-item">
                      <Link to="" className="page-link">
                        <IconifyIcon icon="bx:left-arrow-alt" />
                      </Link>
                    </li>
                    <li className="page-item active">
                      <Link to="" className="page-link">
                        1
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link to="" className="page-link">
                        2
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link to="" className="page-link">
                        3
                      </Link>
                    </li>
                    <li className="page-item">
                      <Link to="" className="page-link">
                        <IconifyIcon icon="bx:right-arrow-alt" />
                      </Link>
                    </li>
                  </ul>
                </Col>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BlogPosts;