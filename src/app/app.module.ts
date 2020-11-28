import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localept from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BreadcrumbService } from './breadcrumb.service';
import { ItemService } from './item/item.service';
import { ListComponent } from './item/list/list.component';
import { RegisterComponent } from './item/register/register.component';
import { RemoveComponent } from './item/remove/remove/remove.component';
registerLocaleData(localept, 'pt');

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
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    MessageService,
    CurrencyPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
