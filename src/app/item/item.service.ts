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
  }

  deleteItem(item: Item) {
    let items: Item[] = JSON.parse(localStorage.getItem('items') || '{}');

    let deletedItem = items.find((x) => x.name === item.name);

    if (!deletedItem) {
      //problema
    }
  }
}
