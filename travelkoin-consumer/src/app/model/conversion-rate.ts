import {DateService} from '../core/date.service';
import * as moment from 'moment';

export class ConversionRate {
    EUR: number;
    USD: number;
    timestamp: number;

    static serializeObject(cr: ConversionRate): any {
        return {
            EUR: cr.EUR,
            timestamp: cr.timestamp
        };
    }

    static deserializeObject(obj: ConversionRate): ConversionRate {
        const result: ConversionRate = new ConversionRate();

        if (obj != null) {
            result.timestamp = new Date().getTime();

            if (obj.EUR != null) {
                result.EUR = obj.EUR;
            }
            if (obj.USD != null) {
                result.USD = obj.USD;
            }
        }

        return result;
    }

    get needsRefresh(): boolean {
        let result = false;
        // need to check to see if the timestamp is old and needs an update
        const now: moment.Moment = DateService.getInstanceOfNow();
        const then: moment.Moment = DateService.timestampToMoment(this.timestamp);

        // the time is 5 minutes old, we go ahead and return true
        if (DateService.daysDifference(then, now) >= 1) {
            result = true;
        }

        return result;
    }
}
