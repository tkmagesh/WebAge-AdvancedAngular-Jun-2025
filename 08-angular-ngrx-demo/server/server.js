const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for tasks (in production, use a database)
let tasks = [
  {
    id: uuidv4(),
    title: 'Sample Task 1',
    description: 'This is a sample task to demonstrate the application',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: uuidv4(),
    title: 'Sample Task 2',
    description: 'Another sample task that is already completed',
    completed: true,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date()
  }
];

// Helper function to find task by ID
const findTaskById = (id) => {
  return tasks.find(task => task.id === id);
};

// Helper function to validate task data
const validateTaskData = (data) => {
  const errors = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.push('Description is required and must be a non-empty string');
  }
  
  return errors;
};

// Routes

// GET /api/tasks - Get all tasks
app.get('/api/tasks', (req, res) => {
  try {
    // Sort tasks by creation date (newest first)
    const sortedTasks = tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tasks/:id - Get a specific task
app.get('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const task = findTaskById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Validate input data
    const validationErrors = validateTaskData({ title, description });
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    }
    
    // Create new task
    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    tasks.push(newTask);
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/tasks/:id - Update a task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    const task = findTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Validate input data if title or description is being updated
    if (title !== undefined || description !== undefined) {
      const dataToValidate = {
        title: title !== undefined ? title : task.title,
        description: description !== undefined ? description : task.description
      };
      
      const validationErrors = validateTaskData(dataToValidate);
      if (validationErrors.length > 0) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: validationErrors 
        });
      }
    }
    
    // Update task properties
    if (title !== undefined) {
      task.title = title.trim();
    }
    if (description !== undefined) {
      task.description = description.trim();
    }
    if (completed !== undefined) {
      task.completed = Boolean(completed);
    }
    
    task.updatedAt = new Date();
    
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/tasks/:id/toggle - Toggle task completion status
app.patch('/api/tasks/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    const task = findTaskById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Toggle completion status
    task.completed = !task.completed;
    task.updatedAt = new Date();
    
    res.json(task);
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Remove task from array
    tasks.splice(taskIndex, 1);
    
    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Task Manager API is running',
    timestamp: new Date().toISOString(),
    tasksCount: tasks.length
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Task Manager API server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API endpoints: http://localhost:${PORT}/api/tasks`);
});

module.exports = app;
