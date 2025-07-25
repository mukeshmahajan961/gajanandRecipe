import { Component,  computed,  signal } from '@angular/core';
import { Contact } from '../../models/contact';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
    contact = signal<Contact>({
    id: 0,
    name: '',
    email: '',
    message: ''
  });

  isLoading = signal(false);
  toastMessage = signal('');
  submitted = signal(false);

  isValid = computed(() => {
    const c = this.contact();
    return c.name.trim() !== '' &&
           c.email.includes('@') &&
           c.message.trim().length >= 5;
  });

  constructor(private contactService: ContactService) {}

  submit() {
    if (!this.isValid()) {
      this.toastMessage.set('❌ Please fill all fields correctly!');
      this.submitted.set(true);
      return;
    }

    this.isLoading.set(true);
    this.contactService.sendMessage(this.contact()).subscribe({
      next: () => {
        this.toastMessage.set('✅ Message sent successfully!');
        this.contact.set({ id: 0, name: '', email: '', message: '' });
        this.submitted.set(true);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastMessage.set('❌ Failed to send message!');
        this.isLoading.set(false);
      }
    });
  }

  updateField(field: keyof Contact, value: string) {
    this.contact.set({ ...this.contact(), [field]: value });
  }
}
