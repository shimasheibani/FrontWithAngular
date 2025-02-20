import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  constructor(private apiService:ApiService){}
  user:any=null;
  message:string="";
  ngOnInit(){
    this.fetchUserInfo();
  }
  fetchUserInfo():void{
    this.apiService.getLoggedInUserInfo().subscribe({
      next:(response)=>{
          this.user=response;
      },
      error:(error:any)=>
        this.showMessage(error?.error?.message||error?.message||"Unable to get User Details")
    });
  }
  showMessage(message :string){
    this.message = message; 
    setTimeout(()=>{this.message=''}, 40000)
    }
    
}
