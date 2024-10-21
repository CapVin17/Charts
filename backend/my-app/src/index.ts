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


// Function to get unique values for a specific field
const getUniqueValues = async (field: string) => {
  try {
    const collection = db?.collection("All-samples"); // Ensure you have the correct collection name
    const uniqueValues = await collection?.distinct(field);
    return uniqueValues;
  } catch (error) {
    console.error(`Error fetching unique values for ${field}:`, error);
    throw new Error(`Failed to fetch unique values for ${field}`);
  }
};

app.get("/api/unique/end_years", async (c) => {
  const endYears = await getUniqueValues("end_year");
  return c.json(endYears);
});

// Endpoint to get unique intensities
app.get("/api/unique/intensities", async (c) => {
  const intensities = await getUniqueValues("intensity");
  return c.json(intensities);
});

// Endpoint to get unique sectors
app.get("/api/unique/sectors", async (c) => {
  const sectors = await getUniqueValues("sector");
  return c.json(sectors);
});

// Endpoint to get unique topics
app.get("/api/unique/topics", async (c) => {
  const topics = await getUniqueValues("topic");
  return c.json(topics);
});

// Endpoint to get unique insights
app.get("/api/unique/insights", async (c) => {
  const insights = await getUniqueValues("insight");
  return c.json(insights);
});

// Endpoint to get unique URLs
app.get("/api/unique/urls", async (c) => {
  const urls = await getUniqueValues("url");
  return c.json(urls);
});

// Endpoint to get unique regions
app.get("/api/unique/regions", async (c) => {
  const regions = await getUniqueValues("region");
  return c.json(regions);
});

// Endpoint to get unique start years
app.get("/api/unique/start_years", async (c) => {
  const startYears = await getUniqueValues("start_year");
  return c.json(startYears);
});

// Endpoint to get unique impacts
app.get("/api/unique/impacts", async (c) => {
  const impacts = await getUniqueValues("impact");
  return c.json(impacts);
});

// Endpoint to get unique added dates
app.get("/api/unique/added", async (c) => {
  const addedDates = await getUniqueValues("added");
  return c.json(addedDates);
});

// Endpoint to get unique published dates
app.get("/api/unique/published", async (c) => {
  const publishedDates = await getUniqueValues("published");
  return c.json(publishedDates);
});

// Endpoint to get unique countries
app.get("/api/unique/countries", async (c) => {
  const countries = await getUniqueValues("country");
  return c.json(countries);
});

// Endpoint to get unique relevances
app.get("/api/unique/relevances", async (c) => {
  const relevances = await getUniqueValues("relevance");
  return c.json(relevances);
});

// Endpoint to get unique pestle categories
app.get("/api/unique/pestle", async (c) => {
  const pestleCategories = await getUniqueValues("pestle");
  return c.json(pestleCategories);
});

// Endpoint to get unique sources
app.get("/api/unique/sources", async (c) => {
  const sources = await getUniqueValues("source");
  return c.json(sources);
});

// Endpoint to get unique titles
app.get("/api/unique/titles", async (c) => {
  const titles = await getUniqueValues("title");
  return c.json(titles);
});

// Endpoint to get unique likelihoods
app.get("/api/unique/likelihoods", async (c) => {
  const likelihoods = await getUniqueValues("likelihood");
  return c.json(likelihoods);
});


export default {
  port,
  fetch: app.fetch,
};
