import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderResponse } from 'src/app/classes/OrderResponse';
import { OrderService } from 'src/app/services/order.service';
import { StackService } from 'src/app/services/stack.service';
import jwt_decode from 'jwt-decode';
import { StackResponse } from 'src/app/classes/StackResponse';

@Component({
  selector: 'app-stack-operations',
  templateUrl: './stack-operations.component.html',
  styleUrls: ['./stack-operations.component.css']
})
export class StackOperationsComponent {
  approvedOrders: OrderResponse[] = [];
  selectedOrderId: number = 0;
  userRole: string = '';
  stacks: StackResponse[] = [];

  constructor(private orderService: OrderService, private stackService: StackService, private toastr: ToastrService) { }

  ngOnInit() {
    this.orderService.getAllApproved().subscribe((orders) => {
      this.approvedOrders = orders;
    });
    let decodedJWT : any = jwt_decode(localStorage.getItem("jwt") ?? '')
    if (decodedJWT != '') {
      this.userRole = decodedJWT.role;
    }
    this.stackService.getAll().subscribe((stacks) => {
      this.stacks = stacks;
    });
  }

  checkOrder() {
    if (this.selectedOrderId == 0)
      return true;
    return false;
  }

  create() {
    this.stackService.create(this.selectedOrderId).subscribe({
      next: (res) => {
        this.stacks.push(...res);
        console.log(this.stacks);
        this.showSuccess();
    },
    error: (e) => this.showError(e.error.message)
  });
}

showSuccess() {
  this.toastr.success('Successfully created stacks', 'Stack creation');
}
showError(error: string) {
  this.toastr.error(error, 'Stack creation');
}

}
