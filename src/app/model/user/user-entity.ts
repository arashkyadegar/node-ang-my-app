export interface IUser {
    _id:string;
    name:string 
}
export class UserEntity implements IUser {
    _id: string="0";
    name:string="" ;


    public get getId():string{
        return this._id;
    }
    public set setId(value:string) {
        this._id=value;
    }

    public get getName():string{
        return this.name;
    }
    public set setName(value:string) {
        this.name=value;
    }
}

