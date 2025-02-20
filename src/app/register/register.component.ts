import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { firstValueFrom } from 'rxjs';
import { error } from 'console';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor (private apiService:ApiService, private router:Router){}
  formData: any ={
    email: '',
    name : '',
    password : '',
    phoneNumber : ''
  
  };
message:string|null=null;
  async handleSubmit(){
    if(!this.formData.email || !this.formData.name || !this.formData.password || !this.formData.phoneNumber){
      this.showMessage("All fiields are requiered");
      return;
    }
    try {
      const response:any = await firstValueFrom(
        this.apiService.registerUser(this.formData)
      );
      if(response.status ===200){
        this.showMessage(response.message);
        this.router.navigate(["/login"]);
      }
    } catch (error:any){
      console.log(error)
      this.showMessage(error?.error?.message||error?.message || "unable to register user" + error);
      
    }
  }
 showMessage(message :string){
  this.message = message; 
  setTimeout(()=>{this.message=null}, 4000)
 }
  
}
