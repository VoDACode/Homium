import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiNavMenuService } from 'src/app/services/api/api-nav-menu.service';
import { NavMenuItem } from 'src/app/types/NavMenuItem';

@Component({
  selector: 'app-nav-admin-panel',
  templateUrl: './nav-admin-panel.component.html',
  styleUrls: ['./nav-admin-panel.component.css']
})
export class NavAdminPanelComponent implements OnInit {

  data: NavMenuItem[] = []

  constructor(private menuApi: ApiNavMenuService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.menuApi.getNavMenuItems().then(data => {
      this.data = data.map(item => new NavMenuItem(item.name, item.description, item.image, item.url, item.items, false));
      this.data.forEach(item => {
        this.translate.get(item.name.replace("[", "").replace("]", "")).toPromise().then((res: string) => item.name = res);
        if(item.items) {
          item.items.forEach(subItem => {
            this.translate.get(subItem.name.replace("[", "").replace("]", "")).toPromise().then((res: string) => subItem.name = res);
          });
        }
      });
    });
  }

  openSubItems(item: NavMenuItem, status: boolean | undefined = undefined) {
    if (status !== undefined) {
      item.viewSubItems = status;
    } else {
      item.viewSubItems = !item.viewSubItems;
    }
    if(item.viewSubItems) {
      this.data.filter(i => i !== item).forEach(i => i.viewSubItems = false);
    }
  }
}
