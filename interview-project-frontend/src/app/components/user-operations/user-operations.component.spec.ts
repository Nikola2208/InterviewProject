import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOperationsComponent } from './user-operations.component';

describe('UserOperationsComponent', () => {
  let component: UserOperationsComponent;
  let fixture: ComponentFixture<UserOperationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserOperationsComponent]
    });
    fixture = TestBed.createComponent(UserOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
