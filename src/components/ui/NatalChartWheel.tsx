import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Line, Text as SvgText, G } from 'react-native-svg';
import type { StoredNatalChart } from '@lib/astrology/natal-chart';
import { FREE_PLANETS } from '@lib/astrology/natal-chart';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useTheme } from '@/context/ThemeContext';

interface NatalChartWheelProps {
  chart: StoredNatalChart;
  size: number;
  showOuterPlanets: boolean;
}

// ── Zodiac metadata ───────────────────────────────────────────────────────────

const SIGNS = [
  { glyph: '♈', element: 'fire' },
  { glyph: '♉', element: 'earth' },
  { glyph: '♊', element: 'air' },
  { glyph: '♋', element: 'water' },
  { glyph: '♌', element: 'fire' },
  { glyph: '♍', element: 'earth' },
  { glyph: '♎', element: 'air' },
  { glyph: '♏', element: 'water' },
  { glyph: '♐', element: 'fire' },
  { glyph: '♑', element: 'earth' },
  { glyph: '♒', element: 'air' },
  { glyph: '♓', element: 'water' },
] as const;

const ELEMENT_FILLS_LIGHT: Record<string, string> = {
  fire:  '#fff3ef',
  earth: '#f0fdf4',
  air:   '#eff6ff',
  water: '#f5f0ff',
};
const ELEMENT_FILLS_DARK: Record<string, string> = {
  fire:  '#2d1208',
  earth: '#0a1f0e',
  air:   '#0a1420',
  water: '#190d2e',
};
const ELEMENT_STROKES: Record<string, string> = {
  fire:  '#f87171',
  earth: '#4ade80',
  air:   '#60a5fa',
  water: '#a78bfa',
};

// ── Geometry helpers ──────────────────────────────────────────────────────────

const DEG2RAD = Math.PI / 180;

/**
 * Chart convention: 0° Aries at 9 o'clock (left), zodiac goes counterclockwise.
 * svg_angle = (180 − lon) × π/180
 */
function lonToAngleRad(lon: number): number {
  return (180 - lon) * DEG2RAD;
}

function polarPoint(cx: number, cy: number, r: number, lonDeg: number) {
  const a = lonToAngleRad(lonDeg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/**
 * SVG path for a ring arc segment (pie-slice of an annulus).
 * lon1 → lon2 is a 30° counterclockwise arc.
 */
function ringArcPath(cx: number, cy: number, rInner: number, rOuter: number, lon1: number, lon2: number): string {
  const o1 = polarPoint(cx, cy, rOuter, lon1);
  const o2 = polarPoint(cx, cy, rOuter, lon2);
  const i2 = polarPoint(cx, cy, rInner, lon2);
  const i1 = polarPoint(cx, cy, rInner, lon1);
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${rOuter} ${rOuter} 0 0 0 ${o2.x} ${o2.y}`,  // outer arc, CCW (sweep=0)
    `L ${i2.x} ${i2.y}`,
    `A ${rInner} ${rInner} 0 0 1 ${i1.x} ${i1.y}`,  // inner arc, CW (sweep=1) to close
    'Z',
  ].join(' ');
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NatalChartWheel({ chart, size, showOuterPlanets }: NatalChartWheelProps) {
  const appTheme = useAppTheme();
  const { activeColorScheme } = useTheme();
  const isDark = activeColorScheme === 'dark';

  const cx = size / 2;
  const cy = size / 2;
  const pad = 6;
  const rOuter      = size / 2 - pad;     // outer sign ring edge
  const rSignInner  = rOuter * 0.72;      // inner sign ring edge
  const rPlanet     = rOuter * 0.52;      // planet glyph placement
  const rInnerFill  = rOuter * 0.38;      // inner circle (empty sky)

  const elementFills = isDark ? ELEMENT_FILLS_DARK : ELEMENT_FILLS_LIGHT;
  const borderColor = appTheme.colors.border.main;
  const subtleBorderColor = appTheme.colors.border.subtle;
  const textPrimary = appTheme.colors.text.primary;
  const textSecondary = appTheme.colors.text.secondary;
  const bgColor = appTheme.colors.surface.background;

  const freePlanetNames = new Set<string>(FREE_PLANETS);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* ── Inner background ── */}
        <Circle cx={cx} cy={cy} r={rInnerFill} fill={bgColor} />

        {/* ── Sign ring segments ── */}
        {SIGNS.map((sign, i) => {
          const lon1 = i * 30;
          const lon2 = lon1 + 30;
          return (
            <G key={i}>
              <Path
                d={ringArcPath(cx, cy, rSignInner, rOuter, lon1, lon2)}
                fill={elementFills[sign.element]}
                stroke={ELEMENT_STROKES[sign.element]}
                strokeWidth={0.5}
              />
              {/* Sign glyph centred in the arc */}
              {(() => {
                const midLon = lon1 + 15;
                const p = polarPoint(cx, cy, (rSignInner + rOuter) / 2, midLon);
                return (
                  <SvgText
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    fontSize={rOuter * 0.10}
                    fill={textPrimary}
                  >
                    {sign.glyph}
                  </SvgText>
                );
              })()}
            </G>
          );
        })}

        {/* ── Outer border ── */}
        <Circle cx={cx} cy={cy} r={rOuter} fill="none" stroke={borderColor} strokeWidth={1} />
        {/* ── Sign ring inner border ── */}
        <Circle cx={cx} cy={cy} r={rSignInner} fill="none" stroke={borderColor} strokeWidth={0.75} />
        {/* ── Inner fill border ── */}
        <Circle cx={cx} cy={cy} r={rInnerFill} fill="none" stroke={subtleBorderColor} strokeWidth={0.5} />

        {/* ── ASC / MC lines ── */}
        {chart.ascendant !== null && (() => {
          const asc1 = polarPoint(cx, cy, rOuter, chart.ascendant);
          const asc2 = polarPoint(cx, cy, rOuter, chart.ascendant + 180);
          return (
            <Line
              x1={asc1.x} y1={asc1.y}
              x2={asc2.x} y2={asc2.y}
              stroke="#8b5cf6"
              strokeWidth={0.75}
              strokeDasharray="3 3"
            />
          );
        })()}
        {chart.midheaven !== null && (() => {
          const mc1 = polarPoint(cx, cy, rOuter, chart.midheaven);
          const mc2 = polarPoint(cx, cy, rOuter, chart.midheaven + 180);
          return (
            <Line
              x1={mc1.x} y1={mc1.y}
              x2={mc2.x} y2={mc2.y}
              stroke="#6366f1"
              strokeWidth={0.75}
              strokeDasharray="1.5 3"
            />
          );
        })()}

        {/* ── Planets ── */}
        {chart.planets.map((planet) => {
          const isFree = freePlanetNames.has(planet.name);
          const isVisible = isFree || showOuterPlanets;
          const opacity = isVisible ? 1 : 0.22;
          const p = polarPoint(cx, cy, rPlanet, planet.longitude);
          const fontSize = rOuter * 0.095;
          return (
            <G key={planet.name} opacity={opacity}>
              {/* Small background circle for readability */}
              <Circle cx={p.x} cy={p.y} r={fontSize * 0.85} fill={bgColor} opacity={0.8} />
              <SvgText
                x={p.x}
                y={p.y}
                textAnchor="middle"
                alignmentBaseline="central"
                fontSize={fontSize}
                fill={isFree ? textPrimary : textSecondary}
              >
                {planet.glyph}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
