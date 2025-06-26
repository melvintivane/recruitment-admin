import JobApplicationPipeline from "@/pages/(admin)/applications/pipeline/page";
import CategoriesCreate from "@/pages/(admin)/categories/create/page";
import CategoriesList from "@/pages/(admin)/categories/list/page";
import { lazy } from "react";
import { Navigate, type RouteProps } from "react-router-dom";



// Lazy-loaded components for routes
const VacanciesList = lazy(() => import("@/pages/(admin)/vacancies/list/page"));
const VacanciesCreate = lazy(() => import("@/pages/(admin)/vacancies/create/page"));
const VacancyDetails = lazy(() => import("@/pages/(admin)/vacancies/details/page"));
const VacancyEdit = lazy(() => import("@/pages/(admin)/vacancies/edit/page"));

const ApplicationsList = lazy(() => import("@/pages/(admin)/applications/list/page"));

const EmployerList = lazy(() => import("@/pages/(admin)/employer/list/page"));
const EmployerCreate = lazy(() => import("@/pages/(admin)/employer/create/page"));
const EmployerDetails = lazy(() => import("@/pages/(admin)/employer/details/page"));
const EmployerEdit = lazy(() => import("@/pages/(admin)/employer/edit/page"));
const CandidateList = lazy(() => import("@/pages/(admin)/candidate/list/page"));
const CandidateCreate = lazy(() => import("@/pages/(admin)/candidate/create/page"));
const CandidateDetails = lazy(() => import("@/pages/(admin)/candidate/details/page"));
const CandidateEdit = lazy(() => import("@/pages/(admin)/candidate/edit/page"));
const UserList = lazy(() => import("@/pages/(admin)/user/list/page"));
const UserEdit = lazy(() => import("@/pages/(admin)/user/edit/page"));
const UserCreate = lazy(() => import("@/pages/(admin)/user/create/page"));
const BlogCreate = lazy(() => import("@/pages/(admin)/blog/create/page"));
const BlogList = lazy(() => import("@/pages/(admin)/blog/list/page"));
const BlogEdit = lazy(() => import("@/pages/(admin)/blog/edit/page"));
const BlogDetails = lazy(() => import("@/pages/(admin)/blog/details/page"));
const BlogCategoryList = lazy(() => import("@/pages/(admin)/blogCategory/list/page"));
const BlogCategoryCreate = lazy(() => import("@/pages/(admin)/blogCategory/create/page"));
const BlogCategoryEdit = lazy(() => import("@/pages/(admin)/blogCategory/edit/page"));
const BlogTagList = lazy(() => import("@/pages/(admin)/blogTag/list/page"));
const BlogTagCreate = lazy(() => import("@/pages/(admin)/blogTag/create/page"));
const BlogTagEdit = lazy(() => import("@/pages/(admin)/blogTag/edit/page"));
const BlogCommentaryList = lazy(() => import("@/pages/(admin)/blogCommentary/list/page"));
const BlogCommentaryCreate = lazy(() => import("@/pages/(admin)/blogCommentary/create/page"));

// Dashboard Routes
const Analytics = lazy(() => import("@/pages/(admin)/dashboard/analytics/page"));

// Pages Routes
const Maintenance = lazy(() => import("@/pages/(other)/maintenance/page"));

const Email = lazy(() => import('@/pages/(admin)/apps/email/page'))

// Not Found Routes
const NotFoundAdmin = lazy(() => import("@/pages/(admin)/not-found"));
const NotFound = lazy(() => import("@/pages/(other)/(error-pages)/error-404/page"));

// Auth Routes
const AuthSignIn2 = lazy(() => import("@/pages/(other)/auth/sign-in-2/page"));
const ResetPassword2 = lazy(() => import("@/pages/(other)/auth/reset-pass-2/page"));
const LockScreen2 = lazy(() => import("@/pages/(other)/auth/lock-screen-2/page"));

export type RoutesProps = {
  path: RouteProps["path"];
  name: string;
  element: RouteProps["element"];
  exact?: boolean;
};

const initialRoutes: RoutesProps[] = [
  {
    path: "/",
    name: "root",
    element: <Navigate to="/dashboard/analytics" />,
  },
];

const generalRoutes: RoutesProps[] = [
  {
    path: "/dashboard/analytics",
    name: "Analytics",
    element: <Analytics />,
  },
];

const appsRoutes: RoutesProps[] = [
  {
    name: 'Email',
    path: '/apps/email',
    element: <Email />,
  },
  {
    name: "Blog Create",
    path: "/blogs/create",
    element: <BlogCreate />,
  },
  {
    name: "Blog List",
    path: "/blogs",
    element: <BlogList />,
  },
  {
    name: "Blog Edit",
    path: "/blogs/edit/:blogId",
    element: <BlogEdit />,
  },
  {
    name: "Blog Details",
    path: "/blogs/:blogId",
    element: <BlogDetails />,
  },
  {
    name: "Blog Categories",
    path: "/blogs/categories",
    element: <BlogCategoryList />,
  },
  {
    name:"Blog Category Create",
    path:"/blogs/categories/create",
    element: <BlogCategoryCreate />,
  },
  {
    name: "Blog Category Edit",
    path: "/blogs/categories/edit/:categoryId",
    element: <BlogCategoryEdit />,
  },
  {
    name: "Blog Tags",
    path: "/blogs/tags",
    element: <BlogTagList />,
  },
  {
    name: "Blog Tag Create",
    path: "/blogs/tags/create",
    element: <BlogTagCreate />,
  },
  {
    name: "Blog Tag Edit",
    path: "/blogs/tags/edit/:tagId",
    element: <BlogTagEdit />,
  },
  {
    name: "Blog Commentaries",
    path: "/blogs/commentaries",
    element: <BlogCommentaryList />,
  },
  {
    name: "Blog Commentary Create",
    path: "/blogs/commentaries/create",
    element: <BlogCommentaryCreate />,
  },
  {
    name: "Vacancies List",
    path: "/vacancies",
    element: <VacanciesList />,
  },
  {
    name: "Vacancy Create",
    path: "/vacancies/create",
    element: <VacanciesCreate />,
  },
  {
    name: "Vacancy Details",
    path: "/vacancies/:id",
    element: <VacancyDetails />,
  },
  {
    name: "Vacancy Edit",
    path: "/vacancies/edit/:id",
    element: <VacancyEdit />,
  },
  {
    name: "Vacancy Applications",
    path: "/vacancies/:id/applications",
    element: <JobApplicationPipeline />,
  },
  {
    name: "Applications List",
    path: "/applications",
    element: <ApplicationsList />,
  },
  {
    name:"Employer List",
    path:"/companies",
    element:<EmployerList/>
  },
  {
    name:"Employer Create",
    path:"/companies/create",
    element:<EmployerCreate/>
  },
  {
    name:"Employer Details",
    path:"/companies/:companyId",
    element:<EmployerDetails/>
  },
  {
    name:"Employer Edit",
    path:"/companies/edit/:companyId",
    element:<EmployerEdit/>
  },
  {
    name:"Candidate List",
    path:"/candidates",
    element:<CandidateList/>
  },
  {
    name:"Candidate Create",
    path:"/candidates/create",
    element:<CandidateCreate/>
  },
  {
    name:"Candidate Details",
    path:"/candidates/:candidateId",
    element:<CandidateDetails/>
  },
  {
    name:"Candidate Edit",
    path:"/candidates/edit/:candidateId",
    element:<CandidateEdit/>
  },
  {
    name: "Job Categories",
    path: "/categories",
    element: <CategoriesList />,
  },
  {
    name: "Job Category Create",
    path: "/categories/create",
    element: <CategoriesCreate />,
  },
  {
    name: "User List",
    path: "/users",
    element: <UserList />,
  },
  {
    name: "User Edit",
    path: "/users/edit/:userId",
    element: <UserEdit />,
  },
  {
    name: "User Create",
    path: "/users/create",
    element: <UserCreate />,
  }
];

const customRoutes: RoutesProps[] = [
  {
    name: "Error 404 Alt",
    path: "/pages/error-404-alt",
    element: <NotFoundAdmin />,
  },
];

export const authRoutes: RoutesProps[] = [
  {
    name: "Sign In",
    path: "/auth/sign-in",
    element: <AuthSignIn2 />,
  },
  {
    name: "Reset Password",
    path: "/auth/reset-pass",
    element: <ResetPassword2 />,
  },
  {
    name: "Lock Screen",
    path: "/auth/lock-screen",
    element: <LockScreen2 />,
  },
  {
    name: "404 Error",
    path: "/error-404",
    element: <NotFound />,
  },
  {
    path: "*",
    name: "not-found",
    element: <NotFound />,
  },
  {
    name: "Maintenance",
    path: "/maintenance",
    element: <Maintenance />,
  }
];

export const appRoutes = [
  ...initialRoutes,
  ...generalRoutes,
  ...appsRoutes,
  ...customRoutes,
  ...authRoutes,
];
