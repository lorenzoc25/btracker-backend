import axios from 'axios';

jest.setTimeout(30000);

describe('routes -> deleteTracking.ts', () => {
  test('POST -> valid request body', async () => {
    await axios.get(
      '/tracking/9361289711007322452059',
    );
    const response = await axios.delete(
      '/deleteTracking/9361289711007322452059',
    );
    expect(response.status).toBe(200);
  });
});

describe('routes -> updateTracking.ts', () => {
  test('POST -> valid request body', async () => {
    await axios.get(
      '/tracking/9361289711007322452059',
    );
    const response = await axios.post(
      '/updateTracking',
      {
        tracking: '9361289711007322452059',
        name: 'nmsl',
      },
    );
    expect(response.status).toBe(200);
  });
  test('POST -> invalid request body', async () => {
    await axios.get(
      '/tracking/9361289711007322452059',
    );
    try {
      await axios.post(
        '/updateTracking',
      );
    } catch (error) {
      if (
        axios.isAxiosError(error)
      ) {
        if (error.response) {
          expect(error.response.status).toEqual(400);
        } else {
          throw Error('error.response is undefined');
        }
      }
    }
  });
});
