import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthorizationService {

    permissions: Array<string>; // Store the actions for which this user has permission

    constructor(private authenticationService: AuthenticationService) {
    }

    hasPermission(role: string) {
        if (!role) return true;
        const roles = role.split(',');
        
        if (this.authenticationService.currentUserDetails.value && this.authenticationService.currentUserDetails.value.Roles.find(permission => {
            return roles.indexOf(permission) !== -1;
        })) {
            return true;
        }
        return false;
    }
    
    hasPermissions(roles: Array<string>) {        
        if (this.authenticationService.currentUserDetails.value) {
            return roles.indexOf(this.authenticationService.currentUserDetails.value.Roles) !== -1;
        }
        return false;
    }
}