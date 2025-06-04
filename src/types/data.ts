/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BootstrapVariantType } from "./component-props";
import type { NumberRange } from "./utils";

export type IdType = string;

export type ReviewType = {
  count: number;
  stars: number;
};

export type AppType = {
  image: string;
  name: string;
  handle: string;
};

export type NotificationType = {
  from: string;
  content: string;
  icon?: string;
};

export type FileType = Partial<File> & {
  preview?: string;
};

export type ActivityType = {
  title: string;
  icon?: string;
  variant?: BootstrapVariantType;
  status?: "completed" | "latest";
  files?: FileType[];
  time: Date;
  type?: "task" | "design" | "achievement";
  content?: string;
};

export type SaleType =
  | {
      type: "percent";
      discount: NumberRange<0, 100>;
    }
  | {
      type: "amount";
      discount: number;
    };

export type CategoryType = {
  id: IdType;
  name: string;
};

export type CustomerType = {
  id: IdType;
  image: string;
  name: string;
  createdAt: Date;
  email: string;
  phone: string;
  address: string;
  ordersCount: number;
};

export type SellerType = {
  id: IdType;
  name: string;
  image: string;
  storeName: string;
  review: ReviewType;
  productsCount: number;
  walletBalance: number;
  createdAt: Date;
  revenue: number;
};

export type OrderType = {
  id: IdType;
  createdAt: Date;
  productId: EcommerceProductType["id"];
  product?: EcommerceProductType;
  customerId: CustomerType["id"];
  customer?: CustomerType;
  paymentMethod: "Credit Card" | "Pay Pal" | "Google Pay";
  status: "Delivered" | "Processing" | "Cancelled";
};

export type InventoryType = {
  id: IdType;
  productId: EcommerceProductType["id"];
  product?: EcommerceProductType;
  condition: "New" | "Returned" | "Damaged";
  location: string;
  quantity: number;
  reserved: number;
  onHand: number;
  lastModifiedAt: Date;
};

export type EcommerceProductType = {
  id: IdType;
  categoryId: CategoryType["id"];
  category?: CategoryType;
  sellerId: SellerType["id"];
  seller?: SellerType;
  name: string;
  description: string;
  sale?: SaleType;
  price: number;
  review: ReviewType;
  quantity: number;
};

export type InvoiceType = {
  id: IdType;
  customerId: CustomerType["id"];
  customer?: CustomerType;
  orderId: OrderType["id"];
  order?: OrderType;
  productId: EcommerceProductType["id"];
  product?: EcommerceProductType;
};

export type PricingType = {
  id: IdType;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  subscribed?: boolean;
};

export type TimelineType = {
  [key: string]: {
    title: string;
    description: string;
    important?: boolean;
  }[];
};

export type CommentType = {
  id: IdType;
  postId: SocialPostType["id"];
  socialUserId: SocialUserType["id"];
  socialUser?: SocialUserType;
  replyTo?: CommentType["id"];
  comment: string;
  likesCount: number;
  children?: CommentType[];
};

export type SocialPostType = {
  id: IdType;
  socialUserId: SocialUserType["id"];
  socialUser?: SocialUserType;
  caption?: string;
  createdAt: Date;
  likesCount: number;
  commentsCount?: number;
  liked?: boolean;
  tags?: `#${string}`[];
  saved?: boolean;
  embedLink?: string;
  comments?: CommentType[];
  photos?: string[];
};

export type SocialUserType = {
  id: IdType;
  avatar: string;
  name: string;
  activityStatus: "typing" | "online" | "offline";
  email: string;
  phone: string;
  languages: string[];
  location: string;
  mutualCount: number;
  hasRequested?: boolean;
  message?: string;
  time: Date;
  status?: string;
};

export type GroupType = {
  id: IdType;
  image: string;
  name: string;
  description: string;
  membersCount: number;
  joined?: boolean;
  friends?: boolean;
  suggested?: boolean;
};

export type SocialEventType = {
  id: IdType;
  title: string;
  venue: string;
  type: "togetherness" | "celebration" | "professional";
  image: string;
  startsAt: Date;
};

export type ProjectType = {
  id: IdType;
  projectName: string;
  client: string;
  teamMembers: string[];
  deadlineDate: Date;
  progressValue: number;
  variant: string;
};

export type TransactionType = {
  id: IdType;
  date: Date;
  customerId: CustomerType["id"];
  customer?: CustomerType;
  amount: number;
  description: string;
  status: "Cr." | "Dr.";
};

export type TodoType = {
  id: IdType;
  task: string;
  createdAt: Date;
  dueDate: Date;
  status: "Pending" | "In-Progress" | "Completed";
  priority: "High" | "Medium" | "Low";
  employeeId: SellerType["id"];
  employee?: SellerType;
};

export type EmailLabelType =
  | "Primary"
  | "Social"
  | "Promotions"
  | "Updates"
  | "Forums";

export type EmailFilterType = keyof EmailCountType;

export type EmailType = {
  id: IdType;
  fromId: SocialUserType["id"];
  from?: SocialUserType;
  toId: SocialUserType["id"];
  to?: SocialUserType;
  subject?: string;
  content?: string;
  attachments?: FileType[];
  label?: EmailLabelType;
  starred?: boolean;
  important?: boolean;
  draft?: boolean;
  deleted?: boolean;
  read?: boolean;
  createdAt: Date;
};

export type Employee = {
  id: IdType;
  name: string;
  email: string;
  position: string;
  company: string;
  country: string;
};

export type TeamMemberType = {
  id: IdType;
  memberId: SocialUserType["id"];
  member?: SocialUserType;
  projects: number;
  duration: string;
  tasks: number;
  role: string;
};

export type ChatMessageType = {
  id: IdType;
  from: SocialUserType;
  to: SocialUserType;
  message: {
    type: "file" | "text";
    value: FileType[] | string;
  };
  sentOn?: Date;
};

export type EmailCountType = {
  inbox: number;
  starred: number;
  draft: number;
  sent: number;
  deleted: number;
  important: number;
};

export type PostType = {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  createdAt: string;
  status: "Draft" | "Published";
  views: number;
  content?: string;
  featuredImage?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  avatar: string;
  createdAt: Date;
  updatedAt?: Date;
  publishDate: Date;
  category: string;
  status: "Publicado" | "Rascunho" | "Draft";
  tags: string[];
  featuredImage: string;
  views: number;
  commentsCount: number;
  content: string;
  isFeatured?: boolean;
};

export type BlogCategory = {
  id: string;
  name: string;
  postCount: number;
  lastUpdate: Date;
};

export type Author = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  postCount: number;
  social: Record<string, string>;
};

export type BlogComment = {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: Date;
  approved: boolean;
};

export type BlogTag = {
  id: string;
  name: string;
  postCount: number;
};

export type FeaturedPost = {
  id: string;
  title: string;
  excerpt: string;
  featureDate: Date;
  category: string;
  views: number;
  featuredImage: string;
};

export interface VacancyType {
  id: string;
  title: string;
  location: string; // Mapped from city.name + state.name
  type: string; // Mapped from jobType (converted to more readable format)
  postedDate: string | Date; // Mapped from createdAt
  status: "Open" | "Closed" | "Draft"; // Default to "Open" since not in JSON
  applicationCount: number; // Not in JSON, default to 0
  salaryRange?: string; // Combined from minSalary and maxSalary
  description?: string; // Could use company description or leave empty
  yearsOfExperience: number;
  degreeRequired: string;
  careerLevel: string;
  remoteAllowed: boolean;
  applicationDeadline: string | Date;
  company: {
    name: string;
    picture?: string;
    industry: string;
    website?: string;
  };
  requiredSkills: {
    name: string;
    category: string;
  }[];
}

// Example of how to transform the API data to VacancyType
export function transformApiDataToVacancy(apiData: any): VacancyType {
  return {
    id: apiData.id,
    title: apiData.jobTitle,
    location: `${apiData.city.name}, ${apiData.city.state.name}`,
    type: apiData.jobType === "FULL_TIME" ? "Full-time" : "Other",
    postedDate: apiData.createdAt,
    status: "Open",
    applicationCount: 0,
    salaryRange: `${apiData.minSalary} - ${apiData.maxSalary}`,
    yearsOfExperience: apiData.yearsOfExperience,
    degreeRequired: apiData.degreeRequired,
    careerLevel: apiData.careerLevel,
    remoteAllowed: apiData.remoteAllowed,
    applicationDeadline: apiData.applicationDeadline,
    company: {
      name: apiData.company.name,
      picture: apiData.company.picture,
      industry: apiData.company.industry,
      website: apiData.company.website,
    },
    requiredSkills: apiData.requiredSkills.map((skill: any) => ({
      name: skill.name,
      category: skill.jobCategory.name,
    })),
  };
}

export interface PageableType {
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

