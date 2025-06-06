import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { TaskListSimpleComponent } from './components/task-list/task-list-simple.component';
import { TaskListComponent } from './components/task-list/task-list.component'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Task Manager - Angular NgRx Demo';
}
