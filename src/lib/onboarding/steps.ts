/**
 * Source of truth for the onboarding step order. Each "data step" appears here
 * exactly once; reordering or inserting a step is a one-line change. Screens
 * navigate via getNextStep() instead of hard-coding their successor route, so
 * the order can be swapped (or A/B tested) without touching every screen.
 *
 * The terminal `calculating` route is *not* in this array — it is the implicit
 * "done" target after the last data step. `welcome` and `tarot-reveal` are also
 * outside the array because they are not user-input steps and their position
 * is fixed.
 */
export type OnboardingStepId = 'name' | 'birth-date' | 'birth-location' | 'birth-time';

export const ONBOARDING_STEPS: readonly OnboardingStepId[] = [
  'name',
  'birth-date',
  'birth-location',
  'birth-time',
] as const;

export type OnboardingNext = OnboardingStepId | 'calculating';

export function getNextStep(current: OnboardingStepId): OnboardingNext {
  const i = ONBOARDING_STEPS.indexOf(current);
  if (i === -1 || i === ONBOARDING_STEPS.length - 1) return 'calculating';
  return ONBOARDING_STEPS[i + 1];
}

export function getStepIndex(current: OnboardingStepId): { index: number; total: number } {
  const i = ONBOARDING_STEPS.indexOf(current);
  return { index: i + 1, total: ONBOARDING_STEPS.length };
}
