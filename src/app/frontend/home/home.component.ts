import { Component, effect, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UsersService } from '../../services/user.service';
import { Users } from '../../models/user';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,CommonModule,HeaderComponent,RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // public users = signal<Users[]>([]);
  // constructor(private router: Router, private userService: UsersService) {
  //   effect(() => {
  //     // this.isLoading.set(true);
  //     this.userService.getUsers().subscribe({
  //       next: user => {
  //         this.users.set(user);
  //       },
  //       error: err => {
  //         console.error('Failed to load users', err);
  //       }
  //     });
  //   }, { allowSignalWrites: true });
  // }

  // trackByUserId(index: number, user: any): number {
  //   return user.id;
  // }

}
