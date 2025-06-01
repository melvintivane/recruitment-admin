import BlogPosts from "@/pages/(admin)/blog/page";
import { lazy } from "react";
import { Navigate, type RouteProps } from "react-router-dom";

// Dashboard Routes
const Analytics = lazy(
  () => import("@/pages/(admin)/dashboard/analytics/page")
);
// const Finance = lazy(() => import('@/app/(admin)/dashboard/finance/page'))
// const Sales = lazy(() => import('@/app/(admin)/dashboard/sales/page'))

// Apps Routes
// const EcommerceProducts = lazy(() => import('@/app/(admin)/ecommerce/products/page'))
// const EcommerceProductDetails = lazy(() => import('@/app/(admin)/ecommerce/products/[productId]/page'))
// const EcommerceProductCreate = lazy(() => import('@/app/(admin)/ecommerce/products/create/page'))
// const EcommerceCustomers = lazy(() => import('@/app/(admin)/ecommerce/customers/page'))
// const EcommerceSellers = lazy(() => import('@/app/(admin)/ecommerce/sellers/page'))
// const EcommerceOrders = lazy(() => import('@/app/(admin)/ecommerce/orders/page'))
// const EcommerceOrderDetails = lazy(() => import('@/app/(admin)/ecommerce/orders/[orderId]/page'))
// const EcommerceInventory = lazy(() => import('@/app/(admin)/ecommerce/inventory/page'))
const Chat = lazy(() => import("@/pages/(admin)/apps/chat/page"));
const Email = lazy(() => import("@/pages/(admin)/apps/email/page"));
const Schedule = lazy(() => import("@/pages/(admin)/calendar/schedule/page"));
const Integration = lazy(() => import("@/pages/(admin)/calendar/integration/page"));
const Todo = lazy(() => import("@/pages/(admin)/apps/todo/page"));
// const Social = lazy(() => import('@/app/(admin)/apps/social/page'))
// const Contacts = lazy(() => import('@/app/(admin)/apps/contacts/page'))
const Invoices = lazy(() => import("@/pages/(admin)/invoices/page"));
const InvoiceDetails = lazy(() => import("@/pages/(admin)/invoices/[invoiceId]/page"));

// Pages Routes
const Welcome = lazy(() => import("@/pages/(admin)/pages/welcome/page"));
const FAQs = lazy(() => import("@/pages/(admin)/pages/faqs/page"));
const ComingSoon = lazy(() => import("@/pages/(other)/coming-soon/page"));
const TimelinePage = lazy(() => import("@/pages/(admin)/pages/timeline/page"));
const Pricing = lazy(() => import("@/pages/(admin)/pages/pricing/page"));
const Maintenance = lazy(() => import("@/pages/(other)/maintenance/page"));
const Widgets = lazy(() => import("@/pages/(admin)/widgets/page"));

// Base UI Routes
const Accordions = lazy(() => import("@/pages/(admin)/ui/accordions/page"));
const Alerts = lazy(() => import("@/pages/(admin)/ui/alerts/page"));
const Avatars = lazy(() => import("@/pages/(admin)/ui/avatars/page"));
const Badges = lazy(() => import("@/pages/(admin)/ui/badges/page"));
const Breadcrumb = lazy(() => import("@/pages/(admin)/ui/breadcrumb/page"));
const Buttons = lazy(() => import("@/pages/(admin)/ui/buttons/page"));
const Cards = lazy(() => import("@/pages/(admin)/ui/cards/page"));
const Carousel = lazy(() => import("@/pages/(admin)/ui/carousel/page"));
const Collapse = lazy(() => import("@/pages/(admin)/ui/collapse/page"));
const Dropdowns = lazy(() => import("@/pages/(admin)/ui/dropdowns/page"));
const ListGroup = lazy(() => import("@/pages/(admin)/ui/list-group/page"));
const Modals = lazy(() => import("@/pages/(admin)/ui/modals/page"));
const Tabs = lazy(() => import("@/pages/(admin)/ui/tabs/page"));
const Offcanvas = lazy(() => import("@/pages/(admin)/ui/offcanvas/page"));
const Pagination = lazy(() => import("@/pages/(admin)/ui/pagination/page"));
const Placeholders = lazy(() => import("@/pages/(admin)/ui/placeholders/page"));
const Popovers = lazy(() => import("@/pages/(admin)/ui/popovers/page"));
const Progress = lazy(() => import("@/pages/(admin)/ui/progress/page"));
const Spinners = lazy(() => import("@/pages/(admin)/ui/spinners/page"));
const Toasts = lazy(() => import("@/pages/(admin)/ui/toasts/page"));
const Tooltips = lazy(() => import("@/pages/(admin)/ui/tooltips/page"));

// Advanced UI Routes
const Ratings = lazy(() => import("@/pages/(admin)/advanced/ratings/page"));
const SweetAlerts = lazy(() => import("@/pages/(admin)/advanced/alert/page"));
const Swiper = lazy(() => import("@/pages/(admin)/advanced/swiper/page"));
const Scrollbar = lazy(() => import("@/pages/(admin)/advanced/scrollbar/page"));
const Toastify = lazy(() => import("@/pages/(admin)/advanced/toastify/page"));

// Charts and Maps Routes
const Area = lazy(() => import("@/pages/(admin)/charts/area/page"));
const Bar = lazy(() => import("@/pages/(admin)/charts/bar/page"));
const Bubble = lazy(() => import("@/pages/(admin)/charts/bubble/page"));
const Candlestick = lazy(
  () => import("@/pages/(admin)/charts/candlestick/page")
);
const Column = lazy(() => import("@/pages/(admin)/charts/column/page"));
const Heatmap = lazy(() => import("@/pages/(admin)/charts/heatmap/page"));
const Line = lazy(() => import("@/pages/(admin)/charts/line/page"));
const Mixed = lazy(() => import("@/pages/(admin)/charts/mixed/page"));
const Timeline = lazy(() => import("@/pages/(admin)/charts/timeline/page"));
const Boxplot = lazy(() => import("@/pages/(admin)/charts/boxplot/page"));
const Treemap = lazy(() => import("@/pages/(admin)/charts/treemap/page"));
const Pie = lazy(() => import("@/pages/(admin)/charts/pie/page"));
const Radar = lazy(() => import("@/pages/(admin)/charts/radar/page"));
const RadialBar = lazy(() => import("@/pages/(admin)/charts/radial-bar/page"));
const Scatter = lazy(() => import("@/pages/(admin)/charts/scatter/page"));
const Polar = lazy(() => import("@/pages/(admin)/charts/polar/page"));
const GoogleMaps = lazy(() => import("@/pages/(admin)/maps/google/page"));
const VectorMaps = lazy(() => import("@/pages/(admin)/maps/vector/page"));

// Forms Routes
const Basic = lazy(() => import("@/pages/(admin)/forms/basic/page"));
const Checkbox = lazy(() => import("@/pages/(admin)/forms/checkbox/page"));
const Select = lazy(() => import("@/pages/(admin)/forms/select/page"));
const Clipboard = lazy(() => import("@/pages/(admin)/forms/clipboard/page"));
const FlatPicker = lazy(() => import("@/pages/(admin)/forms/flat-picker/page"));
const Validation = lazy(() => import("@/pages/(admin)/forms/validation/page"));
const Wizard = lazy(() => import("@/pages/(admin)/forms/wizard/page"));
const FileUploads = lazy(
  () => import("@/pages/(admin)/forms/file-uploads/page")
);
const Editors = lazy(() => import("@/pages/(admin)/forms/editors/page"));
const InputMask = lazy(() => import("@/pages/(admin)/forms/input-mask/page"));
const Slider = lazy(() => import("@/pages/(admin)/forms/slider/page"));

// Form Routes
const BasicTable = lazy(() => import("@/pages/(admin)/tables/basic/page"));
const GridjsTable = lazy(() => import("@/pages/(admin)/tables/gridjs/page"));

// Icon Routes
const BoxIcons = lazy(() => import("@/pages/(admin)/icons/boxicons/page"));
const SolarIcons = lazy(() => import("@/pages/(admin)/icons/iconamoon/page"));

// Not Found Routes
const NotFoundAdmin = lazy(() => import("@/pages/(admin)/not-found"));
const NotFound = lazy(
  () => import("@/pages/(other)/(error-pages)/error-404/page")
);

// Auth Routes
const AuthSignIn2 = lazy(() => import("@/pages/(other)/auth/sign-in-2/page"));
const AuthSignUp2 = lazy(() => import("@/pages/(other)/auth/sign-up-2/page"));
const ResetPassword2 = lazy(() => import("@/pages/(other)/auth/reset-pass-2/page"));
const LockScreen2 = lazy(() => import("@/pages/(other)/auth/lock-screen-2/page")
);

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
  //   {
  //     path: '/dashboard/finance',
  //     name: 'Finance',
  //     element: <Finance />,
  //   },
  //   {
  //     path: '/dashboard/sales',
  //     name: 'Sales',
  //     element: <Sales />,
  //   },
];

const appsRoutes: RoutesProps[] = [
  //   {
  //     name: 'Products',
  //     path: '/ecommerce/products',
  //     element: <EcommerceProducts />,
  //   },
  //   {
  //     name: 'Product Details',
  //     path: '/ecommerce/products/:productId',
  //     element: <EcommerceProductDetails />,
  //   },
  //   {
  //     name: 'Create Product',
  //     path: '/ecommerce/products/create',
  //     element: <EcommerceProductCreate />,
  //   },
  //   {
  //     name: 'Customers',
  //     path: '/ecommerce/customers',
  //     element: <EcommerceCustomers />,
  //   },
  //   {
  //     name: 'Sellers',
  //     path: '/ecommerce/sellers',
  //     element: <EcommerceSellers />,
  //   },
  //   {
  //     name: 'Orders',
  //     path: '/ecommerce/orders',
  //     element: <EcommerceOrders />,
  //   },
  //   {
  //     name: 'Order Details',
  //     path: '/ecommerce/orders/:orderId',
  //     element: <EcommerceOrderDetails />,
  //   },
  //   {
  //     name: 'Inventory',
  //     path: '/ecommerce/inventory',
  //     element: <EcommerceInventory />,
  //   },
  {
    name: "Chat",
    path: "/apps/chat",
    element: <Chat />,
  },
  {
    name: "Email",
    path: "/apps/email",
    element: <Email />,
  },
  {
    name: "Schedule",
    path: "/calendar/schedule",
    element: <Schedule />,
  },
  {
    name: "Integration",
    path: "/calendar/integration",
    element: <Integration />,
  },
  // {
  //   path: '/posts/create',
  //   element: <CreatePost />,
  // },
  // {
  //   path: '/posts/edit/:id',
  //   element: <EditPost />,
  // }
  //   {

  {
    name: "Todo",
    path: "/apps/todo",
    element: <Todo />,
  },
  //   {
  //     name: 'Social',
  //     path: '/apps/social',
  //     element: <Social />,
  //   },
  //   {
  //     name: 'Contacts',
  //     path: '/apps/contacts',
  //     element: <Contacts />,
  //   },
  {
    name: "Invoices List",
    path: "/invoices",
    element: <Invoices />,
  },
  {
    name: "Blog Posts",
    path: "/blogs",
    element: <BlogPosts />,
  },
  {
    name: "Invoices Details",
    path: "/invoices/:invoiceId",
    element: <InvoiceDetails />,
  },
];

const customRoutes: RoutesProps[] = [
  {
    name: "Welcome",
    path: "/pages/welcome",
    element: <Welcome />,
  },
  {
    name: "FAQs",
    path: "/pages/faqs",
    element: <FAQs />,
  },
  {
    name: "Timeline",
    path: "/pages/timeline",
    element: <TimelinePage />,
  },
  {
    name: "Pricing",
    path: "/pages/pricing",
    element: <Pricing />,
  },
  {
    name: "Error 404 Alt",
    path: "/pages/error-404-alt",
    element: <NotFoundAdmin />,
  },
  {
    name: "Widgets",
    path: "/widgets",
    element: <Widgets />,
  },
];

const baseUIRoutes: RoutesProps[] = [
  {
    name: "Accordions",
    path: "/ui/accordions",
    element: <Accordions />,
  },
  {
    name: "Alerts",
    path: "/ui/alerts",
    element: <Alerts />,
  },
  {
    name: "Avatars",
    path: "/ui/avatars",
    element: <Avatars />,
  },
  {
    name: "Badges",
    path: "/ui/badges",
    element: <Badges />,
  },
  {
    name: "Breadcrumb",
    path: "/ui/breadcrumb",
    element: <Breadcrumb />,
  },
  {
    name: "Buttons",
    path: "/ui/buttons",
    element: <Buttons />,
  },
  {
    name: "Cards",
    path: "/ui/cards",
    element: <Cards />,
  },
  {
    name: "Carousel",
    path: "/ui/carousel",
    element: <Carousel />,
  },
  {
    name: "Collapse",
    path: "/ui/collapse",
    element: <Collapse />,
  },
  {
    name: "Dropdowns",
    path: "/ui/dropdowns",
    element: <Dropdowns />,
  },
  {
    name: "List Group",
    path: "/ui/list-group",
    element: <ListGroup />,
  },
  {
    name: "Modals",
    path: "/ui/modals",
    element: <Modals />,
  },
  {
    name: "Tabs",
    path: "/ui/tabs",
    element: <Tabs />,
  },
  {
    name: "Offcanvas",
    path: "/ui/offcanvas",
    element: <Offcanvas />,
  },
  {
    name: "Pagination",
    path: "/ui/pagination",
    element: <Pagination />,
  },
  {
    name: "Placeholders",
    path: "/ui/placeholders",
    element: <Placeholders />,
  },
  {
    name: "Popovers",
    path: "/ui/popovers",
    element: <Popovers />,
  },
  {
    name: "Progress",
    path: "/ui/progress",
    element: <Progress />,
  },
  {
    name: "Spinners",
    path: "/ui/spinners",
    element: <Spinners />,
  },
  {
    name: "Toasts",
    path: "/ui/toasts",
    element: <Toasts />,
  },
  {
    name: "Tooltips",
    path: "/ui/tooltips",
    element: <Tooltips />,
  },
];

const advancedUIRoutes: RoutesProps[] = [
  {
    name: "Ratings",
    path: "/advanced/ratings",
    element: <Ratings />,
  },
  {
    name: "Sweet Alert",
    path: "/advanced/alert",
    element: <SweetAlerts />,
  },
  {
    name: "Swiper Slider",
    path: "/advanced/swiper",
    element: <Swiper />,
  },
  {
    name: "Scrollbar",
    path: "/advanced/scrollbar",
    element: <Scrollbar />,
  },
  {
    name: "Toastify",
    path: "/advanced/toastify",
    element: <Toastify />,
  },
];

const chartsNMapsRoutes: RoutesProps[] = [
  {
    name: "Area",
    path: "/charts/area",
    element: <Area />,
  },
  {
    name: "Bar",
    path: "/charts/bar",
    element: <Bar />,
  },
  {
    name: "Bubble",
    path: "/charts/bubble",
    element: <Bubble />,
  },
  {
    name: "Candle Stick",
    path: "/charts/candlestick",
    element: <Candlestick />,
  },
  {
    name: "Column",
    path: "/charts/column",
    element: <Column />,
  },
  {
    name: "Heatmap",
    path: "/charts/heatmap",
    element: <Heatmap />,
  },
  {
    name: "Line",
    path: "/charts/line",
    element: <Line />,
  },
  {
    name: "Mixed",
    path: "/charts/mixed",
    element: <Mixed />,
  },
  {
    name: "Timeline",
    path: "/charts/timeline",
    element: <Timeline />,
  },
  {
    name: "Boxplot",
    path: "/charts/boxplot",
    element: <Boxplot />,
  },
  {
    name: "Treemap",
    path: "/charts/treemap",
    element: <Treemap />,
  },
  {
    name: "Pie",
    path: "/charts/pie",
    element: <Pie />,
  },
  {
    name: "Radar",
    path: "/charts/radar",
    element: <Radar />,
  },
  {
    name: "Radial Bar",
    path: "/charts/radial-bar",
    element: <RadialBar />,
  },
  {
    name: "Scatter",
    path: "/charts/scatter",
    element: <Scatter />,
  },
  {
    name: "Polar Area",
    path: "/charts/polar",
    element: <Polar />,
  },
  {
    name: "Google",
    path: "/maps/google",
    element: <GoogleMaps />,
  },
  {
    name: "Vector",
    path: "/maps/vector",
    element: <VectorMaps />,
  },
];

const formsRoutes: RoutesProps[] = [
  {
    name: "Basic Elements",
    path: "/forms/basic",
    element: <Basic />,
  },
  {
    name: "Checkbox & Radio",
    path: "/forms/checkbox",
    element: <Checkbox />,
  },
  {
    name: "Choice Select",
    path: "/forms/select",
    element: <Select />,
  },
  {
    name: "Clipboard",
    path: "/forms/clipboard",
    element: <Clipboard />,
  },
  {
    name: "Flat Picker",
    path: "/forms/flat-picker",
    element: <FlatPicker />,
  },
  {
    name: "Validation",
    path: "/forms/validation",
    element: <Validation />,
  },
  {
    name: "Wizard",
    path: "/forms/wizard",
    element: <Wizard />,
  },
  {
    name: "File Uploads",
    path: "/forms/file-uploads",
    element: <FileUploads />,
  },
  {
    name: "Editors",
    path: "/forms/editors",
    element: <Editors />,
  },
  {
    name: "Input Mask",
    path: "/forms/input-mask",
    element: <InputMask />,
  },
  {
    name: "Slider",
    path: "/forms/slider",
    element: <Slider />,
  },
];

const tableRoutes: RoutesProps[] = [
  {
    name: "Basic Tables",
    path: "/tables/basic",
    element: <BasicTable />,
  },
  {
    name: "Grid JS",
    path: "/tables/gridjs",
    element: <GridjsTable />,
  },
];

const iconRoutes: RoutesProps[] = [
  {
    name: "Boxicons",
    path: "/icons/boxicons",
    element: <BoxIcons />,
  },
  {
    name: "SolarIcon",
    path: "/icons/solaricon",
    element: <SolarIcons />,
  },
];

export const authRoutes: RoutesProps[] = [
  {
    name: "Sign In",
    path: "/auth/sign-in",
    element: <AuthSignIn2 />,
  },
  {
    name: "Sign Up",
    path: "/auth/sign-up",
    element: <AuthSignUp2 />,
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
  },
  {
    name: "Coming Soon",
    path: "/coming-soon",
    element: <ComingSoon />,
  },
];

export const appRoutes = [
  ...initialRoutes,
  ...generalRoutes,
  ...appsRoutes,
  ...customRoutes,
  ...baseUIRoutes,
  ...advancedUIRoutes,
  ...chartsNMapsRoutes,
  ...formsRoutes,
  ...tableRoutes,
  ...iconRoutes,
  ...authRoutes,
];
