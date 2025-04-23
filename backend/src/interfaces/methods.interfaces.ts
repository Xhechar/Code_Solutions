import { Chat, PrismaClient, Problem, PSG, Recovery, Solution } from "@prisma/client";
import { Category, Comment, Favourite, LoginDetails, ProjectStructure, RecoveryDetails, Stack, User } from "./solutions.interfaces";

export interface UserInterface {
  prisma: PrismaClient;
  createUser(user: User): Promise<{ success: boolean; message?: string; error?: string }>;
  updateUser(UserId: string, user: Partial<User>): Promise<{ success: boolean; message?: string; error?: string }>;
  softDeleteUser(UserId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  deleteUser(UserId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  restoreUser(UserId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  getSingleUser(UserId: string): Promise<{ success: boolean; message?: string; error?: string; user?: User | unknown }>;
  getAllUsers(): Promise<{ success: boolean; message?: string; error?: string; users?: User[] | unknown[]}>;
  getSoftDeletedUsers(): Promise<{ success: boolean; message?: string; error?: string; users?: User[] | unknown[]}>;
  updateUserRole(UserId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  bulkDeleteUsers(UserIds: string[]): Promise<{ success: boolean; message?: string; error?: string }>;
}

export interface StackInterface {
  prisma: PrismaClient;
  createStack(stack: Stack): Promise<{ success: boolean; message?: string; error?: string }>;
  updateStack(StackId: string, stack: Partial<Stack>): Promise<{ success: boolean; message?: string; error?: string }>;
  deleteStack(StackId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  getAllStacks(): Promise<{ success: boolean; message?: string; error?: string; stacks?: Stack[] }>;
  getSingleStack(StackId: string): Promise<{ success: boolean; message?: string; error?: string; stack?: Stack }>;
}

export interface CategoryInterface {
  prisma: PrismaClient;
  createCategory(category: Category): Promise<{ success: boolean; message?: string; error?: string }>;
  updateCategory(CategoryId: string, category: Partial<Category>): Promise<{ success: boolean; message?: string; error?: string }>;
  deleteCategory(CategoryId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  getAllCategories(): Promise<{ success: boolean; message?: string; error?: string; categories?: Category[] }>;
  getSingleCategory(CategoryId: string): Promise<{ success: boolean; message?: string; error?: string; category?: Category }>;
}

export interface ProblemInterface {
  prisma: PrismaClient;
  createProblem(UserId : string, problem: Problem): Promise<{ success: boolean; message?: string; error?: string }>;
  updateProblem(UserId: string, ProblemId: string, problem: Partial<Problem>): Promise<{ success: boolean; message?: string; error?: string }>;
  deleteProblem(UserId: string, ProblemId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  approveProblem(UserId: string, ProblemId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  getAllProblems(): Promise<{ success: boolean; message?: string; error?: string; problems?: Problem[] }>;
  getApprovedProblems(): Promise<{ success: boolean; message?: string; error?: string; problems?: Problem[] }>;
  getAdminProblems(UserId: string): Promise<{ success: boolean; message?: string; error?: string; problems?: Problem[] }>;
  getSingleProblem(ProblemId: string): Promise<{ success: boolean; message?: string; error?: string; problem?: Problem }>;
  getUserProblems(UserId: string): Promise<{ success: boolean; message?: string; error?: string; problems?: Problem[] }>;
}

export interface SolutionInterface {
  prisma: PrismaClient;
  createSolution(UserId: string, ProblemId: string, solution: Solution): Promise<{ success: boolean; message?: string; error?: string }>;
  updateSolution(UserId: string, SolutionId: string, solution: Partial<Solution>): Promise<{ success: boolean; message?: string; error?: string }>;
  deleteSolution(UserId: string, SolutionId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  getAllSolutions(): Promise<{ success: boolean; message?: string; error?: string; solutions?: Solution[] }>;
  getSolutionsByProblem(ProblemId: string): Promise<{ success: boolean; message?: string; error?: string; solutions?: Solution[] }>;
}

export interface CommentInterface {
  prisma: PrismaClient;
  createComment(UserId: string, ProjectId: string, Content: string): Promise<{ success: boolean; message?: string; error?: string }>;
  updateComment(UserId: string, CommentId: string, content: string): Promise<{ success: boolean; message?: string; error?: string }>;
  deleteComment(CommentId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  getCommentsByProblem(ProblemId: string): Promise<{ success: boolean; message?: string; error?: string; comments?: Comment[] }>;
}

export interface FavouriteInterface {
  prisma: PrismaClient;

  addFavourite(UserId: string, ProblemId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  removeFavourite(FavouriteId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  getFavouritesByUser(UserId: string): Promise<{ success: boolean; message?: string; error?: string; favourites?: Favourite[] }>;
}

export interface HistoryInterface {
  prisma: PrismaClient;
  addHistory(UserId: string, ProblemId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  getHistoryByUser(UserId: string): Promise<{ success: boolean; message?: string; error?: string; histories?: History[] | unknown[] }>;
  clearHistory(UserId: string): Promise<{ success: boolean; message?: string; error?: string }>;
}

export interface ProjectStructureInterface {
  prisma: PrismaClient;
  createProjectStructure(project: ProjectStructure): Promise<{ success: boolean; message?: string; error?: string }>;
  updateProjectStructure(ProjectId: string, project: Partial<ProjectStructure>): Promise<{ success: boolean; message?: string; error?: string }>;
  deleteProjectStructure(ProjectId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  getAllProjectStructures(): Promise<{ success: boolean; message?: string; error?: string; projects?: ProjectStructure[] }>;
  getSingleProjectStructure(ProjectId: string): Promise<{ success: boolean; message?: string; error?: string; project?: ProjectStructure }>;
}

export interface PSGInterface {
  prisma: PrismaClient;
  createPSG(ProjectId: string, psg: PSG): Promise<{ success: boolean; message?: string; error?: string }>;
  updatePSG(PSGId: string, psg: Partial<PSG>): Promise<{ success: boolean; message?: string; error?: string }>;
  deletePSG(PSGId: string): Promise<{ success: boolean; message?: string; error?: string }>;
  getPSGsByProject(ProjectId: string): Promise<{ success: boolean; message?: string; error?: string; psgs?: PSG[] }>;
}

export interface AuthInterface {
  prisma: PrismaClient;
  loginUser(Logins: LoginDetails): Promise<{ success: boolean, error?: string, message?: string, role?: string, token?: string }>,
  changePassword(Details: RecoveryDetails) : Promise<{success: boolean, error?:string, message?: string}>,
  getAllRecoveries() : Promise<{success: boolean, error?:string, message?: string, recoveries?: Recovery[] | unknown[]}>,
  verifyMail(Email: string) : Promise<{success: boolean, error?:string, message?: string}>
}

export interface ChatServiceInterface {
  prisma: PrismaClient,
  createChat(UserId: string, Message: string): Promise<{success: boolean, error?: string, message?: string}>,
  updateChat(UserId: string, ChatId: string, Message: string): Promise<{success: boolean, error?: string, message?: string}>,
  deleteChat(ChatId: string): Promise<{success: boolean, error?: string, message?: string}>,
  toggleChatPinStatus(UserId: string, ChatId: string): Promise<{success: boolean, error?: string, message?: string}>,
  getSingleChat(ChatId: string): Promise<{success: boolean, error?: string, message?: string, chat?: Chat}>,
  getChats(): Promise<{success: boolean, error?: string, message?: string, chats?: Chat[]}>,
}
