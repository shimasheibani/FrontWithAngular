import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { firstValueFrom } from 'rxjs';
import { error } from 'console';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
constructor(private apiService:ApiService, private router:Router){}
formData:any={
  email:'',
  password:''
};
message:string|null=null;
  async handleSubmit(){
    if(!this.formData.email || !this.formData.password){
      this.showMessage("All fields are requierd");
      return;
    }
    try{
      const response:any=await firstValueFrom(
        this.apiService.logIn(this.formData)
      );
      if(response.status===200){
        
        this.apiService.encryptAndSaveToStorag('token', response.token);
        this.apiService.encryptAndSaveToStorag('role', response.role);
        this.showMessage(response.message);
        this.router.navigate(["/dashboard"]);
        
        }
      
    }
    catch(error:any){
      console.log(error)
      this.showMessage(error?.error?.message||error?.message || "unable to Login user" + error);
      
    }
    
  }
  showMessage(message :string){
    this.message = message; 
    setTimeout(()=>{this.message=null}, 4000)
   }
}
