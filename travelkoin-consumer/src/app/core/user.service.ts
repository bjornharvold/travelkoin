import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {User} from '../model/user';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {
    private userCollection: AngularFirestoreCollection<User>;

    /**
     *
     * @param {string} id
     * @returns {AngularFirestoreDocument<User>}
     */
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
