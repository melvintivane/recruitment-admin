import { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import PageMetaData from "@/components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { getAllVacancies } from "@/helpers/data"; // You'll need to create this helper
import type { VacancyType } from "@/types/data"; // Define this type

const VacanciesList = () => {
  const [vacancies, setVacancies] = useState<VacancyType[]>();
  const [filteredVacancies, setFilteredVacancies] = useState<VacancyType[]>();

  useEffect(() => {
    (async () => {
      const data = await getAllVacancies();
      setVacancies(data);
      setFilteredVacancies(data);
    })();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    if (vacancies) {
      setFilteredVacancies(
        vacancies.filter(
          (vacancy) =>
            vacancy.title.toLowerCase().includes(searchTerm) ||
            vacancy.department.toLowerCase().includes(searchTerm) ||
            vacancy.location.toLowerCase().includes(searchTerm)
        )
      );
    }
  };

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
                    placeholder="Search vacancies..."
                    onChange={handleSearch}
                  />
                </div>
                <div>
                  <Link to="/vacancies/create" className="btn btn-success ms-2">
                    <IconifyIcon icon="bx:plus" className="me-1" />
                    Post New Job
                  </Link>
                </div>
              </div>
            </CardBody>
            <div>
              <div className="table-responsive table-centered">
                <table className="table text-nowrap mb-0">
                  <thead className="bg-light bg-opacity-50">
                    <tr>
                      <th className="border-0 py-2">Job Title</th>
                      <th className="border-0 py-2">Department</th>
                      <th className="border-0 py-2">Location</th>
                      <th className="border-0 py-2">Type</th>
                      <th className="border-0 py-2">Posted Date</th>
                      <th className="border-0 py-2">Status</th>
                      <th className="border-0 py-2">Applications</th>
                      <th className="border-0 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVacancies?.map((vacancy, idx) => (
                      <tr key={idx}>
                        <td>
                          <Link
                            to={`/vacancies/${vacancy.id}`}
                            className="fw-medium"
                          >
                            {vacancy.title}
                          </Link>
                        </td>
                        <td>{vacancy.department}</td>
                        <td>{vacancy.location}</td>
                        <td>{vacancy.type}</td>
                        <td>
                          {new Date(vacancy.postedDate).toLocaleDateString()}
                        </td>
                        <td>
                          <span
                            className={`badge badge-soft-${
                              vacancy.status === "Closed"
                                ? "danger"
                                : vacancy.status === "Draft"
                                  ? "warning"
                                  : "success"
                            }`}
                          >
                            {vacancy.status}
                          </span>
                        </td>
                        <td>{vacancy.applicationCount}</td>
                        <td>
                          <Button
                            variant="soft-secondary"
                            size="sm"
                            type="button"
                            className="me-2"
                            // as={Link}
                            // to={`/vacancies/edit/${vacancy.id}`}
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
                    <span className="fw-semibold">
                      {filteredVacancies?.length}
                    </span>
                    &nbsp;of&nbsp;
                    <span className="fw-semibold">{vacancies?.length}</span>
                    &nbsp;jobs
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

export default VacanciesList;
