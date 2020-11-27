import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './item/register/register.component';
import { ListComponent } from './item/list/list.component';

import { MenuModule } from 'primeng/menu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbService } from './breadcrumb.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';

import { ItemService } from './item/item.service';
import { RemoveComponent } from './item/remove/remove/remove.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ListComponent,
    RemoveComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MenuModule,
    BreadcrumbModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    InputMaskModule,
    TableModule,
  ],
  providers: [BreadcrumbService, ItemService],
  bootstrap: [AppComponent],
})
export class AppModule {}
