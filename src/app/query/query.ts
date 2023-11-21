import { User } from "../user/user";
import { Comment } from "../comment/comment";

export class Query {
    id?: number;
    content: string;
    state: boolean;
    user: User | null;
    showDetails?: boolean;
    comments?: Array<Comment>;
   
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