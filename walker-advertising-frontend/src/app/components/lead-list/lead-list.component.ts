import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadService } from '../../services/lead.service';
import { Lead } from '../../models/lead';
import { FormsModule } from '@angular/forms';
import { LeadModalComponent } from '../lead-modal/lead-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LeadModalComponent],
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss']
})
export class LeadListComponent implements OnInit {
  leads: Lead[] = [];
  filteredLeads: Lead[] = [];
  modalLead: Lead | null = null;
  modalMode: 'details' | 'send' | 'add' = 'details';
  searchTerm: string = '';
  
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(private leadService: LeadService, private toastr: ToastrService) {  }

  ngOnInit(): void {
    this.toastr.success('', 'Loaded');
    this.loadLeads();
  }

  loadLeads(): void {
    this.leadService.getLeads().subscribe({
      next: (leads) => {
        this.leads = leads;
        this.applyFilterAndPagination();
      },
      error: (err) => this.toastr.error('Failed to load leads: ' + err.message, 'Error')
    });
  }

  showDetails(lead: Lead): void {
    this.modalLead = lead;
    this.modalMode = 'details';
    const modalElement = document.getElementById('leadModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  showMessageModal(lead: Lead): void {
    this.modalLead = lead;
    this.modalMode = 'send';
    const modalElement = document.getElementById('leadModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  showAddLeadModal(): void {
    this.modalLead = null;
    this.modalMode = 'add';
    const modalElement = document.getElementById('leadModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  handleSendMessage(event: { type: 'text' | 'email', content: string }): void {
    if (this.modalLead) {
      this.leadService.sendNotification(this.modalLead.id, event.type, event.content).subscribe({
        next: () => {
          const destination = event.type === 'text' ? this.modalLead!.phoneNumber : this.modalLead!.email;
          this.toastr.success(`Sent ${event.type} to ${this.modalLead!.name} at ${destination}: "${event.content}"`, 'Message Sent');
        },
        error: (err) => this.toastr.error(`Failed to send ${event.type}: ${err.message}`, 'Error')
      });
    }
  }

  addLead(newLead: Partial<Lead>): void {
    this.leadService.createLead(newLead).subscribe({
      next: (lead) => {
        this.leads.push(lead);
        this.applyFilterAndPagination();
        this.closeModal();
        this.toastr.success('Lead added successfully!', 'Success');
      },
      error: (err) => this.toastr.error(`Failed to add lead: ${err.message}`, 'Error')
    });
  }

  applyFilterAndPagination(): void {
    const filtered = this.leads.filter(lead =>
      lead.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredLeads = filtered.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilterAndPagination();
    }
  }

  private closeModal(): void {
    const modalElement = document.getElementById('leadModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }
  }
}