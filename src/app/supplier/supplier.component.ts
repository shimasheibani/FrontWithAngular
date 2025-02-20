import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier',
  imports: [CommonModule],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierComponent implements OnInit{
  constructor(private apiService:ApiService, private router:Router){}
  suppliers: any[]=[];
  message:string='';

  ngOnInit(): void {
    this.getSuppliers();
  }

  getSuppliers():void{
    this.apiService.getAllsuppliers().subscribe({
      next:(response:any)=>{
        if(response.status===200){
            this.suppliers= response.suppliers;
        }
        else{
           this.showMessage(response.message);
        }
      },
      error:(error:any)=>
        this.showMessage(error?.error?.message||error?.message||"Unable to get All Suppliers")
    })
    }
    

    navigateToAddSupplier():void{
      this.router.navigate(['/add-supplier']);
    }

    navigateToEditSupplier(supplierId: string):void{
      this.router.navigate([`/edit-supplier/${supplierId}`]);
    }

    deleteSupplier(supplierId:string):void{
      this.apiService.deletesupplier(supplierId).subscribe({
        next:(response:any)=>{
          if(response.status===200){
            this.getSuppliers();
          }
          else{
            this.showMessage(response.message);
          }
        },
        error:(error:any)=>
          this.showMessage(error?.error?.message||error?.message||"Unable to get All Suppliers")
      })
    }

    

    showMessage(message :string){
      this.message = message; 
      setTimeout(()=>{this.message=''}, 40000)
     }

  }












 


