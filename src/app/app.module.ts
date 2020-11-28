import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { CurrencyPipe, registerLocaleData } from '@angular/common';

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
import { InputNumberModule } from 'primeng/inputnumber';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';

import { ItemService } from './item/item.service';
import { RemoveComponent } from './item/remove/remove/remove.component';
import { MessageService } from 'primeng/api';

registerLocaleData(localePt, 'pt');

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
    InputMaskModule,
    InputNumberModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    TableModule,
    SidebarModule,
    ToastModule,
  ],
  providers: [
    BreadcrumbService,
    ItemService,
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    MessageService,
    CurrencyPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
