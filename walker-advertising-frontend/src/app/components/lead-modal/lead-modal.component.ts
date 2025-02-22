import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Lead } from '../../models/lead';

@Component({
  selector: 'app-lead-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lead-modal.component.html',
  styleUrls: ['./lead-modal.component.scss']
})
export class LeadModalComponent implements OnChanges {
  @Input() lead: Lead | null = null;
  @Input() mode: 'details' | 'send' | 'add' = 'details';
  @Output() sendMessage = new EventEmitter<{ type: 'text' | 'email', content: string }>();
  @Output() addLead = new EventEmitter<Partial<Lead>>();

  messageType: 'text' | 'email' = 'text';
  messageContent: string = '';
  newLead: Partial<Lead> = {
    name: '',
    phoneNumber: '',
    zipCode: '',
    hasCommunicationPermission: false,
    email: ''
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['mode'] && changes['mode'].currentValue === 'send') || changes['lead']) {
      this.resetSendForm();
    }
    if (changes['mode'] && changes['mode'].currentValue === 'add') {
      this.resetAddForm();
    }
  }

  onSend(): void {
    if (this.mode === 'send' && this.messageContent && this.lead) {
      this.sendMessage.emit({ type: this.messageType, content: this.messageContent });
      this.closeModal();
    }
  }

  onAddLead(): void {
    if (
      this.mode === 'add' &&
      this.newLead.name &&
      this.newLead.phoneNumber &&
      this.isValidPhoneNumber(this.newLead.phoneNumber as string) &&
      this.newLead.zipCode &&
      this.isValidZipCode(this.newLead.zipCode as string) &&
      (!this.newLead.email || this.isValidEmail(this.newLead.email as string))
    ) {
      this.addLead.emit(this.newLead);
      this.closeModal();
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('leadModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
      if (this.mode === 'send') {
        this.resetSendForm();
      } else if (this.mode === 'add') {
        this.resetAddForm();
      }
    }
  }

  restrictToNumbers(event: KeyboardEvent): boolean {
    const charCode = event.charCode || event.keyCode;
    const charStr = String.fromCharCode(charCode);
    if (!/\d/.test(charStr) && charCode !== 8 && charCode !== 9) { // Allow backspace (8) and tab (9)
      event.preventDefault();
      return false;
    }
    return true;
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    return phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);
  }

  isValidZipCode(zipCode: string): boolean {
    return zipCode.length === 5 && /^\d+$/.test(zipCode);
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  private resetSendForm(): void {
    this.messageContent = '';
    this.messageType = 'text';
  }

  private resetAddForm(): void {
    this.newLead = {
      name: '',
      phoneNumber: '',
      zipCode: '',
      hasCommunicationPermission: false,
      email: ''
    };
  }
}