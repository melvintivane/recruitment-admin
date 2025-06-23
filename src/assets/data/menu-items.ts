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
    key: "apps-invoices",
    icon: "solar:bill-list-broken",
    label: "Blogs",
    url: "/blogs",
  },
  {
    key: "page-vacancies",
    label: "Vacancies",
    icon: "solar:case-broken",
    url: "/vacancies",
  },
  {
    key: "page-employers",
    label: "Employeres",
    icon: "solar:users-group-two-rounded-broken",
    url: "/companies",
  },
  {
    key: "page-candidates",
    label: "Candidates",
    icon: "solar:user-circle-bold",
    url: "/candidates",
  },
  {
    key: "page-categories",
    label: "Categories",
    icon: "solar:layers-broken",
    url: "/categories",
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
        url: "/users/list",
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
