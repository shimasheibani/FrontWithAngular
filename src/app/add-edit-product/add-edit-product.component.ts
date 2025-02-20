import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { timeStamp } from 'console';

@Component({
  selector: 'app-add-edit-product',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.css'
})
export class AddEditProductComponent implements OnInit {
  constructor(private apiService:ApiService, private router:Router, private route:ActivatedRoute){}
  productId :string | null= null;
  name :string='';
  sku :string='';
  price :string='';
  stockQuality :string='';
  description :string='';
  categoryId:string='';
  imageFile:File|null=null;
  imageUrl:string='';
  categories:any[]=[];
  isEditing:boolean=false;
  message:string='';
  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.fetchAllCategorie();
    if(this.productId){
      this.isEditing=true;
      this.fetchProductWithId(this.productId);
    }
   
  }
  fetchAllCategorie():void{
    this.apiService.getAllCategories().subscribe({
      next:(response:any)=>{
        if(response.status===200){
          this.categories=response.categories;
        }
      },
      error:(error:any)=>
        this.showMessage(error?.error?.message||error?.message||"Unable to Get All Products")
    });
  }

  fetchProductWithId(productId:string):void{
    this.apiService.getProductById(productId).subscribe({
      next:(response:any)=>{
        if(response.status===200){
          const product = response.product;
          this.name= product.name;
          this.sku= product.sku;
          this.price= product.price;
          this.stockQuality= product.stockQuality;
          this.description= product.description;
          this.categoryId= product.categoryId;
          this.imageUrl= product.imageUrl;
        }
        else{
          this.showMessage(response.message);
        }
      },
      error:(error:any)=>
        this.showMessage(error?.error?.message||error?.message||"Unable to Get All Categories")
    });
  }

  handleImageCHange(event:Event):void{
    const input = event?.target as HTMLInputElement;
    if(input?.files?.[0]){
      this.imageFile=input.files[0];
      const reader = new FileReader();
      reader.onloadend =()=>{
        this.imageUrl=reader.result as string
      }
      reader.readAsDataURL(this.imageFile);
    }
  }
  handleSubmit(event:Event){
    event.preventDefault();
    const formData= new FormData;
    formData.append("name",this.name);
    formData.append("price",this.price);
    formData.append("sku",this.sku);
    formData.append("stockQuality",this.stockQuality);
    formData.append("categoryId",this.categoryId);
    formData.append("description",this.description);
    // if (!this.imageFile) {
    //   this.showMessage("Please select an image.");
    //   return; // Stop the form submission
    // }else{
    if (this.imageFile) {
      formData.append("imgFile", this.imageFile);
    }
    if(this.isEditing){
      formData.append("productId", this.productId!);
      this.apiService.updateProduct(formData).subscribe({
        next:(response:any)=>{
          if(response.status===200){
            this.showMessage("Product successfullu updated")
          this.router.navigate(['/product']);
          }
          else{
            this.showMessage(response.message);
          }
        },
        error:(error:any)=>
          this.showMessage(error?.error?.message||error?.message||"Unable to Get All Categories")
      });
    }
    else{this.apiService.createProduct(formData).subscribe({
      next:(response:any)=>{
        if(response.status===200){
          this.showMessage("Product successfullu created")
          this.router.navigate(['/product']);
        }
        else{
          this.showMessage(response.message);
        }
      },
      error:(error:any)=>
        this.showMessage(error?.error?.message||error?.message||"Unable to Get All Categories")
    });
  }
  }

  showMessage(message :string){
    this.message = message; 
    setTimeout(()=>{this.message=''}, 4000)
   }

}