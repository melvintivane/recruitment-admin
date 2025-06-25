import ComponentContainerCard from "@/components/ComponentContainerCard";
import PageMetaData from "@/components/PageTitle";
import { getUserById, updateUser } from "@/services/userService";
import { User, UserUpdateDTO } from "@/types/user";
import { useState } from "react";
import {
  Spinner as BootstrapSpinner,
  Button,
  Col,
  Form,
  Row,
} from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  gender?: string;
  picture?: string;
}

const UserEdit = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // Form state with TypeScript interface
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    userType: "",
    gender: "",
    picture: "",
  });

  // Fetch user data
  const {
    data: userData,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery<User, Error>(
    ["user", userId],
    () => {
      if (!userId) throw new Error("User ID is required");
      return getUserById(userId);
    },
    {
      enabled: !!userId,
      onSuccess: (data) => {
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          userType: data.userType,
          gender: data.gender,
          picture: data.picture,
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to load user data");
        navigate("/users");
      },
    }
  );

  // Update user mutation
  const mutation = useMutation(updateUser, {
    onSuccess: () => {
      toast.success("User updated successfully!");
      navigate("/users");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData: UserUpdateDTO = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      userType: formData.userType as any, // Cast to any if your enum isn't matching
      gender: formData.gender as any,
      picture: formData.picture,
    };

    mutation.mutate({ userId: userId!, data: updatedData });
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="d-flex justify-content-center py-5">
        <BootstrapSpinner animation="border" variant="primary" />
      </div>
    );
  }

  // Error state
  if (fetchError || !userData) {
    return (
      <div className="alert alert-danger mx-3 my-5">
        {fetchError?.message || "User not found"}
      </div>
    );
  }

  return (
    <>
      <PageMetaData title={`Edit ${formData.firstName || "User"}`} />

      <Row>
        <Col>
          <ComponentContainerCard
            id="user-edit-form"
            title={`Edit ${formData.firstName || "User"}`}
            description="Update the user information below"
          >
            <Form onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <div className="mb-4">
                <h5 className="mb-3">Basic Information</h5>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="firstName" className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="lastName" className="mb-3">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="userType" className="mb-3">
                      <Form.Label>User Type *</Form.Label>
                      <Form.Select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select user type</option>
                        <option value="ADMIN">Admin</option>
                         <option value="BLOGGER">Blogger</option>
                        <option value="CANDIDATE">Candidate</option>
                        <option value="EMPLOYER">Employer</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="gender" className="mb-3">
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="picture" className="mb-3">
                      <Form.Label>Profile Picture URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="picture"
                        value={formData.picture || ""}
                        onChange={handleChange}
                        placeholder="https://example.com/profile.jpg"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              {/* Form Actions */}
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
                    "Update User"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/users")}
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

export default UserEdit;