import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { Contact } from '../../models/contact';
import { ContactService } from '../../services/contact.service';
import { ToastComponent } from '../../common/toast/toast.component';
import { FormsModule, NgForm } from '@angular/forms';

declare var bootstrap: any;
@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, ToastComponent, FormsModule],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss'
})
export class ContactListComponent {

  @ViewChild('modelElemnt') modalElement!: ElementRef;
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;

  public Contacts = signal<Contact[]>([]);



  public toastMessage = '';

  public isUpdate: boolean = false;
  public sortField = signal<keyof Contact>('name');
  public sortDirection = signal<'asc' | 'desc'>('asc');
  public sortKey = signal<keyof Contact>('name');
  public sortOrder = signal<'asc' | 'desc'>('asc');
  public currentPage = signal(1);
  public itemsPerPage = signal(10);
  public isLoading = signal(false);
  public searchTerm = signal('');

  public contactsObj: Contact = new Contact();
  public message: string = "";
  public isAdd = false;
  public userModal: any;


  public totalPages = computed(() => {
    const totalContact = this.Contacts().length;
    const perPage = this.itemsPerPage();
    return Math.ceil(totalContact / perPage)
  })

  public paginatedContact = computed(() => {
    const user = this.sortedContact(); // ✅ sorted data par pagination
    const page = this.currentPage();
    const perPage = this.itemsPerPage();

    const start = (page - 1) * perPage;
    const end = start + perPage;

    return user.slice(start, end);
  });

  public filteredContacts = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const allContacts = this.Contacts();

    if (!search) return allContacts;

    return allContacts.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.message.toString().includes(search) ||
      u.id.toString().includes(search)
    );
  });


  public sortedContact = computed(() => {
    const data = [...this.filteredContacts()];
    const key = this.sortKey();
    const order = this.sortOrder();

    return data.sort((a, b) => {
      if (a[key]! < b[key]!) return order === 'asc' ? -1 : 1;
      if (a[key]! > b[key]!) return order === 'asc' ? 1 : -1;
      return 0;
    });
  });


  constructor(private contactService: ContactService) {
    effect(() => {
      // this.isLoading.set(true);
      this.contactService.getContacts().subscribe({
        next: contact => {
          this.Contacts.set(contact);
          // this.isLoading.set(false);
        },
        error: err => {
          console.error('Failed to load Contact', err);
          // this.isLoading.set(false);
        }
      });
    }, { allowSignalWrites: true });
  }


  updateContact(contact: Contact) {
    this.contactsObj = contact;
    this.isUpdate = true;
    const modal = new bootstrap.Modal(this.modalElement.nativeElement);
    modal.show();
  }

  saveContact(form: NgForm) {
    try {
      if (form.valid) {
        const currentContact = this.Contacts(); // get current value

        const index = currentContact.findIndex(u => u.id === this.contactsObj.id);

        if (index === -1) {
          // Add new user
          this.contactsObj.id = currentContact.length + 1;
          console.log(this.contactsObj.id);

          this.contactService.sendMessage(this.contactsObj).subscribe({
            next: () => {
              this.toastComponent.showToast('User added successfully!', 'error');
              this.Contacts.set([...currentContact, { ...this.contactsObj }]);
              form.reset();
              this.closeModal();
            },
            error: (err) => console.error('Failed to add user', err)
          });
        } else {
          // Update existing user
          this.contactService.updateContacts(this.contactsObj.id, this.contactsObj).subscribe({
            next: () => {
              this.toastComponent.showToast('User updated successfully!', 'success');
              const updatedContact = [...currentContact];
              updatedContact[index] = { ...this.contactsObj };
              this.Contacts.set(updatedContact);
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

  deleteContact(contact: Contact) {
    try {
      if (confirm(`Are you sure you want to delete this user: ${contact.name}?`)) {
        this.contactService.deleteContacts(contact.id).subscribe({
          next: () => {
            this.toastComponent.showToast('User deleted successfully!', 'error');
            const currentContact = this.Contacts(); // get current signal value
            const updatedContact = currentContact.filter(u => u.id !== contact.id);
            this.Contacts.set(updatedContact); // update the signal
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


  sortBy(column: 'id' | 'name' | 'email' | 'message') {
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
