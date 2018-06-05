import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {from as observableFrom, Observable} from 'rxjs';
import {ConversionRate} from '../model/conversion-rate';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {map} from 'rxjs/operators';

const ENDPOINT: string = 'https://min-api.cryptocompare.com';

@Injectable({providedIn: 'root'})
export class ConversionService {
    private conversionRateCollection: AngularFirestoreCollection<ConversionRate>;

    get(id: string): Observable<ConversionRate | null> {
        return this.conversionRateCollection.doc(id).valueChanges().pipe(
            map((cr: ConversionRate) => cr != null ? ConversionRate.deserializeObject(cr) : null));
    }

    set(uid: string, doc: ConversionRate): Observable<void> {
        return observableFrom(this.conversionRateCollection.doc(uid).set(ConversionRate.serializeObject(doc)));
    }

    loadExchangeRate(crypto: string, currency: string): Observable<ConversionRate | null> {
        const params: HttpParams = new HttpParams()
            .set('fsym', crypto)
            .set('tsyms', currency);

        return this.httpClient.get<ConversionRate>(`${ENDPOINT}/data/price`, {params: params}).pipe(
            map((cr: ConversionRate) => cr != null ? ConversionRate.deserializeObject(cr) : null));
    }

    constructor(private readonly afs: AngularFirestore,
                private httpClient: HttpClient) {
        this.conversionRateCollection = afs.collection<ConversionRate>('rates');
    }

}
