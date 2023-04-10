import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogCreateComponent } from './blog-create/blog-create.component';
import { BlogListComponent } from './blog-list/blog-list/blog-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FileUploadComponent } from './file-upload/file-upload.component';



const routes: Routes = [
  { path: 'blog', component: BlogCreateComponent },
  { path: 'blogs', component: BlogListComponent },
  { path: 'files', component: FileUploadComponent },
  /*{ path: 'post', component: PostComponent },
  { path: 'posts', component: PostListComponent },
  { path: 'blogs/edit/:id', component: BlogEditComponent },*/
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
