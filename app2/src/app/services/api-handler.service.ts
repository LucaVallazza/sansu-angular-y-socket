import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CharacterType, UserType } from '../../assets/types';
import { Socket } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';
import { io } from 'socket.io-client';
import { enviroment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService {

  private http: HttpClient = inject(HttpClient)


  userName: string;
  socket;

  restart() {
    this.http.get(`${enviroment.api_url}/restart`).subscribe();
  }

  getReadyUsers() {
    return this.http.get(`${enviroment.api_url}/users/showVotes`);
  }

  setUserName(newUser: string) {
    this.userName = newUser;
  }

  removeCharacter(description: string) {
    return this.http.post(`${enviroment.api_url}/characters/remove`, {
      description: description,
    });
  }

  updateUser(user: UserType) {
    return this.http.put(`${enviroment.api_url}/users/showVotes`, user);
  }

  showVotes(user: UserType) {
    return this.http.post(`${enviroment.api_url}/users/showVotes`, user);
  }

  getUser() {
    return this.userName;
    // return this.http.get(`${enviroment.api_url}/users`)
  }

  getCharacters() {
    console.log(`GET a ${enviroment.api_url}/characters`);
    return this.http.get(`${enviroment.api_url}/characters`);
  }

    addCharacter(description: string) {
      return this.http.post(`${enviroment.api_url}/characters/add`, {
        description: description,
      });
    }

  getUsers() {
    return this.http.get(`${enviroment.api_url}/users`);
  }

  connect (){
    this.socket = io(enviroment.ws_url)

    let observable = new Observable(observer =>{
      this.socket.on('message' , (data : any)=>{
        console.log("Received a message from websocket sever")
        console.log(data)
      })

      return()=>{
        this.socket.disconnect()
      }
    })

    let observer = {
      next: (data: Object) =>{
        this.socket.emit('message', JSON.stringify(data))
      }
    }

    return Subject.create(observer, observable)
  }
}
