import {ImprovedMultimedia} from './improved-multimedia';
import {UserRegistrationForm} from './user-registration-form';

export class User {
    uid: string;
    email: string;
    ethWalletAddress: string;
    approved: boolean;
    whitelisted: boolean;
    submitted: boolean;
    blocked: boolean;
    roles: Array<string>;

    static serializeObjectToPartialUser(dto: User): Partial<User> {
        const result: any = {};

        if (dto.ethWalletAddress != null) {
            result.ethWalletAddress = dto.ethWalletAddress;
        }

        if (dto.blocked != null) {
            result.blocked = dto.blocked;
        }

        if (dto.approved != null) {
            result.approved = dto.approved;
        }

        if (dto.whitelisted != null) {
            result.whitelisted = dto.whitelisted;
        }

        result.submitted = true; // becomes true the first time the user successfully submits the form

        return result;
    }

    static serializeNewUser(dto: User): Partial<User> {
        const result: any = {};
        result.uid = dto.uid;
        result.email = dto.email;
        result.approved = dto.approved;
        result.blocked = dto.blocked;
        result.submitted = dto.submitted;
        result.whitelisted = dto.whitelisted;

        return result;
    }

    static deserializeObject(obj: any): User {
        const result: User = new User();

        if (obj != null) {
            if (obj.uid != null) {
                result.uid = obj.uid;
            }
            if (obj.email != null) {
                result.email = obj.email;
            }
            if (obj.roles != null && obj.roles.length > 0) {
                result.roles = obj.roles;
            }
            if (obj.ethWalletAddress != null) {
                result.ethWalletAddress = obj.ethWalletAddress;
            }
            if (obj.submitted != null) {
                result.submitted = obj.submitted;
            } else {
                result.submitted = false;
            }
            if (obj.approved != null) {
                result.approved = obj.approved;
            } else {
                result.approved = false;
            }
            if (obj.whitelisted != null) {
                result.whitelisted = obj.whitelisted;
            } else {
                result.whitelisted = false;
            }
            if (obj.blocked != null) {
                result.blocked = obj.blocked;
            } else {
                result.blocked = false;
            }
        }

        return result;
    }

    get needsRegistration(): boolean {
        return this.ethWalletAddress == null;
    }

    get isHans(): boolean {
        return this.roles != null && this.roles.length > 0 && this.roles.indexOf('HANS') > -1;
    }

    updateRegistrationDetails(form: UserRegistrationForm): void {
        this.ethWalletAddress = form.ethWalletAddress;
    }

    constructor() {
    }
}
