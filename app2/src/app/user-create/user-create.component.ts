import { Component, OnInit, inject } from '@angular/core';
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
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
})
export class UserCreateComponent implements OnInit {
  private API_URL: string = 'http://localhost:3000';

  constructor(private apiHandler: ApiHandlerService) {}

  http: HttpClient = inject(HttpClient)

  router : Router = inject(Router)

  form: FormGroup;

  sendInfo() {
    if (!this.form.invalid) {
      console.log(" Enviado?")
      this.http.post(`${this.API_URL}/users`, {user: this.form.get('name').value}).subscribe(response => {
        this.router.navigate(['/play'])
        console.log('Respuesta del servidor:', response);
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
