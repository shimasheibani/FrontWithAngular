import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { stat } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private static BASE_URL = 'http://localhost:8080/api'
  private static ENCRYPTION_KEY="my-encrypt-key"
  authStatusChange = new EventEmitter();
  constructor(private http:HttpClient) {}
  encryptAndSaveToStorag(key:string, value:string):void{
    const encryptedValue = CryptoJS.AES.encrypt(value, ApiService.ENCRYPTION_KEY).toString();
    localStorage.setItem(key, encryptedValue);
  }

  private getFromStorageAndDecrypt(key:string):any{
    try{
      const encryptedValue = localStorage.getItem(key);
      if(!encryptedValue) return null;
      return CryptoJS.AES.decrypt(encryptedValue,ApiService.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    }catch(error){
      return null;
    }
  }

  private clearAuth(){
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  private getHeader():HttpHeaders{
    const token = this.getFromStorageAndDecrypt("token");
    return new HttpHeaders({ Authorization: `Bearer ${token}` });

  }

  logout():void{
    this.clearAuth();
  }

  isAuthenticated():boolean{
    const token = this.getFromStorageAndDecrypt("token");
    return !!token;
  }

  isAdmin():boolean{
    const role = this.getFromStorageAndDecrypt("role");
    return role ==="Admin";
  }

  registerUser(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/auth/register`, body);
  }
  logIn(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/auth/login`,body);
  }
  getLoggedInUserInfo():Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/users/currentUser`,{
      headers: this.getHeader(),
    });
  }

  createCategory(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/categories/add`, body, {
      headers: this.getHeader(),
    });
    
    
  }
  getAllCategories():Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/categories/all`,{
      headers: this.getHeader(),
    });
  }
  getCategoryById(id: string):Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/categories/${id}`,{
      headers: this.getHeader(),
    });
  }
  deleteCategory(id: string):Observable<any>{
    return this.http.delete(`${ApiService.BASE_URL}/categories/delete/${id}`,{
      headers: this.getHeader(),
    });
  }
  updateCategory(id: string, body:any):Observable<any>{
    return this.http.put(`${ApiService.BASE_URL}/categories/update/${id}`,body,{
      headers: this.getHeader(),
    });
  }

  createsupplier(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/suppliers/add`,body,{
      headers: this.getHeader(),
    });
  }
  getAllsuppliers():Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/suppliers/all`,{
      headers: this.getHeader(),
    });
  }
  getsuppliersById(id: string):Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/suppliers/supplier/${id}`,{
      headers: this.getHeader(),
    });
  }
  deletesupplier(id: string):Observable<any>{
    return this.http.delete(`${ApiService.BASE_URL}/suppliers/delete/${id}`,{
      headers: this.getHeader(),
    });
  }
  updatesupplier(id: string, body:any):Observable<any>{
    return this.http.put(`${ApiService.BASE_URL}/suppliers/update/${id}`,body,{
      headers: this.getHeader(),
    });
  }

  createProduct(formData:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/products/add`,formData,{
      headers: this.getHeader(),
    });
  }
  getAllProduct():Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/products/all`,{
      headers: this.getHeader(),
    });
  }
  getProductById(id: string):Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/products/product/${id}`,{
      headers: this.getHeader(),
    });
  }
  deleteProduct(id: string):Observable<any>{
    return this.http.delete(`${ApiService.BASE_URL}/products/delete/${id}`,{
      headers: this.getHeader(),
    });
  }
  updateProduct(formData:any):Observable<any>{
    return this.http.put('${ApiService.BASE_URL}/products/update/',formData,{
      headers: this.getHeader(),
    });
  }


  purchaseProduct(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/transactions/purchase`,body,{
      headers: this.getHeader(),
    });
  }
  sellProduct(body:any):Observable<any>{
    return this.http.post(`${ApiService.BASE_URL}/transactions/sell`,body,{
      headers: this.getHeader(),
    });
  }
  getAlltransactions(searchText: string):Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/transactions/all`,{
      params: { searchText: searchText },
      headers: this.getHeader(),
    });
  }
  getTransactionById(id: string):Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/transactions/${id}`,{
      headers: this.getHeader(),
    });
  }
  getTransactionByMonthAndYear(month: string, year:string):Observable<any>{
    return this.http.get(`${ApiService.BASE_URL}/transactions/allbyyearandmonth`,{
      headers: this.getHeader(),
      params:{
        month: month,
        year: year
      },
    });
  }
  
  updateTransaction(id: string, status: string):Observable<any>{
    return this.http.put(`${ApiService.BASE_URL}/transactions/${id}`,JSON.stringify(status),{
      headers: this.getHeader().set("Content-Type", "application/json")
    });
  }
  
}
