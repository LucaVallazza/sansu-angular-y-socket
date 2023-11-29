import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiHandlerService } from '../services/api-handler.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CharacterType, UserType } from '../../assets/types';

@Component({
  selector: 'app-characters-display',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [ApiHandlerService],
  templateUrl: './characters-display.component.html',
  styleUrl: './characters-display.component.scss',
})
export class CharactersDisplayComponent implements OnInit {
  private apihandler = inject(ApiHandlerService);

  user: UserType;

  characters: CharacterType[] = [];
  users: UserType[] = [];

  removeCharacter(description: string) {}

  async refresh() {
    let badVotes = [];
    this.user.votes.map((vote) => {
      let checked = false;
      const findVote = this.characters.map((char) => {
        if (char.id === vote) {
          checked = true;
        }
      });
      if (checked) {
        console.log('voto verificado');
      } else {
        console.log('voto no verificado');
        badVotes.push(vote);
      }
    });

    badVotes.map((bv) => {
      this.user.votes.splice(this.user.votes.indexOf(bv), 1);
    });
    await this.serverUpdateVotes();

    this.ngOnInit();
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

  end() {
    const respuesta = window.confirm('Seguro que queres arrancar de 0?');
    if (respuesta) {
      this.apihandler.restart();
    }
  }

  async ngOnInit() {
    let charLoaded: boolean = false;
    let userLoaded: boolean = false;

    this.apihandler.getCharacters().subscribe((res) => {
      console.log('Resolution');
      console.log(res);
      this.characters = res['characters'];
      console.log(this.characters);
      charLoaded = true;
    });
    this.apihandler.getReadyUsers().subscribe((res) => {
      this.users = res['users'];
      const userName = localStorage.getItem('name');
      this.user = this.users.find((user) => user.name == userName);

      userLoaded = true;
    });
    await this.AdjustVotes();
  }

  async AdjustVotes() {
    setTimeout(() => {
      let badVotes = [];
      this.user.votes.map((vote) => {
        let checked = false;
        const findVote = this.characters.map((char) => {
          if (char.id === vote) {
            checked = true;
          }
        });
        if (checked) {
          console.log('voto verificado');
        } else {
          console.log('voto no verificado');
          badVotes.push(vote);
        }
      });

      badVotes.map((bv) => {
        this.user.votes.splice(this.user.votes.indexOf(bv), 1);
      });
      this.serverUpdateVotes();
    }, 2000);
  }
}
