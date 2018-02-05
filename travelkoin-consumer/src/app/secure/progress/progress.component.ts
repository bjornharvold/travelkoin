import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConversionService} from '../../core/conversion.service';
import {BitcoinService} from '../../core/bitcoin.service';
import {EthereumService} from '../../core/ethereum.service';
import {environment} from '../../../environments/environment';
import {ConversionRate} from '../../model/conversion-rate';
import {Wallet} from '../../model/wallet';
import {TimeSeriesService} from '../../core/time-series.service';
import {TimeSerie} from '../../model/time-serie';
import * as firebase from 'firebase';
import {DateService} from '../../core/date.service';
import * as moment from 'moment';
import {Observable} from 'rxjs/Observable';
import DocumentReference = firebase.firestore.DocumentReference;

const CURRENCY_CODE: string = 'EUR';
const ETH_SYMBOL: string = 'ETH';

@Component({
    selector: 'app-secure-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnDestroy {
    private alive = true;
    private ethWallet: Wallet = null;
    private ethTimeSeries: Array<number> = [];
    private totalTimeSeries: Array<number> = [];

    series: any[] = [{
        name: 'ETH',
        data: this.ethTimeSeries
    }];
    categories: string[] = [];


    private static calculateSumForTimeSeriesValue(ary: Array<Array<TimeSerie>>, index: number): number {
        let result: number = 0;

        for (let series of ary) {
            result += series[index].value;
        }

        return result;
    }

    /**
     * Creates a new record in Firestore
     * @param {TimeSerie} ts
     */
    private addTimeSeriesDate(ts: TimeSerie): void {
        this.timeseriesService.add(ts)
            .takeWhile(() => this.alive)
            .subscribe((ref: DocumentReference) => {
                    // console.log(ref);
                },
                error => console.error(`something went wrong when trying to save time series data: ${error}`)
            );
    }

    /**
     * Loads up Ethereum wallet's latest balance and adds the current value in Euro
     * @param {ConversionRate} cr
     * @param timestamp
     */
    private loadEthereumWalletAndCreateTimeSeries(cr: ConversionRate, timestamp: number): void {
        this.ethereumService.loadAddress(environment.ethWalletAddress)
            .takeWhile(() => this.alive)
            .subscribe((wallet: Wallet) => {
                    if (wallet != null) {
                        this.ethWallet = wallet;
                        const date: number = timestamp;
                        const amount: number = this.ethWallet.walletBalance;
                        const value: number = amount * cr.EUR;

                        const ts: TimeSerie = {
                            date: date,
                            production: environment.production,
                            amount: amount,
                            value: value,
                            symbol: ETH_SYMBOL,
                            currency: CURRENCY_CODE
                        };

                        this.addTimeSeriesDate(ts);
                    }
                },
                error => console.error(`something went wrong when trying to load eth wallet: ${error.error}`)
            );
    }

    /**
     * Updates conversion rate in Firestore
     * @param {string} symbol
     * @param {ConversionRate} cr
     */
    private updateConversionRate(symbol: string, cr: ConversionRate): void {
        // save it
        this.conversionService.set(symbol, cr)
            .takeWhile(() => this.alive)
            .subscribe(() => console.log('Rate set successfully'));
    }

    /**
     * we need to load the balance of our eth wallet - we then need to convert that to EUR and display
     */
    private loadConversionRateAndEthereumWallet(timestamp: number): void {

        this.conversionService.get(ETH_SYMBOL)
            .takeWhile(() => this.alive)
            .subscribe((cr: ConversionRate) => {
                    if (cr == null || cr.needsRefresh) {

                        // the conversion rate we have on file ALSO needs a refresh
                        this.conversionService.loadExchangeRate(ETH_SYMBOL, CURRENCY_CODE)
                            .takeWhile(() => this.alive)
                            .subscribe((cr2: ConversionRate) => {
                                    this.updateConversionRate(ETH_SYMBOL, cr2);
                                    this.loadEthereumWalletAndCreateTimeSeries(cr2, timestamp);
                                },
                                error => console.log(`something went wrong when trying to load conversion rates for eth: ${error}`)
                            )
                    }
                },
                error => console.log(`something went wrong when trying to load conversion rates for eth: ${error}`)
            );
    }

    /**
     * Grabs all the timestamps and displays readable dates of them
     * @param {Array<TimeSerie>} ary
     */
    private loadCategories(ary: Array<TimeSerie>): void {
        this.categories = [];

        if (ary != null && ary.length > 0) {

            for (const ts of ary) {
                const timestamp: moment.Moment = DateService.timestampToMoment(ts.date);
                this.categories.push(timestamp.format('MMM. D, HH:mm'));
            }
        }
    }

    /**
     * Loads the current deposits for this symbol
     * @param {string} symbol
     * @param {Array<TimeSerie>} ary
     */
    private renderTimeSeriesForSymbol(symbol: string, ary: Array<TimeSerie>): void {
        for (let serie of this.series) {
            if (serie.name === symbol) {
                if (ary != null && ary.length > 0) {
                    serie.data.length = 0;
                    for (const ts of ary) {
                        serie.data.push(ts.value);
                    }
                }
                break;
            }
        }
    }

    /**
     * Render goal: btc + eth value together
     * @param {Array<Array<TimeSerie>>} ary
     */
    private renderTimeSeriesForTotal(ary: Array<Array<TimeSerie>>): void {
        this.totalTimeSeries.length = 0;

        if (ary != null && ary.length > 0) {
            const series: Array<TimeSerie> = ary[0];
            for (let i = 0; i < series.length; i++) {
                this.totalTimeSeries.push(ProgressComponent.calculateSumForTimeSeriesValue(ary, i));
            }
        }
    }

    private loadTimeSeries(): void {
        const ethTimeSeries: Observable<Array<TimeSerie>> = this.timeseriesService.query(ETH_SYMBOL);

        // load up and combine two time series
        Observable.zip(...[ethTimeSeries])
            .takeWhile(() => this.alive)
            .subscribe((ary: Array<Array<TimeSerie>>) => {
                if (ary != null && ary.length > 0) {
                    for (let i = 0; i < ary.length; i++) {
                        const series: Array<TimeSerie> = ary[i];
                        if (series.length > 0) {
                            if (i === 0) {
                                // load categories
                                this.loadCategories(series);
                            }

                            this.renderTimeSeriesForSymbol(series[0].symbol, series);
                        }
                    }

                    // finally load the total
                    this.renderTimeSeriesForTotal(ary);
                }
            });
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        const timestamp: number = new Date().getTime();
        this.loadConversionRateAndEthereumWallet(timestamp);

        this.loadTimeSeries();
    }

    constructor(private timeseriesService: TimeSeriesService,
                private conversionService: ConversionService,
                private bitcoinService: BitcoinService,
                private ethereumService: EthereumService) {
    }
}
