/* eslint-disable @typescript-eslint/no-explicit-any */
import { currency } from "@/context/constants";
import type { JobSourceType, JobType, StatType } from "./types";


export const topJobs = [
  {
    id: 'VAC-1001',
    title: 'Senior Frontend Developer',
    views: 4265,
    applications: 86,
    hireRate: 8.4,
    status: 'OPEN',
    location: 'Remote'
  },
  {
    id: 'VAC-1002',
    title: 'Backend Engineer (Node.js)',
    views: 2584,
    applications: 42,
    hireRate: 6.25,
    status: 'OPEN',
    location: 'New York, NY'
  },
  {
    id: 'VAC-1003',
    title: 'UX/UI Designer',
    views: 3369,
    applications: 58,
    hireRate: 5.2,
    status: 'OPEN',
    location: 'San Francisco, CA'
  },
  {
    id: 'VAC-1004',
    title: 'Data Scientist',
    views: 985,
    applications: 19,
    hireRate: 4.2,
    status: 'CLOSED',
    location: 'Boston, MA'
  },
  {
    id: 'VAC-1005',
    title: 'Product Manager',
    views: 653,
    applications: 12,
    hireRate: 2.4,
    status: 'OPEN',
    location: 'Chicago, IL'
  }
]

export const applicantLocations = [
  {
    icon: 'circle-flags:us',
    name: 'United States',
    percentage: 42.5,
    applicants: 125,
    variant: 'primary',
  },
  {
    icon: 'circle-flags:gb',
    name: 'United Kingdom',
    percentage: 18.3,
    applicants: 54,
    variant: 'info',
  },
  {
    icon: 'circle-flags:in',
    name: 'India',
    percentage: 15.2,
    applicants: 45,
    variant: 'warning',
  },
  {
    icon: 'circle-flags:de',
    name: 'Germany',
    percentage: 12.7,
    applicants: 38,
    variant: 'danger',
  },
  {
    icon: 'circle-flags:au',
    name: 'Australia',
    percentage: 11.3,
    applicants: 33,
    variant: 'success',
  },
]

export const jobSources: JobSourceType[] = [
  {
    icon: "simple-icons:linkedin",
    name: "LinkedIn",
    percentage: 42.5,
    applicants: 125,
    variant: "primary",
  },
  {
    icon: "simple-icons:indeed",
    name: "Indeed",
    percentage: 28.3,
    applicants: 83,
    variant: "info",
  },
  {
    icon: "simple-icons:glassdoor",
    name: "Glassdoor",
    percentage: 15.8,
    applicants: 46,
    variant: "warning",
  },
  {
    icon: "mdi:company",
    name: "Company Website",
    percentage: 13.4,
    applicants: 39,
    variant: "success",
  },
];

export const applicants: any[] = [
  {
    name: "Software Engineer",
    percentage: 32.5,
    count: 86,
  },
  {
    name: "Product Manager",
    percentage: 22.1,
    count: 58,
  },
  {
    name: "UX Designer",
    percentage: 18.6,
    count: 49,
  },
  {
    name: "Data Analyst",
    percentage: 12.4,
    count: 33,
  },
  {
    name: "Marketing Specialist",
    percentage: 8.3,
    count: 22,
  },
  {
    name: "HR Coordinator",
    percentage: 3.8,
    count: 10,
  },
  {
    name: "Other",
    percentage: 2.3,
    count: 6,
  },
];

export const jobsList: JobType[] = [
  {
    title: "Senior Frontend Developer",
    views: 4265,
    applications: 86,
    hireRate: 8.4,
    variant: "success",
  },
  {
    title: "Backend Engineer",
    views: 2584,
    applications: 42,
    hireRate: 6.25,
    variant: "warning",
  },
  {
    title: "UX/UI Designer",
    views: 3369,
    applications: 58,
    hireRate: 5.2,
    variant: "success",
  },
  {
    title: "Data Scientist",
    views: 985,
    applications: 19,
    hireRate: 4.2,
    variant: "danger",
  },
  {
    title: "Product Owner",
    views: 653,
    applications: 12,
    hireRate: 2.4,
    variant: "success",
  },
];

export const statData: StatType[] = [
  {
    title: "Active Jobs",
    icon: "solar:case-minimalistic-bold-duotone",
    stat: "24",
    change: "5.3%",
    variant: "success",
  },
  {
    title: "New Applicants",
    icon: "solar:user-plus-bold-duotone",
    stat: "186",
    change: "12.1%",
    variant: "success",
  },
  {
    title: "Interviews Scheduled",
    icon: "solar:calendar-mark-bold-duotone",
    stat: "42",
    change: "3.3%",
    variant: "danger",
  },
  {
    title: "Hiring Budget",
    icon: "solar:wallet-money-bold-duotone",
    stat: `${currency}256.8k`,
    change: "18.6%",
    variant: "success",
  },
];

export const recruitmentStages: any[] = [
  {
    name: "Application Review",
    percentage: "42.5%",
    count: 125,
  },
  {
    name: "Phone Screening",
    percentage: "28.3%",
    count: 83,
  },
  {
    name: "Technical Interview",
    percentage: "15.8%",
    count: 46,
  },
  {
    name: "Final Interview",
    percentage: "9.4%",
    count: 28,
  },
  {
    name: "Offer Extended",
    percentage: "4.0%",
    count: 12,
  },
];
