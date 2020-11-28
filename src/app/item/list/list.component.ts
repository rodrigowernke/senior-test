import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { ItemService } from '../item.service';
import { Item, MeasurementUnit } from '../models/item.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  breadcrumbItems: MenuItem[] = [];

  items: Item[] = [];

  showRemoveItemModal: boolean = false;

  private itemsSubscription!: Subscription;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private itemService: ItemService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.breadcrumbItems.push({ label: 'List' });

    setTimeout(() => {
      this.breadcrumbService.setBreadcrumb(this.breadcrumbItems);
    });

    this.itemsSubscription = this.itemService.itemsSubject.subscribe(
      (items) => {
        this.items = items;
      }
    );

    this.itemService.itemsSubject.next(this.itemService.getItems());
  }

  ngOnDestroy(): void {
    this.itemsSubscription.unsubscribe();
  }

  getQuantityFormat(item: Item) {
    let quantityFormat = '';

    const measurementUnit: any = MeasurementUnit[item.measurementUnit];

    switch (measurementUnit) {
      case MeasurementUnit.Unidade:
        quantityFormat = 'un';
        break;
      case MeasurementUnit.Quilograma:
        quantityFormat = 'kg';
        break;
      case MeasurementUnit.Litro:
        quantityFormat = 'lt';
        break;
      default:
        quantityFormat = 'lt';
        break;
    }

    return quantityFormat;
  }

  deleteItem(item: Item) {
    this.confirmDialog(item);
  }

  confirmDialog(item: Item) {
    this.confirmationService.confirm({
      message: `Você tem certeza que deseja excluir o item ${item.name}?`,
      accept: () => {
        this.itemService.deleteItem(item);
        this.showSuccessToast(
          'Exclusão de item',
          `Item ${item.name} excluído com sucesso.`
        );
      },
    });
  }

  editItem(item: Item) {
    this.router.navigate(['/register'], { state: item });
  }

  addItem() {
    this.router.navigate(['/register']);
  }

  showSuccessToast(summary: string, message: string) {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: message,
    });
  }
}
