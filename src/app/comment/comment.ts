import { User } from "../user/user";
import { Query } from "../query/query";
export class Comment {
    content: string;
    query: Query | null;
    user: User | null;
   
    constructor(
      content: string,
      query: Query | null,
      user: User | null
    ) {
      this.content = content;
      this.query = query;
      this.user = user;
    }
   }