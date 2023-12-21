import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Input, Output, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CharacterType, UserType } from '../../assets/types';
import {io} from 'socket.io-client';
import { enviroment } from '../../enviroment/enviroment';
import { SocketIoModule, Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService extends Socket {

  private http: HttpClient = inject(HttpClient);

  charactersEmitter : EventEmitter<CharacterType[]> = new EventEmitter<CharacterType[]>()

  usersEmitter : EventEmitter<UserType[]> = new EventEmitter<UserType[]>()

  userName: string;

  constructor() {
    super({
      url: enviroment.ws_url,
      options: {
        reconnection: true
      }
    });

  this.ioSocket.on('event', res => console.log('Recibido: event'))

  this.ioSocket.on('updateCharacters', characters =>{
    console.log("Emitido desde api handler por updateCharacters", characters)
    this.charactersEmitter.emit(characters)

  })

  this.ioSocket.on('updateUsers', users =>{
    console.log("Emitido desde api handler por updateUsers", users)
    this.usersEmitter.emit(users)

  })
  }

  restart() {
    this.http.delete(`${enviroment.api_url}/restart`).subscribe();
  }

  getReadyUsers() {
    return this.http.get(`${enviroment.api_url}/users/showVotes`);
  }

  setUserName(newUser: string) {
    this.userName = newUser;
  }

  removeCharacter(description: string) {
    this.ioSocket.emit('removeCharacter' , description)
  }

  updateUser(user: UserType) {
    this.ioSocket.emit('updateUser' , user)
  }

  showVotes(user: UserType) {
    const newUser = {
      name: user.name,
      hasShown: true,
      id : user.id,
      votes: user.votes

    }
    this.ioSocket.emit('updateUser' , newUser)
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
    this.ioSocket.emit('addCharacter', description)

    // console.log(`Enviando ${description} a ${enviroment.api_url}`);
    // this.ioSocket.emit('add-character', description )
    // return this.http.post(`${enviroment.api_url}/characters/add`, {
    //   description: description,
    // });
  }


  getUsers() {
    return this.http.get(`${enviroment.api_url}/users`);
  }


}
