export class StoreUser {
  constructor(
    public id: string,
    public uid: string,
    public email: string,
    public password: string,
    public name: string,
    public role: string,
    public createdAt: Date,
    ){}
}
