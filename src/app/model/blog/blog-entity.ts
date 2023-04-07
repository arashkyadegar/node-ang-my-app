import { IPost, PostEntity } from '../post/post-entity';
import { IUser, UserEntity } from '../user/user-entity';
export interface IBlog {
    _id:number;
    title:string;
    author:IUser;
    body:string;
    rate:number;
    posts:Array<IPost>;
}

export class BlogEntity implements IBlog {    
    _id:number;
    title:string;
    date:Date;
    author: IUser;
    body: string;
    rate: number;
    posts: IPost[];
    constructor(i:number,ti:string,body:string,d:Date,au:UserEntity,ra:number,posts:Array<PostEntity>){
        this._id=i;
        this.title=ti;
        this.body=body;
        this.date=d;
        this.author=au;
        this.rate=ra;
        this.posts=posts;
    }
}
