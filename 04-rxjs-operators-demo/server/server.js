const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Mock data for search
const mockData = [
  // Programming Languages
  { id: 1, name: 'JavaScript', category: 'Programming Language', description: 'Dynamic programming language for web development' },
  { id: 2, name: 'TypeScript', category: 'Programming Language', description: 'Typed superset of JavaScript' },
  { id: 3, name: 'Python', category: 'Programming Language', description: 'High-level programming language' },
  { id: 4, name: 'Java', category: 'Programming Language', description: 'Object-oriented programming language' },
  { id: 5, name: 'C#', category: 'Programming Language', description: 'Microsoft programming language' },
  { id: 6, name: 'Go', category: 'Programming Language', description: 'Google programming language' },
  { id: 7, name: 'Rust', category: 'Programming Language', description: 'Systems programming language' },
  { id: 8, name: 'Swift', category: 'Programming Language', description: 'Apple programming language' },
  { id: 9, name: 'Kotlin', category: 'Programming Language', description: 'JetBrains programming language' },
  { id: 10, name: 'PHP', category: 'Programming Language', description: 'Server-side scripting language' },

  // Frameworks
  { id: 11, name: 'Angular', category: 'Framework', description: 'TypeScript-based web application framework' },
  { id: 12, name: 'React', category: 'Framework', description: 'JavaScript library for building user interfaces' },
  { id: 13, name: 'Vue.js', category: 'Framework', description: 'Progressive JavaScript framework' },
  { id: 14, name: 'Express.js', category: 'Framework', description: 'Node.js web application framework' },
  { id: 15, name: 'Django', category: 'Framework', description: 'Python web framework' },
  { id: 16, name: 'Spring Boot', category: 'Framework', description: 'Java application framework' },
  { id: 17, name: 'Laravel', category: 'Framework', description: 'PHP web application framework' },
  { id: 18, name: 'Ruby on Rails', category: 'Framework', description: 'Ruby web application framework' },
  { id: 19, name: 'ASP.NET Core', category: 'Framework', description: 'Microsoft web framework' },
  { id: 20, name: 'Svelte', category: 'Framework', description: 'Compile-time web framework' },

  // Libraries
  { id: 21, name: 'RxJS', category: 'Library', description: 'Reactive Extensions for JavaScript' },
  { id: 22, name: 'Lodash', category: 'Library', description: 'JavaScript utility library' },
  { id: 23, name: 'Moment.js', category: 'Library', description: 'JavaScript date library' },
  { id: 24, name: 'Axios', category: 'Library', description: 'HTTP client for JavaScript' },
  { id: 25, name: 'jQuery', category: 'Library', description: 'JavaScript DOM manipulation library' },
  { id: 26, name: 'D3.js', category: 'Library', description: 'Data visualization library' },
  { id: 27, name: 'Three.js', category: 'Library', description: '3D graphics library' },
  { id: 28, name: 'Chart.js', category: 'Library', description: 'JavaScript charting library' },
  { id: 29, name: 'Socket.io', category: 'Library', description: 'Real-time communication library' },
  { id: 30, name: 'Webpack', category: 'Library', description: 'Module bundler' },

  // Databases
  { id: 31, name: 'MongoDB', category: 'Database', description: 'NoSQL document database' },
  { id: 32, name: 'PostgreSQL', category: 'Database', description: 'Relational database' },
  { id: 33, name: 'MySQL', category: 'Database', description: 'Relational database management system' },
  { id: 34, name: 'Redis', category: 'Database', description: 'In-memory data structure store' },
  { id: 35, name: 'SQLite', category: 'Database', description: 'Lightweight database engine' },
  { id: 36, name: 'Elasticsearch', category: 'Database', description: 'Search and analytics engine' },
  { id: 37, name: 'CouchDB', category: 'Database', description: 'NoSQL document database' },
  { id: 38, name: 'Cassandra', category: 'Database', description: 'Distributed NoSQL database' },
  { id: 39, name: 'Neo4j', category: 'Database', description: 'Graph database' },
  { id: 40, name: 'DynamoDB', category: 'Database', description: 'AWS NoSQL database' },

  // Tools
  { id: 41, name: 'Docker', category: 'Tool', description: 'Containerization platform' },
  { id: 42, name: 'Kubernetes', category: 'Tool', description: 'Container orchestration' },
  { id: 43, name: 'Git', category: 'Tool', description: 'Version control system' },
  { id: 44, name: 'Jenkins', category: 'Tool', description: 'Continuous integration tool' },
  { id: 45, name: 'Terraform', category: 'Tool', description: 'Infrastructure as code' },
  { id: 46, name: 'Ansible', category: 'Tool', description: 'Configuration management' },
  { id: 47, name: 'Nginx', category: 'Tool', description: 'Web server and reverse proxy' },
  { id: 48, name: 'Apache', category: 'Tool', description: 'Web server software' },
  { id: 49, name: 'Postman', category: 'Tool', description: 'API development tool' },
  { id: 50, name: 'VS Code', category: 'Tool', description: 'Code editor' }
];

// Search endpoint with artificial delay to simulate real API
app.get('/api/search', (req, res) => {
  const { q, limit = 10, delay = 300 } = req.query;
  
  console.log(`Search request: "${q}" with delay: ${delay}ms`);
  
  setTimeout(() => {
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    const searchTerm = q.toLowerCase().trim();
    const results = mockData
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      )
      .slice(0, parseInt(limit))
      .map(item => ({
        ...item,
        highlight: highlightMatch(item.name, searchTerm)
      }));

    res.json({
      query: q,
      results,
      total: results.length,
      timestamp: new Date().toISOString()
    });
  }, parseInt(delay));
});

// Helper function to highlight matching text
function highlightMatch(text, searchTerm) {
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Categories endpoint
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(mockData.map(item => item.category))];
  res.json(categories);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    totalItems: mockData.length 
  });
});

// Error simulation endpoint
app.get('/api/search-with-errors', (req, res) => {
  const { q, errorRate = 0.3 } = req.query;
  
  // Simulate random errors
  if (Math.random() < parseFloat(errorRate)) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Simulated server error for testing retry logic'
    });
  }
  
  // If no error, proceed with normal search
  req.url = '/api/search';
  app._router.handle(req, res);
});

app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`);
  console.log(`📊 Loaded ${mockData.length} mock items`);
  console.log(`🔍 Search endpoint: http://localhost:${PORT}/api/search?q=javascript`);
  console.log(`📂 Categories endpoint: http://localhost:${PORT}/api/categories`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});
