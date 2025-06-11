import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import PageMetaData from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { getAllCategories } from "@/services/categoryService";
import { CategoryApiResponse } from "@/types/category";

const CategoriesList = () => {
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sort: "createdAt,desc",
  });

  const [categories, setCategories] = useState<CategoryApiResponse>();

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPagination((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllCategories(pagination.page, pagination.size);
      setCategories(data);
    };
    
    fetchData();
  }, [pagination]);

  return (
    <>
      <PageMetaData title="Job Vacancies" />

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
                    placeholder="Search categories..."
                    // onChange={handleSearch}
                  />
                </div>
                <div>
                  <Link to="/categories/create" className="btn btn-success ms-2">
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    Post New Category
                  </Link>
                </div>
              </div>
            </CardBody>
            <div>
              <div className="table-responsive table-centered">
                <table className="table text-nowrap mb-0">
                  <thead className="bg-light bg-opacity-50">
                    <tr>
                      <th className="border-0 py-2">Id</th>
                      <th className="border-0 py-2">Code</th>
                      <th className="border-0 py-2">Name</th>
                      <th className="border-0 py-2">Posted Date</th>
                      <th className="border-0 py-2">Updated Date</th>
                      <th className="border-0 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories?.content?.map((category, idx) => (
                      <tr key={idx}>
                        <td>
                          <Link
                            to={`/vacancies/${category.id}`}
                            className="fw-medium"
                          >
                            {category.id}
                          </Link>
                        </td>
                        <td>{category.code}</td>
                        <td>{category.name}</td>
                        <td>
                          {new Date(category.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          {new Date(category.updatedAt).toLocaleDateString()}
                        </td>
                        <td>
                          <Button
                            variant="soft-secondary"
                            size="sm"
                            type="button"
                            className="me-2"
                            // as={Link}
                            // to={`/vacancies/edit/${category.id}`}
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
                    Showing{" "}
                    <span className="fw-semibold">
                      {categories?.numberOfElements}
                    </span>{" "}
                    of{" "}
                    <span className="fw-semibold">
                      {categories?.totalElements}
                    </span>{" "}
                    categories
                    <select
                      className="form-select form-select-sm ms-2 d-inline-block w-auto"
                      value={pagination.size}
                      onChange={(e) =>
                        handlePageSizeChange(Number(e.target.value))
                      }
                    >
                      {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                          {size} per page
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Col sm="auto" className="mt-3 mt-sm-0">
                  <ul className="pagination pagination-rounded m-0">
                    <li
                      className={`page-item ${categories?.first ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(0)}
                        disabled={categories?.first}
                      >
                        <IconifyIcon icon="bx:left-arrow-alt" />
                      </button>
                    </li>
                    <li
                      className={`page-item ${categories?.first ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={categories?.first}
                      >
                        Prev
                      </button>
                    </li>

                    {/* Mostrar números de página */}
                    {/* Mostrar números de página */}
                    {Array.from(
                      { length: Math.min(5, categories?.totalPages ?? 0) },
                      (_, i) => {
                        // Garante que temos um valor numérico para totalPages
                        const totalPages = categories?.totalPages ?? 0;

                        // Calcula o número da página a ser exibido
                        let pageNum: number;

                        if (totalPages <= 5) {
                          pageNum = i;
                        } else if (pagination.page <= 2) {
                          pageNum = i;
                        } else if (pagination.page >= totalPages - 3) {
                          pageNum = totalPages - 5 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        // Garante que o pageNum está dentro dos limites válidos
                        pageNum = Math.max(
                          0,
                          Math.min(pageNum, totalPages - 1)
                        );

                        return (
                          <li
                            key={pageNum}
                            className={`page-item ${pagination.page === pageNum ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(pageNum)}
                              disabled={pageNum === pagination.page}
                            >
                              {pageNum + 1}
                            </button>
                          </li>
                        );
                      }
                    )}

                    <li
                      className={`page-item ${categories?.last ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={categories?.last}
                      >
                        Next
                      </button>
                    </li>
                    <li
                      className={`page-item ${categories?.last ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() =>
                          handlePageChange((categories?.totalPages || 1) - 1)
                        }
                        disabled={categories?.last}
                      >
                        <IconifyIcon icon="bx:right-arrow-alt" />
                      </button>
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

export default CategoriesList;
