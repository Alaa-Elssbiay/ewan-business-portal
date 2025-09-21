import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { DashboardService } from 'src/app/layout/service/customer-balance.service';

@Component({
    selector: 'app-table-demo',
    templateUrl: './dashboard.component.html',
    styles: [
        `
            :host ::ng-deep .p-frozen-column {
                font-weight: bold;
            }

            :host ::ng-deep .p-datatable-frozen-tbody {
                font-weight: bold;
            }

            :host ::ng-deep .p-progressbar {
                height: 0.5rem;
            }
        `,
    ],
    standalone: false
})
export class DashboardComponent implements OnInit {
    customerBalance: any = {};
    creditItems: any[] = [];
    debitItems: any[] = [];
    loading: boolean = true;

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.dashboardService.getDashboardData(true).subscribe((res) => {
            if (res.IsSuccess) {
                const data = res.Data.CustomerBalanceVM;
                this.customerBalance = {
                    Name: data.Name,
                    Code: data.Code,
                    DebitBalance: data.DebitBalance,
                    CreditBalance: data.CreditBalance,
                    CurrentBalance: data.CurrentBalance,
                    TotalBalance: data.TotalBalance,
                };
                this.creditItems = res.Data.CreditGridItemsVM;
                this.debitItems = res.Data.DebitGridItemsVM;
            }
            this.loading = false;
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    clear(table: Table) {
        table.clear();
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    }
}
