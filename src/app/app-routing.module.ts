import { RouterModule } from '@angular/router';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                { path: '', redirectTo: 'login', pathMatch: 'full' },

                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    './demo/components/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule),
                        },
                        {
                            path: 'charts',
                            loadChildren: () =>
                                import(
                                    './demo/components/charts/charts.module'
                                ).then((m) => m.ChartsModule),
                        },
                    ],
                },

                {
                    path: 'login',
                    loadChildren: () =>
                        import('./demo/components/login/login.module').then(
                            (m) => m.LoginModule
                        ),
                },

                { path: 'pages/notfound', component: NotfoundComponent },
                { path: '**', redirectTo: 'pages/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
