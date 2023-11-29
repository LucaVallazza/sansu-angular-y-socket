
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CharacterType, UserType } from '../../assets/types';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService {

constructor(private http: HttpClient) { }
  // private http: HttpClient = inject(HttpClient)

  private API_URL: string = 'https://sansu-backend-jsfz.vercel.app/api';

  userName: string;

  restart(){
    this.http.get(`${this.API_URL}/restart`).subscribe()
  }

  getReadyUsers(){
    return this.http.get(`${this.API_URL}/users/showVotes`)
  }

  setUserName(newUser: string) {
    this.userName = newUser;
  }

  removeCharacter(description : string ){
    return this.http.post(`${this.API_URL}/characters/remove`, {description : description})
  }

  updateUser(user : UserType){
    return this.http.put(`${this.API_URL}/users/showVotes`, user)
  }

  showVotes(user: UserType){
    return this.http.post(`${this.API_URL}/users/showVotes`, user)
  }

  getUser() {
    return this.userName;
    // return this.http.get(`${this.API_URL}/users`)
  }

  getCharacters() {
    console.log(`GET a ${this.API_URL}/characters`)
    return this.http.get(`${this.API_URL}/characters`)
  }

  getUsers(){
    return this.http.get(`${this.API_URL}/users`)
  }

  addCharacter(description : string){
    return this.http.post(`${this.API_URL}/characters/add`, {description : description})
  }
}
