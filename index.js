import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcryptjs from 'bcryptjs';

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoUrl = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.4';
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error.message);
  });

// User schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  gender: String,
});
const User = mongoose.model('All-Ai-users', userSchema);

// Routes
app.get('/', (req, res) => {
  res.send({ message: 'This is a test' });
});

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const encryptedPassword = await bcryptjs.hash(password, 10);
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
    });

    await newUser.save();
    return res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
