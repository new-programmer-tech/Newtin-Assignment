const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');
const Contact = require('../models/Contact');

dotenv.config();

console.log("MONGODB_URI::::",process.env.MONGODB_URI)

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Contact.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        email: 'john@example.com',
        password: 'password123'
      },
      {
        email: 'jane@example.com',
        password: 'password123'
      }
    ]);

    console.log('Created users:', users.map(u => u.email));

    const johnContacts = await Contact.create([
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        phone: '+1234567890',
        type: 'personal',
        user: users[0]._id
      },
      {
        name: 'Bob Smith',
        email: 'bob.smith@company.com',
        phone: '+1234567891',
        type: 'work',
        user: users[0]._id
      },
      {
        name: 'Carol Williams',
        email: 'carol.williams@email.com',
        phone: '+1234567892',
        type: 'personal',
        user: users[0]._id
      },
      {
        name: 'David Brown',
        email: 'david.brown@business.com',
        phone: '+1234567893',
        type: 'work',
        user: users[0]._id
      },
      {
        name: 'Emma Davis',
        email: 'emma.davis@email.com',
        phone: '+1234567894',
        type: 'personal',
        user: users[0]._id
      }
    ]);

    const janeContacts = await Contact.create([
      {
        name: 'Frank Miller',
        email: 'frank.miller@email.com',
        phone: '+1234567895',
        type: 'personal',
        user: users[1]._id
      },
      {
        name: 'Grace Wilson',
        email: 'grace.wilson@corp.com',
        phone: '+1234567896',
        type: 'work',
        user: users[1]._id
      },
      {
        name: 'Henry Taylor',
        email: 'henry.taylor@email.com',
        phone: '+1234567897',
        type: 'personal',
        user: users[1]._id
      },
      {
        name: 'Isabella Moore',
        email: 'isabella.moore@enterprise.com',
        phone: '+1234567898',
        type: 'work',
        user: users[1]._id
      },
      {
        name: 'Jack Anderson',
        email: 'jack.anderson@email.com',
        phone: '+1234567899',
        type: 'personal',
        user: users[1]._id
      }
    ]);

    console.log(`Created ${johnContacts.length} contacts for John`);
    console.log(`Created ${janeContacts.length} contacts for Jane`);
    console.log('Seed data created successfully!');

    // Display demo credentials
    console.log('\n=== DEMO CREDENTIALS ===');
    console.log('User 1:');
    console.log('  Email: john@example.com');
    console.log('  Password: password123');
    console.log('\nUser 2:');
    console.log('  Email: jane@example.com');
    console.log('  Password: password123');
    console.log('========================\n');

  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedData();