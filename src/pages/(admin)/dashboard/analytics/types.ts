export interface JobSourceType {
  icon: string;
  name: string;
  percentage: number;
  applicants: number;
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

export interface JobType {
  title: string;
  views: number;
  applications: number;
  hireRate: number;
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  // Optional fields for more detailed job tracking
  department?: string;
  location?: string;
  jobType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  status?: 'OPEN' | 'CLOSED' | 'DRAFT';
}

export interface StatType {
  title: string;
  icon: string;
  stat: string | number;
  change: string;
  variant: 'success' | 'danger' | 'warning' | 'info';
  // Optional link for navigation
  link?: string;
}
