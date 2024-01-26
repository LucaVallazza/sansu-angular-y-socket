import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiHandlerService } from '../services/api-handler.service';
import { Router } from '@angular/router';
import { enviroment } from '../../enviroment/enviroment';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [ApiHandlerService],
  templateUrl: './user-create.component.html',
  styleUrls: [
    './user-create.component.scss',
    '../vote-component/vote-component.component.scss',
  ],
})
export class UserCreateComponent implements OnInit {
  constructor(private apiHandler: ApiHandlerService) {}

  http: HttpClient = inject(HttpClient);

  router: Router = inject(Router);

  form: FormGroup;

  requestError: boolean = false;

  errorDisplayMessage: string = '';

  sendInfo() {
    if (!this.form.invalid) {
      const userName: string = this.form.get('name').value;

      console.log('Enviando...');

      this.apiHandler.addUser(userName);

      // this.http.post(`${enviroment.api_url}/users/add`, {name: userName}).subscribe(res => {
      //   console.log('Respuesta del servidor:', res);
      //   if(res['user']){
      //     const newUser = res['user']
      //     localStorage.setItem('name', newUser.name)
      //     this.apiHandler.ServiceSetUserName(newUser.name)
      //     const path : string = newUser.votes.hasShown ? '/game' : '/vote'
      //     this.router.navigateByUrl(path)
      //   }

      // }, error => {
      //   switch (error.status){
      //     case 404:
      //       this.errorDisplayMessage = 'Failed to connect to the server';
      //       break;
      //     default:
      //       this.errorDisplayMessage = 'An unexpected error has ocurred'

      //   }
      //   this.requestError = true;
      //   console.log(error)
      // });
    }
  }

  ngOnInit(): void {
    this.apiHandler.gameStartEmitter.subscribe({
      next: (user) => {
        localStorage.setItem('name', user.name)
        this.router.navigateByUrl('/vote')
      }});
    this.form = new FormGroup({
      name: new FormControl<string | null>(null, [
        Validators.required,
        Validators.max(50),
        Validators.min(2),
      ]),
    });
  }
}
