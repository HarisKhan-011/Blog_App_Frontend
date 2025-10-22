import { Routes } from '@angular/router';
import { PostpageComponent } from './postpage/postpage.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './auth/auth.guard';
import { PostListComponent } from './post/post-list/post-list.component';
import { PostDetailComponent } from './post/post-detail/post-detail.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';
import { PendingPostsComponent } from './moderation/pending-posts/pending-posts.component';
import { ReportedPostsComponent } from './moderation/reported-posts/reported-posts.component';
import { UsersComponent } from './admin/users/users.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
export const routes: Routes = [
  
  { path: "", component:PostListComponent },
  // { path: "post", component:PostListComponent },

  { path: "postpage", component: PostpageComponent,canActivate:[authGuard] },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "post/:id", component: PostDetailComponent },
  { path: 'suggestions', component: SuggestionsComponent },
  {   path: 'moderation/pending-posts',component: PendingPostsComponent},
  {  path: 'moderation/reported-posts',    component: ReportedPostsComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
   { path: 'admin/users', component: UsersComponent },
   {path:'admindashboard',component:AdminDashboardComponent},
 { path: "**", redirectTo: "" }
];
