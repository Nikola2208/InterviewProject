import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItemCreation } from 'src/app/classes/ItemCreation';
import { ItemResponse } from 'src/app/classes/ItemResponse';
import { ItemService } from 'src/app/services/item.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-item-operations',
  templateUrl: './item-operations.component.html',
  styleUrls: ['./item-operations.component.css']
})
export class ItemOperationsComponent {
  name: string = '';
  price: number = 1;
  tax: number = 0;
  weight: number = 1;
  total_capacity: number = 1;
  formGroup!: FormGroup;
  uformGroup!: FormGroup;
  items: ItemResponse[] = [];
  userRole: string = '';
  mode: string = '';
  selectedItem!: ItemResponse;

  constructor(private router: Router, private toastr: ToastrService, private itemService: ItemService) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl('',[Validators.required]),
      price: new FormControl(1,[Validators.min(1)]),
      tax: new FormControl(0,[Validators.min(0), Validators.max(100)]),
      weight: new FormControl(1,[Validators.min(1)]),
      total_capacity: new FormControl(1,[Validators.min(1)])
    });
    this.uformGroup = new FormGroup({
      uname: new FormControl('',[Validators.required]),
      uprice: new FormControl(1,[Validators.min(1)]),
      utax: new FormControl(0,[Validators.min(0), Validators.max(100)]),
      uweight: new FormControl(1,[Validators.min(1)]),
      utotal_capacity: new FormControl(1,[Validators.min(1)])
    });
    this.itemService.getAll().subscribe((items) => {
      this.items = items;
    });
    let decodedJWT : any = jwt_decode(localStorage.getItem("jwt") ?? '')
    if (decodedJWT != '') {
      this.userRole = decodedJWT.role
    }
  }

  create() {
    this.mode = '';
    let item : ItemCreation = { name: this.name, price: this.price, tax: this.tax, weight: this.weight, total_capacity: this.total_capacity}
    this.itemService.create(item).subscribe({
      next: (item) => {
        this.items.push(item);
        this.name = '';
        this.price = 1;
        this.tax = 0;
        this.weight = 1;
        this.total_capacity = 1;
        this.showSuccess();
      },
      error: (e) => this.showError(e.error.message)
    })
  }

  showSuccess() {
    this.toastr.success('Successfully created item', 'Item creation');
  }
  showError(error: string) {
    this.toastr.error(error, 'Item creation');
  }

  edit(item: ItemResponse) {
    this.mode = 'edit';
    this.selectedItem = {...item};
  }

  update(){
    let item : ItemCreation = { name: this.selectedItem.name, price: this.selectedItem.price, tax: this.selectedItem.tax,
      weight: this.selectedItem.weight, total_capacity: this.selectedItem.total_capacity}
    this.itemService.update(this.selectedItem.id, item).subscribe({
      next: (res) => {
        let itemIndex = this.items.findIndex((item) => res.id === item.id);
        this.items[itemIndex] = res;
        this.mode = '';
        this.showUpdateSuccess();
        },
      error: (e) => this.showUpdateError(e.error.message)
    })
  }

  showUpdateSuccess() {
    this.toastr.success('Successfully updated item', 'Item update');
  }
  showUpdateError(error: string) {
    this.toastr.error(error, 'Item update');
  }

  delete(item: ItemResponse) {
    this.mode = '';
    this.itemService.delete(item.id).subscribe({
      next: () => {
        let itemIndex = this.items.findIndex((it) => it.id === item.id);
        this.items.splice(itemIndex, 1);
        this.showDeleteSuccess();
        },
      error: (e) => this.showDeleteError(e.error.message)
    })
  }

  showDeleteSuccess() {
    this.toastr.success('Successfully deleted item', 'Item deletion');
  }
  showDeleteError(error: string) {
    this.toastr.error(error, 'Item deletion');
  }
}
