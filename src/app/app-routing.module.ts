import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogCreateComponent } from './blog-create/blog-create.component';
import { BlogListComponent } from './blog-list/blog-list/blog-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PostCreateComponent } from './post-create/post-create.component';

const routes: Routes = [

  { path: 'blog', component: BlogCreateComponent },
  { path: 'blogs', component: BlogListComponent ,
  children: [
    {
      path: '?page=', // child route path
      component: BlogListComponent, // child route component that the router renders
    }
  ],},
  { path: 'files', component: FileUploadComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'posts', component: PostListComponent },
  { path: 'posts/create', component: PostCreateComponent },
  { path: 'posts/edit/:id', component: PostEditComponent },
  // { path: 'blogs/:bid/posts', component: PostListComponent },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
