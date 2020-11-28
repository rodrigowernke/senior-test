import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  breadcrumbItems!: MenuItem[];
  menuItems!: MenuItem[];
  home!: MenuItem;
  sidebarShowing: boolean = false;

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.menuItems = [
      { label: 'Register', icon: 'pi pi-save', routerLink: ['/register'] },
      { label: 'List', icon: 'pi pi-list', routerLink: ['/list'] },
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.breadcrumbService.breadcrumbChanged.subscribe((breadcrumb: any) => {
      this.breadcrumbItems = breadcrumb;
    });

    this.breadcrumbItems = [];
  }

  itemClicked(event: { item: { routerLink: string } }) {
    if (event.item.routerLink === '/') {
      this.breadcrumbItems = [];
    }
  }

  showSideBar() {
    this.sidebarShowing = true;
  }

  hideSideBar() {
    this.sidebarShowing = false;
  }
}
