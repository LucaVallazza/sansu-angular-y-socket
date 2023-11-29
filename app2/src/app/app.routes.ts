import { Routes } from '@angular/router';
import { UserCreateComponent } from './user-create/UserCreateComponent';
import { GameComponent } from './game/game.component';
import { VoteComponentComponent } from './vote-component/vote-component.component';

export const routes: Routes = [
  {path: "game" , component:GameComponent, title: "Game" },
  {path: "vote" , component:VoteComponentComponent, title: "Vote" },
  {path: "**" , component:UserCreateComponent, title: "Crear usuario" },
];
