import {ImprovedMultimedia} from './improved-multimedia';
import {UserRegistrationForm} from './user-registration-form';

export class User {
    uid: string;
    email: string;
    ethWalletAddress: string;
    multimedia: Array<ImprovedMultimedia>;
    approved: boolean;
    submitted: boolean;
    blocked: boolean;
    roles: Array<string>;

    static serializeObjectToPartialUser(dto: User): Partial<User> {
        const result: any = {};

        const images: Array<any> = [];
        if (dto.multimedia != null && dto.multimedia.length > 0) {
            for (let mm of dto.multimedia) {
                images.push(ImprovedMultimedia.serializeObject(mm));
            }
        }

        if (dto.ethWalletAddress != null) {
            result.ethWalletAddress = dto.ethWalletAddress;
        }

        if (dto.blocked != null) {
            result.blocked = dto.blocked;
        }

        if (dto.approved != null) {
            result.approved = dto.approved;
        }

        if (images != null && images.length > 0) {
            result.multimedia = images;
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
            if (obj.multimedia != null && obj.multimedia.length > 0) {
                result.multimedia = [];
                for (let mm of obj.multimedia) {
                    result.multimedia.push(ImprovedMultimedia.deserializeObject(mm));
                }
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
            if (obj.blocked != null) {
                result.blocked = obj.blocked;
            } else {
                result.blocked = false;
            }
        }

        return result;
    }

    get needsRegistration(): boolean {
        return this.multimedia == null || this.multimedia.length < 2;
    }

    get isHans(): boolean {
        return this.roles != null && this.roles.length > 0 && this.roles.indexOf('HANS') > -1;
    }

    updateRegistrationDetails(form: UserRegistrationForm): void {
        this.multimedia = form.multimedia;
        this.ethWalletAddress = form.ethWalletAddress;
    }

    constructor() {
    }
}
