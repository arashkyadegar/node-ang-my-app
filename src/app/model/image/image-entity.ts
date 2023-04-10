export interface IImage {
    _id:number;
    url:string,
    date:Date
}
export class ImageEntity implements IImage {
    _id:number;
    url: string;
    date: Date;
    constructor(_id:number,url: string,date: Date){
        this._id=_id;
        this.url=url;
        this.date=date;
    }
}
