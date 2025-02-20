import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [CommonModule,PaginationComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  constructor(private apiService:ApiService, private router:Router){}
  products:any[]=[];
  message:string="";
  currentPage:number=1;
  totalePage:number=0;
  itemPerPage:number=10;

  ngOnInit(): void {
    this.fetchProduct();
  }
  fetchProduct():void{
    this.apiService.getAllProduct().subscribe({
      next:(response:any)=>{
      
          const products= response.products || [];
          console.log(products[0].imageUrl);
          this.totalePage=Math.ceil(products.length/this.itemPerPage);
          this.products=products.slice((this.currentPage-1)*this.itemPerPage,this.currentPage*this.itemPerPage);
      
      },
      error:(error:any)=>
        this.showMessage(error?.error?.message||error?.message||"Unable to fetch Products")
    });
  }
  onPageChange(page:number){
    this.currentPage=page;
    this.fetchProduct();
  }

  handleDeletProduct(productId:string):void{
    if(window.confirm("Are you sure to deleter this product?")){
      this.apiService.deleteProduct(productId).subscribe({
        next:(response:any)=>{
          if(response.status===200){
            this.showMessage("Product successfullu deleted");
            this.fetchProduct();
          }
        },
        error:(error:any)=>
          this.showMessage(error?.error?.message||error?.message||"Unable to delete product")
      });
    }
    }
    
  handleNavigateToEditProductPage(productId:string):void{
    this.router.navigate([`/edit-product/${productId}`]);
  }

  handleNavigateToAddProductPage():void{
    this.router.navigate(['/add-product']);
  }


  showMessage(message :string){
    this.message = message; 
    setTimeout(()=>{this.message=''}, 4000)
   }

}
