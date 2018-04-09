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
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faEnvelope} from '@fortawesome/pro-regular-svg-icons/faEnvelope';
import {faUnlockAlt} from '@fortawesome/pro-regular-svg-icons/faUnlockAlt';
import {faExternalLinkSquare} from '@fortawesome/pro-regular-svg-icons/faExternalLinkSquare';
import {faPhoneSquare} from '@fortawesome/pro-regular-svg-icons/faPhoneSquare';
import {faUsers} from '@fortawesome/pro-regular-svg-icons/faUsers';
import {faSpinner} from '@fortawesome/pro-regular-svg-icons/faSpinner';
import {faHome} from '@fortawesome/pro-regular-svg-icons/faHome';
import {faAngleRight} from '@fortawesome/pro-regular-svg-icons/faAngleRight';
import {faEthereum} from '@fortawesome/free-brands-svg-icons/faEthereum';
import {faLanguage} from '@fortawesome/pro-regular-svg-icons/faLanguage';
import {faMoneyBill} from '@fortawesome/pro-regular-svg-icons/faMoneyBill';
import {faImage} from '@fortawesome/pro-regular-svg-icons/faImage';
import {faExchange} from '@fortawesome/pro-regular-svg-icons/faExchange';
import {faTrophyAlt} from '@fortawesome/pro-regular-svg-icons/faTrophyAlt';
import {faSuperscript} from '@fortawesome/pro-regular-svg-icons/faSuperscript';
import {faExclamation} from '@fortawesome/pro-regular-svg-icons/faExclamation';
import {faChartLine} from '@fortawesome/pro-regular-svg-icons/faChartLine';
import {faFile} from '@fortawesome/pro-regular-svg-icons/faFile';
import {faTelegramPlane} from '@fortawesome/free-brands-svg-icons/faTelegramPlane';
import {faTwitter} from '@fortawesome/free-brands-svg-icons/faTwitter';

library.add(
    faEnvelope,
    faUnlockAlt,
    faFile,
    faTelegramPlane,
    faTwitter,
    faExternalLinkSquare,
    faPhoneSquare,
    faUsers,
    faSpinner,
    faHome,
    faAngleRight,
    faEthereum,
    faLanguage,
    faMoneyBill,
    faImage,
    faExchange,
    faTrophyAlt,
    faSuperscript,
    faExclamation,
    faChartLine
);

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
        ButtonsModule,
        FontAwesomeModule
    ],
    declarations: [
        TimerComponent,
        SuccessBoxComponent,
        FailureBoxComponent,
        MultimediaManagerComponent,
        MultimediaDivComponent
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
        FontAwesomeModule
    ],
    providers: []
})
export class SharedModule {
}
