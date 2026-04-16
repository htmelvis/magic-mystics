import { useCallback, useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  findNodeHandle,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { spacing, borderRadius } from '@theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { ZODIAC_THEMES } from '@lib/astrology/zodiac-themes';
import type { ZodiacSign } from '@lib/astrology/calculate-signs';

// ─── Copy ────────────────────────────────────────────────────────────────────

const PLACEMENT_INTRO = {
  sun: {
    emoji: '☀️',
    title: 'Sun Sign',
    role: 'Your core self — the steady flame at the center of who you are.',
    description:
      `The Sun is the steady flame at the center of your chart — the core of who you are when everything else falls away. It speaks to your life force, ego, purpose, and creative will: the part of you that says "I am" and insists on becoming itself. When you act from your Sun, you feel awake, decisive, and alive, as if the world is briefly orbiting around your essence. It is both your fuel and your trajectory, the story you came here to live on purpose.`,
  },
  moon: {
    emoji: '🌙',
    title: 'Moon Sign',
    role: 'Your inner tide — the hidden self that rises and falls beneath your public face.',
    description:
      'The Moon is your inner tide — the hidden self that rises and falls beneath your public face. It governs your emotions, instincts, and how you seek comfort and safety, the part of you that reacts before you can explain why. Where your Sun describes how you shine in the open, your Moon describes how you feel in the dark: your private rituals, your emotional cravings, and the secret language of your heart. When you honor your Moon sign, life feels softer, more aligned, as if your nervous system recognizes itself and can finally exhale.',
  },
  rising: {
    emoji: '⬆️',
    title: 'Rising Sign',
    role: 'Your mask and doorway — the energy people sense before they truly know you.',
    description:
      'Your Rising sign is your mask and doorway: the energy people sense before they truly know you. It shows your style of approaching life, how you enter new spaces, and the aura you project without trying — the costume your soul chose for its first entrance on stage. While your Sun is the inner script and your Moon is the whisper behind the curtain, your Rising sign is the opening scene: the way you introduce yourself to fate, and the stance your spirit takes as it meets the world.',
  },
} as const;

type Placement = keyof typeof PLACEMENT_INTRO;

// Per-sign copy, written for each placement type
const SIGN_COPY: Record<ZodiacSign, Record<Placement, string>> = {
  Aries: {
    sun: `Bold, direct, and first across every finish line — Aries Suns carry an instinctive flame that refuses to wait. You are a pioneer at heart: quick to act, slow to overthink, and energized by the thrill of a fresh beginning. The challenge is learning that pausing doesn't mean losing.`,
    moon: `When emotions rise in you, they rise fast. Aries Moon feels things immediately and intensely, craving action as a release. You're soothed by autonomy — being able to move, decide, and not be told to wait. Anger is a clean emotion for you; it passes quickly, and you rarely hold grudges.`,
    rising: 'You enter a room and people notice. Aries Rising gives you an energy that reads as confident, sometimes edgy, always alive. Others experience you as direct — someone who says what they mean and means what they say. First impressions of you lean energetic, assertive, and a little magnetic.',
  },
  Taurus: {
    sun: `Taurus Suns are the steady heartbeat the world relies on. You are patient, sensual, and deeply loyal — someone who builds things meant to last. You trust what you can touch, smell, and savor. Comfort and beauty aren't luxuries for you; they're necessities. The challenge: learning to move before the moment is "perfect."`,
    moon: `Your emotional security lives in the physical world — good food, familiar spaces, a dependable routine. Taurus Moon takes time to feel, and time to let go. You don't shift easily, and you need partners who understand that your stillness isn't coldness; it's depth. Once safe, you love with extraordinary steadiness.`,
    rising: `You come across as grounded, calm, and quietly beautiful. Taurus Rising gives you a presence that others find reassuring — you seem unshakable. People often trust you instinctively, sensing you won't overreact or over-promise. There's a gentle elegance to your manner, even when you're doing nothing at all.`,
  },
  Gemini: {
    sun: `Gemini Suns live in the space between ideas, always collecting, connecting, and communicating. You are the eternal student: curious about everything, bored by repetition, and energized by conversation. You carry multitudes — and yes, that's a feature, not a flaw. The challenge is deciding which thread to follow when they're all interesting.`,
    moon: 'Your emotional life runs through your mind. Gemini Moon processes feelings by talking, writing, or turning them over in thought until they make sense. You need variety in your emotional diet — sameness breeds restlessness. A great conversation can lift your mood faster than almost anything else.',
    rising: 'You come across as lively, witty, and easy to talk to. Gemini Rising gives your presence an electric quality: you seem to be paying attention to everything at once, asking the right questions, and shifting the energy of a room toward lightness. People see you as clever and fun — someone who makes things interesting.',
  },
  Cancer: {
    sun: 'Cancer Suns feel the world more deeply than most will ever know. You are nurturing, perceptive, and fiercely protective of the people you love. Home — whether a place, a person, or a feeling — is your sacred space. The world may see your soft exterior first, but underneath lives one of the most resilient souls in the zodiac.',
    moon: 'The Moon rules Cancer, which means a Cancer Moon is the Moon at home in itself — emotional, intuitive, and richly feeling. You absorb the moods of the people around you like weather. Memory is vivid for you; the past stays present. What you need most is to feel truly seen, and to belong.',
    rising: 'You give off a warmth that draws people in — something about you says "safe." Cancer Rising makes others want to open up to you, often before they even know why. You may seem a little guarded at first, but that reserve is just discernment. Once trust is established, your care is legendary.',
  },
  Leo: {
    sun: `Leo Suns were born to shine — not out of vanity, but out of a genuine and generous desire to bring warmth into the world. You lead with your heart, love with drama and devotion, and possess a creative vitality that few can match. The challenge: learning that asking for recognition doesn't make you less radiant; it makes you honest.`,
    moon: `Leo Moon needs to feel special — truly, sincerely cherished — and that's not a flaw; it's a beautiful demand. You give love in grand, expressive ways, and you need the same in return. Your inner child is alive and playful. When you feel unseen, you dim. When seen? You light up every room you enter.`,
    rising: 'Your entrance is an event. Leo Rising gives you an unmistakable presence: poised, warm, and carrying the quiet confidence of someone who knows who they are. People see you as charismatic and generous. You may attract attention without trying, which can feel like a gift or a pressure — often both.',
  },
  Virgo: {
    sun: `Virgo Suns carry the quiet power of someone who actually does the work. Detail-oriented, thoughtful, and devoted to craft, you see what others miss and care about getting things right. Service isn't a burden for you — it's how you express love. The challenge: learning to extend the same grace to yourself that you give so freely to others.`,
    moon: 'Virgo Moon processes emotions through analysis — turning feelings into understandable shapes. You feel better when you have a plan, a routine, or a problem you can solve. Chaos is distressing; order is soothing. You show love through acts of service, and you need to feel genuinely useful to feel truly safe.',
    rising: `You come across as composed, capable, and quietly perceptive. Virgo Rising gives your presence a quality of careful attention — people sense that you notice things, that you won't be careless with details or with them. You may underplay yourself, but others pick up on an understated authority that earns deep trust.`,
  },
  Libra: {
    sun: `Libra Suns are the diplomats of the zodiac — seeking balance, beauty, and connection in everything they touch. You have an extraordinary sense of fairness and a genuine desire for harmony. Relationships are central to your story; you understand yourself through others. The challenge: learning that choosing a side doesn't mean starting a war.`,
    moon: 'Libra Moon finds emotional comfort in harmony and beauty. When the environment around you is peaceful and aesthetically pleasing, you feel like yourself. Conflict — even minor friction — is deeply unsettling. You process emotions by talking them through with someone you trust, weighing all sides before arriving at feeling.',
    rising: `Effortlessly charming, gracious, and beautiful in bearing — that's what people see first with Libra Rising. You make others feel at ease simply by being present. You're skilled at mirroring, at finding common ground, at making everyone feel included. People often describe you as warm, attractive, and fair — a natural diplomat.`,
  },
  Scorpio: {
    sun: `Scorpio Suns don't do surface. You are drawn to depth, truth, and transformation — the parts of life that others find uncomfortable. You feel everything intensely and guard your vulnerability with intensity. But when you love or commit, it is total and enduring. The challenge: learning to trust, which is the hardest thing for the person who sees through everyone.`,
    moon: 'Scorpio Moon feels with extraordinary intensity — and rarely shows it. Your emotional world is vast, private, and layered. You need complete trust before you open up, and betrayal lands harder on you than almost any other sign. But your capacity for emotional depth and loyalty is unmatched. You transform through feeling, not despite it.',
    rising: `There is something magnetic and a little mysterious about you at first meeting. Scorpio Rising gives you a penetrating quality: people feel like you're reading them, even when you're simply listening. You come across as composed, powerful, and a little unknowable — which draws people in even as it holds them at arm's length.`,
  },
  Sagittarius: {
    sun: 'Sagittarius Suns are on a quest — always. For knowledge, for meaning, for the next horizon. You carry a philosophy and a fire, a humor and a restlessness that makes every chapter of your life feel like an adventure worth having. The challenge: learning that wisdom sometimes asks you to stay, not just to seek.',
    moon: `Sagittarius Moon needs emotional freedom the way other signs need security. You feel best when the future feels open — when there are possibilities ahead and room to roam. Emotionally, you process best through movement, humor, and honest conversation. You're optimistic by feeling, not just by thinking.`,
    rising: `You come across as enthusiastic, honest, and a little unpredictable — in the best way. Sagittarius Rising gives you an energy that reads as adventurous and open-hearted. People sense that you'll be straight with them, that you won't play games. There's a lightness to your presence that makes others feel expansive just by being near you.`,
  },
  Capricorn: {
    sun: 'Capricorn Suns are here to build something that lasts. Disciplined, ambitious, and quietly determined, you understand that great things are made through consistent effort over time. You carry a natural authority that grows more pronounced with age. The challenge: learning to value the journey, not just the summit — and to rest without guilt.',
    moon: `Capricorn Moon keeps its emotions under careful management. You learned early that feelings should be handled, not displayed — and that inner stability comes from structure and self-reliance. You're emotionally most comfortable when you're productive and in control. Learning to need people is one of your life's deepest, most rewarding lessons.`,
    rising: `You enter a room and people take you seriously — even when you're not trying. Capricorn Rising gives you a composed, capable, and slightly formal presence that reads as trustworthy and authoritative. Others often see you as older or wiser than you are. Over time, you soften, and that's when your real warmth finally shows.`,
  },
  Aquarius: {
    sun: `Aquarius Suns are the visionaries — thinking years ahead, drawn to the collective, and fundamentally uninterested in being ordinary. You value your freedom and your ideals equally. At your best, you're the friend who genuinely sees people as they could be, not just as they are. The challenge: connecting heart-to-heart, not just mind-to-mind.`,
    moon: `Aquarius Moon processes emotions through ideas. You feel better once you can think about what you're feeling — name it, categorize it, understand its shape. Closeness is important to you, but you need space within it. You're loyal to the people you love and fiercely supportive of their individuality. Conformity, emotional or otherwise, is your nemesis.`,
    rising: `You come across as unique, a little eccentric, and genuinely interesting. Aquarius Rising gives you a presence that defies easy categorization — people sense you're operating on a different frequency. You seem friendly but self-contained; warm but not clingy. There's an intellectual coolness that makes others curious to know what you really think.`,
  },
  Pisces: {
    sun: `Pisces Suns exist at the edge of the visible and the invisible, the real and the dreamed. You are compassionate, creative, and deeply intuitive — capable of feeling what others can't even articulate. You absorb the world like a sponge, which is both your gift and your challenge. The question Pisces must keep asking: what is mine to carry, and what isn't?`,
    moon: `Pisces Moon feels everything — and I mean everything. The emotional boundaries between you and others are thin and permeable. You empathize deeply, dream vividly, and need regular time alone to rinse off what you've absorbed from the world around you. Beauty, music, and solitude are not indulgences for you; they're medicine.`,
    rising: `There's something ethereal about your first impression — dreamy, soft, hard to pin down in the most enchanting way. Pisces Rising gives you a presence that others describe as gentle, artistic, or deeply kind. People often feel at ease confessing things to you. You seem to carry the ocean in your eyes — vast, quiet, and full of depth.`,
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

interface SignsSheetProps {
  isVisible: boolean;
  onClose: () => void;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
}

export function SignsSheet({ isVisible, onClose, sunSign, moonSign, risingSign }: SignsSheetProps) {
  const theme = useAppTheme();
  const slideY = useRef(new Animated.Value(900)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetRef = useRef<View>(null);
  const dismissRef = useRef<() => void>(() => {});

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: 900, duration: 280, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => onClose());
  }, [onClose, slideY, backdropOpacity]);

  useEffect(() => {
    dismissRef.current = dismiss;
  });

  const handleShow = useCallback(() => {
    // Reset position synchronously before starting the animation so there
    // is no race between this callback and a useEffect that runs later.
    slideY.setValue(900);
    backdropOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(slideY, {
        toValue: 0,
        damping: 50,
        stiffness: 380,
        mass: 1,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      const node = findNodeHandle(sheetRef.current);
      if (node) AccessibilityInfo.setAccessibilityFocus(node);
    });
  }, [slideY, backdropOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) slideY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 110 || gs.vy > 0.7) {
          dismissRef.current();
        } else {
          Animated.spring(slideY, {
            toValue: 0,
            damping: 50,
            stiffness: 380,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const placements: { key: Placement; sign: ZodiacSign }[] = [
    { key: 'sun', sign: sunSign },
    { key: 'moon', sign: moonSign },
    { key: 'rising', sign: risingSign },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onShow={handleShow}
      onRequestClose={() => dismissRef.current()}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => dismissRef.current()}
          accessibilityRole="button"
          accessibilityLabel="Close signs sheet"
        >
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </Pressable>

        <Animated.View
          ref={sheetRef}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface.card,
              transform: [{ translateY: slideY }],
              ...theme.shadows.xl,
            },
          ]}
          accessibilityViewIsModal
          accessibilityRole="none"
        >
          {/* Drag handle */}
          <View
            {...panResponder.panHandlers}
            style={styles.handleZone}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Drag handle, swipe down to close"
            accessibilityHint="Swipe down to dismiss"
            hitSlop={{ top: 12, bottom: 12 }}
          >
            <View style={[styles.handle, { backgroundColor: theme.colors.border.default }]} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Header */}
            <Text style={[styles.headerGlyph, { color: theme.colors.brand.accent }]} accessible={false}>✦</Text>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>The Big Three</Text>
            <Text style={[styles.intro, { color: theme.colors.text.secondary }]}>
              Your birth chart is a snapshot of the sky at the exact moment you arrived — a map of
              light, shadow, and possibility. Your Sun, Moon, and Rising are the three main gateways
              into that map. The Sun shows how your light shines, the Moon reveals the tides of your
              inner world, and the Rising sign is the mask, doorway, and first impression you carry
              into the world.
            </Text>

            {/* Placement cards */}
            {placements.map(({ key, sign }) => {
              const placement = PLACEMENT_INTRO[key];
              const theme_data = ZODIAC_THEMES[sign];
              const copy = SIGN_COPY[sign][key];

              return (
                <PlacementCard
                  key={key}
                  emoji={placement.emoji}
                  placementTitle={placement.title}
                  role={placement.role}
                  placementDescription={placement.description}
                  sign={sign}
                  glyph={theme_data.glyph}
                  element={theme_data.element}
                  gradient={theme_data.gradient}
                  signCopy={copy}
                />
              );
            })}

            <Text style={[styles.footer, { color: theme.colors.text.muted }]}>
              Together, your Sun, Moon, and Rising form a triad — your core story, your emotional
              underworld, and your first approach to life. Explore each one, and you begin to see
              not just who you are — but how you came here to move through this lifetime.
            </Text>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── PlacementCard ────────────────────────────────────────────────────────────

interface PlacementCardProps {
  emoji: string;
  placementTitle: string;
  role: string;
  placementDescription: string;
  sign: ZodiacSign;
  glyph: string;
  element: string;
  gradient: [string, string];
  signCopy: string;
}

function PlacementCard({
  emoji,
  placementTitle,
  role,
  placementDescription,
  sign,
  glyph,
  element,
  signCopy,
}: PlacementCardProps) {
  const theme = useAppTheme();
  return (
    <View
      style={[
        cardStyles.card,
        {
          backgroundColor: theme.colors.surface.elevated,
          borderColor: theme.colors.border.main,
        },
      ]}
    >
      {/* Placement header */}
      <View style={cardStyles.placementRow}>
        <Text style={cardStyles.placementEmoji} accessible={false}>{emoji}</Text>
        <Text style={[cardStyles.placementTitle, { color: theme.colors.brand.primary }]}>
          {placementTitle}
        </Text>
      </View>
      <Text style={[cardStyles.role, { color: theme.colors.text.primary }]}>{role}</Text>
      <Text style={[cardStyles.placementDescription, { color: theme.colors.text.secondary }]}>
        {placementDescription}
      </Text>

      {/* Sign block */}
      <View style={[cardStyles.divider, { backgroundColor: theme.colors.border.main }]} />
      <View style={cardStyles.signRow}>
        <Text style={[cardStyles.glyph, { color: theme.colors.brand.primaryLight }]} accessible={false}>
          {glyph}
        </Text>
        <View style={cardStyles.signMeta}>
          <Text style={[cardStyles.signName, { color: theme.colors.text.primary }]}>{sign}</Text>
          <Text style={[cardStyles.element, { color: theme.colors.text.muted }]}>{element} sign</Text>
        </View>
      </View>
      <Text style={[cardStyles.signCopy, { color: theme.colors.text.secondary }]}>{signCopy}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    height: '88%',
    overflow: 'hidden',
  },
  handleZone: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 48,
    alignItems: 'center',
  },
  headerGlyph: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  intro: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: spacing.xl,
  },
  footer: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: borderRadius.card,
    borderWidth: 1,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  placementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  placementEmoji: {
    fontSize: 18,
  },
  placementTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  role: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  placementDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginVertical: spacing.lg,
  },
  signRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  glyph: {
    fontSize: 28,
  },
  signMeta: {
    gap: 2,
  },
  signName: {
    fontSize: 20,
    fontWeight: '700',
  },
  element: {
    fontSize: 12,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
  signCopy: {
    fontSize: 14,
    lineHeight: 21,
  },
});
