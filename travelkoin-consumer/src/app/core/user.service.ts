import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {User} from '../model/user';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {
    private userCollection: AngularFirestoreCollection<User>;

    // /**
    //  * Creates a private key and a Segwit public key
    //  * TODO move this to Functions
    //  * @param {User} user
    //  */
    // private createBitcoinPrivateKeyAndAddress(user: User): void {
    //     if (user.btcPublicKey == null && user.btcWIF == null) {
    //         // generate new btc key pair
    //         const pair: ECPair = this.btcService.createKey();
    //         const pubKey: Buffer = pair.getPublicKeyBuffer();
    //         const scriptPubKey = script.witnessPubKeyHash.output.encode(crypto.hash160(pubKey));
    //
    //         // update user data
    //         user.btcWIF = pair.toWIF();
    //         user.btcPublicKey = address.fromOutputScript(scriptPubKey).toString();
    //     }
    // }

    /**
     *
     * @param {string} id
     * @returns {AngularFirestoreDocument<User>}
     */
    get(id: string): Observable<User | null> {
        return id != null ? this.userCollection.doc(id).valueChanges().map((user: User) => User.deserializeObject(user)) : Observable.of(null);
    }

    update(uid: string, user: Partial<User>): Observable<void> {
        return Observable.fromPromise(this.userCollection.doc(uid).update(user));
    }

    set(uid: string, user: User): Observable<void> {
        // create addresses for the first time
        // this.createBitcoinPrivateKeyAndAddress(user);

        return Observable.fromPromise(this.userCollection.doc(uid).set(user));
    }

    constructor(private readonly afs: AngularFirestore) {
        this.userCollection = afs.collection<User>('users');
    }

}
