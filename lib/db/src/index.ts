import { MongoClient, Db, ObjectId } from "mongodb";
export { ObjectId, MongoClient, Db };

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI must be set. Please check your environment variables.",
  );
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "invoicekit";

/**
 * Global connection cache — shared across hot-reloads in dev and
 * across module re-initializations in serverless cold starts in prod.
 * Rule: server-no-shared-module-state / server-hoist-static-io
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

const options = {};

if (!global._mongoClient) {
  global._mongoClient = new MongoClient(uri, options);
  global._mongoClientPromise = global._mongoClient.connect();
}

const client = global._mongoClient;
const clientPromise = global._mongoClientPromise;
const db: Db = client.db(dbName);

export { client, clientPromise, db };
