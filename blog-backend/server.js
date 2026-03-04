const express = require('express');
const cors = require('cors');

const db = require('./db'); 

const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Blog backend is running' });
});

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
