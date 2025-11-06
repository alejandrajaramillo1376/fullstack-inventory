import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Necesario para *ngFor y *ngIf
import { InventoryService } from '../../services/inventory.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true, // ✅ convierte el componente en standalone
  imports: [CommonModule], // ✅ habilita *ngFor
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  items: any[] = [];

  constructor(
    private inventoryService: InventoryService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    // ✅ Carga inicial de los items
    this.inventoryService.getItems().subscribe(items => {
      this.items = items;
    });

    // ✅ Actualización en tiempo real
    this.socketService.onStockUpdate().subscribe(update => {
      const idx = this.items.findIndex(i => i._id === update.id);
      if (idx >= 0) {
        this.items[idx].quantity = update.quantity;
      } else {
        this.inventoryService.getItems().subscribe(items => (this.items = items));
      }
    });
  }
}