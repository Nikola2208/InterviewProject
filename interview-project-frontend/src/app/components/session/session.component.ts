import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserLogin } from 'src/app/classes/UserLogin';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent {
  username: string = '';
  password: string = '';
  formGroup!: FormGroup;

  constructor(private toastr: ToastrService, private userService: UserService) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      username: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
    });
  }

  login(){
    let user : UserLogin = {username: this.username, password: this.password};
    this.userService.login(user).subscribe({
      next: (res) => {
        localStorage.setItem("jwt", res.token);
        this.username = '';
        this.password = '';
        this.showSuccess("in");
      },
      error: (e) => this.showError(e.error.message)
    });
  }

  logout(){
    localStorage.removeItem("jwt");
    this.showSuccess("out");
  }

  isLoggedIn(){
    if(localStorage.getItem("jwt") != null)
      return true;
    return false;
  }

  isLoggedOut(){
    if(localStorage.getItem("jwt") != null)
      return false;
    return true;
  }

  showSuccess(operation: string) {
    this.toastr.success('Successfully logged ' + operation, 'Log' + operation);
  }
  showError(error: string) {
    this.toastr.error(error, 'Login');
  }

}
