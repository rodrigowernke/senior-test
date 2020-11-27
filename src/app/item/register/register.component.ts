import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { ItemService } from '../item.service';
import { Item, MeasurementUnit } from '../models/item.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];

  measurementUnits!: { name: string; measurementUnit: MeasurementUnit }[];

  quantityAbreviation!: string;

  registerForm!: FormGroup;

  editableItem!: Item;

  constructor(
    private breadcrumb: BreadcrumbService,
    private router: Router,
    private itemService: ItemService
  ) {
    const navigation = this.router.getCurrentNavigation();

    if (navigation && navigation.extras.state) {
      this.editableItem = navigation.extras.state as Item;
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

    // form initialization
    this.registerForm = new FormGroup({
      name: new FormControl(this.editableItem ? this.editableItem.name : '', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      measurementUnit: new FormControl(
        this.editableItem
          ? {
              name: this.editableItem.measurementUnit,
              measurementUnit:
                MeasurementUnit[this.editableItem.measurementUnit],
            }
          : {
              name: 'Litro',
              measurementUnit: MeasurementUnit.Litro,
            },
        [Validators.required]
      ),
      quantity: new FormControl(
        this.editableItem ? this.editableItem.quantity : '',
        [this.validatorQuantity as ValidatorFn]
      ),
      price: new FormControl(this.editableItem ? this.editableItem.price : ''),
      perishable: new FormControl(
        this.editableItem ? this.editableItem.perishable : false,
        Validators.required
      ),
      expirationDate: new FormControl(
        this.editableItem ? this.editableItem.expirationDate : '',
        [this.validatorExpirationDate as ValidatorFn]
      ),
      manufacturingDate: new FormControl(
        this.editableItem ? this.editableItem.manufacturingDate : '',
        [Validators.required, this.validatorManufacturingDate]
      ),
    });

    this.quantityAbreviation = 'lt';

    this.registerForm.valueChanges.subscribe((change) => {
      const measurementUnit =
        MeasurementUnit[
          change.measurementUnit.name as keyof typeof MeasurementUnit
        ];

      switch (measurementUnit) {
        case MeasurementUnit.Litro:
          this.quantityAbreviation = 'lt';
          break;
        case MeasurementUnit.Quilograma:
          this.quantityAbreviation = 'kg';
          break;
        case MeasurementUnit.Unidade:
          this.quantityAbreviation = 'un';
          break;
        default:
          this.quantityAbreviation = 'un';
          break;
      }
    });

    this.registerForm.controls['expirationDate'].valueChanges.subscribe(() => {
      this.registerForm.controls['manufacturingDate'].updateValueAndValidity();
    });

    this.registerForm.controls['perishable'].valueChanges.subscribe(() => {
      this.registerForm.controls['manufacturingDate'].updateValueAndValidity();
    });
  }

  isInvalidControl(controlName: string) {
    if (
      this.registerForm.controls[controlName].touched &&
      this.registerForm.controls[controlName].errors
    ) {
      return true;
    }
    return false;
  }

  validatorQuantity = (control: FormControl): ValidationErrors => {
    const quantity = control.value as string;
    return null!;
    if (Number(quantity) < 10) {
      return { expiredItem: true };
    } else {
      return null!;
    }
  };

  validatorExpirationDate = (control: FormControl): ValidationErrors => {
    const expirationDate = control.value as Date;
    const currentDate = new Date();

    if (expirationDate < currentDate) {
      return { expiredItem: true };
    } else {
      return null!;
    }
  };

  validatorManufacturingDate = (control: FormControl): ValidationErrors => {
    if (this.registerForm === undefined) {
      return null!;
    } else {
      const isPerishable = this.registerForm.controls['perishable']
        .value as boolean;

      const expirationDate = this.registerForm.controls['expirationDate']
        .value as Date;

      const manufacturingDate = control.value as Date;

      console.log(manufacturingDate > expirationDate);

      if (isPerishable && manufacturingDate > expirationDate) {
        return { invalidManufacturingDate: true };
      } else {
        return null!;
      }
    }
  };

  onSubmit() {
    if (this.registerForm.status === 'INVALID') {
      this.registerForm.controls['name'].markAsTouched();
      this.registerForm.controls['measurementUnit'].markAsTouched();
      this.registerForm.controls['quantity'].markAsTouched();
      this.registerForm.controls['price'].markAsTouched();
      this.registerForm.controls['perishable'].markAsTouched();
      this.registerForm.controls['expirationDate'].markAsTouched();
      this.registerForm.controls['manufacturingDate'].markAsTouched();

      this.registerForm.controls['name'].updateValueAndValidity();
      this.registerForm.controls['measurementUnit'].updateValueAndValidity();
      this.registerForm.controls['quantity'].updateValueAndValidity();
      this.registerForm.controls['price'].updateValueAndValidity();
      this.registerForm.controls['perishable'].updateValueAndValidity();
      this.registerForm.controls['expirationDate'].updateValueAndValidity();
      this.registerForm.controls['manufacturingDate'].updateValueAndValidity();
    } else {
      const name = this.registerForm.controls['name'].value as string;
      const measurementUnit =
        MeasurementUnit[
          this.registerForm.controls['measurementUnit'].value
            .measurementUnit as keyof typeof MeasurementUnit
        ];
      const quantity = Number(this.registerForm.controls['quantity'].value);
      const maskedNumber: string = this.registerForm.controls['price'].value;

      let price = 0;

      if (maskedNumber.toString().includes('R$')) {
        price = Number(maskedNumber.replace('R$', '').trim().replace(',', '.'));
      } else {
        price = Number(maskedNumber);
      }

      const perishable = this.registerForm.controls['perishable'].value;
      const expirationDate = this.registerForm.controls['expirationDate']
        .value as Date;
      const manufacturingDate = this.registerForm.controls['manufacturingDate']
        .value as Date;

      let item: Item = new Item(
        name,
        measurementUnit,
        quantity,
        price,
        perishable,
        expirationDate,
        manufacturingDate
      );

      if (this.editableItem) {
        this.itemService.editItem(item);
        console.log('Edited an item!');
      } else {
        this.itemService.addItem(item);
        console.log('Added a new item!');
      }
    }
  }

  cancelForm() {
    this.router.navigate(['/list']);
  }
}
