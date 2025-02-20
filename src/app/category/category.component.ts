import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { error } from 'console';

interface Category{
  id:string,
  name:string
}
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  categoryName:string='';
  message:string='';
  isEditing:boolean=false;
  editingCategoryId:string|null=null;
  constructor(private apiService:ApiService){}
  ngOnInit(): void {
    this.getCategories();  
  }

  getCategories():void{
    this.apiService.getAllCategories().subscribe({
      next:(response:any)=>{
        if(response.status===200){
          this.categories= response.categories;
        }
      },
      error:(error:any)=>
        this.showMessage(error?.error?.message||error?.message||"Unable to get All Category")
    })
  }
  addCategory():void{
    if(!this.categoryName){
      this.showMessage("Name of Category is requiered!")
    }
    this.apiService.createCategory({name:this.categoryName}).subscribe({
      next:(response:any)=>{
        if(response.status===200){
          this.showMessage("Category successfully created");
          this.categoryName = '';
          this.getCategories();
        }        
      },
      error:(error:any)=>
        this.showMessage(error?.error?.message||error?.message||"Unable to get All Category")
    })
  }
  editCategory():void{
    if(!this.editingCategoryId || !this.categoryName){
      this.showMessage("Select a category first")
      return;
    }
    this.apiService.updateCategory(this.editingCategoryId, {name:this.categoryName}).subscribe({
      next:(response:any)=>{
        if(response.status===200){
          this.categoryName='';
          // this.editingCategoryId='';
          this.isEditing=false;
          this.getCategories();
        }
      },
      error:(error:any)=>
        this.showMessage(error?.error?.message||error?.message||"Unable to get All Category")
    })
  }

  handleEdirCategory(category:Category):void{
    this.isEditing=true;
    this.categoryName = category.name;
    this.editingCategoryId= category.id;
  }

  handleDeletingCategory(categoryId:string):void{
    if(window.confirm("Are you sure for deleting this categopry?")){
      this.apiService.deleteCategory(categoryId).subscribe({
        next:(response:any)=>{
          if(response.status===200){
            this.showMessage("Categorysuccefully Deleted")
            this.getCategories();
          }
        },
        error:(error:any)=>
          this.showMessage(error?.error?.message||error?.message||"Unable to get All Category")
      })
    }
  }

  showMessage(message :string){
    this.message = message; 
    setTimeout(()=>{this.message=''}, 4000)
   }
}
