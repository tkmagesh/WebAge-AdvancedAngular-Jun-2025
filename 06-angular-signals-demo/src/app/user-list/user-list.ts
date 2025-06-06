// user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service';

@Component({
  selector: 'app-user-list',
  template: `
  @if (userService.loading()) {
    <div>Loading users...</div>
  }
  @if (userService.error()) {
    <div>{{ userService.error() }}</div>
  }
    <ul>
      @for (user of userService.users(); track user.name) {
        <li >{{ user.name }}</li>
      }
    </ul>
    <button (click)="refresh()">Refresh</button>
  `
})
export class UserListComponent implements OnInit {
  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.fetchUsers();
  }

  refresh() {
    this.userService.fetchUsers();
  }
}

