import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'app2';

  userName : string = null

  ngOnInit(): void {
    console.log('gola')

window.addEventListener('refresh', () =>{
  localStorage.clear()
})

    const userName = localStorage.getItem('name')

    if(userName){
      console.log('username', userName)
      this.userName = userName

    }

  }


}
