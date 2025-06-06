const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());

// Mock user data
const users = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Charlie Brown" },
  { id: 4, name: "David Williams" },
  { id: 5, name: "Eva Miller" },
  { id: 6, name: "Frank Thomas" },
  { id: 7, name: "Grace Lee" },
  { id: 8, name: "Henry Adams" },
];

// Endpoint: GET /api/users?search=query
app.get("/api/users", (req, res) => {
  const search = (req.query.search || "").toLowerCase();
  const filtered = users.filter((u) => u.name.toLowerCase().includes(search));
  // Simulate network delay
  setTimeout(() => {
    res.json(filtered);
  }, 500);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
