import { ZODIAC_THEMES } from '@lib/astrology/zodiac-themes';
import type { ZodiacSign } from '@lib/astrology/calculate-signs';

const ALL_SIGNS: ZodiacSign[] = [
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
];

describe('ZODIAC_THEMES', () => {
  it('has entries for all 12 zodiac signs', () => {
    ALL_SIGNS.forEach(sign => {
      expect(ZODIAC_THEMES).toHaveProperty(sign);
    });
  });

  it('has no extra entries beyond the 12 canonical signs', () => {
    expect(Object.keys(ZODIAC_THEMES)).toHaveLength(12);
  });

  describe.each(ALL_SIGNS)('%s', sign => {
    it('has a non-empty glyph string', () => {
      expect(ZODIAC_THEMES[sign].glyph.length).toBeGreaterThan(0);
    });

    it('has a valid element', () => {
      expect(['fire', 'earth', 'air', 'water']).toContain(ZODIAC_THEMES[sign].element);
    });

    it('has a gradient tuple of exactly 2 hex colors', () => {
      const { gradient } = ZODIAC_THEMES[sign];
      expect(gradient).toHaveLength(2);
      gradient.forEach(color => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it('has two distinct gradient colors', () => {
      const [c1, c2] = ZODIAC_THEMES[sign].gradient;
      expect(c1).not.toBe(c2);
    });
  });

  // Traditional astrology element assignments
  it('assigns fire element to Aries, Leo, Sagittarius', () => {
    expect(ZODIAC_THEMES['Aries'].element).toBe('fire');
    expect(ZODIAC_THEMES['Leo'].element).toBe('fire');
    expect(ZODIAC_THEMES['Sagittarius'].element).toBe('fire');
  });

  it('assigns earth element to Taurus, Virgo, Capricorn', () => {
    expect(ZODIAC_THEMES['Taurus'].element).toBe('earth');
    expect(ZODIAC_THEMES['Virgo'].element).toBe('earth');
    expect(ZODIAC_THEMES['Capricorn'].element).toBe('earth');
  });

  it('assigns air element to Gemini, Libra, Aquarius', () => {
    expect(ZODIAC_THEMES['Gemini'].element).toBe('air');
    expect(ZODIAC_THEMES['Libra'].element).toBe('air');
    expect(ZODIAC_THEMES['Aquarius'].element).toBe('air');
  });

  it('assigns water element to Cancer, Scorpio, Pisces', () => {
    expect(ZODIAC_THEMES['Cancer'].element).toBe('water');
    expect(ZODIAC_THEMES['Scorpio'].element).toBe('water');
    expect(ZODIAC_THEMES['Pisces'].element).toBe('water');
  });

  it('assigns the correct Unicode glyphs', () => {
    const expectedGlyphs: Record<ZodiacSign, string> = {
      Aries: '♈',
      Taurus: '♉',
      Gemini: '♊',
      Cancer: '♋',
      Leo: '♌',
      Virgo: '♍',
      Libra: '♎',
      Scorpio: '♏',
      Sagittarius: '♐',
      Capricorn: '♑',
      Aquarius: '♒',
      Pisces: '♓',
    };
    ALL_SIGNS.forEach(sign => {
      expect(ZODIAC_THEMES[sign].glyph).toBe(expectedGlyphs[sign]);
    });
  });
});
