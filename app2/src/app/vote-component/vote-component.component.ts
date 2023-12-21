import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiHandlerService } from '../services/api-handler.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CharacterType, UserType } from '../../assets/types';
import { AddCharacterComponent } from '../add-character/add-character.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { io } from 'socket.io-client';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { UsersStatusComponent } from '../users-status/users-status.component';

@Component({
  selector: 'app-vote-component',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    AddCharacterComponent,
    RouterModule,
    UsersStatusComponent
  ],
  providers: [ApiHandlerService],
  templateUrl: './vote-component.component.html',
  styleUrl: './vote-component.component.scss',
})
export class VoteComponentComponent implements OnInit {
  private apihandler = inject(ApiHandlerService);
  private router = inject(Router);

  // Create a reference to the apiHandler to send to the add-character component to avoid connecting twice to the socket and avoid passing two times the same data to the same client
  apiHandlerReference : ApiHandlerService = this.apihandler

  user: UserType;

  characters: CharacterType[] = [];
  users: UserType[] = [];


  sendVotes() {
    // Manda los votos de user.votes al server y anda a /game
    this.apihandler.showVotes(this.user)

  }

  deleteCharacter(description: string) {
    this.apihandler.removeCharacter(description);

    this.ngOnInit();
  }



  changeVote(id: number) {
    if (this.user.votes.includes(id)) {
      this.user.votes.splice(this.user.votes.indexOf(id), 1);
      this.apihandler.updateUser(this.user);
    } else {
      if (this.user.votes.length > 5) {
        return;
      }

      this.user.votes.push(id);
      this.apihandler.updateUser(this.user);
    }
  }



  async refresh() {
    this.ngOnInit();
  }

  cleanVotes() {
    const userWithCleanVotes = {
      id: this.user.id,
      name: this.user.name,
      hasShown: this.user.hasShown,
      votes: [],
    };
    console.log('clean Votes');
    this.apihandler.updateUser(userWithCleanVotes)

  }



  ngOnInit() {
    // Obtain and set the characters from server
    this.apihandler.getCharacters().subscribe({
      next: (res) => {
        console.log('getCharacters():', res);
        this.characters = res as CharacterType[];
        const userName = localStorage.getItem('name');
      },
      error: (e) => {
        console.log(e);
      },
    });

    // Obtain and set the users from server
    this.apihandler.getUsers().subscribe({
      next: (res) => {
        console.log('getUsers():' , res);
        const userName = localStorage.getItem('name');
        console.log('name in local : ', userName)
        this.users = res as UserType[]
        this.user = this.users.find(user => (user.name === userName))
      },
      error: (e) =>{
        console.log(e)
      }
    }
    );

    // Suscribe to the event to change characters
    this.apihandler.charactersEmitter.subscribe((characters)=>{
      this.characters = characters
      console.log('characters updated!')
    })

    this.apihandler.usersEmitter.subscribe((users)=>{
      this.users = users

      const userName = localStorage.getItem('name');
      this.user = this.users.find(user => (user.name === userName))

      console.log('characters updated!')
    })
    // await this.adjustVotes();

  }


  // async adjustVotes() {
  //   setTimeout(() => {
  //     let badVotes = [];
  //     this.user.votes.map((vote) => {
  //       let checked = false;
  //       this.characters.map((char) => {
  //         if (char.id === vote) {
  //           checked = true;
  //         }
  //       });

  //       if (checked) {
  //         console.log('voto verificado');
  //       } else {
  //         console.log('voto no verificado');
  //         badVotes.push(vote);
  //       }
  //     });

  //     badVotes.map((bv) => {
  //       this.user.votes.splice(this.user.votes.indexOf(bv), 1);
  //     });
  //     this.serverUpdateVotes();
  //   }, 2000);
  // }
}
