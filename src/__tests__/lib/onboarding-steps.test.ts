import {
  getNextStep,
  getStepIndex,
  ONBOARDING_STEPS,
  type OnboardingStepId,
} from '@lib/onboarding/steps';

describe('ONBOARDING_STEPS', () => {
  it('contains exactly 4 steps in the expected order', () => {
    expect(ONBOARDING_STEPS).toEqual(['name', 'birth-date', 'birth-location', 'birth-time']);
  });
});

describe('getNextStep', () => {
  it('name → birth-date', () => {
    expect(getNextStep('name')).toBe('birth-date');
  });

  it('birth-date → birth-location', () => {
    expect(getNextStep('birth-date')).toBe('birth-location');
  });

  it('birth-location → birth-time', () => {
    expect(getNextStep('birth-location')).toBe('birth-time');
  });

  it('birth-time → calculating (last step)', () => {
    expect(getNextStep('birth-time')).toBe('calculating');
  });

  it('returns calculating for an unrecognised step id', () => {
    // Cast to bypass TS — guards against runtime misuse from JS callers or future renames.
    expect(getNextStep('unknown' as OnboardingStepId)).toBe('calculating');
  });
});

describe('getStepIndex', () => {
  it.each([
    ['name', 1],
    ['birth-date', 2],
    ['birth-location', 3],
    ['birth-time', 4],
  ] as [OnboardingStepId, number][])(
    '%s → index %i of %i',
    (step, expectedIndex) => {
      const { index, total } = getStepIndex(step);
      expect(index).toBe(expectedIndex);
      expect(total).toBe(ONBOARDING_STEPS.length);
    }
  );
});
