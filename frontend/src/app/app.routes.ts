import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SingleProblemComponent } from './components/single-problem/single-problem.component';
import { CreateProblemComponent } from './components/create-problem/create-problem.component';
import { CreateSolutionComponent } from './components/create-solution/create-solution.component';
import { VerifyMailComponent } from './components/verify-mail/verify-mail.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AdminComponent } from './components/admin/admin.component';
import { CommentsComponent } from './components/admin/comments/comments.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProblemsComponent } from './components/admin/problems/problems.component';
import { ProjectStructureComponent } from './components/admin/project-structure/project-structure.component';
import { SolutionsComponent } from './components/admin/solutions/solutions.component';
import { TechToolsComponent } from './components/admin/tech-tools/tech-tools.component';
import { UsersComponent } from './components/admin/users/users.component';
import { AllUsersComponent } from './components/admin/users/all-users/all-users.component';
import { DeletedUsersComponent } from './components/admin/users/deleted-users/deleted-users.component';
import { CategoriesComponent } from './components/admin/techTools/categories/categories.component';
import { StacksComponent } from './components/admin/techTools/stacks/stacks.component';
import { AllProblemsComponent } from './components/admin/problems/all-problems/all-problems.component';
import { PreviewwComponent } from './components/admin/projectStructure/previeww/previeww.component';
import { StructureguidesComponent } from './components/admin/projectStructure/structureguides/structureguides.component';
import { AdminProblemsComponent } from './components/admin/problems/admin-problems/admin-problems.component';
import { ApprovedProblemsComponent } from './components/admin/problems/approved-problems/approved-problems.component';
import { PendingProblemsComponent } from './components/admin/problems/pending-problems/pending-problems.component';
import { UserProblemsComponent } from './components/admin/problems/user-problems/user-problems.component';
import { UserComponent } from './components/user/user.component';
import { ContributionsComponent } from './components/user/contributions/contributions.component';
import { MyProblemsComponent } from './components/user/contributions/my-problems/my-problems.component';
import { MySolutionsComponent } from './components/user/contributions/my-solutions/my-solutions.component';
import { FavouritesComponent } from './components/user/favourites/favourites.component';
import { HistoryComponent } from './components/user/history/history.component';
import { HomeComponent } from './components/user/home/home.component';
import { MyProfileComponent } from './components/user/my-profile/my-profile.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', pathMatch: 'full', redirectTo: '' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'single-problem', component: SingleProblemComponent },
  { path: 'create-problem', component: CreateProblemComponent },
  { path: 'create-solution', component: CreateSolutionComponent },
  { path: 'verify-mail', component: VerifyMailComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  {
    path: 'admin', component: AdminComponent, children: [
      { path: 'comments', component: CommentsComponent },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'problems', component: ProblemsComponent, children: [
          {path: 'admin-problems', component: AdminProblemsComponent},
          { path: 'all-problems', component: AllProblemsComponent },
          { path: 'approved-problems', component: ApprovedProblemsComponent },
          { path: 'pending-problems', component: PendingProblemsComponent },
          { path: 'users-problems', component: UserProblemsComponent }
      ]},
      {
        path: 'project-structure', component: ProjectStructureComponent, children: [
          { path: 'all-project-structures', component: AllProblemsComponent },
          { path: 'preview', component: PreviewwComponent },
          { path: 'structure-guides', component: StructureguidesComponent }
      ]},
      { path: 'solutions', component: SolutionsComponent },
      {
        path: 'tech-tools', component: TechToolsComponent, children: [
          { path: 'categories', component: CategoriesComponent },
          { path: 'stacks', component: StacksComponent }
      ]},
      {
        path: 'users', component: UsersComponent, children: [
          { path: 'all-users', component: AllUsersComponent },
          {path: 'deleted-users', component: DeletedUsersComponent}
      ]}
    ]
  },
  {
    path: 'user', component: UserComponent, children: [
      {
        path: 'contributions', component: ContributionsComponent, children: [
          { path: 'my-problems', component: MyProblemsComponent },
          {path: 'my-solutions', component: MySolutionsComponent}
        ]
      },
      { path: 'favourites', component: FavouritesComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'home', component: HomeComponent },
      {path: 'my-profile', component: MyProfileComponent}
    ]
  },
  { path: '**', component: NotFoundComponent }
];
