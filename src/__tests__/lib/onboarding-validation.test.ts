import {
  onboardingParamsSchema,
  astrologyDataSchema,
  userOnboardingUpdateSchema,
} from '@lib/validation/onboarding';

// ── onboardingParamsSchema ────────────────────────────────────────────────────

describe('onboardingParamsSchema', () => {
  const valid = {
    displayName: 'Luna',
    birthDate: '1990-06-15',
    birthTime: '14:30',
    birthLocation: 'New York, NY',
  };

  it('accepts a valid payload', () => {
    expect(onboardingParamsSchema.safeParse(valid).success).toBe(true);
  });

  describe('displayName', () => {
    it('rejects empty string', () => {
      const r = onboardingParamsSchema.safeParse({ ...valid, displayName: '' });
      expect(r.success).toBe(false);
    });

    it('rejects name over 50 chars', () => {
      const r = onboardingParamsSchema.safeParse({ ...valid, displayName: 'A'.repeat(51) });
      expect(r.success).toBe(false);
    });

    it('trims whitespace', () => {
      const r = onboardingParamsSchema.safeParse({ ...valid, displayName: '  Luna  ' });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.displayName).toBe('Luna');
    });
  });

  describe('birthDate', () => {
    it('rejects a non-date string', () => {
      const r = onboardingParamsSchema.safeParse({ ...valid, birthDate: 'not-a-date' });
      expect(r.success).toBe(false);
    });

    it('rejects a date before 1900-01-01', () => {
      const r = onboardingParamsSchema.safeParse({ ...valid, birthDate: '1899-12-31' });
      expect(r.success).toBe(false);
    });

    it('rejects a future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const r = onboardingParamsSchema.safeParse({
        ...valid,
        birthDate: futureDate.toISOString().split('T')[0],
      });
      expect(r.success).toBe(false);
    });
  });

  describe('birthTime', () => {
    it('accepts boundary times 00:00 and 23:59', () => {
      expect(onboardingParamsSchema.safeParse({ ...valid, birthTime: '00:00' }).success).toBe(true);
      expect(onboardingParamsSchema.safeParse({ ...valid, birthTime: '23:59' }).success).toBe(true);
    });

    it('rejects 24:00', () => {
      const r = onboardingParamsSchema.safeParse({ ...valid, birthTime: '24:00' });
      expect(r.success).toBe(false);
    });

    it('rejects missing colon', () => {
      const r = onboardingParamsSchema.safeParse({ ...valid, birthTime: '1430' });
      expect(r.success).toBe(false);
    });
  });

  describe('birthLocation', () => {
    it('rejects a single character', () => {
      const r = onboardingParamsSchema.safeParse({ ...valid, birthLocation: 'X' });
      expect(r.success).toBe(false);
    });

    it('rejects over 200 chars', () => {
      const r = onboardingParamsSchema.safeParse({ ...valid, birthLocation: 'A'.repeat(201) });
      expect(r.success).toBe(false);
    });
  });
});

// ── astrologyDataSchema ───────────────────────────────────────────────────────

describe('astrologyDataSchema', () => {
  const valid = { sunSign: 'Gemini', moonSign: 'Scorpio', risingSign: 'Aries' };

  it('accepts valid signs', () => {
    expect(astrologyDataSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects an invalid sign', () => {
    const r = astrologyDataSchema.safeParse({ ...valid, sunSign: 'Ophiuchus' });
    expect(r.success).toBe(false);
  });

  it('rejects lowercase sign names', () => {
    const r = astrologyDataSchema.safeParse({ ...valid, moonSign: 'scorpio' });
    expect(r.success).toBe(false);
  });
});

// ── userOnboardingUpdateSchema ────────────────────────────────────────────────

describe('userOnboardingUpdateSchema', () => {
  const valid = {
    display_name: 'Luna',
    birth_date: '1990-06-15',
    birth_time: '14:30',
    birth_location: 'New York, NY',
    sun_sign: 'Gemini',
    moon_sign: 'Scorpio',
    rising_sign: 'Aries',
    onboarding_completed: true as const,
  };

  it('accepts a valid payload', () => {
    expect(userOnboardingUpdateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects birth_date not in YYYY-MM-DD format', () => {
    const r = userOnboardingUpdateSchema.safeParse({ ...valid, birth_date: '06/15/1990' });
    expect(r.success).toBe(false);
  });

  it('rejects onboarding_completed: false', () => {
    const r = userOnboardingUpdateSchema.safeParse({ ...valid, onboarding_completed: false });
    expect(r.success).toBe(false);
  });
});
