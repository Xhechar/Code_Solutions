import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CreateProblemComponent } from './components/create-problem/create-problem.component';
import { CreateSolutionComponent } from './components/create-solution/create-solution.component';
import { VerifyMailComponent } from './components/verify-mail/verify-mail.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AdminComponent } from './components/admin/admin.component';
import { CommentsComponent } from './components/admin/comments/comments.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProblemsComponent } from './components/admin/problems/problems.component';
import { ProjectStructureComponent } from './components/admin/project-structure/project-structure.component';
import { TechToolsComponent } from './components/admin/tech-tools/tech-tools.component';
import { UsersComponent } from './components/admin/users/users.component';
import { AllUsersComponent } from './components/admin/users/all-users/all-users.component';
import { CategoriesComponent } from './components/admin/tech-tools/categories/categories.component';
import { StacksComponent } from './components/admin/tech-tools/stacks/stacks.component';
import { PreviewwComponent } from './components/admin/project-structure/previeww/previeww.component';
import { AdminProblemsComponent } from './components/admin/problems/admin-problems/admin-problems.component';
import { UserComponent } from './components/user/user.component';
import { ContributionsComponent } from './components/user/contributions/contributions.component';
import { MyProblemsComponent } from './components/user/contributions/my-problems/my-problems.component';
import { MySolutionsComponent } from './components/user/contributions/my-solutions/my-solutions.component';
import { FavouritesComponent } from './components/user/favourites/favourites.component';
import { HistoryComponent } from './components/user/history/history.component';
import { HomeComponent } from './components/user/home/home.component';
import { AllProjectStructuresComponent } from './components/admin/project-structure/all-project-structures/all-project-structures.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { LogoutComponent } from './components/logout/logout.component';
import { SingleProblemComponent } from './components/single-problem/single-problem.component';
import { SingleProjectStructureComponent } from './components/single-project-structure/single-project-structure.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', pathMatch: 'full', redirectTo: '' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-solution', component: CreateSolutionComponent },
  { path: 'verify-mail', component: VerifyMailComponent },
  { path: 'change-password/:Email', component: ChangePasswordComponent },
  { path: 'single-problem/:ProblemId', component: SingleProblemComponent },
  {
    path: 'single-project-structure/:ProjectId',
    component: SingleProjectStructureComponent,
  },
  { path: 'notification', component: NotificationsComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'comments', component: CommentsComponent },
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'create-problem', component: CreateProblemComponent },
      { path: 'create-solution', component: CreateSolutionComponent },
      {
        path: 'problems',
        component: ProblemsComponent,
        children: [
          { path: '', component: AdminProblemsComponent },
          { path: 'admin-problems', component: AdminProblemsComponent },
          {
            path: 'single-problem/:ProblemId',
            component: SingleProblemComponent,
          },
        ],
      },
      {
        path: 'project-structure',
        component: ProjectStructureComponent,
        children: [
          { path: '', component: AllProjectStructuresComponent },
          {
            path: 'all-project-structures',
            component: AllProjectStructuresComponent,
          },
          { path: 'preview', component: PreviewwComponent },
        ],
      },
      {
        path: 'tech-tools',
        component: TechToolsComponent,
        children: [
          { path: '', component: CategoriesComponent },
          { path: 'categories', component: CategoriesComponent },
          { path: 'stacks', component: StacksComponent },
        ],
      },
      {
        path: 'users',
        component: UsersComponent,
        children: [
          { path: '', component: AllUsersComponent },
          { path: 'all-users', component: AllUsersComponent },
        ],
      },
      { path: 'profile', component: ProfileComponent },
    ],
  },
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'single-problem/:ProblemId', component: SingleProblemComponent },
      { path: 'create-problem', component: CreateProblemComponent },
      { path: 'create-problem', component: CreateSolutionComponent },
      {
        path: 'contributions',
        component: ContributionsComponent,
        children: [
          { path: '', component: MyProblemsComponent },
          { path: 'my-problems', component: MyProblemsComponent },
          { path: 'my-solutions', component: MySolutionsComponent },
        ],
      },
      { path: 'favourites', component: FavouritesComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'my-profile', component: ProfileComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
