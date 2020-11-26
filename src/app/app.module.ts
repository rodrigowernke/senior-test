import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { InputSwitchModule } from 'primeng/inputswitch';
import { ItemService } from './item/item.service';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [AppComponent, RegisterComponent, ListComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenuModule,
    BreadcrumbModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputSwitchModule,
    TableModule,
  ],
  providers: [BreadcrumbService, ItemService],
  bootstrap: [AppComponent],
})
export class AppModule {}
