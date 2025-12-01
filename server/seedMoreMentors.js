const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const User = require('./models/User');
const Mentor = require('./models/Mentor');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mentorconnect');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const expertiseList = [
    'Software Engineering', 'Data Science', 'Product Design', 'Marketing',
    'DevOps', 'Business Strategy', 'Career Development', 'Cybersecurity',
    'Cloud Computing', 'Mobile Development'
];

const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);

const seedMoreMentors = async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Test@123', salt);

        const newMentors = [];
        const newUsers = [];

        console.log('Generating 20 more mentors...');

        for (let i = 0; i < 20; i++) {
            const firstName = getRandomElement(firstNames);
            const lastName = getRandomElement(lastNames);
            const name = `${firstName} ${lastName} ${i}`; // Append index to ensure uniqueness if names repeat
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;

            const user = new User({
                name,
                email,
                password: hashedPassword,
                role: 'mentor'
            });
            newUsers.push(user);

            const expertiseCount = getRandomInt(1, 3);
            const mentorExpertise = [];
            for (let j = 0; j < expertiseCount; j++) {
                const exp = getRandomElement(expertiseList);
                if (!mentorExpertise.includes(exp)) mentorExpertise.push(exp);
            }

            const mentor = new Mentor({
                userId: user._id,
                expertise: mentorExpertise,
                bio: `Experienced professional in ${mentorExpertise.join(', ')}. Passionate about helping others grow.`,
                experience: `${getRandomInt(3, 15)} years in industry`,
                hourlyRate: getRandomInt(50, 200),
                rating: getRandomFloat(3.5, 5.0),
                totalSessions: getRandomInt(0, 50),
                languages: ['English'],
                availability: [
                    { day: 'Monday', slots: [{ startTime: '09:00', endTime: '17:00' }] },
                    { day: 'Wednesday', slots: [{ startTime: '10:00', endTime: '16:00' }] }
                ]
            });
            newMentors.push(mentor);
        }

        await User.insertMany(newUsers);
        await Mentor.insertMany(newMentors);

        console.log('Successfully added 20 more mentors!');

        const totalMentors = await Mentor.countDocuments();
        console.log(`Total mentors in DB: ${totalMentors}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding more mentors:', error);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();
    await seedMoreMentors();
};

run();
