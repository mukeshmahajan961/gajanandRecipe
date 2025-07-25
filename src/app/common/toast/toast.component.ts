import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @ViewChild('universalToast', { static: false }) universalToast!: ElementRef;

  public toastMessage = '';
  public toastType = 'bg-success'; // default (can be bg-danger, bg-warning etc.)


  showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.toastMessage = message;

    // Set toast type class
    switch (type) {
      case 'success':
        this.toastType = 'bg-success';
        break;
      case 'error':
        this.toastType = 'bg-danger';
        break;
      case 'warning':
        this.toastType = 'bg-warning text-dark';
        break;
    }

    // Show toast
    const toastEl = this.universalToast.nativeElement;
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 }); // 5 seconds
    toast.show();
  }

}
