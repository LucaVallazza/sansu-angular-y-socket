import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiHandlerService } from '../services/api-handler.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [ApiHandlerService],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
})
export class UserCreateComponent implements OnInit {
  private API_URL: string = 'https://sansu-frontend.vercel.app/api';

  constructor(private apiHandler: ApiHandlerService) {}

  http: HttpClient = inject(HttpClient)

  router : Router = inject(Router)

  form: FormGroup;

  sendInfo() {
    if (!this.form.invalid) {
      const userName : string = this.form.get('name').value
      localStorage.setItem('name', userName.toLowerCase())

      console.log("Enviando...")

      this.http.post(`${this.API_URL}/users/add`, {userName: userName}).subscribe(res => {
        console.log('Respuesta del servidor:', res);
        if(res['status'] === 201){
          this.apiHandler.setUserName(userName)
          const path : string = res['routeTo']
          this.router.navigateByUrl(res['routeTo'])
        }

      });
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl<string | null>(null, [
        Validators.required,
        Validators.max(50),
        Validators.min(2),
      ]),
    });
  }


}
