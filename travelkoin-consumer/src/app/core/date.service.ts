/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { BigNumber } from "bignumber.js";
const SERVER_FRIENDLY_DATE_FORMAT = 'YYYY-MM-DD';
const DATE_FORMAT = 'x';
const UTC_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

@Injectable()
export class DateService {

    /**
     * Returns a moment of now
     * @returns {moment.Moment}
     */
    static getInstanceOfNow(): moment.Moment {
        return moment();
    }

    /**
     * Converts a string to a moment.Moment object.
     * @param date
     * @returns {moment.Moment}
     */
    static timestampStringToMoment(date: string): moment.Moment {
        return moment(date, DATE_FORMAT);
    }

    static timestampToMoment(date: number): moment.Moment {
        return DateService.timestampStringToMoment('' + date);
    }

    /**
     * Converts a string to a moment.Moment object.
     * @param date
     * @returns {moment.Moment}
     */
    static stringFromServerToMoment(date: string): moment.Moment {
        return moment(date, SERVER_FRIENDLY_DATE_FORMAT);
    }

    /**
     * Converts a string to a moment.Moment object.
     * @param date
     * @returns {moment.Moment}
     */
    static utcToMoment(date: string): moment.Moment {
        return moment(date, UTC_DATE_FORMAT);
    }

    /**
     * Converts a NgbDateStruct to a moment.Moment object.
     * Note that we take into consideration that momentjs uses 0-based months and NgbDateStruct does not.
     * @param date
     * @returns {moment.Moment}
     */
    static dateStructToMoment(date: NgbDateStruct): moment.Moment {
        return moment({year: date.year, month: date.month - 1, day: date.day});
    }

    /**
     * Converts a Javascript Date object to a moment
     * @param date
     * @returns {moment.Moment}
     */
    static dateToMoment(date: Date): moment.Moment {
        return moment(date);
    }

    /**
     * Returns a timestamp of date without time in milliseconds
     * @returns {number}
     */
    static datestampOfNow(): number {
        return moment().hours(0).minutes(0).seconds(0).millisecond();
    }

    /**
     * Returns a timestamp in milliseconds
     * @returns {number}
     */
    static timestampOfNow(): number {
        return moment().millisecond();
    }

    /**
     * Converts a moment to Date object
     * @param {moment.Moment} aMoment
     * @returns {Date}
     */
    static momentToDate(aMoment: moment.Moment): Date {
        return aMoment.toDate();
    }

    static momentToDateStruct(aMoment: moment.Moment): NgbDateStruct {

        return {
            year: aMoment.year(),
            month: aMoment.month() + 1,
            day: aMoment.date()
        };
    }

    /**
     * Generates a NgbDateStruct based on today's date plus adds a specified number of days into the future
     * @param daysInTheFuture
     * @returns {{year: number, month: number, day: number}}
     */
    static generateDateStructOfNowAndAddDays(daysInTheFuture: number): NgbDateStruct {
        return DateService.momentToDateStruct(DateService.addDaysToMoment(DateService.getInstanceOfNow(), daysInTheFuture));
    }

    /**
     * Generates a NgbDateStruct based on today's date plus adds a specified number of days into the future
     * @param daysInTheFuture
     * @returns {{year: number, month: number, day: number}}
     */
    static generateMomentOfNowAndAddDays(daysInTheFuture: number): moment.Moment {
        return DateService.addDaysToMoment(DateService.getInstanceOfNow(), daysInTheFuture);
    }

    /**
     * Generates a NgbDateStruct based on a moment plus adds a specified number of days into the future
     * @param moment
     * @param daysInTheFuture
     * @returns {{year: number, month: number, day: number}}
     */
    static momentToDateStructAndAddDays(thisMoment: moment.Moment, daysInTheFuture: number): NgbDateStruct {
        return DateService.momentToDateStruct(DateService.addDaysToMoment(thisMoment, daysInTheFuture));
    }

    /**
     * Returns how many days there are between start and end moments
     * @param start
     * @param end
     * @returns {number}
     */
    static daysDifference(start: moment.Moment, end: moment.Moment): number {
        return end.diff(start, 'days');
    }

    /**
     * Returns how many minutes there are between start and end moments
     * @param start
     * @param end
     * @returns {number}
     */
    static minutesDifference(start: moment.Moment, end: moment.Moment): number {
        return end.diff(start, 'minutes');
    }

    /**
     * Returns how many days there are between start and end moments
     * @param start
     * @param end
     * @returns {number}
     */
    static hoursDifference(start: moment.Moment, end: moment.Moment): number {
        return end.diff(start, 'hours');
    }

    /**
     * Creates a string for a moment using our global date format
     * @param moment
     * @returns {string}
     */
    static momentToString(thisMoment: moment.Moment): string {
        return thisMoment.format(DATE_FORMAT);
    }

    /**
     * Creates a string for a moment using what can convert to Java's LocalDate object
     * @param moment
     * @returns {string}
     */
    static momentToServerFriendlyString(thisMoment: moment.Moment): string {
        return thisMoment.format(SERVER_FRIENDLY_DATE_FORMAT);
    }

    /**
     * Checks to see if the specified moment is not today.
     * @param aMoment
     * @returns {boolean}
     */
    static isAfterToday(aMoment: moment.Moment): boolean {
        return DateService.getInstanceOfNow().isBefore(aMoment);
    }

    /**
     * Checls to see if the specified moment does not go past the max limit in days from today's date
     * @param aMoment
     * @param maxFutureDaysLimit
     * @returns {boolean}
     */
    static isBeforeDaysInTheFuture(aMoment: moment.Moment, maxFutureDaysLimit: number): boolean {
        return DateService.daysDifference(DateService.getInstanceOfNow(), aMoment) < maxFutureDaysLimit;
    }

    /**
     * Subtracts some days from moment
     * @param aMoment
     * @param daysToSubtract
     * @returns {Moment}
     */
    static subtractDaysFromMoment(aMoment: moment.Moment, daysToSubtract: number): moment.Moment {
        return moment(aMoment).subtract(daysToSubtract, 'days');
    }

    /**
     * Uses the moment object to add days to specified moment
     * @param aMoment
     * @param daysToAdd
     * @returns {Moment}
     */
    static addDaysToMoment(aMoment: moment.Moment, daysToAdd: number): moment.Moment {
        return moment(aMoment).add(daysToAdd, 'days');
    }

    static isSame(moment1: moment.Moment, moment2: moment.Moment): boolean {
        let result = false;

        if (moment1 && moment2) {
            result = moment1.isSame(moment2, 'day');
        }

        return result;
    }

    static isBefore(moment1: moment.Moment, moment2: moment.Moment): boolean {
        let result = false;

        if (moment1 && moment2) {
            result = moment1.isBefore(moment2, 'day');
        }

        return result;
    }

    static isAfter(moment1: moment.Moment, moment2: moment.Moment): boolean {
        let result = false;

        if (moment1 && moment2) {
            result = moment1.isAfter(moment2, 'day');
        }

        return result;
    }

    static isSameOrBefore(moment1: moment.Moment, moment2: moment.Moment): boolean {
        let result = false;

        if (moment1 && moment2) {
            result = moment1.isSameOrBefore(moment2, 'day');
        }

        return result;
    }

    static isSameOrAfter(moment1: moment.Moment, moment2: moment.Moment): boolean {
        let result = false;

        if (moment1 && moment2) {
            result = moment1.isSameOrAfter(moment2, 'day');
        }

        return result;
    }

    static bigNumberToMoment(startTime: BigNumber) {
        return moment.unix(startTime.toNumber());
    }

    constructor() {
    }
}
