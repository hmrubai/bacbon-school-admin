import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cookie } from 'ng2-cookies';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public currentUserDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) {
    if (Cookie.check('.School.APP.Cookie'))
      this.currentUserDetails = new BehaviorSubject<any>(JSON.parse(Cookie.get('.School.APP.Cookie')));
  }

  public get currentUserValue(): any {
    return Cookie.check('.School.APP.Cookie') ? this.currentUserDetails.value : null;
  }

  public isAuthenticated(): boolean {
    return Cookie.check('.School.APP.Cookie');
  }


  login(param) {
    var data = "username=" + param.UserName + "&password=" + encodeURIComponent(param.Password) + "&usertype=Trainer&grant_type=password";
    let params = {
      "email" : param.UserName,
      "password" : param.Password
    }
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this.http.post<any>(environment.baseUrl + 'jwt-login', params, { headers: reqHeader })
      .pipe(map(data => {
        if(!data.status){
          return data;
        }else{
          let user_info = data.result.user;
          const user = {
            Id: user_info.id,
            Email: user_info.email,
            EmployeeId: user_info.id,
            Gender: user_info.gender,
            FullName: user_info.name,
            Roles: ['Admin'],
            UserType: "Admin",
            ImagePath: user_info.image,
            access_token: data.result.token,
            ExpiredDate: new Date('2029-12-31')
          }
          let expireDate = new Date('2029-12-31');
          Cookie.set('.School.APP.Cookie', JSON.stringify(user), expireDate, '/', window.location.hostname, false);
          this.currentUserDetails.next(user);
          let params = {
            status: true,
          }
          return params;
        }
      }),
        catchError(err => {
          console.log(err);
          return of(null);
        }));
  }

  logout(hostname) {
    Cookie.delete('.School.APP.Cookie', '/', hostname);
    this.currentUserDetails.next(null);
  }

  registerSystemAdmin(url, params) {
    return this.http.post<any>(environment.apiUrl + url, params).pipe(
      map(res => {
        return res;
      })
    );
  }

  updateImage(imagePath) {
    let currentUser = this.currentUserDetails.value;
    currentUser.ImagePath = imagePath;
    Cookie.set('.School.APP.Cookie', JSON.stringify(currentUser), new Date(currentUser.ExpiredDate), '/', window.location.hostname, false);
    // sessionStorage.setItem('.BacBon.PCSMS.Cookie', JSON.stringify(currentUser));
    this.currentUserDetails.next(currentUser);
  }

  updateCurrentUser(currentUser) {
    Cookie.set('.School.APP.Cookie', JSON.stringify(currentUser), new Date(currentUser.ExpiredDate), '/', window.location.hostname, false);
    // sessionStorage.setItem('.BacBon.PCSMS.Cookie', JSON.stringify(currentUser));
    this.currentUserDetails.next(currentUser);
  }

}
