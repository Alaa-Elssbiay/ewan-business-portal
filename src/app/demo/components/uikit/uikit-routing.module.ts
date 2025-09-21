import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule) },
    ])],
    exports: [RouterModule]
})
export class UikitRoutingModule { }
