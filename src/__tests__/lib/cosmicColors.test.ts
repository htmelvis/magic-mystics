import { resolveColor, buildGradientColors } from '@lib/colors/cosmicColors';
import { theme } from '@theme';

const DEEP_SPACE = theme.colors.brand.cosmic.deepSpace;

describe('resolveColor', () => {
  it('resolves known color names to hex values', () => {
    expect(resolveColor('red')).toBe('#7f1d1d');
    expect(resolveColor('indigo')).toBe('#1e1b4b');
    expect(resolveColor('gold')).toBe('#78350f');
    expect(resolveColor('teal')).toBe('#134e4a');
  });

  it('is case-insensitive', () => {
    expect(resolveColor('Red')).toBe(resolveColor('red'));
    expect(resolveColor('INDIGO')).toBe(resolveColor('indigo'));
    expect(resolveColor('Gold')).toBe(resolveColor('gold'));
  });

  it('trims surrounding whitespace', () => {
    expect(resolveColor('  blue  ')).toBe(resolveColor('blue'));
  });

  it('falls back to deepSpace for unknown color names', () => {
    expect(resolveColor('ultraviolet')).toBe(DEEP_SPACE);
    expect(resolveColor('')).toBe(DEEP_SPACE);
    expect(resolveColor('chartreuse')).toBe(DEEP_SPACE);
  });
});

describe('buildGradientColors', () => {
  it('returns a two-color fallback when luckyColors is null', () => {
    const colors = buildGradientColors(null);
    expect(colors).toHaveLength(2);
    expect(colors[0]).toBe(DEEP_SPACE);
  });

  it('returns a two-color fallback when luckyColors is an empty array', () => {
    const colors = buildGradientColors([]);
    expect(colors).toHaveLength(2);
    expect(colors[0]).toBe(DEEP_SPACE);
  });

  it('returns [resolvedColor, deepSpace] when only one color resolves', () => {
    // 'teal' (#134e4a) is distinct from deepSpace so it survives the filter
    const colors = buildGradientColors(['teal']);
    expect(colors).toHaveLength(2);
    expect(colors[0]).toBe(resolveColor('teal'));
    expect(colors[1]).toBe(DEEP_SPACE);
  });

  it('returns [c1, c2, deepSpace] when two colors resolve', () => {
    const colors = buildGradientColors(['red', 'gold']);
    expect(colors).toHaveLength(3);
    expect(colors[0]).toBe(resolveColor('red'));
    expect(colors[1]).toBe(resolveColor('gold'));
    expect(colors[2]).toBe(DEEP_SPACE);
  });

  it('filters out unresolvable colors before building the gradient', () => {
    // 'ultraviolet' is unknown → stripped; only 'teal' survives
    const colors = buildGradientColors(['ultraviolet', 'teal']);
    expect(colors).toHaveLength(2);
    expect(colors[0]).toBe(resolveColor('teal'));
    expect(colors[1]).toBe(DEEP_SPACE);
  });

  it('filters out colors that resolve to deepSpace itself', () => {
    // 'indigo' (#1e1b4b) equals deepSpace, so it is stripped as a background duplicate
    const colors = buildGradientColors(['indigo']);
    expect(colors).toHaveLength(2);
    expect(colors[0]).toBe(DEEP_SPACE);
  });

  it('falls back to the two-color default when all colors are unknown', () => {
    const colors = buildGradientColors(['neon', 'chartreuse']);
    expect(colors).toHaveLength(2);
    expect(colors[0]).toBe(DEEP_SPACE);
  });

  it('always returns a tuple with at least 2 elements', () => {
    const cases: (string[] | null)[] = [null, [], ['red'], ['red', 'blue'], ['red', 'blue', 'gold']];
    cases.forEach(input => {
      const colors = buildGradientColors(input);
      expect(colors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
