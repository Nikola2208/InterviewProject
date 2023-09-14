import { Component } from '@angular/core';
import { UserResponse } from 'src/app/classes/UserResponse';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import { Address } from 'src/app/classes/Address';
import { ToastrService } from 'ngx-toastr';
import { Email } from 'src/app/classes/Email';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-operations',
  templateUrl: './user-operations.component.html',
  styleUrls: ['./user-operations.component.css']
})
export class UserOperationsComponent {
  user: UserResponse = { id: 0, name: '', surname: '', address: { number: 0, city: '', street: '', country: ''}, account: { email: '', username: '' }, role: ''};
  users: UserResponse[] = [];
  userId: number = 0;
  userRole: string = '';
  previousEmail: string = '';

  constructor(private router: Router , private userService: UserService, private toastr: ToastrService) { }

  ngOnInit(){
    let decodedJWT : any = jwt_decode(localStorage.getItem("jwt") ?? '')
    if (decodedJWT != '') {
      this.userId = decodedJWT.user_id;
      this.userRole = decodedJWT.role
    }
    this.userService.getUserInfo(this.userId).subscribe((user) => {
      this.user = user;
      this.previousEmail = this.user.account.email
    });
    this.userService.getAll().subscribe((users) => {
      this.users = users;
    });
  }

  checkEmail(){
    if (this.user.account.email == '' || this.user.name == '')
      return true;
    return false;
  }

  checkAddress(){
    if (this.user.address.number <= 0 || this.user.address.street == '' || this.user.address.city == '' || this.user.address.country == '' || this.user.name == '')
      return true;
    return false;
  }

  updateEmail(){
    let email : Email = { email: this.user.account.email }
    this.userService.updateEmail(this.userId, email).subscribe({
      next: (res) => {
        let user = this.users.find((user) => res.id === user.id)
        if (user)
          user.account.email = res.account.email
        this.showSuccess("email");
      },
      error: (e) => {
        this.user.account.email = this.previousEmail;
        this.showError(e.error.message);
      }
    });
  }

  updateAddress(){
    let address : Address = { number: this.user.address.number, street: this.user.address.street, city: this.user.address.city, country: this.user.address.country}
    this.userService.updateAddress(this.userId, address).subscribe({
      next: (res) => {
        let user = this.users.find((user) => res.id === user.id)
        if (user)
          user.address = res.address
        this.showSuccess("address");
      },
      error: (e) => this.showError(e.error.message)
    });
  }

  showSuccess(operation: string) {
    this.toastr.success('Successfully updated ' + operation, 'Update user info');
  }
  showError(error: string) {
    this.toastr.error(error, 'Update user info');
  }

  delete(){
    this.userService.delete(this.userId).subscribe({
      next: (res) => {
        this.showDeleteSuccess();
        localStorage.removeItem("jwt");
        this.router.navigate(['/session']);
      },
      error: (e) => this.showDeleteError(e.error.message)
    });
  }

  showDeleteSuccess() {
    this.toastr.success('Successfully deleted user', 'Delete user');
  }
  showDeleteError(error: string) {
    this.toastr.error(error, 'Delete user');
  }

}
