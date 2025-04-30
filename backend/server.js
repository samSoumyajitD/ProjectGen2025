const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev')); // Log HTTP requests to the console

app.use(cors({ 
    origin: 'http://localhost:3000',
    credentials: true
 }));
 const genAI = new GoogleGenerativeAI(process.env.GenAI_API_Key);
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/admin',require('./routes/userRoutes'));
// API endpoint for chatbot
app.use('/api/goals',require('./routes/goalsRoutes'));
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
  
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = `Act as an AI Tutor for students. Answer this: ${message}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      res.json({ reply: text });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });
// 404 Handling
app.use((req, res) => {
    res.status(404).json({ 
        message: 'Endpoint not found' 
    });
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
         message: 'Internal Server Error' 
        });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

