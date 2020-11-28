import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { ItemService } from '../item.service';
import { Item, MeasurementUnit } from '../models/item.model';

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
          ? new Date(this.editableItem.expirationDate).toLocaleDateString()
          : '',
        [
          this.validatorExpirationDate as ValidatorFn,
          this.validatorDate as ValidatorFn,
        ]
      ),
      manufacturingDate: new FormControl(
        this.editableItem
          ? new Date(this.editableItem.manufacturingDate).toLocaleDateString()
          : '',
        [Validators.required, this.validatorManufacturingDate]
      ),
    });

    if (this.editableItem === null || this.editableItem === undefined) {
      this.quantityAbreviation = 'lt';
    }

    // Update the correct unit of measure.
    this.registerForm.controls['measurementUnit'].valueChanges.subscribe(
      (change) => {
        if (change === null) return;

        const measurementUnit = change.name;

        switch (measurementUnit) {
          case 'Litro':
            this.quantityAbreviation = 'lt';
            this.minQuantityDigits = 1;
            this.maxQuantityDigits = 3;
            break;
          case 'Quilograma':
            this.quantityAbreviation = 'kg';
            this.minQuantityDigits = 1;
            this.maxQuantityDigits = 3;
            break;
          case 'Unidade':
            this.quantityAbreviation = 'un';
            this.minQuantityDigits = 0;
            this.maxQuantityDigits = 0;
            break;
          default:
            this.quantityAbreviation = 'un';
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

      // const currentDate = formatDate(
      //   new Date(control.value),
      //   'dd/MM/yyyy',
      //   'pt-BR'
      // );
      const currentDate = new Date(control.value);

      if (currentDate === null || currentDate === undefined) {
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

      const expirationDate: Date = this.createLocalDate(control.value);
      const currentDate = new Date();

      if (expirationDate > currentDate) {
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

      const expirationDate = this.createLocalDate(
        this.registerForm.controls['expirationDate'].value
      );

      const manufacturingDate = this.createLocalDate(control.value);

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
      const price = this.registerForm.controls['price'].value;
      const perishable = this.registerForm.controls['perishable'].value;
      const expirationDate: Date = this.createLocalDate(
        this.registerForm.controls['expirationDate'].value
      );
      const manufacturingDate: Date = this.createLocalDate(
        this.registerForm.controls['manufacturingDate'].value
      );

      const id = this.editableItem ? this.editableItem.id : Math.random();

      let item: Item = new Item(
        name,
        measurementUnit,
        quantity,
        price,
        perishable,
        expirationDate,
        manufacturingDate,
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

  createLocalDate(dateString: string): Date {
    if (dateString === null!) return null!;

    const metadata = dateString.split('/');

    return new Date(`${metadata[1]}-${metadata[0]}-${metadata[2]}`);
  }
}
