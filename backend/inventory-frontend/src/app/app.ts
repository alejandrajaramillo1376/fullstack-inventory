import { Component, signal } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('inventory-frontend');
}