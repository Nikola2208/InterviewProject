import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GroupMain } from 'src/app/classes/GroupMain';
import { InvoiceCreation } from 'src/app/classes/InvoiceCreation';
import { OrderResponse } from 'src/app/classes/OrderResponse';
import { InvoiceService } from 'src/app/services/invoice.service';
import { OrderService } from 'src/app/services/order.service';
import jwt_decode from 'jwt-decode';
import { InvoiceResponse } from 'src/app/classes/InvoiceResponse';

@Component({
  selector: 'app-invoice-operations',
  templateUrl: './invoice-operations.component.html',
  styleUrls: ['./invoice-operations.component.css']
})
export class InvoiceOperationsComponent {
  approvedOrders: OrderResponse[] = [];
  selectedOrderId: number = 0;
  orderLines: GroupMain[] = [];
  selectedLines: string[] = [];
  userId: number = 0;
  userRole: string = '';
  invoices: InvoiceResponse[] = [];

  constructor(private orderService: OrderService, private invoiceService: InvoiceService, private toastr: ToastrService) { }

  ngOnInit() {
    this.orderService.getAllApproved().subscribe((orders) => {
      this.approvedOrders = orders;
    });
    let decodedJWT : any = jwt_decode(localStorage.getItem("jwt") ?? '')
    if (decodedJWT != '') {
      this.userRole = decodedJWT.role;
      this.userId = decodedJWT.user_id;
    }
    if (this.userRole === 'admin'){
      this.invoiceService.getAll().subscribe((invoices) => {
        this.invoices = invoices;
        this.convertInvoiceGroupsArrayToString(this.invoices);
      });
    }
    else{
      this.invoiceService.getByUser(this.userId).subscribe((invoices) => {
        this.invoices = invoices;
        this.convertInvoiceGroupsArrayToString(this.invoices);
      });
    }
  }

  convertInvoiceGroupsArrayToString(invoices: InvoiceResponse[]) {
    invoices.forEach((invoice) => {
      invoice.invoice_groups_string = invoice.invoice_groups.map((group) => group.item.name + ' x' + group.total_amount).join(', ');
    });
  }

  selectOrder() {
    this.orderLines = this.approvedOrders.filter((order) => order.id == this.selectedOrderId)[0].groups;
    this.selectedLines = [];
  }

  checkInvoice() {
    if (this.selectedLines.length == 0)
      return true;
    return false;
  }

  create(){
    let invoice: InvoiceCreation = { name: 'Invoice_order ' + this.selectedOrderId + '_date ' + new Date().toLocaleString('en-US'), item_names: this.selectedLines};
    this.invoiceService.create(invoice, this.selectedOrderId).subscribe({
      next: (res) => {
        this.invoices.push(res);
        this.convertInvoiceGroupsArrayToString(this.invoices);
        this.showSuccess();
    },
    error: (e) => this.showError(e.error.message)
  });
}

showSuccess() {
  this.toastr.success('Successfully created invoice', 'Invoice creation');
}
showError(error: string) {
  this.toastr.error(error, 'Invoice creation');
}

delete(invoiceId: number) {
  this.invoiceService.delete(invoiceId).subscribe({
    next: () => {
      let invoiceIndex = this.invoices.findIndex((i) => i.id === invoiceId);
      this.invoices.splice(invoiceIndex, 1);
      this.showDeleteSuccess();
      },
    error: (e) => this.showDeleteError(e.error.message)
  });
}

showDeleteSuccess() {
  this.toastr.success('Successfully deleted invoice', 'Invoice deletion');
}
showDeleteError(error: string) {
  this.toastr.error(error, 'Invoice deletion');
}

}
