describe('POST /api/submit-quiz', () => {
  const BASE_URL = 'http://localhost:3000';

  test('accepts valid quiz response and returns ID', async () => {
    const payload = {
      email: 'couple@example.com',
      name: 'Jane & Mark',
      weddingDate: '2024-06-15',
      primaryFear: 'memories-fading',
      planningStage: 'underway',
      stylePreference: 75,
    };

    const response = await fetch(`${BASE_URL}/api/submit-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();
    expect(typeof data.id).toBe('string');
    expect(data.archetype).toBeDefined();
    expect(typeof data.archetype).toBe('string');
    expect(data.recommendedPackage).toBeDefined();
    expect(typeof data.recommendedPackage).toBe('string');
  });

  test('rejects invalid email', async () => {
    const payload = {
      email: 'invalid-email',
      name: 'Jane & Mark',
      primaryFear: 'memories-fading',
      planningStage: 'underway',
      stylePreference: 75,
    };

    const response = await fetch(`${BASE_URL}/api/submit-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.errors).toBeDefined();
    expect(Array.isArray(data.errors)).toBe(true);
    expect(data.errors.some((err: { field: string }) => err.field === 'email')).toBe(true);
  });

  test('rejects missing email', async () => {
    const payload = {
      name: 'Jane & Mark',
      primaryFear: 'memories-fading',
      planningStage: 'underway',
      stylePreference: 75,
    };

    const response = await fetch(`${BASE_URL}/api/submit-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.errors).toBeDefined();
  });

  test('rejects invalid stylePreference (outside 0-100 range)', async () => {
    const payload = {
      email: 'couple@example.com',
      name: 'Jane & Mark',
      primaryFear: 'memories-fading',
      planningStage: 'underway',
      stylePreference: 150,
    };

    const response = await fetch(`${BASE_URL}/api/submit-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.errors.some((err: { field: string }) => err.field === 'stylePreference')).toBe(true);
  });

  test('rejects missing required fields', async () => {
    const payload = {
      email: 'couple@example.com',
      name: 'Jane & Mark',
    };

    const response = await fetch(`${BASE_URL}/api/submit-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.errors).toBeDefined();
    expect(data.errors.length).toBeGreaterThan(0);
  });

  test('accepts valid response with optional weddingDate', async () => {
    const payload = {
      email: 'another@example.com',
      name: 'John & Sarah',
      primaryFear: 'guest-conflict',
      planningStage: 'planning',
      stylePreference: 45,
    };

    const response = await fetch(`${BASE_URL}/api/submit-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();
    expect(data.archetype).toBeDefined();
    expect(data.recommendedPackage).toBeDefined();
  });

  test('rejects empty name', async () => {
    const payload = {
      email: 'couple@example.com',
      name: '   ',
      primaryFear: 'memories-fading',
      planningStage: 'underway',
      stylePreference: 75,
    };

    const response = await fetch(`${BASE_URL}/api/submit-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.errors.some((err: { field: string }) => err.field === 'name')).toBe(true);
  });

  test('rejects invalid primaryFear value', async () => {
    const payload = {
      email: 'couple@example.com',
      name: 'Jane & Mark',
      primaryFear: 'invalid-fear',
      planningStage: 'underway',
      stylePreference: 75,
    };

    const response = await fetch(`${BASE_URL}/api/submit-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.errors.some((err: { field: string }) => err.field === 'primaryFear')).toBe(true);
  });

  test('rejects invalid planningStage value', async () => {
    const payload = {
      email: 'couple@example.com',
      name: 'Jane & Mark',
      primaryFear: 'memories-fading',
      planningStage: 'invalid-stage',
      stylePreference: 75,
    };

    const response = await fetch(`${BASE_URL}/api/submit-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.errors.some((err: { field: string }) => err.field === 'planningStage')).toBe(true);
  });
});
