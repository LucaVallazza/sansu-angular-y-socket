import { ApiHandlerService } from './../services/api-handler.service';
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CharacterType } from '../../assets/types';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { enviroment } from '../../enviroment/enviroment';

@Component({
  selector: 'app-add-character',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterModule],
  providers: [ApiHandlerService],
  templateUrl: './add-character.component.html',
  styleUrls: ['../vote-component/vote-component.component.scss'],
})
export class AddCharacterComponent implements OnInit {
  @Input() apihandler : ApiHandlerService

  private router = inject(Router);

  form: FormGroup;

  character: CharacterType;

  async addCharacter() {
    // Sends the info to the server
    if (this.form.valid) {

      const description = this.form.get('description').value;


      this.apihandler.addCharacter(description)
      //.subscribe({
      //   next: (data) => {
      //     this.form.get('description').setValue('');
      //   },
      //   error(err) {},
      //   complete: () => {
      //     this.form.get('description').setValue('');
      //   },
      // });
    }
    await this.form.get('description').setValue('');

    return;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      description: new FormControl<string>(null, [
        Validators.required,
        Validators.maxLength(80),
        Validators.minLength(3),
      ]),
    });
  }
}
