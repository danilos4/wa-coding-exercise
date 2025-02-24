import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LeadListComponent } from './lead-list.component';
import { LeadService } from '../../services/lead.service';
import { FormsModule } from '@angular/forms';
import { LeadModalComponent } from '../lead-modal/lead-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Lead } from '../../models/lead';
import { By } from '@angular/platform-browser';

describe('LeadListComponent', () => {
  let component: LeadListComponent;
  let fixture: ComponentFixture<LeadListComponent>;
  let leadService: jasmine.SpyObj<LeadService>;
  let toastrService: ToastrService;

  const mockLeads: Lead[] = [
    { id: '1', name: 'John Doe', phoneNumber: '5551234567', zipCode: '12345', hasCommunicationPermission: true, email: 'john.doe@example.com', createdAt: new Date() },
    { id: '2', name: 'Jane Smith', phoneNumber: '5559876543', zipCode: '67890', hasCommunicationPermission: false, createdAt: new Date() }
  ];

  beforeEach(async () => {
    const leadServiceSpy = jasmine.createSpyObj('LeadService', ['getLeads', 'sendNotification', 'createLead']);
    leadServiceSpy.getLeads.and.returnValue(of(mockLeads));
    leadServiceSpy.sendNotification.and.returnValue(of(null));
    leadServiceSpy.createLead.and.returnValue(of({
      id: '3',
      name: 'New Lead',
      phoneNumber: '5551112222',
      zipCode: '54321',
      hasCommunicationPermission: true,
      email: 'new@example.com',
      createdAt: new Date()
    }));

    await TestBed.configureTestingModule({
      imports: [
        LeadListComponent,
        FormsModule,
        LeadModalComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule
      ],
      providers: [{ provide: LeadService, useValue: leadServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadListComponent);
    component = fixture.componentInstance;
    leadService = TestBed.inject(LeadService) as jasmine.SpyObj<LeadService>;
    toastrService = TestBed.inject(ToastrService);
    fixture.detectChanges(); // Trigger ngOnInit to load leads
  });

  afterEach(() => {
    fixture.destroy();
    const existingModal = document.getElementById('leadModal');
    if (existingModal && existingModal.parentNode) {
      existingModal.parentNode.removeChild(existingModal);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadLeads on initialization', () => {
      spyOn(component, 'loadLeads');
      component.ngOnInit();
      expect(component.loadLeads).toHaveBeenCalled();
    });
  });

  describe('loadLeads', () => {
    it('should load leads and apply pagination', fakeAsync(() => {
      spyOn(component, 'applyFilterAndPagination');
      component.loadLeads();
      tick();

      expect(leadService.getLeads).toHaveBeenCalled();
      expect(component.leads).toEqual(mockLeads);
      expect(component.applyFilterAndPagination).toHaveBeenCalled();
    }));
  });

  describe('showDetails', () => {
    it('should set modalLead and mode to details and show modal', () => {
      const modalElement = document.createElement('div');
      modalElement.id = 'leadModal';
      document.body.appendChild(modalElement);

      spyOn(document, 'getElementById').and.returnValue(modalElement);
      const lead = mockLeads[0];

      component.showDetails(lead);

      expect(component.modalLead).toBe(lead);
      expect(component.modalMode).toBe('details');
      expect(modalElement.classList.contains('show')).toBeTrue();
      expect(modalElement.style.display).toBe('block');
      expect(document.body.classList.contains('modal-open')).toBeTrue();
    });
  });

  describe('showMessageModal', () => {
    it('should set modalLead and mode to send and show modal', () => {
      const modalElement = document.createElement('div');
      modalElement.id = 'leadModal';
      document.body.appendChild(modalElement);

      spyOn(document, 'getElementById').and.returnValue(modalElement);
      const lead = mockLeads[0];

      component.showMessageModal(lead);

      expect(component.modalLead).toBe(lead);
      expect(component.modalMode).toBe('send');
      expect(modalElement.classList.contains('show')).toBeTrue();
      expect(modalElement.style.display).toBe('block');
      expect(document.body.classList.contains('modal-open')).toBeTrue();
    });
  });

  describe('showAddLeadModal', () => {
    it('should set mode to add and show modal', () => {
      const modalElement = document.createElement('div');
      modalElement.id = 'leadModal';
      document.body.appendChild(modalElement);

      spyOn(document, 'getElementById').and.returnValue(modalElement);

      component.showAddLeadModal();

      expect(component.modalLead).toBeNull();
      expect(component.modalMode).toBe('add');
      expect(modalElement.classList.contains('show')).toBeTrue();
      expect(modalElement.style.display).toBe('block');
      expect(document.body.classList.contains('modal-open')).toBeTrue();
    });
  });

  describe('addLead', () => {
    it('should add a new lead and refresh pagination', fakeAsync(() => {
      spyOn(component, 'applyFilterAndPagination');
      const closeModalSpy = spyOn(component as any, 'closeModal');
      const newLead: Partial<Lead> = {
        name: 'New Lead',
        phoneNumber: '5551112222',
        zipCode: '54321',
        hasCommunicationPermission: true,
        email: 'new@example.com'
      };

      component.addLead(newLead);
      tick();

      expect(leadService.createLead).toHaveBeenCalledWith(newLead);
      expect(component.leads.length).toBe(3);
      expect(component.applyFilterAndPagination).toHaveBeenCalled();
      expect(closeModalSpy).toHaveBeenCalled();
    }));
  });

  describe('applyFilterAndPagination', () => {
    it('should filter leads by searchTerm and apply pagination', () => {
      component.leads = mockLeads;
      component.searchTerm = 'John';
      component.itemsPerPage = 1;
      component.currentPage = 1;

      component.applyFilterAndPagination();

      expect(component.filteredLeads.length).toBe(1);
      expect(component.filteredLeads[0].name).toBe('John Doe');
      expect(component.totalPages).toBe(1);
    });

    it('should apply pagination without filtering when searchTerm is empty', () => {
      component.leads = mockLeads;
      component.searchTerm = '';
      component.itemsPerPage = 1;
      component.currentPage = 1;

      component.applyFilterAndPagination();

      expect(component.filteredLeads.length).toBe(1);
      expect(component.filteredLeads[0].name).toBe('John Doe');
    });
  });
});