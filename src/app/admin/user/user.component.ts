import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, OnInit, signal, Signal, ViewChild } from '@angular/core';
import { Users } from '../../models/user';
import { UsersService } from '../../services/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastComponent } from '../../common/toast/toast.component';

declare var bootstrap: any;
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  @ViewChild('modelElemnt') modalElement!: ElementRef;
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;


  public toastMessage = '';

  public isUpdate: boolean = false;
  public users = signal<Users[]>([]);
  public sortField = signal<keyof Users>('name');
  public sortDirection = signal<'asc' | 'desc'>('asc');
  public sortKey = signal<keyof Users>('name');
  public sortOrder = signal<'asc' | 'desc'>('asc');
  public currentPage = signal(1);
  public itemsPerPage = signal(10);
  public isLoading = signal(false);
  public searchTerm = signal('');

  public userObj: Users = new Users();
  public message: string = "";
  public isAdd = false;
  public userModal: any;


  public totalPages = computed(() => {
    const totalUsers = this.users().length;
    const perPage = this.itemsPerPage();
    return Math.ceil(totalUsers / perPage)
  })

  public paginatedUsers = computed(() => {
    const user = this.sortedUsers(); // ✅ sorted data par pagination
    const page = this.currentPage();
    const perPage = this.itemsPerPage();

    const start = (page - 1) * perPage;
    const end = start + perPage;

    return user.slice(start, end);
  });

  public filteredUsers = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const allUsers = this.users();

    if (!search) return allUsers;

    return allUsers.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.age.toString().includes(search) ||
      u.id.toString().includes(search)
    );
  });


  public sortedUsers = computed(() => {
    const data = [...this.filteredUsers()];
    const key = this.sortKey();
    const order = this.sortOrder();

    return data.sort((a, b) => {
      if (a[key]! < b[key]!) return order === 'asc' ? -1 : 1;
      if (a[key]! > b[key]!) return order === 'asc' ? 1 : -1;
      return 0;
    });
  });


  constructor(private userService: UsersService) {
    effect(() => {
      this.isLoading.set(true);
      this.userService.getUsers().subscribe({
        next: user => {
          this.users.set(user);
          this.isLoading.set(false);
        },
        error: err => {
          console.error('Failed to load users', err);
          this.isLoading.set(false);
        }
      });
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
  }


  updateUser(user: Users) {
    this.userObj = user;
    this.isUpdate = true;
    const modal = new bootstrap.Modal(this.modalElement.nativeElement);
    modal.show();
  }

  saveUsers(form: NgForm) {
    try {
      if (form.valid) {
        const currentUsers = this.users(); // get current value
        const index = currentUsers.findIndex(u => u.id === this.userObj.id);

        if (index === -1) {
          // Add new user
          this.userObj.id = (currentUsers.length + 1).toString();
          console.log(this.userObj.id);

          this.userService.addUsers(this.userObj).subscribe({
            next: () => {
              this.toastComponent.showToast('User added successfully!', 'error');
              this.users.set([...currentUsers, { ...this.userObj }]);
              form.reset();
              this.closeModal();
            },
            error: (err) => console.error('Failed to add user', err)
          });
        } else {
          // Update existing user
          this.userService.updateUsers(this.userObj.id, this.userObj).subscribe({
            next: () => {
              this.toastComponent.showToast('User updated successfully!', 'success');
              const updatedUsers = [...currentUsers];
              updatedUsers[index] = { ...this.userObj };
              this.users.set(updatedUsers);
              this.closeModal();
            },
            error: (err) => console.error('Failed to update user', err)
          });
        }

        this.isUpdate = false;
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  closeModal() {
    if (this.modalElement) {
      this.userModal = bootstrap.Modal.getInstance(this.modalElement.nativeElement);
      if (this.userModal) {
        this.userModal.hide();
      }
    }
  }

  deleteUser(user: Users) {
    try {
      if (confirm(`Are you sure you want to delete this user: ${user.name}?`)) {
        const id = user.id.toString();
        this.userService.deleteUsers(id).subscribe({
          next: () => {
            this.toastComponent.showToast('User deleted successfully!', 'error');
            const currentUsers = this.users(); // get current signal value
            const updatedUsers = currentUsers.filter(u => u.id !== user.id);
            this.users.set(updatedUsers); // update the signal
          },
          error: (err) => {
            console.error('Failed to delete user:', err);
          }
        });
      }
    } catch (err) {
      console.error('Error during delete:', err);
    }
  }


  sortBy(column: 'id' | 'name' | 'email' | 'age') {
    if (this.sortKey() === column) {
      // Toggle asc/desc if same column
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      // Otherwise set new column and default to ascending
      this.sortKey.set(column);
      this.sortOrder.set('asc');
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }

}