import { z } from 'zod';

const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const;

const today = () => new Date();
const minDate = new Date('1900-01-01');

/**
 * Validates the raw query params passed into the calculating screen from the
 * onboarding router. All three values arrive as strings.
 */
export const onboardingParamsSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or fewer')
    .trim(),

  birthDate: z
    .string()
    .min(1, 'Birth date is required')
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: 'Birth date is not a valid date string',
    })
    .refine(
      (val) => {
        const date = new Date(val);
        return date >= minDate && date <= today();
      },
      { message: 'Birth date must be between 1 January 1900 and today' }
    ),

  birthTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Birth time must be in HH:mm format (00:00 – 23:59)'),

  birthLocation: z
    .string()
    .min(2, 'Birth location must be at least 2 characters')
    .max(200, 'Birth location must be 200 characters or fewer'),
});

/**
 * Validates the astrology data returned by calculateAstrologyData() before it
 * is written to the database.
 */
export const astrologyDataSchema = z.object({
  sunSign: z.enum(ZODIAC_SIGNS, { message: 'Sun sign must be a valid zodiac sign' }),
  moonSign: z.enum(ZODIAC_SIGNS, { message: 'Moon sign must be a valid zodiac sign' }),
  risingSign: z.enum(ZODIAC_SIGNS, { message: 'Rising sign must be a valid zodiac sign' }),
});

/**
 * Validates the full payload that will be sent to the `users` table update.
 */
export const userOnboardingUpdateSchema = z.object({
  display_name: z.string().min(1).max(50),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formatted birth date must be in YYYY-MM-DD format'),
  birth_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Birth time must be in HH:mm format'),
  birth_location: z.string().min(2).max(200),
  sun_sign: z.enum(ZODIAC_SIGNS),
  moon_sign: z.enum(ZODIAC_SIGNS),
  rising_sign: z.enum(ZODIAC_SIGNS),
  onboarding_completed: z.literal(true),
});

export type OnboardingParams = z.infer<typeof onboardingParamsSchema>;
export type AstrologyData = z.infer<typeof astrologyDataSchema>;
export type UserOnboardingUpdate = z.infer<typeof userOnboardingUpdateSchema>;
