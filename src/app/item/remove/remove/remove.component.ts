import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemService } from '../../item.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-remove',
  templateUrl: './remove.component.html',
  styleUrls: ['./remove.component.scss'],
})
export class RemoveComponent implements OnInit {
  @Input() item!: Item;
  @Output('cancelEvent') cancelEvent = new EventEmitter<boolean>();

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {}

  removeItem() {
    this.itemService.deleteItem(this.item);
    this.cancel();
  }

  cancel() {
    this.cancelEvent.emit(false);
  }
}
