export enum Badge {
  Expert = 'Expert',
  Intermediate = 'Intermediate',
  Admin = 'Admin', 
  Beginner = 'Beginner'
}

export interface User {
  UserId: string;
  FullName: string;
  Username: string;
  Email: string;
  Password: string;
  ProfileImage: string;
  IsDeleted: boolean;
  Notified: boolean;
  IsWelcomed: boolean;
  DateCreated: Date;
  Badge: Badge;
  PreviousBadge: Badge;
  ProblemsCount: number;
  Role: string;
  IsSolver: boolean;
  Comments?: Comment[];
  Favourites?: Favourite[];
  Histories?: History[];
  Problems?: Problem[];
  Solutions?: Solution[];
}

export interface Stack {
  StackId: string;
  Name: string;
  Description: string;
  Version: string;
  Problems?: Problem[];
  ProjectStructures?: ProjectStructure[];
}

export interface Category {
  CategoryId: string;
  Name: string;
  Description: string;
  Problems?: Problem[];
}

export interface Problem {
  ProblemId: string;
  Title: string;
  Description: string;
  ErrorCode?: string;
  Context?: string;
  Environment?: string;
  Tags?: string;
  Reproducibility: boolean;
  Logs?: string;
  PriorityLevel?: number;
  ImagePath?: string;
  DateCreated: Date;
  StackId: string;
  Stack?: Stack;
  CategoryId: string;
  IsApproved: boolean;
  Category?: Category;
  Solutions?: Solution[];
  Comments?: Comment[];
  Favourites?: Favourite[];
  Histories?: History[];
  UserId: string;
  User?: User;
  ProjectStructure?: ProjectStructure[];
}

export interface Solution {
  SolutionId: string;
  Description: string;
  Steps: string;
  CodeSamples?: string;
  ImagePath?: string;
  VideoLink?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  ProblemId: string;
  Problem?: Problem;
  UserId: string;
  User?: User;
  editing: boolean;
  ProjectStructure?: ProjectStructure[];
}

export interface Comment {
  CommentId: string;
  Content: string;
  DatePosted: Date;
  UserId: string;
  User?: User;
  ProblemId: string;
  Problem?: Problem;
}

export interface Favourite {
  FavouriteId: string;
  UserId: string;
  User?: User;
  ProblemId: string;
  Problem?: Problem;
}

export interface History {
  HistoryId: string;
  UserId: string;
  User?: User;
  ProblemId: string;
  Problem?: Problem;
  AccessedAt: Date;
}

export interface ProjectStructure {
  ProjectId: string;
  Title: string;
  Description: string;
  StackId: string;
  Stack?: Stack;
  DateCreated: Date;
  LastUpdated: Date;
  PSG?: PSG[];
}

export interface PSG {
  RelatedProblemIds: any;
  PSGId: string;
  Title: string;
  ProjectId: string;
  PictorialGuide?: string;
  TextInstructions: string;
  Project?: ProjectStructure;
  RelatedProblems?: Problem[];
  RelatedSolutions?: Solution[];
}

export interface LoginDetails {
  Email: string;
  Password: string;
}

export interface RecoveryDetails {
  Email: string;
  RecoveryCode: string;
  NewPassword: string;
}

export interface MailConfigurations {
  service: string;
  host: string;
  port: number;
  requireTLS: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface MessageOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface TokenDetails {
  DateCreated: Date;
  UserId: string;
  Email: string;
  Role: string;
}

//other landing page interfaces

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Testimonial {
  name: string;
  role: string;
  message: string;
  image: string;
}