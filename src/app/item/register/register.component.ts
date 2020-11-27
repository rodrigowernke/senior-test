import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
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

    // form initialization
    this.registerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      measurementUnit: new FormControl(
        {
          name: 'Quilograma',
          measurementUnit: MeasurementUnit.Quilograma,
        },
        [Validators.required]
      ),
      quantity: new FormControl(0),
      price: new FormControl(0),
      perishable: new FormControl(false, Validators.required),
      expirationDate: new FormControl('', [
        this.validatorExpirationDate as ValidatorFn,
      ]),
      manufacturingDate: new FormControl('', [
        Validators.required,
        this.validatorManufacturingDate,
      ]),
    });

    this.quantityAbreviation = 'kg';

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

  validatorExpirationDate = (control: FormControl): ValidationErrors => {
    const expirationDate = control.value as Date;
    const currentDate = new Date();
    if (currentDate > expirationDate) {
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

      if (isPerishable && manufacturingDate > expirationDate) {
        return { invalidManufacturingDate: true };
      } else {
        return null!;
      }
    }
  };

  onSubmit() {
    if (this.registerForm.status === 'INVALID') {
      this.registerForm.controls['name'].updateValueAndValidity();
      this.registerForm.controls['measurementUnit'].updateValueAndValidity();
      this.registerForm.controls['quantity'].updateValueAndValidity();
      this.registerForm.controls['price'].updateValueAndValidity();
      this.registerForm.controls['perishable'].updateValueAndValidity();
      this.registerForm.controls['expirationDate'].updateValueAndValidity();
      this.registerForm.controls['manufacturingDate'].updateValueAndValidity();

      console.log('FORM INVALID');
    }
    console.log('Invalid: ', this.isInvalidControl('manufacturingDate'));
  }

  cancelForm() {
    this.router.navigate(['/list']);
  }
}
