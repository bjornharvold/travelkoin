import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {TermsComponent} from './terms/terms.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'privacy',
        component: PrivacyComponent
    },
    {
        path: 'terms',
        component: TermsComponent
    },
    {
        path: 'auth',
        loadChildren: './auth/auth.module#AuthModule'
    },
    {
        path: 'secure',
        loadChildren: './secure/secure.module#SecureModule'
    },
    {
        path: 'hans',
        loadChildren: './hans/hans.module#HansModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule {
}