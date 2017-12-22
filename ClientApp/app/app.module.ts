import { AuthGuardService } from './services/auth-guard.service';
import { AdminComponent } from './components/admin/admin.component';
import { AuthService } from './services/auth.service';
import { PhotoService } from './services/photo.service';
import * as Raven from 'raven-js';
import { AppErrorHandler } from './app.error-handler';
import { VehicleService } from './services/vehicle.service';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, BrowserXhr } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ToastyModule } from 'ng2-toasty';
import { ErrorHandler } from '@angular/core';
import { ChartModule } from 'angular2-chartjs';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { PaginationComponent } from './components/shared/pagination.component';
import { ViewVehicleComponent } from './components/view-vehicle/view-vehicle.component';
import { CallbackComponent } from './components/callback/callback.component';
import { AdminAuthGuardService } from './services/admin-auth-guard.service';
import { AUTH_PROVIDERS } from 'angular2-jwt';

Raven
    .config('https://868256a8c08c4ba688a11e95dd36c925@sentry.io/254887')
    .install();

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        VehicleFormComponent,
        VehicleListComponent,
        PaginationComponent,
        ViewVehicleComponent,
        CallbackComponent,
        AdminComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ChartModule,
        ToastyModule.forRoot(),
        RouterModule.forRoot([
            { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
            { path: 'callback', component: CallbackComponent },
            { path: 'vehicles/new', component: VehicleFormComponent, canActivate: [ AuthGuardService] },
            { path: 'vehicles/edit/:id', component: VehicleFormComponent, canActivate: [ AdminAuthGuardService] },
            { path: 'vehicles/:id', component: ViewVehicleComponent },
            { path: 'vehicles', component: VehicleListComponent },
            { path: 'admin', component: AdminComponent, canActivate: [ AdminAuthGuardService] },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: '**', redirectTo: 'vehicles' }
        ])
    ],
    providers: [
        { provide: ErrorHandler, useClass: AppErrorHandler},
        VehicleService,
        PhotoService,
        AuthService,
        AuthGuardService,
        AdminAuthGuardService,
        AUTH_PROVIDERS
    ]
})
export class AppModuleShared {
}
