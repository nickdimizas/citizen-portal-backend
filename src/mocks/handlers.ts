import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:9999/placeholder', () => {
    return HttpResponse.json({ message: 'This is a mock response' });
  }),
];
