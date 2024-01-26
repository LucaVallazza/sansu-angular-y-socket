import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiHandlerService } from '../services/api-handler.service';
import { OptionsDisplayComponent } from '../options-display/options-display.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, OptionsDisplayComponent],
  providers: [ApiHandlerService],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss', '../vote-component/vote-component.component.scss']
})
export class GameComponent implements OnInit, OnDestroy{

  constructor(private apiHandler: ApiHandlerService) {}


  ngOnInit(): void {
    console.log(this.apiHandler.userName)
  }

  ngOnDestroy(): void {
    // this.apiHandler.userDisconnect()
  }
}
