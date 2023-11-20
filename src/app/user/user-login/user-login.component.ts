import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { UserDataService } from '../userData.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  user: User = new User("","");
  errorMessage: string = "";

  constructor(private userService: UserService, private router: Router, private userDataService: UserDataService) { }

  onLogin(): void {
    this.userService.login(this.user).subscribe(
      response => {
        console.log("Login exitoso", response);
        this.userDataService.setCurrentUser(response);
        this.router.navigate(["/homepage"]);
      },
      error => {
        console.error("Error en el login", error);
        this.errorMessage = "Wrong email or password"; // Actualiza el mensaje de error
      }
    );
  }

  onSignup(): void {
    this.userService.postUser(this.user).subscribe(
      response => {
        console.log("Registro exitoso", response);
        this.userDataService.setCurrentUser(response);
        this.router.navigate(["/homepage"]);
      },
      error => {
        console.error("Error en el registro", error);
        this.errorMessage = "Email already in use"; // Actualiza el mensaje de error
      }
    );
  }
  ngOnInit() {
  }
}
