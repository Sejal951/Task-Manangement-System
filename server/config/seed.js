require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./db');
const User = require('../models/User');
const Task = require('../models/Task');

const TEST_USERS = [
  { name: 'Test User', email: 'testuser@example.com', password: 'Test@1234' },
  { name: 'Admin User', email: 'admin@example.com', password: 'Admin@1234' },
];

async function upsertUser({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email },
    { name, email, passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return user;
}

async function seed() {
  await connectDB();

  const [testUser, adminUser] = await Promise.all(TEST_USERS.map(upsertUser));
  console.log('Seeded users:', testUser.email, adminUser.email);

  await Task.deleteMany({
    createdBy: { $in: [testUser._id, adminUser._id] },
  });

  const sampleTasks = [
    {
      title: 'Set up project repository',
      description: 'Initialize client and server folders with base configuration.',
      priority: 'high',
      status: 'completed',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      assignedUser: testUser._id,
      createdBy: adminUser._id,
    },
    {
      title: 'Design dashboard UI',
      description: 'Create wireframes for the dashboard cards and layout.',
      priority: 'medium',
      status: 'in-progress',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      assignedUser: testUser._id,
      createdBy: adminUser._id,
    },
    {
      title: 'Implement authentication API',
      description: 'Add register/login endpoints with JWT and bcrypt hashing.',
      priority: 'high',
      status: 'completed',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      assignedUser: adminUser._id,
      createdBy: adminUser._id,
    },
    {
      title: 'Write task filtering logic',
      description: 'Support search, status/priority filters, and sort by due date.',
      priority: 'low',
      status: 'pending',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      assignedUser: testUser._id,
      createdBy: testUser._id,
    },
    {
      title: 'Prepare deployment configs',
      description: 'Add vercel.json and render deployment settings.',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedUser: adminUser._id,
      createdBy: testUser._id,
    },
  ];

  await Task.insertMany(sampleTasks);
  console.log(`Seeded ${sampleTasks.length} sample tasks`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
