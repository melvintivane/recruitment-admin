// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   JSXElementConstructor,
//   Key,
//   ReactElement,
//   ReactNode,
//   ReactPortal,
//   useState,
// } from "react";
// import { Button, Col, Form, Row } from "react-bootstrap";
// import { useNavigate, useParams } from "react-router-dom";
// import { useMutation, useQuery } from "react-query";
// import { Formik } from "formik";
// import * as Yup from "yup";

// import PageMetaData from "@/components/PageTitle";
// import ComponentContainerCard from "@/components/ComponentContainerCard";
// import { getVacancyById, updateVacancy } from "@/services/vacancyService";
// import { VacancyType } from "@/types/vacancy";

// const VacancyEdit = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [initialValues, setInitialValues] = useState<VacancyType>({
//     id: "",
//     title: "",
//     slug: "",
//     description: "",
//     type: "FULL_TIME",
//     status: "ACTIVE",
//     yearsOfExperience: 0,
//     applicationCount: 0,
//     degreeRequired: "",
//     careerLevel: "JUNIOR",
//     genderPreference: "UNSPECIFIED",
//     applicationDeadline: "",
//     remoteAllowed: false,
//     minSalary: 0,
//     maxSalary: 0,
//     requiredSkills: [],
//     company: {
//       id: "",
//       name: "",
//       slug: "",
//       mobileNumber: "",
//       email: "",
//       city: {
//         id: 0,
//         name: "",
//         state: {
//           id: 0,
//           name: "",
//           country: {
//             id: 0,
//             shortName: "",
//             name: "",
//             phoneCode: "",
//           },
//         },
//       },
//       industry: "",
//       foundedYear: 0,
//       numberOfEmployees: 0,
//       businessType: "",
//       description: "",
//       createdAt: "",
//       updatedAt: "",
//     },
//     city: {
//       id: 0,
//       name: "",
//       state: {
//         id: 0,
//         name: "",
//         country: {
//           id: 0,
//           shortName: "",
//           name: "",
//           phoneCode: "",
//         },
//       },
//     },
//     createdAt: "",
//     updatedAt: "",
//   });

//   // Buscar os dados da vaga
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { data: vacancy, isLoading } = useQuery(
//     ["vacancy", id],
//     () => getVacancyById(id!),
//     {
//       enabled: !!id,
//       onSuccess: (data) => {
//         setInitialValues(data);
//       },
//     }
//   );

//   // Atualizar a vaga
//   const mutation = useMutation(updateVacancy, {
//     onSuccess: () => {
//       navigate("/vacancies");
//     },
//     onError: (error) => {
//       console.error("Error updating vacancy:", error);
//     },
//   });

//   // Schema de validação
//   const validationSchema = Yup.object().shape({
//     title: Yup.string().required("Job title is required"),
//     description: Yup.string().required("Description is required"),
//     company: Yup.object().shape({
//       id: Yup.string().required("Company is required"),
//     }),
//     type: Yup.string().required("Job type is required"),
//     status: Yup.string().required("Status is required"),
//     yearsOfExperience: Yup.number().required("Years of experience is required"),
//     minSalary: Yup.number().required("Minimum salary is required"),
//     maxSalary: Yup.number()
//       .required("Maximum salary is required")
//       .min(Yup.ref("minSalary"), "Max salary must be greater than min salary"),
//     applicationDeadline: Yup.string().required("Deadline is required"),
//   });

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       <PageMetaData title="Edit Vacancy" />

//       <Row>
//         <Col>
//           <ComponentContainerCard
//             id="vacancy-edit-form"
//             title="Edit Job Vacancy"
//             description="Update the vacancy details below"
//           >
//             <Formik
//               initialValues={initialValues}
//               validationSchema={validationSchema}
//               onSubmit={(values: any) => {
//                 mutation.mutate({ id: id!, data: values });
//               }}
//               enableReinitialize
//             >
//               {({
//                 values,
//                 errors,
//                 touched,
//                 handleChange,
//                 handleBlur,
//                 handleSubmit,
//                 setFieldValue,
//               }) => (
//                 <Form onSubmit={handleSubmit}>
//                   {/* Basic Information */}
//                   <div className="mb-4">
//                     <h5 className="mb-3">Basic Information</h5>

//                     <Row className="mb-3">
//                       <Col md={6}>
//                         <Form.Group controlId="title">
//                           <Form.Label>Job Title *</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="title"
//                             value={values.title}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={!!errors.title && touched.title}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.title}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group controlId="company.id">
//                           <Form.Label>Company *</Form.Label>
//                           <Form.Select
//                             name="company.id"
//                             value={values.company.id}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={!!errors.company?.id && touched.company?.id}
//                           >
//                             <option value="">Select company</option>
//                             <option value="0cdf58d1-a700-46bc-9d87-b6a2dbc40678">
//                               {values.company.name || "Company A"}
//                             </option>
//                           </Form.Select>
//                           <Form.Control.Feedback type="invalid">
//                             {errors.company?.id}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                     </Row>

//                     <Row className="mb-3">
//                       <Col md={6}>
//                         <Form.Group controlId="type">
//                           <Form.Label>Job Type *</Form.Label>
//                           <Form.Select
//                             name="type"
//                             value={values.type}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={!!errors.type && touched.type}
//                           >
//                             <option value="FULL_TIME">Full Time</option>
//                             <option value="PART_TIME">Part Time</option>
//                             <option value="CONTRACT">Contract</option>
//                             <option value="INTERNSHIP">Internship</option>
//                           </Form.Select>
//                           <Form.Control.Feedback type="invalid">
//                             {errors.type}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group controlId="status">
//                           <Form.Label>Status *</Form.Label>
//                           <Form.Select
//                             name="status"
//                             value={values.status}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={!!errors.status && touched.status}
//                           >
//                             <option value="ACTIVE">Active</option>
//                             <option value="CLOSED">Closed</option>
//                             <option value="PENDING">Pending</option>
//                           </Form.Select>
//                           <Form.Control.Feedback type="invalid">
//                             {errors.status}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                     </Row>

//                     <Row className="mb-3">
//                       <Col md={6}>
//                         <Form.Group controlId="city">
//                           <Form.Label>Location *</Form.Label>
//                           <Form.Control
//                             type="text"
//                             value={`${values.city.name}, ${values.city.state.name}`}
//                             disabled
//                           />
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group controlId="remoteAllowed">
//                           <Form.Label>Remote Work</Form.Label>
//                           <Form.Check
//                             type="switch"
//                             id="remoteSwitch"
//                             label="Allow remote work"
//                             checked={values.remoteAllowed}
//                             onChange={() =>
//                               setFieldValue(
//                                 "remoteAllowed",
//                                 !values.remoteAllowed
//                               )
//                             }
//                           />
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                   </div>

//                   {/* Requirements */}
//                   <div className="mb-4">
//                     <h5 className="mb-3">Requirements</h5>

//                     <Row className="mb-3">
//                       <Col md={6}>
//                         <Form.Group controlId="yearsOfExperience">
//                           <Form.Label>Years of Experience *</Form.Label>
//                           <Form.Control
//                             type="number"
//                             min="0"
//                             name="yearsOfExperience"
//                             value={values.yearsOfExperience}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={!!errors.yearsOfExperience && touched.yearsOfExperience}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.yearsOfExperience}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group controlId="careerLevel">
//                           <Form.Label>Career Level *</Form.Label>
//                           <Form.Select
//                             name="careerLevel"
//                             value={values.careerLevel}
//                             onChange={handleChange}
//                           >
//                             <option value="JUNIOR">Junior</option>
//                             <option value="MID">Mid</option>
//                             <option value="SENIOR">Senior</option>
//                             <option value="LEAD">Lead</option>
//                             <option value="MANAGER">Manager</option>
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>
//                     </Row>

//                     <Row className="mb-3">
//                       <Col md={6}>
//                         <Form.Group controlId="degreeRequired">
//                           <Form.Label>Education Requirement</Form.Label>
//                           <Form.Control
//                             type="text"
//                             name="degreeRequired"
//                             value={values.degreeRequired}
//                             onChange={handleChange}
//                           />
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group controlId="genderPreference">
//                           <Form.Label>Gender Preference</Form.Label>
//                           <Form.Select
//                             name="genderPreference"
//                             value={values.genderPreference}
//                             onChange={handleChange}
//                           >
//                             <option value="UNSPECIFIED">No Preference</option>
//                             <option value="MALE">Male</option>
//                             <option value="FEMALE">Female</option>
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                   </div>

//                   {/* Compensation */}
//                   <div className="mb-4">
//                     <h5 className="mb-3">Compensation</h5>

//                     <Row className="mb-3">
//                       <Col md={6}>
//                         <Form.Group controlId="minSalary">
//                           <Form.Label>Minimum Salary *</Form.Label>
//                           <Form.Control
//                             type="number"
//                             min="0"
//                             name="minSalary"
//                             value={values.minSalary}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={!!errors.minSalary && touched.minSalary}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.minSalary}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group controlId="maxSalary">
//                           <Form.Label>Maximum Salary *</Form.Label>
//                           <Form.Control
//                             type="number"
//                             min="0"
//                             name="maxSalary"
//                             value={values.maxSalary}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={!!errors.maxSalary && touched.maxSalary}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.maxSalary}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                   </div>

//                   {/* Dates */}
//                   <div className="mb-4">
//                     <h5 className="mb-3">Dates</h5>

//                     <Row className="mb-3">
//                       <Col md={6}>
//                         <Form.Group controlId="applicationDeadline">
//                           <Form.Label>Application Deadline *</Form.Label>
//                           <Form.Control
//                             type="datetime-local"
//                             name="applicationDeadline"
//                             value={values.applicationDeadline}
//                             onChange={handleChange}
//                             onBlur={handleBlur}
//                             isInvalid={!!errors.applicationDeadline && touched.applicationDeadline}
//                           />
//                           <Form.Control.Feedback type="invalid">
//                             {errors.applicationDeadline}
//                           </Form.Control.Feedback>
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                   </div>

//                   {/* Description */}
//                   <div className="mb-4">
//                     <h5 className="mb-3">Job Description</h5>

//                     <Form.Group controlId="description">
//                       <Form.Label>Description *</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={5}
//                         name="description"
//                         value={values.description}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         isInvalid={!!errors.description && touched.description}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {errors.description}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </div>

//                   {/* Skills */}
//                   <div className="mb-4">
//                     <h5 className="mb-3">Required Skills</h5>
//                     <Form.Group controlId="requiredSkills">
//                       <Form.Label>Skills</Form.Label>
//                       <div className="border p-2 rounded">
//                         {values.requiredSkills.length > 0 ? (
//                           values.requiredSkills.map(
//                             (skill: {
//                               id: Key | null | undefined;
//                               name:
//                                 | string
//                                 | number
//                                 | boolean
//                                 | ReactElement<
//                                     any,
//                                     string | JSXElementConstructor<any>
//                                   >
//                                 | Iterable<ReactNode>
//                                 | ReactPortal
//                                 | null
//                                 | undefined;
//                             }) => (
//                               <span
//                                 key={skill.id}
//                                 className="badge bg-primary me-1"
//                               >
//                                 {skill.name}
//                               </span>
//                             )
//                           )
//                         ) : (
//                           <span className="text-muted">
//                             No skills specified
//                           </span>
//                         )}
//                       </div>
//                     </Form.Group>
//                   </div>

//                   <div className="mt-4">
//                     <Button
//                       variant="primary"
//                       type="submit"
//                       disabled={mutation.isLoading}
//                       className="me-2"
//                     >
//                       {mutation.isLoading ? "Updating..." : "Update Vacancy"}
//                     </Button>
//                     <Button
//                       variant="secondary"
//                       onClick={() => navigate("/vacancies")}
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </ComponentContainerCard>
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default VacancyEdit;
