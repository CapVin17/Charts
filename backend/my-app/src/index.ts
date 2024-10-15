import { Hono } from "hono";
import { MongoClient, Db } from "mongodb";

const app = new Hono();
const port = 3000;

let db: Db | null = null;

async function connectToMongo(uri: string): Promise<void> {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db("JsonData"); 
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}


app.use("*", async (c, next) => {
  const MONGO_URI = Bun.env.MONGO_URI; 
  if (!MONGO_URI) {
    throw new Error("MONGODB_URI is wrong");
  }
  if (!db) {
    await connectToMongo(MONGO_URI);
  }
  return next();
});

app.get("/", (c) => c.text("Hello Hono!!"));

app.get("/api/data", async (c) => {
  try {
    const collection = db?.collection("All-samples"); 
    const data = await collection?.find({}).toArray();
    console.log("Ten samples : " + data);
    return c.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return c.json({ error: "Failed to fetch data" }, 500); 
  }
});

export default {
  port,
  fetch: app.fetch,
};
