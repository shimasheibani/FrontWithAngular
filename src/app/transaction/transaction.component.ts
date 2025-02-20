import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  imports: [PaginationComponent, FormsModule,CommonModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit{
  constructor(private apiService:ApiService, private router:Router){}
  transactions: any[] =[];
  message:string='';
  totalPages:number=0;
  currentPage:number=1;
  itemsPerPage:number=10;
  searchInput:string= '';
  valueToSearch:string='';

  ngOnInit(): void {
    this.loadTransactions();
  }
  loadTransactions():void{
    this.apiService.getAlltransactions(this.valueToSearch).subscribe({
      next:(response:any)=>
      {
        if(response.status===200){
          const transactions=response.transactions || [];
          this.totalPages = Math.ceil(transactions.length/this.itemsPerPage);
          this.transactions= transactions.slice((this.currentPage-1)*this.itemsPerPage, this.currentPage*this.itemsPerPage);
        }
      },
      error:(error:any)=>
        this.showMessage(error?.error?.message||error?.message||"Unable to get All Transactions")
    });
  }

handleSearch():void{
  this.currentPage=1;
  this.valueToSearch= this.searchInput;
  this.loadTransactions();
}

navigateToTransactionDetails(transactionId:string):void{
  this.router.navigate([`/transaction-details/${transactionId}`]);
}


handlePageChange(page:number):void{
  this.currentPage=page;
  this.loadTransactions();
}

showMessage(message :string){
  this.message = message; 
  setTimeout(()=>{this.message=''}, 40000)
 }

}
