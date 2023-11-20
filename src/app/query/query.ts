import { User } from "../user/user";

export class Query {
    id?: number;
    content: string;
    state: boolean;
    user: User | null;
    showDetails?: boolean;
   
    constructor(
      content: string,
      state: boolean,
      user: User | null
    ) {
      this.content = content;
      this.state = state;
      this.user = user;
    }
   }