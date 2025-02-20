import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-add-edit-supplier',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-edit-supplier.component.html',
  styleUrl: './add-edit-supplier.component.css'
})
export class AddEditSupplierComponent implements OnInit {
  constructor(private apiService:ApiService, private router:Router){}
  message:string|null=null;
  isEditing:boolean=false;
  supplierId:string="";
  formDate:any={
    name:'',
    address :'',
    contactInfo :''
  }

  ngOnInit(): void {
    this.supplierId= this.router.url.split('/')[2];
    if(this.supplierId){
      this.isEditing=true;
      this.fetchSupplier();
    }
  }
  fetchSupplier():void{
    this.apiService.getsuppliersById(this.supplierId).subscribe({
      next:(response:any)=>{
        if(response.status===200){
          this.formDate={
            name : response.supplier.name,
            address : response.supplier.address,
            contactInfo:response.supplier.contactInfo
          }
        }
        else{
          this.showMessage("Supplier is not found.")}
      },
      error:(error:any)=>
        this.showMessage(error?.error?.message||error?.message||"Unable to get All Category")
    })
  }

  handleSubmit():void{
    if(!this.formDate.name || !this.formDate.address){
      this.showMessage("All fields requireds.");
      return;
    }
    const supplierData ={
      name: this.formDate.name,
      address:this.formDate.address,
      contactInfo:this.formDate.contactInfo
    }
    if(this.supplierId){
      this.apiService.updatesupplier(this.supplierId!,supplierData).subscribe({
        next:(response:any)=>{
          if(response.status === 200){
            this.showMessage("Supplier updated.")
            this.router.navigate(['/supplier'])
          }
          else{
            this.showMessage("Supplier can not updated.")
          }
        },
        error:(error:any)=>
          this.showMessage(error?.error?.message||error?.message||"Unable to update  Supplier")
      })
    }
    else{
      this.apiService.createsupplier(supplierData).subscribe({
        next:(response:any)=>{
          if(response.status === 200){
            this.showMessage("Supplier Added.")
            this.router.navigate(["/supplier"])
          }
          else{
            this.showMessage("Supplier can not Added.")
          }
        },
        error:(error:any)=>
          this.showMessage(error?.error?.message||error?.message||"Unable to add  Supplier")
      })
    }

  }

  showMessage(message :string){
    this.message = message; 
    setTimeout(()=>{this.message=null}, 4000)
   }
    
}
