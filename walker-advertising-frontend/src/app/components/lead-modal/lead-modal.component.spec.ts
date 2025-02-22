import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeadModalComponent } from './lead-modal.component';
import { FormsModule } from '@angular/forms';
import { Lead } from '../../models/lead';
import { SimpleChanges } from '@angular/core';

describe('LeadModalComponent', () => {
  let component: LeadModalComponent;
  let fixture: ComponentFixture<LeadModalComponent>;

  const mockLead: Lead = {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-klmn1234',
    name: 'John Doe',
    phoneNumber: '5551234567',
    zipCode: '12345',
    hasCommunicationPermission: true,
    email: 'john.doe@example.com',
    createdAt: new Date('2025-02-18T10:00:00Z')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadModalComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadModalComponent);
    component = fixture.componentInstance;
    component.lead = mockLead;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    const modals = document.querySelectorAll('#leadModal');
    modals.forEach(modal => {
      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    });
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
      if (backdrop && backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    });
    document.body.classList.remove('modal-open');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should reset send form when mode changes to send', () => {
      component.messageContent = 'Previous text';
      component.mode = 'details';
      fixture.detectChanges();

      const changes: SimpleChanges = {
        mode: {
          previousValue: 'details',
          currentValue: 'send',
          firstChange: false,
          isFirstChange: () => false
        }
      };
      component.ngOnChanges(changes);
      fixture.detectChanges();

      expect(component.messageContent).toBe('');
      expect(component.messageType).toBe('text');
    });

    it('should reset send form when lead changes in send mode', () => {
      component.messageContent = 'Previous text';
      component.mode = 'send';
      fixture.detectChanges();

      const newLead = { ...mockLead, id: 'new-id' };
      const changes: SimpleChanges = {
        lead: {
          previousValue: mockLead,
          currentValue: newLead,
          firstChange: false,
          isFirstChange: () => false
        }
      };
      component.ngOnChanges(changes);
      fixture.detectChanges();

      expect(component.messageContent).toBe('');
      expect(component.messageType).toBe('text');
    });

    it('should reset add form when mode changes to add', () => {
      component.newLead.name = 'Old Name';
      component.mode = 'send';
      fixture.detectChanges();

      const changes: SimpleChanges = {
        mode: {
          previousValue: 'send',
          currentValue: 'add',
          firstChange: false,
          isFirstChange: () => false
        }
      };
      component.ngOnChanges(changes);
      fixture.detectChanges();

      expect(component.newLead.name).toBe('');
      expect(component.newLead.phoneNumber).toBe('');
    });
  });

  describe('onSend', () => {
    it('should emit sendMessage event and close modal when content is provided in send mode', () => {
      component.mode = 'send';
      component.messageContent = 'Test message';
      spyOn(component.sendMessage, 'emit');
      spyOn(component, 'closeModal');

      component.onSend();

      expect(component.sendMessage.emit).toHaveBeenCalledWith({
        type: 'text',
        content: 'Test message'
      });
      expect(component.closeModal).toHaveBeenCalled();
    });

    it('should not emit or close modal when content is empty in send mode', () => {
      component.mode = 'send';
      component.messageContent = '';
      spyOn(component.sendMessage, 'emit');
      spyOn(component, 'closeModal');

      component.onSend();

      expect(component.sendMessage.emit).not.toHaveBeenCalled();
      expect(component.closeModal).not.toHaveBeenCalled();
    });

    it('should do nothing in details mode', () => {
      component.mode = 'details';
      component.messageContent = 'Test message';
      spyOn(component.sendMessage, 'emit');
      spyOn(component, 'closeModal');

      component.onSend();

      expect(component.sendMessage.emit).not.toHaveBeenCalled();
      expect(component.closeModal).not.toHaveBeenCalled();
    });
  });

  describe('onAddLead', () => {
    it('should emit addLead event and close modal when required fields are filled', () => {
      component.mode = 'add';
      component.newLead = {
        name: 'New Lead',
        phoneNumber: '5551112222',
        zipCode: '12345'  // Add a valid zip code
      };
      spyOn(component.addLead, 'emit');
      spyOn(component, 'closeModal');
    
      component.onAddLead();
    
      expect(component.addLead.emit).toHaveBeenCalledWith({
        name: 'New Lead',
        phoneNumber: '5551112222',
        zipCode: '12345'
      });
      expect(component.closeModal).toHaveBeenCalled();
    });

    it('should not emit or close if required fields are missing', () => {
      component.mode = 'add';
      component.newLead = { name: '', phoneNumber: '' };
      spyOn(component.addLead, 'emit');
      spyOn(component, 'closeModal');

      component.onAddLead();

      expect(component.addLead.emit).not.toHaveBeenCalled();
      expect(component.closeModal).not.toHaveBeenCalled();
    });
  });
});