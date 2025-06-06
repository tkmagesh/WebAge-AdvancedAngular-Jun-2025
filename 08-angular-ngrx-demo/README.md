# Task Manager Application

A full-stack Task Manager application built with Angular, NgRx for state management, and Node.js backend API.

## Features

- **List Tasks**: View all tasks with filtering options (All, Pending, Completed)
- **Add New Tasks**: Create new tasks with title and description
- **Mark Tasks as Completed**: Toggle task completion status
- **Delete Tasks**: Remove tasks from the list
- **Real-time Statistics**: View task counts and completion status
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Frontend
- **Angular 20**: Modern web framework
- **NgRx**: State management with Redux pattern
- **RxJS**: Reactive programming
- **TypeScript**: Type-safe development
- **Standalone Components**: Modern Angular architecture

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **UUID**: Unique identifier generation
- **In-memory storage**: Simple data persistence (can be replaced with database)

## Project Structure

```
angular-ngrx-demo/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── task-list/
│   │   │       └── task-list.component.ts
│   │   ├── models/
│   │   │   └── task.model.ts
│   │   ├── services/
│   │   │   └── task.service.ts
│   │   ├── store/
│   │   │   ├── task.actions.ts
│   │   │   ├── task.effects.ts
│   │   │   ├── task.reducer.ts
│   │   │   ├── task.selectors.ts
│   │   │   └── task.state.ts
│   │   ├── app.config.ts
│   │   ├── app.ts
│   │   └── app.html
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── backend/
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd angular-ngrx-demo
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Running the Application

You need to run both the frontend and backend servers:

#### 1. Start the Backend API Server

In one terminal window:
```bash
cd backend
npm start
```

The backend server will start on `http://localhost:3001`

#### 2. Start the Frontend Development Server

In another terminal window (from the root directory):
```bash
npm start
```

The Angular application will start on `http://localhost:4200`

### API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/health` - Health check
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `DELETE /api/tasks/:id` - Delete a task

### Sample API Usage

#### Create a new task:
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "description": "Task description"}'
```

#### Get all tasks:
```bash
curl http://localhost:3001/api/tasks
```

#### Toggle task completion:
```bash
curl -X PATCH http://localhost:3001/api/tasks/{task-id}/toggle
```

## NgRx State Management

The application uses NgRx for state management with the following structure:

- **Actions**: Define what can happen (load tasks, add task, etc.)
- **Reducers**: Define how state changes in response to actions
- **Effects**: Handle side effects like API calls
- **Selectors**: Query specific pieces of state
- **State**: Define the shape of application state

### State Structure

```typescript
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}
```

## Development

### Adding New Features

1. **Define Actions**: Add new actions in `task.actions.ts`
2. **Update Reducer**: Handle new actions in `task.reducer.ts`
3. **Add Effects**: Handle side effects in `task.effects.ts`
4. **Create Selectors**: Add selectors in `task.selectors.ts`
5. **Update Components**: Use new actions and selectors in components

### Code Style

- Use TypeScript strict mode
- Follow Angular style guide
- Use reactive programming patterns with RxJS
- Implement proper error handling

## Testing

To run tests:
```bash
npm test
```

## Building for Production

To build the application for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Future Enhancements

- Add user authentication
- Implement task categories/tags
- Add due dates and reminders
- Implement task priority levels
- Add search and advanced filtering
- Integrate with a database (PostgreSQL, MongoDB)
- Add unit and integration tests
- Implement real-time updates with WebSockets
- Add task assignment to users
- Implement task comments and attachments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
