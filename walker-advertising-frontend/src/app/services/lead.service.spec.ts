import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LeadService } from './lead.service';
import { Lead } from '../models/lead';
import { HttpErrorResponse } from '@angular/common/http';

describe('LeadService', () => {
  let service: LeadService;
  let httpMock: HttpTestingController;

  const mockLeads: Lead[] = [
    { id: '1', name: 'John Doe', phoneNumber: '555-123-4567', zipCode: '12345', hasCommunicationPermission: true, email: 'john.doe@example.com', createdAt: new Date('2025-02-18T10:00:00Z') },
    { id: '2', name: 'Jane Smith', phoneNumber: '555-987-6543', zipCode: '67890', hasCommunicationPermission: false, email: 'jane.smith@example.com', createdAt: new Date('2025-02-19T12:00:00Z') }
  ];

  const mockLead: Lead = mockLeads[0];
  const apiUrl = 'http://localhost:5270/api/leads';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeadService]
    });

    service = TestBed.inject(LeadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLeads', () => {
    it('should return an Observable of leads', () => {
      service.getLeads().subscribe(leads => {
        expect(leads.length).toBe(2);
        expect(leads).toEqual(mockLeads);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockLeads);
    });

    it('should handle server error', () => {
      const errorMessage = 'Server error occurred';
      service.getLeads().subscribe({
        next: () => fail('Should have failed with 500 error'),
        error: (error: Error) => {
          expect(error.message).toContain('Server-side error: 500 - ' + errorMessage);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getLeadById', () => {
    it('should return an Observable of a single lead', () => {
      service.getLeadById('1').subscribe(lead => {
        expect(lead).toEqual(mockLead);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockLead);
    });

    it('should handle 404 error when lead is not found', () => {
      service.getLeadById('999').subscribe({
        next: () => fail('Should have failed with 404 error'),
        error: (error: Error) => {
          expect(error.message).toContain('Server-side error: 404 - Not Found');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('sendNotification', () => {
    it('should send a notification and return void Observable', () => {
      const notification = { type: 'text' as const, content: 'Test message' };
      service.sendNotification('1', notification.type, notification.content).subscribe(response => {
        expect(response).toBeNull(); // Updated expectation
      });

      const req = httpMock.expectOne(`${apiUrl}/1/notifications`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(notification);
      req.flush(null);
    });

    it('should handle error when sending notification fails', () => {
      const notification = { type: 'text' as const, content: 'Test message' };
      service.sendNotification('1', notification.type, notification.content).subscribe({
        next: () => fail('Should have failed with 400 error'),
        error: (error: Error) => {
          expect(error.message).toContain('Server-side error: 400 - Bad Request');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/1/notifications`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('createLead', () => {
    it('should create a new lead and return the created lead', () => {
      const newLead: Partial<Lead> = {
        name: 'New Lead',
        phoneNumber: '555-111-2222',
        zipCode: '54321',
        hasCommunicationPermission: true,
        email: 'new@example.com'
      };
      const createdLead: Lead = { ...newLead, id: '3', createdAt: new Date() } as Lead;

      service.createLead(newLead).subscribe(lead => {
        expect(lead).toEqual(createdLead);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newLead);
      req.flush(createdLead);
    });

    it('should handle error when creating lead fails', () => {
      const newLead: Partial<Lead> = {
        name: 'New Lead',
        phoneNumber: '555-111-2222'
      };

      service.createLead(newLead).subscribe({
        next: () => fail('Should have failed with 400 error'),
        error: (error: Error) => {
          expect(error.message).toContain('Server-side error: 400 - Validation Error');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Validation Error', { status: 400, statusText: 'Bad Request' });
    });
  });
});