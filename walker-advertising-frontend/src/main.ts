import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideToastr } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
      timeOut: 3000, // Toast disappears after 3 seconds
      positionClass: 'toast-top-right', // Position on screen
      preventDuplicates: true, // Avoid duplicate toasts
      progressBar: true // Show progress bar
    })
  ]
}).catch((err) => console.error(err));