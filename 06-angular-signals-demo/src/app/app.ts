import { Component } from '@angular/core';
import { UserListComponent } from './user-list/user-list';
import { UserSearchComponent } from "./user-list/user-list-debounced";
import { HelloSignalsComponent } from "./hello-signals/hello-signals";

@Component({
  selector: 'app-root',
  imports: [HelloSignalsComponent, UserListComponent, UserSearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone : true
})
export class App {
  protected title = 'angular-signals-demo';
}
