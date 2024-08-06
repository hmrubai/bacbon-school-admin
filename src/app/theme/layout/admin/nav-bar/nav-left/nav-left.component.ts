import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CommonService } from 'src/app/_services/common.service';
import { environment } from 'src/environments/environment';
import {NextConfig} from '../../../../../app-config';
declare var $: any;
@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit {
  public flatConfig: any;
  currentUser: any;
  requests: any;
  private connection: any;
  private proxy: any;
  baseUrl = environment.baseUrl;

  constructor(private authService: AuthenticationService,
    private _service: CommonService,
    private toastr: ToastrService,) {
    this.currentUser = this.authService.currentUserDetails.value;
    this.flatConfig = NextConfig.config;
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    
    // this.connection = $.hubConnection(environment.baseUrl);
    // this.proxy = this.connection.createHubProxy('NotificationHub');
    // this.connection.start().done(() => {
    //   console.log('Connected to Notification Hub1');
    // }).fail((error: any) => {
    //   console.log('Notification Hub error -> ' + error);
    // });
    // this.proxy.on('NewPendingRequest', () => this.getRequestCount());
    // this.getRequestCount();
  }
  // getRequestCount() {
  //   this._service.get('leave-request/leave-requests-for-approver-count').subscribe(res => {
  //     this.requests = res.Total;
  //   }, err => {
  //     this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
  //   });
  // }
}
