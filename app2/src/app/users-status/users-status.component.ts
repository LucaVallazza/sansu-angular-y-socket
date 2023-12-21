import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Check, Loader, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-users-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-status.component.html',
  styleUrl: './users-status.component.scss'
})
export class UsersStatusComponent implements OnInit{
  @Input() users

  ngOnInit(): void {

  }



}
