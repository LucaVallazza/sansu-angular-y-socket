import { ApiHandlerService } from '../services/api-handler.service';
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OptionType } from '../../assets/types';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { enviroment } from '../../enviroment/enviroment';

@Component({
  selector: 'app-add-Option',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterModule],
  providers: [ApiHandlerService],
  templateUrl: './add-Option.component.html',
  styleUrls: ['../vote-component/vote-component.component.scss'],
})
export class AddOptionComponent implements OnInit {

  // Create an Input to send the ApiHandlerService from the parent component
  // to avoid creating multiple sockets
  @Input() apihandler : ApiHandlerService

  private router = inject(Router);

  form: FormGroup;

  option: OptionType;

  async addOption() {
    // Sends the info to the server
    if (this.form.valid) {

      // Get the description from the control and Trigger the socket action
      const description = this.form.get('description').value;
      this.apihandler.addOption(description)
    }

    return;
  }

  ngOnInit(): void {

    // Suscribe to OptionsEmitter Event
    this.apihandler.OptionsEmitter.subscribe( e => {
      // Reset the value of the text input when options are updated
      this.form.get('description').setValue('');
    })

    // Create the form
    this.form = new FormGroup({
      description: new FormControl<string>(null, [
        Validators.required,
        Validators.maxLength(80),
        Validators.minLength(3),
      ]),
    });
  }
}
