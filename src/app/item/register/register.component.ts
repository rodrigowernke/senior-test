import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { ItemService } from '../item.service';
import { Item, MeasurementUnit } from '../models/item.model';

moment.locale('pt-br');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [DatePipe],
})
export class RegisterComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];

  measurementUnits!: { name: string; measurementUnit: MeasurementUnit }[];

  quantityAbreviation!: string;

  registerForm!: FormGroup;

  editableItem!: Item;

  minQuantityDigits: number = 1;
  maxQuantityDigits: number = 3;

  constructor(
    private breadcrumb: BreadcrumbService,
    private router: Router,
    private itemService: ItemService,
    private messageService: MessageService
  ) {
    const navigation = this.router.getCurrentNavigation();

    if (navigation && navigation.extras.state) {
      this.editableItem = navigation.extras.state as Item;

      const measurementUnit: any =
        MeasurementUnit[this.editableItem.measurementUnit];

      switch (measurementUnit) {
        case MeasurementUnit.Unidade:
          this.quantityAbreviation = 'un';
          this.minQuantityDigits = 1;
          this.maxQuantityDigits = 3;

          break;
        case MeasurementUnit.Quilograma:
          this.quantityAbreviation = 'kg';
          this.minQuantityDigits = 1;
          this.maxQuantityDigits = 3;
          break;
        case MeasurementUnit.Litro:
          this.quantityAbreviation = 'lt';
          this.minQuantityDigits = 0;
          this.maxQuantityDigits = 0;
          break;
        default:
          this.quantityAbreviation = 'un';
          this.minQuantityDigits = 0;
          this.maxQuantityDigits = 0;
          break;
      }
    }
  }

  ngOnInit(): void {
    if (this.editableItem) {
      this.breadcrumbItems.push({ label: 'Register' });
    }

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
        this.editableItem ? this.editableItem.quantity : ''
      ),
      price: new FormControl(this.editableItem ? this.editableItem.price : '', [
        Validators.required,
      ]),
      perishable: new FormControl(
        this.editableItem ? this.editableItem.perishable : false,
        [Validators.required]
      ),
      expirationDate: new FormControl(
        this.editableItem
          ? moment(this.editableItem.expirationDate).format('L')
          : '',
        [
          this.validatorExpirationDate as ValidatorFn,
          this.validatorDate as ValidatorFn,
        ]
      ),
      manufacturingDate: new FormControl(
        this.editableItem
          ? moment(this.editableItem.manufacturingDate).format('L')
          : '',
        [
          Validators.required,
          this.validatorManufacturingDate,
          this.validatorDate,
        ]
      ),
    });

    if (this.editableItem === null || this.editableItem === undefined) {
      this.quantityAbreviation = 'lt';
    }

    // Update the correct unit of measure.
    this.registerForm.controls['measurementUnit'].valueChanges.subscribe(
      (change) => {
        if (change === null) return;

        this.registerForm.controls['quantity'].setValue(0);

        const measurementUnit = change.name;

        switch (measurementUnit) {
          case 'Litro':
            this.quantityAbreviation = 'lt';
            this.maxQuantityDigits = 3;
            this.minQuantityDigits = 1;
            break;
          case 'Quilograma':
            this.quantityAbreviation = 'kg';
            this.maxQuantityDigits = 3;
            this.minQuantityDigits = 1;
            break;
          case 'Unidade':
            this.quantityAbreviation = 'un';
            this.minQuantityDigits = 0;
            break;
          default:
            this.quantityAbreviation = 'un';
            this.minQuantityDigits = 0;
            break;
        }
      }
    );

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

  validatorDate = (control: FormControl): ValidationErrors => {
    if (this.registerForm === undefined) {
      return null!;
    } else {
      if (control.value === '') return null!;

      const date = moment(control.value, 'DD-MM-YYYY');

      if (!date.isValid()) {
        return { invalidDate: true };
      } else {
        return null!;
      }
    }
  };

  validatorExpirationDate = (control: FormControl): ValidationErrors => {
    if (this.registerForm === undefined) {
      return null!;
    } else {
      const isPerishable = this.registerForm.controls['perishable']
        .value as boolean;

      if (!isPerishable) {
        return null!;
      }

      const expirationDate = moment(control.value, 'DD-MM-YYYY');
      const currentDate = moment();

      if (currentDate.isAfter(expirationDate, 'day')) {
        return { expiredItem: true };
      } else {
        return null!;
      }
    }
  };

  validatorManufacturingDate = (control: FormControl): ValidationErrors => {
    if (this.registerForm === undefined) {
      return null!;
    } else {
      const isPerishable = this.registerForm.controls['perishable']
        .value as boolean;

      const expirationDate = moment(
        this.registerForm.controls['expirationDate'].value,
        'DD-MM-YYYY'
      );

      const manufacturingDate = moment(control.value, 'DD-MM-YYYY');

      if (isPerishable && manufacturingDate.isAfter(expirationDate, 'day')) {
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
      const price = this.registerForm.controls['price'].value;
      const perishable = this.registerForm.controls['perishable'].value;
      const expirationDate = moment(
        this.registerForm.controls['expirationDate'].value,
        'DD-MM-YYYY'
      );

      const manufacturingDate = moment(
        this.registerForm.controls['manufacturingDate'].value,
        'DD-MM-YYYY'
      );

      const id = this.editableItem ? this.editableItem.id : Math.random();

      let item: Item = new Item(
        name,
        measurementUnit,
        quantity,
        price,
        perishable,
        expirationDate.toDate(),
        manufacturingDate.toDate(),
        id
      );

      if (this.editableItem) {
        this.itemService.editItem(item);
        this.showSuccessToast('Edição realizada com sucesso.');
        this.clearForm();
      } else {
        this.itemService.addItem(item);
        this.showSuccessToast('Cadastro realizado com sucesso.');
        this.clearForm();
      }
    }
    // debug
  }

  cancelForm() {
    this.router.navigate(['/list']);
  }

  clearForm() {
    // this.registerForm.markAsPristine();
    // this.registerForm.markAsUntouched();
    this.registerForm.reset();
    this.editableItem = null!;
  }

  showSuccessToast(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Cadastro de Item',
      detail: message,
    });
  }
}
