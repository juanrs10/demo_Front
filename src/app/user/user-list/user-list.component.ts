import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: Array<User> = [];

  constructor(private userService: UserService) { }

  getUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }
 
  ngOnInit() {
    this.getUsers();
  }

}
