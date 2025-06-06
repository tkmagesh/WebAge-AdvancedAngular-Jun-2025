import { createAction, props } from '@ngrx/store';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';

// Load Tasks Actions
export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction(
  '[Task] Load Tasks Success',
  props<{ tasks: Task[] }>()
);
export const loadTasksFailure = createAction(
  '[Task] Load Tasks Failure',
  props<{ error: string }>()
);

// Add Task Actions
export const addTask = createAction(
  '[Task] Add Task',
  props<{ task: CreateTaskRequest }>()
);
export const addTaskSuccess = createAction(
  '[Task] Add Task Success',
  props<{ task: Task }>()
);
export const addTaskFailure = createAction(
  '[Task] Add Task Failure',
  props<{ error: string }>()
);

// Update Task Actions
export const updateTask = createAction(
  '[Task] Update Task',
  props<{ task: UpdateTaskRequest }>()
);
export const updateTaskSuccess = createAction(
  '[Task] Update Task Success',
  props<{ task: Task }>()
);
export const updateTaskFailure = createAction(
  '[Task] Update Task Failure',
  props<{ error: string }>()
);

// Delete Task Actions
export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ id: string }>()
);
export const deleteTaskSuccess = createAction(
  '[Task] Delete Task Success',
  props<{ id: string }>()
);
export const deleteTaskFailure = createAction(
  '[Task] Delete Task Failure',
  props<{ error: string }>()
);

// Toggle Task Completion
export const toggleTaskCompletion = createAction(
  '[Task] Toggle Task Completion',
  props<{ id: string }>()
);
