import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {User} from '../model/user';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {
    private userCollection: AngularFirestoreCollection<User>;

    private static deserializeUsers(users: Array<User>): Array<User> {
        const result: Array<User> = [];
        if (users != null && users.length > 0) {
            for (const user of users) {
                result.push(User.deserializeObject(user))
            }
        }
        return result;
    }

    private list(approved: boolean, submittedDocuments: boolean, blocked: boolean, whitelisted: boolean): Observable<Array<User> | null> {
        return this.afs.collection<User>('users', ref => ref
            .where('approved', '==', approved)
            .where('blocked', '==', blocked)
            .where('submitted', '==', submittedDocuments)
            .where('whitelisted', '==', whitelisted)
            .orderBy('email'))
            .valueChanges().map((users: Array<User>) => UserService.deserializeUsers(users));
    }

    toggleBlockUser(user: User): void {
        user.blocked = !user.blocked;
        this.update(user.uid, user);
    }

    approveUser(user: User): Observable<void> {
        user.approved = true;
        return this.update(user.uid, user);
    }

    listWhitelisted(): Observable<Array<User> | null> {
        return this.list(true, true, false, true);
    }

    listApproved(): Observable<Array<User> | null> {
        return this.list(true, true, false, false);
    }

    listRegistered(): Observable<Array<User> | null> {
        return this.list(false, true, false, false);
    }

    listBlocked(): Observable<Array<User> | null> {
        return this.list(true, true, false, false);
    }

    get(id: string): Observable<User | null> {
        return id != null ? this.userCollection.doc(id).valueChanges().map((user: User) => user != null ? User.deserializeObject(user) : null) : Observable.of(null);
    }

    update(uid: string, user: User): Observable<void> {
        return Observable.fromPromise(this.userCollection.doc(uid).update(User.serializeObjectToPartialUser(user)));
    }

    set(uid: string, user: User): Observable<void> {
        return Observable.fromPromise(this.userCollection.doc(uid).set(User.serializeNewUser(user)));
    }

    constructor(private readonly afs: AngularFirestore) {
        this.userCollection = afs.collection<User>('users');
    }

}
