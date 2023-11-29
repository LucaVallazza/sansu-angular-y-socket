import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiHandlerService } from '../services/api-handler.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CharacterType, UserType } from '../../assets/types';
import { AddCharacterComponent } from '../add-character/add-character.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-vote-component',
  standalone: true,
  imports: [CommonModule, HttpClientModule, AddCharacterComponent, RouterModule],
  providers: [ApiHandlerService],
  templateUrl: './vote-component.component.html',
  styleUrl: './vote-component.component.scss',
})
export class VoteComponentComponent implements OnInit {
  private apihandler = inject(ApiHandlerService);
  private router = inject(Router);

  user: UserType;

  characters: CharacterType[] = [];
  users: UserType[] = [];

  sendVotes() {
    // Manda los votos de user.votes al server y anda a /game
    this.apihandler.showVotes(this.user).subscribe({
      next: (data)=>{
        this.router.navigate(['/game'])
      },
      error(err) {

      },
      complete: () => {
      },
    });
    this.router.navigate(['/game'])
  }

  deleteCharacter(description: string) {
    this.apihandler.removeCharacter(description)
    .subscribe({
      next: (data) =>{
        this.ngOnInit()
      },
      error: (err) => {

      },
      complete: () => {
        this.ngOnInit()
    }
    });
    this.ngOnInit()
  }

  serverUpdateVotes() {
    console.log('Update Votes');
    this.apihandler.updateUser(this.user).subscribe((d) => console.log(d));
  }

  changeVote(id: number) {
    if (this.user.votes.includes(id)) {
      this.user.votes.splice(this.user.votes.indexOf(id), 1);
      this.serverUpdateVotes();
    } else {
      if (this.user.votes.length > 5) {
        return;
      }
      this.user.votes.push(id);
      this.serverUpdateVotes();
    }
  }

  async refresh(){
    this.ngOnInit()
  }

  cleanVotes(){
    const userWithCleanVotes = {
      id: this.user.id,
      name: this.user.name,
      hasShown: this.user.hasShown,
      votes : []
    }
    console.log('clean Votes');
    this.apihandler.updateUser(userWithCleanVotes).subscribe((d) => {
      console.log(d)
    });
    this.ngOnInit()
  }

  async ngOnInit() {
    console.log('on init')
    this.apihandler.getCharacters().subscribe((res) => {
      console.log('Resolution');
      console.log(res);
      this.characters = res['characters'];
      console.log(this.characters);
    });

    this.apihandler.getUsers().subscribe((res) => {
      this.users = res['users'];
      const userName = localStorage.getItem('name');
      this.user = this.users.find((user) => user.name == userName);
    });

    await this.adjustVotes()

  }

  async adjustVotes(){
    setTimeout(() => {
      let badVotes = []
    this.user.votes.map((vote) => {
      let checked = false
      this.characters.map((char) => {
        if(char.id === vote){
          checked = true
        }
      })

      if(checked){
        console.log('voto verificado')
      }
      else{
        console.log('voto no verificado')
        badVotes.push(vote)
      }
    })

    badVotes.map(bv => {
      this.user.votes.splice(this.user.votes.indexOf(bv), 1)
    })
    this.serverUpdateVotes()
    }, 2000);

  }
}
