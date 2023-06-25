import { CommentEntity, IComment } from "../comment/comment-entity";
import { DocumentEntity, IDocument } from "../document/document-entity";
import { UserEntity } from "../user/user-entity";

export interface IPost {
    _id:number;
    author:UserEntity;
    title:string; //
    body:string; //
    rate:number;
    img:string;
    date:Date;
    tags:string[];
    links:string[];
    isVisible:boolean; //
    documents:Array<DocumentEntity>;
    comments:Array<CommentEntity>;
    /*user:number;*/
}

export class PostEntity implements IPost {
    _id: number;
    author!: UserEntity;
    title: string;
    body: string;
    rate: number=0;
    img: string="";
    date:Date;
    isVisible: boolean=false;
    tags:  string[];
    links: string[];

    comments:Array<CommentEntity>=[];
    documents: any;

   /*  user: number=0;*/
constructor(ti:string,body:string,r:number,img:string,date:Date,isVisible:boolean,author:UserEntity,tags:string[],links:string[]){
    this.body=body;
    this.title=ti;
    this.rate=r;
    this.img=img;
    this.date=date;
    this.isVisible=isVisible;
    this._id=1
    this.documents= [];
    this.author=author;
    this.tags = tags;
    this.links = links;
}
 



  
}

