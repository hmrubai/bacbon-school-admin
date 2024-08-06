
import { FormControl } from '@angular/forms';

export interface ValidationResult {
    [key: string]: boolean;
}

export class ContactNoValidator {

    public static isValid(control: FormControl): ValidationResult {    
        let hasNumber = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/.test(control.value);        

       //PasswordValidator.strong
        const valid = hasNumber ;
        if (!valid) {
            // return what´s not valid
            return { isValid: true };
        }
        return null;
    }
}