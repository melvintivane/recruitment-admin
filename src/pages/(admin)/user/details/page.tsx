import logoDark from "@/assets/images/logo-dark-full.png";
import logoLight from "@/assets/images/logo-light-full.png";
import PageMetaData from "@/components/PageTitle";
import { getUserById } from "@/services/userService";
import { UserType } from "@/types/user";
import { useEffect, useState } from "react";
import { Alert, Badge, Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const UserDetails = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) {
          navigate("/pages/error-404-alt");
          return;
        }

        setLoading(true);
        const data = await getUserById(userId);
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
        navigate("/pages/error-404-alt");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  if (loading) {
    return (
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 mb-0">Loading user details...</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }

  if (error) {
    return (
      <Row>
        <Col xs={12}>
          <Alert variant="danger" className="my-3">
            {error}
          </Alert>
        </Col>
      </Row>
    );
  }

  if (!user) {
    return null;
  }

  const formatUserType = (type: string) => {
    switch (type) {
      case 'ADMIN':
        return 'Administrator';
      case 'CANDIDATE':
        return 'Candidate';
      case 'EMPLOYER':
        return 'Employer';
      case 'BLOGGER':
        return 'Blogger';
      default:
        return type;
    }
  };

  const formatGender = (gender?: string) => {
    if (!gender) return 'Not specified';
    return gender.charAt(0) + gender.slice(1).toLowerCase();
  };

  return (
    <>
      <PageMetaData title={`${user.firstName} ${user.lastName}` || "User Details"} />

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="clearfix">
                <div className="float-sm-end">
                  <div className="auth-logo">
                    <img
                      className="logo-dark me-1"
                      height={24}
                      src={logoDark}
                      alt="logo-dark"
                    />
                    <img
                      className="logo-light me-1"
                      height={24}
                      src={logoLight}
                      alt="logo-light"
                    />
                  </div>
                  <address className="mt-3">
                    Member since: {new Date(user.createdAt).toLocaleDateString()}<br />
                    <abbr title="Email">E:</abbr> {user.email}
                  </address>
                </div>
                <div className="float-sm-start">
                  <CardTitle as="h5" className="mb-2">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <div className="d-flex gap-2 align-items-center">
                    <Badge
                      pill
                      bg={
                        user.userType === "ADMIN"
                          ? "danger"
                          : user.userType === "EMPLOYER"
                            ? "info"
                            : "success"
                      }
                    >
                      {formatUserType(user.userType)}
                    </Badge>
                    <span className="text-muted">#{user.id}</span>
                  </div>
                </div>
              </div>

              <Row className="mt-4">
                <Col md={6}>
                  <h6 className="fw-normal text-muted">Personal Information</h6>
                  <div className="mb-2">
                    <strong>Full Name:</strong> {user.firstName} {user.lastName}
                  </div>
                  <div className="mb-2">
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div className="mb-2">
                    <strong>Gender:</strong> {formatGender(user.gender)}
                  </div>
                  <div className="mb-2">
                    <strong>Account Type:</strong> {formatUserType(user.userType)}
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}
                  </div>
                  {user.lastLogin && (
                    <div className="mb-2">
                      <strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}
                    </div>
                  )}
                </Col>
              </Row>

              {user.bio && (
                <Row className="mt-3">
                  <Col xs={12}>
                    <h6 className="fw-normal text-muted">About</h6>
                    <div className="p-3 bg-light rounded">
                      {user.bio}
                    </div>
                  </Col>
                </Row>
              )}

              <Row className="mt-3">
                <Col xs={12}>
                  <h6 className="fw-normal text-muted">Account Details</h6>
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead className="bg-light bg-opacity-50">
                        <tr>
                          <th className="border-0 py-2">Category</th>
                          <th className="border-0 py-2">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Registration Date</td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                        <tr>
                          <td>Last Updated</td>
                          <td>
                            {new Date(user.updatedAt).toLocaleDateString()}
                          </td>
                        </tr>
                        <tr>
                          <td>Email Verified</td>
                          <td>
                            {user.isEmailVerified ? (
                              <Badge pill bg="success">Verified</Badge>
                            ) : (
                              <Badge pill bg="warning">Pending</Badge>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>Account Status</td>
                          <td>
                            {user.isActive ? (
                              <Badge pill bg="success">Active</Badge>
                            ) : (
                              <Badge pill bg="danger">Inactive</Badge>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>

              {user.userType === 'CANDIDATE' && user.resume && (
                <Row className="mt-3">
                  <Col xs={12}>
                    <h6 className="fw-normal text-muted">Resume</h6>
                    <div className="p-3 bg-light rounded">
                      <a 
                        href={user.resume} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        View Resume
                      </a>
                    </div>
                  </Col>
                </Row>
              )}

              <Row className="mt-3">
                <Col sm={12}>
                  <div className="clearfix pt-xl-3 pt-0">
                    <h6 className="text-muted">Notes:</h6>
                    <small className="text-muted">
                      {user.userType === 'ADMIN' && 'This user has administrator privileges.'}
                      {user.userType === 'EMPLOYER' && 'This user can post job vacancies.'}
                      {user.userType === 'CANDIDATE' && 'This user can apply for job vacancies.'}
                    </small>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UserDetails;