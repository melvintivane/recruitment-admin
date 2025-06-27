import type { MenuItemType } from "@/types/menu";

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: "menu",
    label: "MENU",
    isTitle: true,
  },
  {
    key: "dashboard",
    icon: "solar:home-2-broken",
    label: "Dashboard",
    // badge: {
    //   text: "9+",
    //   variant: "success",
    // },
    url: "/dashboard/analytics",
  },
  {
    key: "apps",
    label: "APPS",
    isTitle: true,
  },
  {
    key: "apps-email",
    icon: "solar:letter-broken",
    label: "Email",
    url: "/apps/email",
  },
  {
    key: "pages",
    label: "PAGES",
    isTitle: true,
  },
  {
    key: "page-vacancies",
    label: "Vacancies",
    icon: "solar:case-broken",
    url: "/vacancies",
  },
  {
    key: "page-applications",
    label: "Applications",
    icon: "solar:document-broken",
    url: "/applications",
  },
  {
    key: "page-candidates",
    label: "Candidates",
    icon: "solar:user-id-broken",
    url: "/candidates",
  },
  {
    key: "page-employers",
    label: "Companies",
    icon: "solar:users-group-two-rounded-broken",
    url: "/companies",
  },
  {
    key: "page-categories",
    label: "Categories",
    icon: "solar:layers-broken",
    url: "/categories",
  },
  {
    key: "page-blogs",
    label: "Blogs",
    isTitle: false,
    icon: "solar:bill-list-broken",
    children: [
      {
        key: "blog-list",
        label: "Blog List",
        url: "/blogs",
        parentKey: "page-blogs"
      },
      {
        key: "blog-create",
        label: "Create Blog",
        url: "/blogs/create",
        parentKey: "page-blogs"
      },
      {
        key: "blog-categories",
        label: "Blog Categories",
        url: "/blogs/categories",
        parentKey: "page-blogs"
      },
      {
        key: "blog-tags",
        label: "Blog Tags",
        url: "/blogs/tags",
        parentKey: "page-blogs"
      },
      {
        key: "blog-commentary",
        label: "Blog Commentary",
        url: "/blogs/commentaries",
        parentKey: "page-blogs"
      },
    ],
  },
  {
    key: "page-user",
    label: "User Management",
    isTitle: false,
    icon: "solar:user-id-broken",
    children: [
      {
        key: "user-list",
        label: "User List",
        url: "/users",
        parentKey: "page-user",
      },
      {
        key: "user-create",
        label: "Create User",
        url: "/users/create",
        parentKey: "page-user",
      },
      {
        key: "user-roles",
        label: "Roles & Permissions",
        url: "/users/roles",
        parentKey: "page-user",
      },
      {
        key: "user-profile",
        label: "Profile",
        url: "/users/profile",
        parentKey: "page-user",
      },
    ],
  },
  {
    key: "custom",
    label: "Custom",
    isTitle: true,
  },
  {
    key: "page-authentication",
    label: "Authentication",
    isTitle: false,
    icon: "solar:lock-password-unlocked-broken",
    children: [
      {
        key: "sign-in",
        label: "Sign In",
        url: "/auth/sign-in",
        parentKey: "page-authentication",
      },
      {
        key: "reset-pass",
        label: "Reset Password",
        url: "/auth/reset-pass",
        parentKey: "page-authentication",
      },
      {
        key: "lock-screen",
        label: "Lock Screen",
        url: "/auth/lock-screen",
        parentKey: "page-authentication",
      },
    ],
  },
];
