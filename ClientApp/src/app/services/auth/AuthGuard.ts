import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { from, Observable } from "rxjs";
import { ApiAuthService } from "../api/api-auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authApi: ApiAuthService, private router: Router) { }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.isSignedIn();
    }
    isSignedIn(): Observable<boolean> {
        return from(this.authApi.isAuthenticated.then(response => {
            if (!response) {
                this.router.navigate(['signin']);
                return false;
            }
            return true;
        }));
    }
}