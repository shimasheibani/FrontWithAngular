import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-details.component.html',
  // styleUrl: './transaction-details.component.css'
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit{
  constructor(private apiService:ApiService, private route:ActivatedRoute, private router:Router){}

  transactionId:string | null = '';
  transaction: any = null;
  status:string = '';
  message:string = ''

  ngOnInit(): void {
    // this.route.params.subscribe(params =>{
    //   this.transactionId = params['transactionId'];
    this.transactionId = this.route.snapshot.paramMap.get('transactionId');
    this.getTransactionDetails();
    // })
  }


  getTransactionDetails():void{
    if (this.transactionId) {
      this.apiService.getTransactionById(this.transactionId).subscribe({
        next:(transactionData: any) =>{
          if (transactionData.status === 200) {
            this.transaction = transactionData.transaction;
            this.status = this.transaction.status;
          }
        },
      error:(error:any)=>
        this.showMessage(error?.error?.message||error?.message||"Unable to get Transaction Details")
      });
    }
  }
  handleUpdateTransaction():void{
    if (this.transactionId && this.status) {
      this.apiService.updateTransaction(this.transactionId, this.status).subscribe({
        next:(result)=>{
          this.router.navigate(['/transaction'])
        },
        error:(error:any)=>
          this.showMessage(error?.error?.message||error?.message||"Unable to get Transaction Details")
      });
    }
  }

  
 showMessage(message :string){
  this.message = message; 
  setTimeout(()=>{this.message=''}, 40000)
  }
  
}
