const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Mentor = require('./models/Mentor');
const Session = require('./models/Session');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mentorconnect');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Mentor.deleteMany({});
    await Session.deleteMany({});
    console.log('Cleared existing data');

    // Create password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Test@123', salt);

    // Create student users
    const students = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: hashedPassword,
        role: 'student'
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: hashedPassword,
        role: 'student'
      }
    ]);
    console.log('Created student users');

    // Create mentor users
    const mentorUsers = await User.create([
      {
        name: 'Dr. Sarah Williams',
        email: 'sarah@example.com',
        password: hashedPassword,
        role: 'mentor'
      },
      {
        name: 'John Martinez',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'mentor'
      },
      {
        name: 'Emily Chen',
        email: 'emily@example.com',
        password: hashedPassword,
        role: 'mentor'
      },
      {
        name: 'Michael Brown',
        email: 'michael@example.com',
        password: hashedPassword,
        role: 'mentor'
      },
      {
        name: 'Jessica Davis',
        email: 'jessica@example.com',
        password: hashedPassword,
        role: 'mentor'
      }
    ]);
    console.log('Created mentor users');

    // Create mentor profiles
    const mentorProfiles = await Mentor.create([
      {
        userId: mentorUsers[0]._id,
        expertise: ['Software Engineering', 'React', 'Node.js', 'System Design'],
        bio: 'Senior Software Engineer with 10+ years of experience in building scalable web applications. Passionate about mentoring and helping developers grow their careers.',
        experience: 'Senior Software Engineer at Google',
        hourlyRate: 100,
        rating: 4.9,
        totalSessions: 128,
        languages: ['English', 'Spanish'],
        education: [
          { degree: 'PhD in Computer Science', institution: 'MIT', year: '2010' },
          { degree: 'MS in Computer Science', institution: 'Stanford', year: '2006' }
        ],
        availability: [
          { day: 'Monday', slots: [{ startTime: '09:00', endTime: '17:00' }] },
          { day: 'Wednesday', slots: [{ startTime: '09:00', endTime: '17:00' }] },
          { day: 'Friday', slots: [{ startTime: '09:00', endTime: '17:00' }] }
        ]
      },
      {
        userId: mentorUsers[1]._id,
        expertise: ['Data Science', 'Machine Learning', 'Python', 'AI'],
        bio: 'Data Scientist specializing in ML and AI. Helped numerous students transition into data science careers.',
        experience: 'Lead Data Scientist at Microsoft',
        hourlyRate: 120,
        rating: 4.8,
        totalSessions: 95,
        languages: ['English', 'Mandarin'],
        education: [
          { degree: 'MS in Data Science', institution: 'UC Berkeley', year: '2015' }
        ],
        availability: [
          { day: 'Tuesday', slots: [{ startTime: '10:00', endTime: '18:00' }] },
          { day: 'Thursday', slots: [{ startTime: '10:00', endTime: '18:00' }] }
        ]
      },
      {
        userId: mentorUsers[2]._id,
        expertise: ['Product Design', 'UX/UI', 'Figma', 'User Research'],
        bio: 'Product Designer with a passion for creating intuitive user experiences. Former design lead at top tech companies.',
        experience: 'Senior Product Designer at Apple',
        hourlyRate: 90,
        rating: 4.7,
        totalSessions: 76,
        languages: ['English'],
        education: [
          { degree: 'BFA in Design', institution: 'Rhode Island School of Design', year: '2012' }
        ],
        availability: [
          { day: 'Monday', slots: [{ startTime: '14:00', endTime: '20:00' }] },
          { day: 'Wednesday', slots: [{ startTime: '14:00', endTime: '20:00' }] }
        ]
      },
      {
        userId: mentorUsers[3]._id,
        expertise: ['Marketing', 'Digital Marketing', 'SEO', 'Content Strategy'],
        bio: 'Digital marketing expert with 8+ years of experience. Helped scale multiple startups through effective marketing strategies.',
        experience: 'Marketing Director at Meta',
        hourlyRate: 85,
        rating: 4.6,
        totalSessions: 64,
        languages: ['English', 'French'],
        education: [
          { degree: 'MBA in Marketing', institution: 'Harvard Business School', year: '2014' }
        ],
        availability: [
          { day: 'Tuesday', slots: [{ startTime: '09:00', endTime: '15:00' }] },
          { day: 'Thursday', slots: [{ startTime: '09:00', endTime: '15:00' }] },
          { day: 'Saturday', slots: [{ startTime: '10:00', endTime: '14:00' }] }
        ]
      },
      {
        userId: mentorUsers[4]._id,
        expertise: ['DevOps', 'AWS', 'Kubernetes', 'CI/CD'],
        bio: 'DevOps engineer passionate about automation and cloud infrastructure. Love teaching best practices in deployment and scaling.',
        experience: 'Senior DevOps Engineer at Amazon',
        hourlyRate: 110,
        rating: 4.9,
        totalSessions: 112,
        languages: ['English', 'German'],
        education: [
          { degree: 'BS in Computer Engineering', institution: 'Georgia Tech', year: '2013' }
        ],
        certifications: [
          { name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2020' },
          { name: 'Certified Kubernetes Administrator', issuer: 'CNCF', year: '2021' }
        ],
        availability: [
          { day: 'Monday', slots: [{ startTime: '18:00', endTime: '21:00' }] },
          { day: 'Wednesday', slots: [{ startTime: '18:00', endTime: '21:00' }] },
          { day: 'Friday', slots: [{ startTime: '18:00', endTime: '21:00' }] }
        ]
      }
    ]);
    console.log('Created mentor profiles');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nTest Credentials:');
    console.log('==================');
    console.log('\nStudent Account:');
    console.log('Email: alice@example.com');
    console.log('Password: Test@123');
    console.log('\nMentor Account:');
    console.log('Email: sarah@example.com');
    console.log('Password: Test@123');
    console.log('\n==================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
  await seedData();
};

run();
