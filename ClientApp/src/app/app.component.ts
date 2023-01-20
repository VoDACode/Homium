import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {CookieService} from "ngx-cookie-service";
import { ApiAuthService } from './services/api/api-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'homium';
  showBg = false;
  selectLocale: string = 'en';
  
  constructor(private translateService: TranslateService, private cookie: CookieService, private apiAuthService: ApiAuthService) {
    this.selectLocale = this.cookie.get('locale');
    if(!this.selectLocale){
      this.selectLocale = 'en';
      this.cookie.set('locale', this.selectLocale)
    }
    this.translateService.use(this.selectLocale);
    this.apiAuthService.refresh().then(() => {
      console.log('refreshed');
    });
  }
}
