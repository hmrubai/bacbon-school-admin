import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ConfirmService } from 'src/app/_helpers/confirm-dialog/confirm.service';
import { Page } from 'src/app/_models/page';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AuthorizationService } from 'src/app/_services/authorization.service';
import { CommonService } from 'src/app/_services/common.service';
import { environment } from 'src/environments/environment';
import { NavLeftComponent } from '../nav-left/nav-left.component';
declare var $: any;

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {
  currentUser: any;
  showMenu: boolean = false;
  requests: any;
  isApprover: boolean = false;
  private connection: any;
  private proxy: any;
  notifications: Array<any> = [];
  unseenTotal: number = 0;
  page = new Page();
  baseUrl = environment.baseUrl;
  @BlockUI() blockUI: NgBlockUI;

  loadingIndicator: boolean = false;


  constructor(private authService: AuthenticationService,
    private _service: CommonService,
    private router: Router,
    private authorizationService: AuthorizationService,
    private toastr: ToastrService,
    private confirmService: ConfirmService) {
    this.baseUrl = environment.baseUrl;
    this.page.size = 5;
    this.currentUser = this.authService.currentUserDetails.value;
  }

  ngOnInit() {
    // this.isApprover = this.authorizationService.hasPermission('LeaveApprove')
    // this.connection = $.hubConnection(environment.baseUrl);
    // this.proxy = this.connection.createHubProxy('NotificationHub');
    // this.connection.start().done(() => {
    //   console.log('Connected to Notification Hub');
    // }).fail((error: any) => {
    //   console.log('Notification Hub error -> ' + error);
    // });
    // this.proxy.on('NewNotification', (sourceId, notificationId) => this.onNewNotification(sourceId, notificationId));
    // this.getList();
    // let navLeftComponent = new NavLeftComponent(this.authService,this._service,this.toastr);
    // navLeftComponent.getRequestCount();
  }

  //showMore() {
   // this.page.pageNumber++;
  //   this.getList();
  // }

  // getList() {
  //   this.loadingIndicator = true;
  //   this._service.get('notification/list', this.page).subscribe(res => {
  //     if (!res.Success) {
  //       this.toastr.error(res, 'Error!', { closeButton: true, disableTimeOut: false });
  //       return;
  //     }
  //     res.Records.forEach(element => {
  //       this.notifications.push(element);
  //     });
  //     this.unseenTotal = res.UnseenTotal;
  //     this.page.totalElements = res.Total;
  //     this.page.totalPages = this.page.totalElements > 0 ? this.page.totalElements / this.page.size : 0;
  //     setTimeout(() => {
  //       this.loadingIndicator = false;
  //     }, 1000);
  //   }, err => {
  //     this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
  //     setTimeout(() => {
  //       this.loadingIndicator = false;
  //     }, 1000);
  //   });
  // }


  // getRequestCount() {
  //   this._service.get('leave-request/leave-requests-for-approver-count').subscribe(res => {
  //     this.requests = res.Total;
  //   }, err => {
  //     this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
  //   });
  // }

  // onNewNotification(sourceId, notificationId) {
  //   this._service.leaveRequestChage.next(!this._service.leaveRequestChage.value);
  //   if (this.currentUser.Id !== sourceId) {
  //     this._service.get('notification/get/' + notificationId).subscribe(res => {
  //       if (!res.Success) {
  //         this.toastr.error(res, 'Error!', { closeButton: true, disableTimeOut: false });
  //         return;
  //       }

  //       if (res.Record) {
  //         this.notifications.unshift(res.Record);
  //         if(this.notifications.length > this.page.size){
  //           this.notifications.pop();
  //         }
  //         this.unseenTotal++;
  //         this.page.totalElements++;
  //         this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
  //       }
  //     }, err => {
  //       this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
  //     });
  //   }
  // }

  // async onClickNotification(item: any) {
  //   try {
  //     if (!item.Seen) {
  //       await this.seenNotification(item.Id);
  //       item.Seen = true;
  //       this.unseenTotal--;
  //     }
  //     const currentUrl = this.router.url;
  //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //       this.router.navigate(['/requisition-detail-list', item.RefId]);
  //     });


  //     // switch (item.Type) {
  //     //   case 'Exam':
  //     //     this.router.navigate(['requisition-detail-list', item.RefId]);
  //     //     break;
  //     // }
  //   } catch (error) {

  //   }
  // }

  // private seenNotification(id): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this._service.get('notification/seen/' + id).subscribe(res => {
  //       if (!res.Success) {
  //         this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false });
  //         return resolve(null);
  //       }
  //       resolve(null);
  //     }, err => {
  //       this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: false });
  //       reject(err.message || err);
  //     });
  //   })

  // }


  logout() {
    this.confirmService.confirm('Are you sure?', 'You are logging out from the app.', "Yes, Log Me Out")
      .subscribe(
        result => {
          if (result) {
            this.authService.logout(window.location.hostname);
            window.location.reload();
          }
        });
  }

}
