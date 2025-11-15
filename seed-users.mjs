import { drizzle } from "drizzle-orm/mysql2";
import { users } from "./drizzle/schema.js";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function seedUsers() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  console.log("Seeding demo users...");

  const demoUsers = [
    {
      username: "admin9197",
      password: "Admin9197",
      name: "AL AMIN",
      role: "admin",
      email: "admin@amintouch.com",
      loginMethod: "local",
    },
    {
      username: "ronytalukder",
      password: "@jead2016R",
      name: "RONY TALUKDER",
      role: "user",
      email: "rony@amintouch.com",
      loginMethod: "local",
    },
    {
      username: "mahir",
      password: "Mahir3",
      name: "MAHIR",
      role: "user",
      email: "mahir@amintouch.com",
      loginMethod: "local",
    },
    {
      username: "sakiladnan",
      password: "Sakiladnan",
      name: "SAKIL ADNAN",
      role: "user",
      email: "sakil@amintouch.com",
      loginMethod: "local",
    },
  ];

  for (const user of demoUsers) {
    try {
      await db.insert(users).values(user);
      console.log(`✓ Created user: ${user.username} (${user.name})`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⚠ User ${user.username} already exists, skipping...`);
      } else {
        console.error(`✗ Error creating user ${user.username}:`, error.message);
      }
    }
  }

  await connection.end();
  console.log("\nDemo users seeding completed!");
}

seedUsers().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
