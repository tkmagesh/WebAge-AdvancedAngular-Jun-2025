# Angular Chat Demo

A real-time chat application built with Angular and Node.js using WebSockets (Socket.IO).

## Features

- Real-time messaging with WebSocket connections
- User authentication with username
- Online users list
- Typing indicators
- Message history
- Responsive design
- Connection status indicator
- System messages for user join/leave events

## Tech Stack

### Frontend
- Angular 20
- TypeScript
- Socket.IO Client
- RxJS for reactive programming
- Standalone components

### Backend
- Node.js
- Express.js
- Socket.IO
- CORS support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd angular-chat-demo
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
cd ..
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm start
```
The server will run on `http://localhost:3000`

2. In a new terminal, start the Angular development server:
```bash
npm start
```
The frontend will run on `http://localhost:4200`

3. Open your browser and navigate to `http://localhost:4200`

### Development Mode

For development with auto-restart:

1. Backend (with nodemon):
```bash
cd server
npm run dev
```

2. Frontend (with live reload):
```bash
npm start
```

## Usage

1. Enter a username on the login screen
2. Start chatting with other users in real-time
3. See who's online in the users sidebar
4. Watch typing indicators when others are typing
5. View connection status in the header

## Project Structure

```
angular-chat-demo/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/
│   │   │   │   └── login.component.ts
│   │   │   └── chat/
│   │   │       └── chat.component.ts
│   │   ├── services/
│   │   │   └── chat.service.ts
│   │   ├── app.ts
│   │   ├── app.html
│   │   └── app.css
│   ├── styles.css
│   └── main.ts
├── server/
│   ├── server.js
│   └── package.json
└── package.json
```

## API Endpoints

### WebSocket Events

#### Client to Server
- `join` - Join the chat room with username
- `message` - Send a chat message
- `typing` - Send typing indicator

#### Server to Client
- `chat-history` - Receive chat history on join
- `message` - Receive new messages
- `users-update` - Receive updated users list
- `user-typing` - Receive typing indicators

### HTTP Endpoints
- `GET /health` - Server health check

## Configuration

### Backend Configuration
The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

### Frontend Configuration
The frontend connects to the backend at `http://localhost:3000` by default. To change this, update the `SERVER_URL` in `src/app/services/chat.service.ts`.

## Features in Detail

### Real-time Messaging
- Messages are instantly delivered to all connected users
- Message history is maintained and sent to new users
- System messages notify when users join or leave

### User Management
- Simple username-based authentication
- Online users list with avatars
- Current user identification

### Typing Indicators
- Shows when other users are typing
- Automatically stops after 3 seconds of inactivity
- Handles multiple users typing simultaneously

### Responsive Design
- Mobile-friendly interface
- Adaptive layout for different screen sizes
- Touch-friendly controls

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
