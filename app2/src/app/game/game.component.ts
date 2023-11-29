import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiHandlerService } from '../services/api-handler.service';
import { CharactersDisplayComponent } from '../characters-display/characters-display.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, CharactersDisplayComponent],
  providers: [ApiHandlerService],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit, OnDestroy{

  constructor(private apiHandler: ApiHandlerService) {}


  ngOnInit(): void {
    console.log(this.apiHandler.userName)
  }

  ngOnDestroy(): void {

  }
}
