import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {TimeSerie} from '../model/time-serie';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';
import DocumentReference = firebase.firestore.DocumentReference;
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class TimeSeriesService {
    private timeSeriesCollection: AngularFirestoreCollection<TimeSerie>;

    query(symbol: string): Observable<Array<TimeSerie> | null> {
        return this.afs.collection<TimeSerie>('timeseries', ref => ref
            .where('symbol', '==', symbol)
            .where('production', '==', environment.production)
            .orderBy('date'))
            .valueChanges();
    }

    add(doc: TimeSerie): Observable<DocumentReference> {
        return Observable.fromPromise(this.timeSeriesCollection.add(doc));
    }

    constructor(private readonly afs: AngularFirestore) {
        this.timeSeriesCollection = afs.collection<TimeSerie>('timeseries');
    }

}
