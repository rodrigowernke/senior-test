import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from './models/item.model';

@Injectable()
export class ItemService {
  itemsSubject = new Subject<Item[]>();

  getItems(): Item[] {
    let items: Item[] = JSON.parse(localStorage.getItem('items') || '{}');

    return items;
  }

  addItem(item: Item) {
    let items: Item[] = JSON.parse(localStorage.getItem('items') || '{}');

    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));

    this.itemsSubject.next(this.getItems());
  }

  editItem(editedItem: Item) {
    let items: Item[] = JSON.parse(localStorage.getItem('items') || '{}');

    items = items.map((item) => {
      if (item.name === editedItem.name) {
        item.measurementUnit = editedItem.measurementUnit;
        item.expirationDate = editedItem.expirationDate;
        item.perishable = editedItem.perishable;
        item.price = editedItem.price;
        item.quantity = editedItem.quantity;
        item.manufacturingDate = editedItem.manufacturingDate;

        return item;
      }
      return item;
    });

    localStorage.setItem('items', JSON.stringify(items));

    this.itemsSubject.next(this.getItems());
  }

  deleteItem(item: Item) {
    let items: Item[] = JSON.parse(localStorage.getItem('items') || '{}');

    let itemIndex = items.findIndex((x) => x.name === item.name);

    items.splice(itemIndex, 1);
    localStorage.setItem('items', JSON.stringify(items));

    this.itemsSubject.next(this.getItems());
  }
}
