import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceOperationsComponent } from './invoice-operations.component';

describe('InvoiceOperationsComponent', () => {
  let component: InvoiceOperationsComponent;
  let fixture: ComponentFixture<InvoiceOperationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceOperationsComponent]
    });
    fixture = TestBed.createComponent(InvoiceOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
