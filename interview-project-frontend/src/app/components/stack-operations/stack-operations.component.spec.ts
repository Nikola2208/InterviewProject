import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackOperationsComponent } from './stack-operations.component';

describe('StackOperationsComponent', () => {
  let component: StackOperationsComponent;
  let fixture: ComponentFixture<StackOperationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StackOperationsComponent]
    });
    fixture = TestBed.createComponent(StackOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
