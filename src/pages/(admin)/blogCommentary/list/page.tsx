import PageMetaData from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import {
  deleteBlogTag,
  getAllBlogTags,
} from "@/services/blogTagService";
import { BlogTagApiResponse } from "@/types/blogTag";
import { useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { withSwal } from "react-sweetalert2";
import { SweetAlertResult } from "sweetalert2";

interface BlogTagListProps {
  swal: {
    fire: (options: object) => Promise<SweetAlertResult>;
  };
}

interface PaginationState {
  page: number;
  size: number;
  sort: string;
}

const BlogTagList = withSwal(({ swal }: BlogTagListProps) => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: 10,
    sort: "createdAt,desc",
  });

  const queryClient = useQueryClient();

  const {
    data: blogTags,
    isLoading,
    error,
  } = useQuery<BlogTagApiResponse, Error>(
    ["blogTags", pagination],
    () => getAllBlogTags(pagination.page, pagination.size),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const deleteMutation = useMutation(deleteBlogTag, {
    onSuccess: () => {
      queryClient.invalidateQueries(["blogTags"]);
      swal.fire({
        title: "Deleted!",
        text: "The tag has been deleted.",
        icon: "success",
        customClass: { confirmButton: "btn btn-success" },
      });
    },
    onError: () => {
      swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the tag.",
        icon: "error",
        customClass: { confirmButton: "btn btn-danger" },
      });
    },
  });

  const handleDelete = async (tagId: string) => {
    const result = await swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-danger me-2",
        cancelButton: "btn btn-secondary",
      },
      buttonsStyling: false,
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(tagId);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  const renderPaginationButtons = () => {
    if (!blogTags?.totalPages) return null;
    const totalPages = blogTags.totalPages;
    const currentPage = pagination.page;
    const buttons = [];

    buttons.push(
      <li key={0} className={`page-item ${currentPage === 0 ? "active" : ""}`}>
        <button className="page-link" onClick={() => handlePageChange(0)}>1</button>
      </li>
    );

    if (currentPage > 3) {
      buttons.push(<li key="left-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
    }

    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages - 2, currentPage + 1);
      i++
    ) {
      buttons.push(
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>{i + 1}</button>
        </li>
      );
    }

    if (currentPage < totalPages - 4) {
      buttons.push(<li key="right-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
    }

    if (totalPages > 1) {
      buttons.push(
        <li key={totalPages - 1} className={`page-item ${currentPage === totalPages - 1 ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(totalPages - 1)}>{totalPages}</button>
        </li>
      );
    }

    return buttons;
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading blog tags: {error.message}
      </div>
    );
  }

  return (
    <>
      <PageMetaData title="Blog Tags" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between gap-3">
                <div className="search-bar">
                  <span><IconifyIcon icon="bx:search-alt" className="mb-1" /></span>
                  <input type="search" className="form-control" placeholder="Search blog tags..." />
                </div>
                <Link to="/blogs/tags/create" className="btn btn-success ms-2">
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Add New Tag
                </Link>
              </div>
            </CardBody>
            <div className="table-responsive table-centered">
              <table className="table text-nowrap mb-0">
                <thead className="bg-light bg-opacity-50">
                  <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        <Spinner type="bordered" className="m-2" color="primary" />
                        <span>Loading tags...</span>
                      </td>
                    </tr>
                  ) : blogTags?.content?.length ? (
                    blogTags.content.map((tag) => (
                      <tr key={tag.id}>
                        <td>{tag.name}</td>
                        <td>{tag.code}</td>
                        <td>{tag.description}</td>
                        <td>{new Date(tag.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button onClick={() => navigate(`/blogs/tags/edit/${tag.id}`)} variant="soft-secondary" size="sm" className="me-2">
                            <IconifyIcon icon="bx:edit" className="fs-16" />
                          </Button>
                          <Button onClick={() => handleDelete(tag.id)} variant="soft-danger" size="sm" disabled={deleteMutation.isLoading}>
                            <IconifyIcon icon="bx:trash" className="fs-16" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4">No tags found</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {!isLoading && blogTags && blogTags.totalElements > 0 && (
                <div className="row g-0 p-3 border-top justify-content-between align-items-center">
                  <div className="col-sm-auto text-muted">
                    Showing {blogTags.numberOfElements} of {blogTags.totalElements} tags
                    <select className="form-select form-select-sm ms-2 d-inline-block w-auto" value={pagination.size} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
                      {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>{size} per page</option>
                      ))}
                    </select>
                  </div>
                  <Col sm="auto" className="mt-3 mt-sm-0">
                    <ul className="pagination pagination-rounded m-0">
                      <li className={`page-item ${blogTags.first ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(0)} disabled={blogTags.first}>
                          <IconifyIcon icon="bx:left-arrow-alt" />
                        </button>
                      </li>
                      <li className={`page-item ${blogTags.first ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(pagination.page - 1)} disabled={blogTags.first}>Prev</button>
                      </li>
                      {renderPaginationButtons()}
                      <li className={`page-item ${blogTags.last ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(pagination.page + 1)} disabled={blogTags.last}>Next</button>
                      </li>
                      <li className={`page-item ${blogTags.last ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(blogTags.totalPages - 1)} disabled={blogTags.last}>
                          <IconifyIcon icon="bx:right-arrow-alt" />
                        </button>
                      </li>
                    </ul>
                  </Col>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
});

export default BlogTagList;
