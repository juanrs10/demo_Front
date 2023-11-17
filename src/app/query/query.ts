import { User } from "../user/user";

export class Query {
    content: string;
    state: boolean;
    user: User;
   
    constructor(
      content: string,
      state: boolean,
      user: User
    ) {
      this.content = content;
      this.state = state;
      this.user = user;
    }
   }