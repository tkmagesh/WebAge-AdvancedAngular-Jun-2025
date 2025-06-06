import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import * as TaskActions from '../../store/task.actions';
import * as TaskSelectors from '../../store/task.selectors';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: `./task-list.component.html`,
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  // NgRx Observables
  allTasks$: Observable<Task[]>;
  completedTasks$: Observable<Task[]>;
  pendingTasks$: Observable<Task[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  filteredTasks$: Observable<Task[]>;

  currentFilter: 'all' | 'pending' | 'completed' = 'all';
  
  newTask = {
    title: '',
    description: ''
  };

  constructor(private store: Store) {
    // Initialize NgRx selectors
    this.allTasks$ = this.store.select(TaskSelectors.selectAllTasks);
    this.completedTasks$ = this.store.select(TaskSelectors.selectCompletedTasks);
    this.pendingTasks$ = this.store.select(TaskSelectors.selectPendingTasks);
    this.loading$ = this.store.select(TaskSelectors.selectTasksLoading);
    this.error$ = this.store.select(TaskSelectors.selectTasksError);
    this.filteredTasks$ = this.allTasks$;
  }

  ngOnInit() {
    // Dispatch action to load tasks via NgRx
    this.store.dispatch(TaskActions.loadTasks());
  }

  addTask() {
    if (this.newTask.title.trim() && this.newTask.description.trim()) {
      // Dispatch action to add task via NgRx
      this.store.dispatch(TaskActions.addTask({ 
        task: { 
          title: this.newTask.title.trim(), 
          description: this.newTask.description.trim() 
        } 
      }));
      this.newTask = { title: '', description: '' };
    }
  }

  toggleTaskCompletion(id: string) {
    // Dispatch action to toggle task completion via NgRx
    this.store.dispatch(TaskActions.toggleTaskCompletion({ id }));
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      // Dispatch action to delete task via NgRx
      this.store.dispatch(TaskActions.deleteTask({ id }));
    }
  }

  setFilter(filter: 'all' | 'pending' | 'completed') {
    this.currentFilter = filter;
    switch (filter) {
      case 'all':
        this.filteredTasks$ = this.allTasks$;
        break;
      case 'pending':
        this.filteredTasks$ = this.pendingTasks$;
        break;
      case 'completed':
        this.filteredTasks$ = this.completedTasks$;
        break;
    }
  }

  getFilterTitle(): string {
    switch (this.currentFilter) {
      case 'all':
        return 'All Tasks';
      case 'pending':
        return 'Pending Tasks';
      case 'completed':
        return 'Completed Tasks';
      default:
        return 'Tasks';
    }
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
