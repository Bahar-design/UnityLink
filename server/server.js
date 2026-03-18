const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/locations', require('./routes/locations.routes'));
app.use('/api/visits', require('./routes/visits.routes'));
app.use('/api/posts', require('./routes/posts.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

app.listen(process.env.PORT || 5000, () =>
  console.log(`UnityLink server running on port ${process.env.PORT || 5000}`)
);