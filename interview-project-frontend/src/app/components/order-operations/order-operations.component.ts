import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ItemResponse } from 'src/app/classes/ItemResponse';
import { OrderCreation } from 'src/app/classes/OrderCreation';
import { OrderLine } from 'src/app/classes/OrderLine';
import { OrderResponse } from 'src/app/classes/OrderResponse';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';
import jwt_decode from 'jwt-decode';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-order-operations',
  templateUrl: './order-operations.component.html',
  styleUrls: ['./order-operations.component.css']
})
export class OrderOperationsComponent {
  total_amount: number = 0;
  selectedItem: string = '';
  items: ItemResponse[] = [];
  orderLines: OrderLine[] = [];
  oname: string = '';
  orders: OrderResponse[] = [];
  userRole: string = '';
  userId: number = 0;

  constructor(private orderService: OrderService, private itemService: ItemService, private toastr: ToastrService) { }

  ngOnInit() {
    this.itemService.getAll().subscribe((items) => {
      this.items = items;
    });
    let decodedJWT : any = jwt_decode(localStorage.getItem("jwt") ?? '')
    if (decodedJWT != '') {
      this.userRole = decodedJWT.role;
      this.userId = decodedJWT.user_id;
    }
    if (this.userRole === 'admin'){
      this.orderService.getAll().subscribe((orders) => {
        this.orders = orders;
        this.convertGroupsArrayToString(this.orders);
      });
    }
    else{
      this.orderService.getByUser(this.userId).subscribe((orders) => {
        this.orders = orders;
        this.convertGroupsArrayToString(this.orders);
      });
    }
  }

  convertGroupsArrayToString(orders: OrderResponse[]) {
    orders.forEach((order) => {
      order.groups_string = order.groups.map((group) => group.item.name + ' x' + group.total_amount).join(', ');
    });
  }

  checkOrderLine(){
    if (this.total_amount <= 0 || this.selectedItem == '')
      return true
    return false
  }

  add() {
    if (this.orderLines.find((li) => li.item_name === this.selectedItem)){ 
      this.showAddingError();
      return;
    }
    let orderLine : OrderLine = { total_amount: this.total_amount, item_name: this.selectedItem};
    this.orderLines.push(orderLine);
    this.total_amount = 0;
    this.selectedItem = '';
  }

  remove(line: OrderLine) {
    let lineIndex = this.orderLines.findIndex((li) => li.item_name === line.item_name)
    this.orderLines.splice(lineIndex, 1)
  }

  showAddingError() {
    this.toastr.error("Item already added.", 'Adding item to order');
  }

  checkOrder() {
    if (this.oname == '' || this.orderLines.length == 0)
      return true;
    return false
  }

  create() {
    let order : OrderCreation = { name: this.oname, groups: this.orderLines}
    this.orderService.create(order).subscribe({
      next: (res) => {
        this.oname = '';
        this.orderLines = [];
        this.orders.push(res);
        this.convertGroupsArrayToString(this.orders)
        this.showSuccess();
      },
      error: (e) => this.showError(e.error.message)
    });
  }

  showSuccess() {
    this.toastr.success('Successfully created order', 'Order creation');
  }
  showError(error: string) {
    this.toastr.error(error, 'Order creation');
  }

  checkUserId(order: OrderResponse) {
    if (this.userId == order.user.id)
      return true;
    return false;
  }

  delete(order: OrderResponse) {
    this.orderService.delete(order.id).subscribe({
      next: () => {
        let orderIndex = this.orders.findIndex((o) => o.id === order.id);
        this.orders.splice(orderIndex, 1);
        this.showDeleteSuccess();
        },
      error: (e) => this.showDeleteError(e.error.message)
    })
  }

  showDeleteSuccess() {
    this.toastr.success('Successfully canceled order', 'Order cancellation');
  }
  showDeleteError(error: string) {
    this.toastr.error(error, 'Order cancellation');
  }

  accept(order: OrderResponse) {
    this.orderService.accept(order.id).subscribe({
      next: () => {
        order.status = 'approved';
        },
      error: (e) => this.showReviewError(e.error.message)
    })
  }

  reject(order: OrderResponse) {
    this.orderService.reject(order.id).subscribe({
      next: () => {
        order.status = 'denied';
        },
      error: (e) => this.showReviewError(e.error.message)
    })
  }

  showReviewError(error: string) {
    this.toastr.error(error, 'Order review');
  }

  createPDF(order: OrderResponse) {
    this.orderService.createPDF(order.id).subscribe({
      next: (res) => { 
        var blob = new Blob([res], { type: 'application/pdf' });
            saveAs(blob, 'order.pdf');
      },
      error: (e) => this.showReviewError(e.error.message)
    })
  }

  getClassForValue(status: string) {
    switch (status) {
      case 'approved':
        return 'classApproved';
      case 'denied':
        return 'classDenied';
      default:
        return '';
    }
  }
}
