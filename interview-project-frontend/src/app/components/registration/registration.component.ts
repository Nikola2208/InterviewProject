import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserRegistration } from 'src/app/classes/UserRegistration';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  name: string = '';
  surname: string = '';
  number: number = 1;
  street: string = '';
  city: string = '';
  country: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  role: string = 'Admin';
  formGroup!: FormGroup;

  constructor(private router: Router, private toastr: ToastrService, private userService: UserService) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl('',[Validators.required]),
      surname: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required]),
      username: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
      number: new FormControl(1, [Validators.min(1)]),
      street: new FormControl('',[Validators.required]),
      city: new FormControl('',[Validators.required]),
      country: new FormControl('',[Validators.required]),
    });
  }

  changedRole(value: string){
    this.role = value;
  }

  registration(){
    let user : UserRegistration = { name: this.name, surname: this.surname, number: this.number, street: this.street,
      city: this.city, country: this.country, username: this.username, email: this.email, password: this.password, role: this.role};
    this.userService.registration(user).subscribe({
      next: () => {
        this.showSuccess();
        this.router.navigate(['/session']);
      },
      error: (e) => this.showError(e.error.message)
    });
  }

  showSuccess() {
    this.toastr.success('Successfully registered', 'Registration');
  }
  showError(error: string) {
    this.toastr.error(error, 'Registration');
  }

}
