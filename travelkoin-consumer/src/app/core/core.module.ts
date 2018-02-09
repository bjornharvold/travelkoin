import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PromptUpdateService} from './prompt-update.service';
import {LogUpdateService} from './log-update.service';
import {CheckForUpdateService} from './check-for-update.service';
import {AuthenticationHttpInterceptorService} from './authentication-http-interceptor.service';
import {AuthenticationTokenService} from './authentication-token.service';
import {DateService} from './date.service';
import {MediaTypeHttpInterceptorService} from './media-type-http-interceptor.service';
import {ServerErrorHttpInterceptorService} from './server-error-http-interceptor.service';
import {ServerHeartBeatService} from './server-heart-beat.service';
import {TimezoneOffsetHttpInterceptorService} from './timezone-offset-http-interceptor.service';
import {UserSessionService} from './user-session.service';
import {BitcoinService} from './bitcoin.service';
import {UserService} from './user.service';
import {CloudinaryService} from './cloudinary.service';
import {AuthenticatedGuard} from './authenticated.guard';
import {RegisteredGuard} from './registered.guard';
import {EthereumService} from './ethereum.service';
import {ConversionService} from './conversion.service';
import {TimeSeriesService} from './time-series.service';
import {Web3Service} from './web3.service';
import {HansGuard} from './hans.guard';
import {WindowRefService} from './window-ref.service';
import {TokenContractService} from './token-contract.service';

// import {Web3Service} from './web3.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    providers: [
        CheckForUpdateService,
        LogUpdateService,
        PromptUpdateService,
        AuthenticationHttpInterceptorService,
        AuthenticationTokenService,
        DateService,
        MediaTypeHttpInterceptorService,
        ServerErrorHttpInterceptorService,
        ServerHeartBeatService,
        TimezoneOffsetHttpInterceptorService,
        UserSessionService,
        BitcoinService,
        EthereumService,
        UserService,
        CloudinaryService,
        AuthenticatedGuard,
        RegisteredGuard,
        HansGuard,
        ConversionService,
        TimeSeriesService,
        Web3Service,
        WindowRefService,
        TokenContractService
    ]
})
export class CoreModule {
}
