import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { SessionComponent } from './components/session/session.component';
import { UserOperationsComponent } from './components/user-operations/user-operations.component';
import { ItemOperationsComponent } from './components/item-operations/item-operations.component';
import { OrderOperationsComponent } from './components/order-operations/order-operations.component';
import { InvoiceOperationsComponent } from './components/invoice-operations/invoice-operations.component';
import { StackOperationsComponent } from './components/stack-operations/stack-operations.component';


const routes: Routes = [
  { path: 'registration', component: RegistrationComponent },
  { path: 'session', component: SessionComponent },
  { path: 'user-operations', component: UserOperationsComponent },
  { path: 'item-operations', component: ItemOperationsComponent },
  { path: 'order-operations', component: OrderOperationsComponent },
  { path: 'invoice-operations', component: InvoiceOperationsComponent },
  { path: 'stack-operations', component: StackOperationsComponent }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
