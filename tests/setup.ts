import { beforeAll, afterAll, afterEach } from 'vitest';

import { server } from '../src/mocks/server';

beforeAll(() => {
  console.log('Tests starting...');
  server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => {
  server.close();
  console.log('Tests completed.');
});
