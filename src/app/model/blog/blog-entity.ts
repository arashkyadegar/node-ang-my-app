import { CommentEntity, IComment } from '../comment/comment-entity';
import { IPost, PostEntity } from '../post/post-entity';
import { IUser, UserEntity } from '../user/user-entity';
export interface IBlog {
    _id:number;
    title:string;
    author:IUser;
     body:string;
     rate:number;
     date:Date;
     posts:Array<IPost>;
     comments:Array<IComment>;
}

export class BlogEntity implements IBlog {    
    _id:number;
    title:string;
     date:Date;
     author: IUser;
     body: string;
     rate: number;
     posts: IPost[];
     comments: IComment[];
    constructor(i:number,ti:string,au:UserEntity,body:string,
        d:Date,ra:number,posts:Array<PostEntity>,comments:Array<CommentEntity>){
        this._id=i;
        this.title=ti;
         this.body=body;
         this.date=d;
         this.author=au;
         this.rate=ra;
         this.posts=posts;
         this.comments=comments;
    }

}
