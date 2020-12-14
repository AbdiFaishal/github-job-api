const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require('./src/routes/authRoutes');
const jobsRoutes = require('./src/routes/jobsRoutes');

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/auth', authRoutes);
app.use('/api/', jobsRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
