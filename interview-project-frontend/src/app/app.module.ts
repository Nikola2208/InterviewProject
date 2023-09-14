import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SessionComponent } from './components/session/session.component';
import { TokenInterceptor } from './interceptor/TokenInterceptor';
import { UserOperationsComponent } from './components/user-operations/user-operations.component';
import { ItemOperationsComponent } from './components/item-operations/item-operations.component';
import { OrderOperationsComponent } from './components/order-operations/order-operations.component';
import { InvoiceOperationsComponent } from './components/invoice-operations/invoice-operations.component';
import { StackOperationsComponent } from './components/stack-operations/stack-operations.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    RegistrationComponent,
    SessionComponent,
    UserOperationsComponent,
    ItemOperationsComponent,
    OrderOperationsComponent,
    InvoiceOperationsComponent,
    StackOperationsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right'
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
