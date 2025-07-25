import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.maxLength(5), Validators.required]),
    email: new FormControl('', [Validators.required, Validators.maxLength(50)])
  })


  onSubmit() {
    console.log(this.profileForm.value);
  }
  setValue() {
    this.profileForm.setValue({
      name: 'peter',
      password: '123',
      email: 'peter@gmail.com'
    })
  }
}
