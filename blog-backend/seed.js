// seed.js
// Run: node seed.js
// Optional wipe: node seed.js --wipe

require("./db"); // connects to MongoDB
const mongoose = require("mongoose");

const User = require("./models/userSchema");
const Blog = require("./models/blogschema");

const SEED_ADMIN = {
  name: "Admin",
  email: "admin@test.com",
  password: "Admin@12345", // will be hashed by userSchema pre-save hook
};

const seedBlogs = [
  {
    title: "Getting Started with React",
    description: "A beginner-friendly guide to understanding React and building your first component.",
    content:
      "React is a JavaScript library for building user interfaces.\n\nIt helps you build reusable components and manage state efficiently.\n\nIn this blog, we explore JSX, components, props, and state.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=60",
  },
  {
    title: "Understanding Node.js and Express",
    description: "Learn what Node.js does and why Express is used for APIs.",
    content:
      "Node.js lets JavaScript run on the server.\n\nExpress is a lightweight framework that helps with routing and middleware.\n\nTogether, they are a common backend stack for REST APIs.",
    image: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?auto=format&fit=crop&w=1200&q=60",
  },
  {
    title: "MongoDB for Beginners",
    description: "A simple introduction to MongoDB and document databases.",
    content:
      "MongoDB stores data in flexible JSON-like documents.\n\nUnlike SQL, you don’t need a fixed schema.\n\nThis makes it great for fast iteration and rapid development.",
    image: "https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=1200&q=60",
  },
  {
    title: "Authentication with JWT Explained",
    description: "What JWT is, how it works, and why modern apps use it.",
    content:
      "JWT stands for JSON Web Token.\n\nIt allows a server to verify a user without storing sessions.\n\nIt’s a popular approach for scalable authentication.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=60",
  },
  {
    title: "Deploying a Full Stack App",
    description: "How to deploy React + Node with correct environment and CORS settings.",
    content:
      "Typically you deploy frontend and backend separately.\n\nFrontend: Vercel/Netlify\nBackend: Render/Railway\n\nMake sure API URLs and CORS are configured correctly.",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1200&q=60",
  },
];

async function main() {
  const shouldWipe = process.argv.includes("--wipe");

  try {
    // Wait for mongoose connection to be ready
    await new Promise((resolve, reject) => {
      const db = mongoose.connection;

      if (db.readyState === 1) return resolve();

      db.once("open", resolve);
      db.once("error", reject);
    });

    console.log("✅ DB connected. Seeding...");

    // 1) Ensure admin user exists
    let admin = await User.findOne({ email: SEED_ADMIN.email });

    if (!admin) {
      admin = new User(SEED_ADMIN);
      await admin.save();
      console.log("✅ Admin user created:", admin.email);
    } else {
      console.log("ℹ️ Admin user already exists:", admin.email);
    }

    // 2) Optional wipe blogs
    if (shouldWipe) {
      const del = await Blog.deleteMany({});
      console.log(`🧹 Wiped blogs: ${del.deletedCount}`);
    }

    // 3) Insert blogs if they don't already exist by title
    let inserted = 0;

    for (const b of seedBlogs) {
      const exists = await Blog.findOne({ title: b.title });
      if (exists) {
        console.log("↩️ Blog already exists:", b.title);
        continue;
      }

      await Blog.create({
        ...b,
        author: admin._id,
      });

      console.log("✅ Inserted:", b.title);
      inserted++;
    }

    console.log(`🎉 Seeding complete. Inserted ${inserted} new blogs.`);
    console.log("🔐 Admin login:");
    console.log("   email:", SEED_ADMIN.email);
    console.log("   password:", SEED_ADMIN.password);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("🔌 DB connection closed.");
  }
}

main();