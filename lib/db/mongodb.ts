import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      let uri = process.env.MONGODB_URI;

      if (!uri) {
        console.warn('⚠️ MONGODB_URI not specified. Falling back to an isolated in-memory MongoDB instance for this session.');
        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          const mongod = await MongoMemoryServer.create();
          uri = mongod.getUri();
          console.log(`✅ In-Memory MongoDB initialized at: ${uri}`);
        } catch (err) {
          console.error('Failed to initialize MongoMemoryServer:', err);
          throw new Error('Database connection failed and MongoMemoryServer could not start.');
        }
      }

      const opts: mongoose.ConnectOptions = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      };

      const connection = await mongoose.connect(uri, opts);
      console.log('✅ Connected to MongoDB persistence layer.');
      return connection;
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
