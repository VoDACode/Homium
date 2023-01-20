import { Injectable } from '@angular/core';
import { NavMenuItem } from 'src/app/types/NavMenuItem';

@Injectable({
  providedIn: 'root'
})
export class ApiNavMenuService {

  constructor() { }

  getNavMenuItems(): Promise<NavMenuItem[]> {
    return fetch('/api/menu/list').then(res => res.json()).then(data => data as NavMenuItem[]);
  }

}
