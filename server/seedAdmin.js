const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./db');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await connectDB();
        console.log('Connected to database...');

        const adminEmail = 'admin@mentorconnect.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists');
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('Updated existing user to admin role');
            }
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123!@#', salt);

            const adminUser = await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });

            console.log('Admin user created successfully');
        }

        console.log('-----------------------------------');
        console.log('Admin Credentials:');
        console.log('Email: admin@mentorconnect.com');
        console.log('Password: admin123!@#');
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
