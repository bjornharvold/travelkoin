import {ImprovedMultimedia} from './improved-multimedia';
import {Transaction} from './transaction';
import {UserRegistrationForm} from './user-registration-form';

export class User {
    uid: string;
    email: string;
    ethWalletAddress: string;
    multimedia: Array<ImprovedMultimedia>;
    approved: boolean;
    transactions: Array<Transaction>;
    roles: Array<string>;

    static serializeObjectToPartialUser(dto: User): Partial<User> {
        const result: any = {};

        const images: Array<any> = [];
        const transactions: Array<any> = [];
        if (dto.multimedia != null && dto.multimedia.length > 0) {
            for (let mm of dto.multimedia) {
                images.push(ImprovedMultimedia.serializeObject(mm));
            }
        }
        if (dto.transactions != null && dto.transactions.length > 0) {
            for (let tx of dto.transactions) {
                transactions.push(Transaction.serializeObject(tx));
            }
        }

        if (dto.ethWalletAddress != null) {
            result.ethWalletAddress = dto.ethWalletAddress;
        }
        if (transactions != null && transactions.length > 0) {
            result.transactions = transactions;
        }
        if (images != null && images.length > 0) {
            result.multimedia = images;
        }

        return result;
    }

    static serializeNewUser(dto: User): Partial<User> {
        const result: any = {};
        result.uid = dto.uid;
        result.email = dto.email;

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
            if (obj.transactions != null && obj.transactions.length > 0) {
                result.transactions = [];
                for (let tx of obj.transactions) {
                    result.transactions.push(Transaction.deserializeObject(tx));
                }
            }
            if (obj.approved != null) {
                result.approved = obj.approved;
            } else {
                result.approved = false;
            }
        }

        return result;
    }

    get needsRegistration(): boolean {
        return this.multimedia == null || this.multimedia.length < 2;
    }

    get etherTransactions(): Array<Transaction> {
        let result: Array<Transaction> = [];

        if (this.transactions != null && this.transactions.length > 0) {
            for (let tx of this.transactions) {
                if (tx.type === 'ETH') {
                    result.push(tx);
                }
            }
        }
        return result;
    }

    get isHans(): boolean {
        return this.roles != null && this.roles.length > 0 && this.roles.indexOf('HANS') > -1;
    }

    updateRegistrationDetails(form: UserRegistrationForm): void {
        this.multimedia = form.multimedia;
        this.ethWalletAddress = form.ethWalletAddress;
    }

    addTransaction(tx: Transaction): void {
        let index = -1;
        if (this.transactions == null) {
            this.transactions = [];
        }

        for (let i = 0; i < this.transactions.length; i++) {
            const existing: Transaction = this.transactions[i];
            if (existing.transactionID === tx.transactionID) {
                index = i;
                break;
            }
        }

        if (index > -1) {
            this.transactions.splice(index, 1, tx);
        } else {
            this.transactions.push(tx);
        }
    }

    removeTransaction(index: number): void {
        if (this.transactions == null && this.transactions.length > index) {
            this.transactions.splice(index, 1);
        }
    }

    constructor() {
    }
}
