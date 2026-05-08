import { MongoClient } from "mongodb";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("[mongodb.ts] DATABASE_URL is not set for MongoDB");
  throw new Error("DATABASE_URL is not set for MongoDB");
}

console.log("[mongodb.ts] DATABASE_URL found, initializing MongoClient");

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

export const mongoClient = globalForMongo.mongoClient ?? new MongoClient(url);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

export async function ensureConnected() {
  try {
    console.log("[mongodb.ts] ensureConnected called");

    // Connect to MongoDB (safe to call multiple times - it's idempotent)
    const connectResult = await mongoClient.connect();
    console.log("[mongodb.ts] connect() completed, result:", !!connectResult);

    // Verify connection by doing a simple ping
    const admin = mongoClient.db("admin");
    const pingResult = await admin.command({ ping: 1 });
    console.log("[mongodb.ts] MongoDB ping successful:", pingResult);
  } catch (error) {
    console.error("[mongodb.ts] Failed to ensure MongoDB connection:", error);
    throw error;
  }
}

export function getDb(dbName = "portfolio_generator") {
  const db = mongoClient.db(dbName);
  console.log("[mongodb.ts] Returning database instance:", dbName);
  return db;
}
