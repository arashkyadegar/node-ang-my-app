import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlogCreateComponent } from './blog-create/blog-create.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BlogListComponent } from './blog-list/blog-list/blog-list.component';

import { FileUploadComponent } from './file-upload/file-upload.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { SocketIoComponent } from './socket-io/socket-io.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
// const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    BlogCreateComponent,
    PageNotFoundComponent,
    BlogListComponent,
    FileUploadComponent,
    PostListComponent,
    PostEditComponent,
    LoginComponent,
    HomeComponent,
    PostCreateComponent,
    SocketIoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
