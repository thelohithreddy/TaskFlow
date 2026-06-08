import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_ACCESS_SECRET = 'test-access-secret-key-minimum-32-chars';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-minimum-32-chars';
  process.env.NODE_ENV = 'test';

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});
