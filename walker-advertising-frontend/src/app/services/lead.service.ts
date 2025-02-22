import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Lead } from '../models/lead';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private apiUrl = 'http://localhost:5270/api/leads';

  constructor(private http: HttpClient) {}

  getLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getLeadById(id: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  sendNotification(id: string, type: 'text' | 'email', content: string): Observable<void> {
    const request = { type, content };
    return this.http.post<void>(`${this.apiUrl}/${id}/notifications`, request).pipe(
      catchError(this.handleError)
    );
  }

  createLead(lead: Partial<Lead>): Observable<Lead> {
    return this.http.post<Lead>(this.apiUrl, lead).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Use error.error (response body) if available, otherwise fall back to statusText
      const serverMessage = typeof error.error === 'string' ? error.error : error.error?.Errors?.join(', ') || error.statusText;
      errorMessage = `Server-side error: ${error.status} - ${serverMessage}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}