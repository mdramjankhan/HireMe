const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {cloudinaryConnect} = require('./config/cloudinary');
dotenv.config();
cloudinaryConnect();
const app = express();
const server = http.createServer(app);

require('./models/Job');
require('./models/Application');
require('./models/Notification');
require('./models/Message');
//socket.io setup
const io = socketIo(server, {
  cors: {
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });


// const allowedOrigins =  ['http://localhost:5173']; 
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// io connection
io.on('connection', (socket) => {
  console.log('New WebSocket client connected:', socket.id, 'Transport:', socket.conn.transport.name);
  socket.on('disconnect', () => console.log('WebSocket client disconnected:', socket.id));
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// default route 
app.get('/',(req,res)=> {
  res.send('Hello World!');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));

const { applyJob, getApplications, shortlistApplication, getMyApplications } = require('./controllers/applicationController');
const { authMiddleware, roleMiddleware } = require('./middleware/auth');
app.post('/api/job/apply', authMiddleware, roleMiddleware('jobseeker'), applyJob);
app.get('/api/job/:jobId/applications', authMiddleware, roleMiddleware('employer'), getApplications);
app.put('/api/job/applications/:id/shortlist', authMiddleware, roleMiddleware('employer'), shortlistApplication);
app.get('/api/job/my-applications', authMiddleware, roleMiddleware('jobseeker'), getMyApplications); // New endpoint
app.use('/api/job',require('./routes/jobs'));
app.use('/api/messages', require('./routes/messages'));

// Starting the server---->
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
});