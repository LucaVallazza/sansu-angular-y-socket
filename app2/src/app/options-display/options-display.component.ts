import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiHandlerService } from '../services/api-handler.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OptionType, UserType } from '../../assets/types';

@Component({
  selector: 'app-Options-display',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [ApiHandlerService],
  templateUrl: './Options-display.component.html',
  styleUrls: ['./Options-display.component.scss', '../vote-component/vote-component.component.scss'],
})
export class OptionsDisplayComponent implements OnInit {
  private apihandler = inject(ApiHandlerService);

  apiHandlerReference = this.apihandler

  user: UserType;

  options: OptionType[] = [];
  users: UserType[] = [];

  removeOption(description: string) {}


  serverUpdateVotes() {
    console.log('Update Votes');
    this.apihandler.updateUser(this.user)
  }

  // Handle the vote change
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
    const respuesta = window.confirm('Are you sure that you want to delete ALL the data?');
    if (respuesta) {
      this.apihandler.restart();
    }
  }

  async ngOnInit() {
    let charLoaded: boolean = false;
    let userLoaded: boolean = false;

    this.apihandler.getOptions().subscribe((res) => {
      console.log('Resolution');
      console.log(res);
      this.options = res['options'];
      console.log(this.options);
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
        const findVote = this.options.map((char) => {
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
