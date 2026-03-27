const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Review = require('../models/Review');
const Action = require('../models/Action');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Clear old data
    await User.deleteMany();
    await Review.deleteMany();
    await Action.deleteMany();
    await Notification.deleteMany();

    // 👤 10 Users
    const users = await User.insertMany([
      { name: "Alice", email: "alice@example.com", password: "123456" },
      { name: "Bob", email: "bob@example.com", password: "123456" },
      { name: "Charlie", email: "charlie@example.com", password: "123456" },
      { name: "David", email: "david@example.com", password: "123456" },
      { name: "Emma", email: "emma@example.com", password: "123456" },
      { name: "Frank", email: "frank@example.com", password: "123456" },
      { name: "Grace", email: "grace@example.com", password: "123456" },
      { name: "Hannah", email: "hannah@example.com", password: "123456" },
      { name: "Ivy", email: "ivy@example.com", password: "123456" },
      { name: "Jack", email: "jack@example.com", password: "123456" }
    ]);

    console.log("Users Created");

    // 📝 Reviews (mix real & fake)
    const reviews = await Review.insertMany([
      { user: users[0]._id, content: "Amazing product!", rating: 5, aiScore: 0.1, label: "real" },
      { user: users[1]._id, content: "Best product ever buy now!!!", rating: 5, aiScore: 0.95, label: "fake", status: "flagged" },
      { user: users[2]._id, content: "Good quality, satisfied.", rating: 4, aiScore: 0.2, label: "real" },
      { user: users[3]._id, content: "Worst product, waste of money", rating: 1, aiScore: 0.3, label: "real" },
      { user: users[4]._id, content: "Limited offer!!! click now!!!", rating: 5, aiScore: 0.9, label: "fake", status: "flagged" },
      { user: users[5]._id, content: "Decent for the price", rating: 3, aiScore: 0.25, label: "real" },
      { user: users[6]._id, content: "Absolutely loved it!", rating: 5, aiScore: 0.15, label: "real" },
      { user: users[7]._id, content: "Fake review spam buy now!!!", rating: 5, aiScore: 0.97, label: "fake", status: "flagged" },
      { user: users[8]._id, content: "Not bad, could improve", rating: 3, aiScore: 0.35, label: "real" },
      { user: users[9]._id, content: "Terrible experience", rating: 1, aiScore: 0.4, label: "real" }
    ]);

    console.log("Reviews Created");

    // ⚡ Actions (for fake reviews)
    const actions = await Action.insertMany([
      { review: reviews[1]._id, actionType: "flag", reason: "Spam detected", performedBy: "ai" },
      { review: reviews[4]._id, actionType: "flag", reason: "Promotional spam", performedBy: "ai" },
      { review: reviews[7]._id, actionType: "flag", reason: "Repeated fake pattern", performedBy: "ai" }
    ]);

    console.log("Actions Created");

    // 🔔 Notifications (only for flagged users)
    const notifications = await Notification.insertMany([
      { user: users[1]._id, message: "Your review was flagged as fake", type: "review_flagged" },
      { user: users[4]._id, message: "Your review was flagged as spam", type: "review_flagged" },
      { user: users[7]._id, message: "Your review was flagged by AI", type: "review_flagged" }
    ]);

    console.log("Notifications Created");

    console.log("✅ SEEDING DONE");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();