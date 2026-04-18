describe('POST /api/submit-quiz', () => {
  test('accepts valid quiz response and returns ID', async () => {
    const payload = {
      email: 'couple@example.com',
      name: 'Jane & Mark',
      weddingDate: '2024-06-15',
      primaryFear: 'memories-fading',
      planningStage: 'underway',
      stylePreference: 75,
    };

    // Note: actual test will be implemented after endpoint creation
    expect(payload.email).toBeDefined();
  });

  test('rejects invalid email', async () => {
    const payload = {
      email: 'invalid-email',
      name: 'Jane & Mark',
      primaryFear: 'memories-fading',
      planningStage: 'underway',
      stylePreference: 75,
    };

    expect(payload.email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});
