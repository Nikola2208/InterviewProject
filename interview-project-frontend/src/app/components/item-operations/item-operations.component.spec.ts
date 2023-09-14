import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemOperationsComponent } from './item-operations.component';

describe('ItemOperationsComponent', () => {
  let component: ItemOperationsComponent;
  let fixture: ComponentFixture<ItemOperationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemOperationsComponent]
    });
    fixture = TestBed.createComponent(ItemOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
