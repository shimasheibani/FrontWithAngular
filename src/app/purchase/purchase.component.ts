import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-purchase',
  imports: [CommonModule,FormsModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent implements OnInit{
  constructor(private apiService:ApiService){}
  products:any[]=[];
  suppliers:any[]=[];
  productId:string='';
  supplierId:string='';
  description:string='';
  quantity:string='';
  message:string='';

  ngOnInit(): void {
    this.fetchProductsAndSuppliers();
  }
  fetchProductsAndSuppliers():void{
    this.apiService.getAllProduct().subscribe({
      next:(response:any)=>{
        if(response.status===200){
          this.products=response.products;
        }
      },
      error:(error)=>{
        this.showMessage(error?.error?.message|| error?.message|| "unable to fetch products")
      }
    });
    this.apiService.getAllsuppliers().subscribe({
      next:(response:any)=>{
        if(response.status===200){
          this.suppliers=response.suppliers;
        }
      },
      error:(error)=>{
        this.showMessage(error?.error?.message|| error?.message|| "unable to fetch products")
      }
    });
  }

  handleSubmit():void{
    if(!this.productId || !this.supplierId|| !this.quantity){
      this.showMessage("Fields of supplier, product and quantity is requiered.");
      return;
    }
    const body={
      productId : this.productId,
      supplierId : this.supplierId,
      quantity : parseInt(this.quantity, 10),
      description : this.description
    }
    this.apiService.purchaseProduct(body).subscribe({
      next:(response:any)=>{
        if(response.status===200){
          this.showMessage(response.message);
          this.clearForm();
        }
      },
      error:(error)=>{
        this.showMessage(error?.error?.message|| error?.message|| "unable to submit the purchase")
      }
    });
  }

  clearForm():void{
    this.productId='';
    this.supplierId='';
    this.quantity='';
    this.description='';
  }
  showMessage(message :string){
    this.message = message; 
    setTimeout(()=>{this.message=''}, 40000)
   }
}
