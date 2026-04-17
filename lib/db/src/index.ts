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
}

if (!global._mongoClientPromise) {
  global._mongoClientPromise = new MongoClient(uri).connect();
}

const connectedClient = await global._mongoClientPromise;
const db: Db = connectedClient.db(dbName);
const client: MongoClient = connectedClient;

export { client, db };
