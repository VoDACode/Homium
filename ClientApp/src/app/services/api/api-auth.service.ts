import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SigninData } from '../../types/SigninData';

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {

  constructor(private http: HttpClient) { }

  public signIn(data: SigninData): Promise<Response> {
    return fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  public signOut(): Promise<Response> {
    return fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  public refresh(): Promise<Response> {
    return fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  public get isAuthenticated(): Promise<boolean> {
    return fetch('/api/auth/status', {
      method: 'GET',
    }).then(response => {
      return response.ok;
    });
  }
}
