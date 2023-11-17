import { User } from "../user/user";
import { Query } from "@angular/core";

export class Comment {
    content: string;
    query: Query;
    user: User;
   
    constructor(
      content: string,
      query: Query,
      user: User
    ) {
      this.content = content;
      this.query = query;
      this.user = user;
    }
   }