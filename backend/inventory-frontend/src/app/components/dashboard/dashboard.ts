import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 agrega esta línea
import { HttpClientModule } from '@angular/common/http';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // 👈 agrega CommonModule aquí
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  items: any[] = [];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.inventoryService.getItems().subscribe((data) => {
      this.items = data;
    });
  }
}