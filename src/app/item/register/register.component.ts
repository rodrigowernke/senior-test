import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { Router } from '@angular/router';
import { Item, MeasurementUnit } from '../models/item.model';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];

  measurementUnits!: { name: string; measurementUnit: MeasurementUnit }[];

  selectedMeasurementUnit: MeasurementUnit = MeasurementUnit.Unidade;

  constructor(
    private breadcrumb: BreadcrumbService,
    private router: Router,
    private itemService: ItemService
  ) {
    const navigation = this.router.getCurrentNavigation();

    if (navigation && navigation.extras.state) {
      const item = navigation.extras.state as Item;
    }
  }

  ngOnInit(): void {
    this.breadcrumbItems.push({ label: 'Register' });

    setTimeout(() => {
      this.breadcrumb.setBreadcrumb(this.breadcrumbItems);
    });

    this.measurementUnits = [
      { name: 'Litro', measurementUnit: MeasurementUnit.Litro },
      { name: 'Quilograma', measurementUnit: MeasurementUnit.Quilograma },
      { name: 'Unidade', measurementUnit: MeasurementUnit.Unidade },
    ];
  }

  // onSubmit(form: NgForm) {
  // add item
  //   this.itemService.itemsSubject.next(this.itemService.getItems());
  // }
  cancelForm() {
    this.router.navigate(['/list']);
  }
}
