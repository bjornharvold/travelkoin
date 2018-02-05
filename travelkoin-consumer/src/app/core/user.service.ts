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

    list(limit: number, approved: boolean, submittedDocuments: boolean, blocked: boolean): Observable<Array<User> | null> {
        return this.afs.collection<User>('users', ref => ref
                .where('approved', '==', approved)
                .where('blocked', '==', blocked)
                .where('submitted', '==', submittedDocuments)
                .orderBy('email')
                .limit(limit))
                .valueChanges().map((users: Array<User>) => UserService.deserializeUsers(users));
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
