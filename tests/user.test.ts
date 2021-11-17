import axios from 'axios';

jest.setTimeout(30000);

describe('routes -> user.ts', () => {
  test('POST -> valid request body', async () => {
    const response = await axios.post(
      '/user',
      {
        username: 'Test',
        email: 'test-email@gmail.com',
        password: 'test-password',
      },
    );
    expect(response.status).toBe(200);
  });

  test('POST -> invalid request body', async () => {
    try {
      await axios.post(
        '/user',
        {
          username: 'Test',
          email: 'test@gmail.com',
        },
      );
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        if (error.response) {
          expect(error.response.status).toEqual(400);
          expect(error.response.data.message).toEqual(
            'The field \'password\' is missing in the request body',
          );
        } else {
          throw Error('error.response is undefined');
        }
      }
    }
  });
});
