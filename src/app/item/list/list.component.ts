import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { ItemService } from '../item.service';
import { Item } from '../models/item.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  breadcrumbItems: MenuItem[] = [];

  items: Item[] = [];

  removeItem!: Item;
  showRemoveItemModal: boolean = false;

  private itemsSubscription!: Subscription;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private itemService: ItemService,
    private router: Router
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

  hideRemoveModal(showRemoveItemModal: boolean) {
    this.showRemoveItemModal = showRemoveItemModal;
  }

  deleteItem(item: Item) {
    this.removeItem = item;
    this.showRemoveItemModal = true;
  }

  editItem(item: Item) {
    this.router.navigate(['/register'], { state: item });
  }
}
