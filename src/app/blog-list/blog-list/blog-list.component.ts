import { Component } from '@angular/core';
import { BlogService } from 'src/app/service/blog-service.service';
import { BlogEntity } from 'src/app/model/blog/blog-entity';
import { tap, Observable, of, Subscription } from 'rxjs';
@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ["../../../../dist/output.css"]
})
export class BlogListComponent {
  blogList:Array<BlogEntity>=[];


  constructor(private blogService:BlogService){

  }

  ngOnInit() {
          const blogs$=this.blogService.find();    
          blogs$.subscribe(value => {
            this.blogList=<Array<BlogEntity>> value;
          });
  }

  onDelete(id:string):void{
    console.log("on Delete blogId = " + id)
  }
  
  onEdit(blogId:number):void{
    //console.log("on Edit blogId = " + blogId)
  }
}
