import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Input, OnDestroy, Output, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OptionType, UserType } from '../../assets/types';
import {io} from 'socket.io-client';
import { enviroment } from '../../enviroment/enviroment';
import { SocketIoModule, Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class ApiHandlerService extends Socket {

  private http: HttpClient = inject(HttpClient);

  OptionsEmitter : EventEmitter<OptionType[]> = new EventEmitter<OptionType[]>()

  usersEmitter : EventEmitter<UserType[]> = new EventEmitter<UserType[]>()

  gameStartEmitter : EventEmitter<UserType> = new EventEmitter<UserType>()

  userName: string;

  clientOptions: OptionType[]

  clientUsers: UserType[]

  constructor() {
    super({
      url: enviroment.ws_url,
      options: {
        reconnection: true
      }
    });

  this.ioSocket.on('event', res => console.log('Recibido: event'))

  this.ioSocket.on('updateOptions', Options =>{
    // Emit an event sending all the options that the server has sent us
    this.OptionsEmitter.emit(Options)

  })

  this.ioSocket.on('updateUsers', users =>{
    // Emit an event sending all the options that the server has sent us
    this.usersEmitter.emit(users)

  })

  // ## Update Users ##
  this.ioSocket.on('loadGame', (users: UserType[] , options : OptionType[], user : UserType ) =>{
    // Emit an event sending all the options that the server has sent us
    this.gameStartEmitter.emit(user)

    this.setClientUserName(user.name)
    this.setClientOptions(options)
    this.setClientUsers(users)
  })

  }

  setClientOptions(options : OptionType[]){
    this.clientOptions = options
  }

  setClientUsers(users : UserType[]){
    this.clientUsers = users
  }

  setClientUserName(newUser: string) {
    this.userName = newUser;
  }

  getClientUser() {
    return this.userName;
    // return this.http.get(`${enviroment.api_url}/users`)
  }

  restart() {
    this.http.delete(`${enviroment.api_url}/restart`).subscribe();
  }

  getReadyUsers() {
    return this.http.get(`${enviroment.api_url}/users/showVotes`);
  }

  removeOption(description: string) {
    this.ioSocket.emit('removeOption' , description)
  }

  updateUser(user: UserType) {
    this.ioSocket.emit('updateUser' , user)
  }

  toggleVotes(user: UserType) {
    const newUser = {
      name: user.name,
      hasShown: !user.hasShown,
      id : user.id,
      votes: user.votes
    }

    this.ioSocket.emit('updateUser' , newUser)
  }

  getOptions() {
    console.log(`GET a ${enviroment.api_url}/options`);
    return this.http.get(`${enviroment.api_url}/options`);
  }

  addOption(description: string) {
    console.log('Emitido addOption con la informacion: ', description)
    this.ioSocket.emit('addOption', description)
  }


  addUser(newUserName: string) {
    this.ioSocket.emit('addUser', newUserName)

  }


  getUsers() {
    return this.http.get(`${enviroment.api_url}/users`);
  }

  userDisconnect(user : UserType ){
    console.log('disconnect user!!!!')
    this.ioSocket.emit('userDisconnect' , user)
  }

}
