/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MomentModule} from 'angular2-moment';
import {TimerComponent} from './timer/timer.component';
import {TranslateModule} from '@ngx-translate/core';
import {ChartModule} from '@progress/kendo-angular-charts';
import {GridModule} from '@progress/kendo-angular-grid';
import {DialogModule} from '@progress/kendo-angular-dialog';
import {CloudinaryModule} from '@cloudinary/angular-5.x';
import 'hammerjs';
import {SuccessBoxComponent} from './success-box/success-box.component';
import {FailureBoxComponent} from './failure-box/failure-box.component';
import {MultimediaManagerComponent} from './multimedia-manager/multimedia-manager.component';
import {MultimediaDivComponent} from './multimedia-div/multimedia-div.component';
import {UploadModule} from '@progress/kendo-angular-upload';
import {ClipboardModule} from 'ngx-clipboard';
import {ButtonsModule} from '@progress/kendo-angular-buttons';
import {TransactionLogComponent} from './transaction-log/transaction-log.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        ReactiveFormsModule,
        MomentModule,
        NgbModule,
        TranslateModule,
        ChartModule,
        GridModule,
        DialogModule,
        CloudinaryModule,
        UploadModule,
        ClipboardModule,
        ButtonsModule
    ],
    declarations: [
        TimerComponent,
        SuccessBoxComponent,
        FailureBoxComponent,
        MultimediaManagerComponent,
        MultimediaDivComponent,
        TransactionLogComponent
    ],
    exports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        MomentModule,
        NgbModule,
        TranslateModule,
        ChartModule,
        GridModule,
        DialogModule,
        CloudinaryModule,
        UploadModule,
        ClipboardModule,
        ButtonsModule,
        TimerComponent,
        SuccessBoxComponent,
        FailureBoxComponent,
        MultimediaManagerComponent,
        MultimediaDivComponent,
        TransactionLogComponent
    ],
    providers: []
})
export class SharedModule {
}
