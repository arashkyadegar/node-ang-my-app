import { IPost, PostEntity } from "../post/post-entity";

export interface IDocument {
    _id:number;
    title:string;
    url:string;
    category:number;

}
export class DocumentEntity implements IDocument {
    _id: number=0;
    title: string="";
    url: string="";
    category: number=0;


    public get getId():number{
        return this._id;
    }
    public set setId(value:number) {
        this._id=value;
    }

    public get getTitle():string{
        return this.title;
    }
    public set setTitle(value:string) {
        this.title=value;
    }
/*
    public get getUrl():string{
        return this.url;
    }
    public set setUrl(value) {
        this.url=value;
    }

    public get getCategory():number{
        return this.category;
    }
    public set setCategory(value) {
        this.category=value;
    }*/
}

