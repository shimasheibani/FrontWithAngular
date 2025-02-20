import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-sell',
  imports: [CommonModule, FormsModule],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css'
})
export class SellComponent implements OnInit {
  constructor(private apiService:ApiService){}
  products:any[]=[];
  productId:string='';
  quantity:string='';
  description:string='';
  message:string='';

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts():void{
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
  }

  handleSubmit():void{
    if(!this.productId || !this.quantity){
      this.showMessage("Selet product and insert Quantity");
    }
    const body ={
      productId : this.productId,
      quantity : parseInt(this.quantity,10),
      description :this.description
    }
    this.apiService.sellProduct(body).subscribe({
      next:(response:any)=>{
        if(response.status===200){
          this.clearForm();
          this.showMessage(response.message);
        }
      },
      error:(error)=>{
        this.showMessage(error?.error?.message|| error?.message|| "unable to sell products")
      }
    });
  }

  clearForm():void{
    this.productId='';
    this.quantity='';
    this.description='';
  }

  showMessage(message :string){
    this.message = message; 
    setTimeout(()=>{this.message=''}, 40000)
   }
  
}

