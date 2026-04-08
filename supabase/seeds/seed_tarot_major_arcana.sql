-- =====================================================
-- Major Arcana Tarot Cards (22 cards: 0-21)
-- Based on Rider-Waite-Smith deck
-- Includes imagery descriptions from Pictorial Key to the Tarot
-- =====================================================

-- The Fool (0)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Fool', 'Major', NULL, 0,
  -- Summaries
  'New beginnings, innocence, spontaneity, and a free spirit embarking on a journey.',
  'Recklessness, naivety, poor judgment, or fear of taking necessary risks.',
  -- Long meanings
  'The Fool represents pure potential and new beginnings. Standing at the edge of a cliff, The Fool is about to embark on a grand adventure with childlike wonder and optimism. This card signifies a leap of faith, trusting the universe, and embracing the unknown with an open heart. It encourages you to take risks, be spontaneous, and follow your dreams without overthinking. The Fool reminds us that every expert was once a beginner.',
  'When reversed, The Fool suggests reckless behavior, poor planning, or naivety that could lead to unnecessary risks. You may be acting foolishly, ignoring warnings, or refusing to consider consequences. This card can also indicate a fear of commitment or an inability to make decisions. It''s a reminder to balance spontaneity with wisdom and to think before you leap.',
  -- Keywords
  ARRAY['beginnings', 'innocence', 'spontaneity', 'freedom', 'adventure', 'potential', 'faith'],
  ARRAY['recklessness', 'naivety', 'folly', 'risk', 'distraction', 'carelessness', 'chaos'],
  -- Imagery
  'A young person stands at the edge of a cliff, gazing upward at the sky, seemingly unaware of the precipice. They carry a small bundle on a stick over their shoulder, wear colorful motley clothing, and hold a white rose. A small white dog jumps at their heels. Mountains rise in the distance under a bright sun.',
  -- Symbolism
  '{"figures": ["young traveler", "small white dog"], "colors": ["yellow (consciousness)", "white (purity)", "colorful motley"], "objects": ["bundle on stick (few possessions)", "white rose (innocence)", "precipice edge"], "background": "mountains in distance, bright sun overhead", "symbols": ["cliff edge (leap of faith)", "dog (instinct/protection)", "sun (enlightenment)"]}'::jsonb,
  'Air', 'Uranus', 0
);

-- The Magician (I)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Magician', 'Major', NULL, 1,
  'Manifestation, resourcefulness, power, and inspired action.',
  'Manipulation, poor planning, untapped talents, or illusion.',
  'The Magician is a powerful archetype of manifestation and creation. With one hand pointing to the heavens and one to the earth, The Magician channels divine energy into material reality. All four suit symbols appear on the table before them, representing mastery over all elements and resources. This card signifies that you have everything you need to succeed - skills, tools, and determination. The Magician encourages you to take inspired action and recognize your personal power.',
  'Reversed, The Magician warns of manipulation, trickery, or misuse of power. You may be using your skills to deceive others or yourself. This card can indicate untapped potential, lack of confidence, or poor planning. There may be a disconnect between your intentions and your actions, or you''re not utilizing your full capabilities. Be wary of con artists and empty promises.',
  ARRAY['manifestation', 'resourcefulness', 'power', 'inspired action', 'concentration', 'mastery', 'willpower'],
  ARRAY['manipulation', 'poor planning', 'unused talents', 'illusion', 'deception', 'trickery', 'lack of energy'],
  'A figure in red robes stands before a table displaying a cup, pentacle, sword, and wand - the four suit symbols. One hand points upward holding a wand, the other points downward. An infinity symbol (lemniscate) floats above their head. Red roses and white lilies grow in the garden below. A red and white canopy drapes overhead.',
  '{"figures": ["robed magician"], "colors": ["red (passion/action)", "white (purity)", "yellow background"], "objects": ["table with four suit symbols", "wand raised", "infinity symbol"], "background": "garden with roses and lilies", "symbols": ["infinity symbol (limitless potential)", "as above so below (manifestation)", "four elements mastered", "roses (desire)", "lilies (purity)"]}'::jsonb,
  'Air', 'Mercury', 1
);

-- The High Priestess (II)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The High Priestess', 'Major', NULL, 2,
  'Intuition, sacred knowledge, the subconscious mind, and inner voice.',
  'Secrets, disconnection from intuition, withdrawal, or repressed feelings.',
  'The High Priestess sits at the gate between the conscious and subconscious realms. She represents intuition, mystery, and divine feminine wisdom. This card calls you to trust your inner voice and look beyond the obvious. She guards sacred knowledge and reminds us that not everything can be understood through logic alone. The High Priestess encourages meditation, introspection, and listening to your dreams. She teaches that true wisdom comes from within.',
  'When reversed, The High Priestess suggests you''re ignoring your intuition or inner voice. Secrets may be causing problems, or you''re keeping something hidden that needs to come to light. You may feel disconnected from your spiritual side or overwhelmed by repressed emotions. This card can also indicate information being withheld or a need to trust your gut feelings more.',
  ARRAY['intuition', 'sacred knowledge', 'subconscious', 'inner voice', 'mystery', 'divine feminine', 'wisdom'],
  ARRAY['secrets', 'disconnected', 'withdrawal', 'silence', 'repressed feelings', 'blocked intuition', 'hidden agendas'],
  'A woman sits between two pillars marked B and J, wearing a crown and blue robes adorned with crosses. She holds a Torah scroll labeled "TORA" partially concealed by her mantle. Behind her hangs a tapestry depicting pomegranates and palm leaves. A crescent moon sits at her feet.',
  '{"figures": ["seated priestess"], "colors": ["blue (intuition/water)", "white (purity)", "silver crescent"], "objects": ["Torah scroll (hidden knowledge)", "two pillars (duality)", "crown with moon"], "background": "tapestry with pomegranates and palms", "symbols": ["pillars (Boaz & Jachin, temple entrance)", "veil (mysteries)", "crescent moon (subconscious)", "cross (balance)", "pomegranates (fertility/Persephone)"]}'::jsonb,
  'Water', 'Moon', 2
);

-- The Empress (III)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Empress', 'Major', NULL, 3,
  'Femininity, beauty, nature, nurturing, and abundance.',
  'Creative block, dependence, smothering, or neglecting self-care.',
  'The Empress embodies the divine feminine in all her abundant glory. She represents fertility, creativity, and nurturing energy. Surrounded by nature''s bounty, The Empress signifies growth, sensuality, and material comfort. This card encourages you to connect with nature, express your creativity, and care for yourself and others. She reminds us that we are part of the natural world and encourages us to embrace beauty, pleasure, and the senses.',
  'Reversed, The Empress may indicate creative blocks, difficulty expressing emotions, or neglecting self-care. You might be smothering others with attention or feeling creatively stifled. This card can also point to dependence on others for validation or an over-focus on physical appearance. It''s a reminder to find balance between caring for others and caring for yourself.',
  ARRAY['femininity', 'beauty', 'nature', 'nurturing', 'abundance', 'creativity', 'fertility'],
  ARRAY['creative block', 'dependence', 'smothering', 'lack', 'neglect', 'insecurity', 'overbearing'],
  'A serene woman sits on a throne in a lush forest setting, wearing a crown of twelve stars and a white gown adorned with pomegranates. She holds a scepter topped with an orb and sits on cushions embroidered with the Venus symbol. A field of golden wheat grows at her feet, and a waterfall flows in the background.',
  '{"figures": ["empress on throne"], "colors": ["green (growth)", "gold (abundance)", "white (purity)"], "objects": ["crown of stars", "scepter with Venus orb", "wheat field", "cushioned throne"], "background": "forest with waterfall", "symbols": ["twelve stars (zodiac/divine feminine)", "Venus symbol (love/beauty)", "wheat (abundance/harvest)", "pomegranates (fertility)", "waterfall (emotions flowing)", "forest (nature)"]}'::jsonb,
  'Earth', 'Venus', 3
);

-- The Emperor (IV)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Emperor', 'Major', NULL, 4,
  'Authority, structure, control, and fatherly figure.',
  'Domination, excessive control, rigidity, or lack of discipline.',
  'The Emperor represents structure, authority, and paternal power. Seated firmly on his throne, he embodies leadership, logic, and stability. This card signifies the ability to turn ideas into reality through discipline and organization. The Emperor encourages you to take charge of your life, establish boundaries, and create order from chaos. He teaches that true power comes from self-control and strategic thinking, not brute force.',
  'When reversed, The Emperor suggests abuse of power, excessive control, or tyrannical behavior. You may be too rigid, domineering, or unwilling to adapt. This card can also indicate a lack of discipline, weak boundaries, or avoiding responsibility. There may be issues with authority figures or an inability to assert yourself appropriately.',
  ARRAY['authority', 'structure', 'control', 'father figure', 'leadership', 'stability', 'discipline'],
  ARRAY['domination', 'excessive control', 'rigidity', 'inflexibility', 'lack of discipline', 'tyranny', 'powerlessness'],
  'A stern figure sits on a stone throne decorated with rams heads, wearing red robes and golden armor. He holds an ankh scepter in one hand and an orb in the other. Mountains tower behind the throne. His long white beard suggests wisdom and maturity.',
  '{"figures": ["emperor on throne"], "colors": ["red (passion/power)", "gold (authority)", "stone gray"], "objects": ["stone throne", "ankh scepter", "orb", "armor"], "background": "barren mountains", "symbols": ["rams heads (Aries/Mars)", "ankh (life/power)", "orb (world dominion)", "armor (protection)", "stone throne (stability)", "mountains (achievement)"]}'::jsonb,
  'Fire', 'Aries', 4
);

-- The Hierophant (V)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Hierophant', 'Major', NULL, 5,
  'Spiritual wisdom, religious beliefs, tradition, and conformity.',
  'Personal beliefs, freedom, challenging the status quo, or dogma.',
  'The Hierophant represents spiritual authority, tradition, and conventional wisdom. As a bridge between heaven and earth, he teaches sacred knowledge and upholds established systems of belief. This card often appears when you''re seeking guidance from a mentor, teacher, or institution. The Hierophant encourages learning through traditional means, respecting established practices, and finding your place within a community or belief system.',
  'Reversed, The Hierophant suggests breaking away from tradition, questioning established norms, or rejecting dogma. You may be developing your own spiritual path outside conventional religion. This card can indicate feeling restricted by rules, rebelling against authority, or exposing corruption in institutions. It''s a reminder that personal spirituality is valid even when it doesn''t fit traditional molds.',
  ARRAY['spiritual wisdom', 'tradition', 'conformity', 'institutions', 'education', 'belief systems', 'mentorship'],
  ARRAY['personal beliefs', 'freedom', 'challenging tradition', 'unconventional', 'rebellion', 'dogma', 'restriction'],
  'A religious figure sits on a throne between two pillars, wearing three-tiered papal crown and red robes. He holds a triple cross staff and makes a blessing gesture with his right hand. Two supplicants kneel before him. Keys lie at his feet.',
  '{"figures": ["hierophant/pope", "two supplicants"], "colors": ["red (earthly power)", "white (spirituality)", "gold"], "objects": ["triple cross staff", "papal crown", "crossed keys", "pillars"], "background": "two pillars (sacred threshold)", "symbols": ["triple crown (three worlds)", "triple cross (holy trinity)", "crossed keys (heaven access)", "blessing gesture", "two pillars (knowledge gateway)"]}'::jsonb,
  'Earth', 'Taurus', 5
);

-- The Lovers (VI)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Lovers', 'Major', NULL, 6,
  'Love, harmony, relationships, values alignment, and choices.',
  'Self-love issues, disharmony, imbalance, or misalignment of values.',
  'The Lovers card transcends mere romance — it is a card of sacred union, conscious choice, and the alignment of soul with purpose. The divine figure above blesses the union of two souls standing in the Garden of Eden, representing the integration of opposites: conscious and unconscious, masculine and feminine, earthly and divine. When The Lovers appears, you are at a crossroads that will define your path. The choice before you is not simply between two options but between two versions of yourself. Love in its highest expression is an act of spiritual recognition — seeing the divine in another. This card calls you to honor your values, communicate openly, and choose consciously.',
  'Reversed, The Lovers warns of inner conflict, misaligned values, or a relationship built on shaky foundations. You may be avoiding a difficult choice, making decisions from fear rather than love, or ignoring red flags. This card can indicate co-dependency, a lack of self-love, or a painful dissonance between what you want and what you choose. It asks: are your choices truly aligned with your highest self, or are you settling for comfort over truth?',
  ARRAY['love', 'union', 'harmony', 'alignment', 'choice', 'values', 'partnership', 'duality'],
  ARRAY['disharmony', 'imbalance', 'misalignment', 'poor choices', 'inner conflict', 'avoidance', 'separation'],
  'A man and woman stand naked beneath an angel — the Archangel Raphael — who blesses them with outstretched wings in a radiant cloud. Behind the woman stands the Tree of Knowledge with a serpent coiled in its branches. Behind the man stands the Tree of Life bearing twelve flames. A volcano rises in the distance. The sun blazes overhead.',
  '{"figures": ["naked man", "naked woman", "Archangel Raphael"], "colors": ["gold (divine light)", "green (nature)", "red volcano"], "objects": ["Tree of Knowledge", "Tree of Life", "serpent", "twelve flames"], "background": "sun overhead, volcano in distance", "symbols": ["angel (higher self/divine guidance)", "nudity (vulnerability/truth)", "serpent (temptation/kundalini)", "twelve flames (zodiac)", "volcano (passion/eruption of feeling)", "two trees (duality unified)"]}'::jsonb,
  'Air', 'Gemini', 6
);

-- The Chariot (VII)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Chariot', 'Major', NULL, 7,
  'Control, willpower, success, determination, and triumph.',
  'Lack of control, aggression, no direction, or scattered energy.',
  'The Chariot is the card of the conquering will — the force of focused consciousness that overcomes all opposition. A warrior-prince rides a chariot drawn by two sphinxes of opposing colors, yet they move as one through the sheer force of his intention. He wears no reins; he commands through mind and will alone. This card speaks to victory achieved through discipline, not brute force. When The Chariot appears, you are called to harness opposing forces within yourself — your rational mind and your emotional nature — and direct them toward a single unwavering goal. Success is yours, but only through absolute self-mastery.',
  'Reversed, The Chariot suggests a loss of control, scattered direction, or aggression turned inward. You may be forcing outcomes rather than flowing with aligned effort, or two conflicting drives are pulling you apart. This card can indicate a journey gone off course, a power struggle, or the danger of letting your ego drive decisions that require wisdom. It asks you to reclaim your inner authority before proceeding.',
  ARRAY['control', 'willpower', 'victory', 'determination', 'discipline', 'focus', 'triumph', 'ambition'],
  ARRAY['lack of control', 'aggression', 'scattered energy', 'no direction', 'defeat', 'powerlessness', 'obstruction'],
  'A crowned warrior stands upright within a canopied chariot adorned with a winged sun disc and the Hindu lingam symbol. Two sphinxes — one black, one white — sit before the chariot. The warrior holds no reins but carries a wand. Stars cover his canopy, and his breastplate bears crescent moons and a square of earth. A walled city rises behind him.',
  '{"figures": ["warrior-prince in chariot", "black sphinx", "white sphinx"], "colors": ["black and white (duality)", "gold (victory)", "blue (sky/intellect)"], "objects": ["canopy of stars", "wand", "winged sun disc", "crescent moons", "square breastplate"], "background": "walled city behind", "symbols": ["two sphinxes (opposing forces unified)", "no reins (mind over matter)", "star canopy (cosmic alignment)", "crescent moons (emotional mastery)", "square (earth/material mastery)", "walled city (civilization conquered)"]}'::jsonb,
  'Water', 'Cancer', 7
);

-- Strength (VIII)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Strength', 'Major', NULL, 8,
  'Inner strength, bravery, compassion, focus, and quiet power.',
  'Inner doubt, weakness, self-doubt, insecurity, or raw impulse.',
  'Strength is one of the most profound cards in the Tarot — not the strength of force, but the strength of love. A woman clad in white gently holds open the jaws of a lion, and the lion yields. This is the alchemy of the inner life: the wild, instinctual nature is not conquered but transformed through gentleness, patience, and compassionate will. The infinity symbol above her head marks her as a master of both worlds. This card calls you to recognize that your greatest power lies not in dominance but in the courage to remain soft when everything screams for hardness. True strength is the ability to face fear without flinching — and to meet it with love.',
  'Reversed, Strength warns of self-doubt, raw uncontrolled impulses, or a surrender to fear. You may be doubting your ability to handle a situation or allowing your inner critic to dominate. This card can also indicate the shadow expression of strength: cruelty, domination, or a need to control others because you cannot control yourself. It calls for a return to inner quiet and the patient, loving reclamation of your own power.',
  ARRAY['inner strength', 'courage', 'patience', 'compassion', 'influence', 'persuasion', 'self-mastery', 'resilience'],
  ARRAY['self-doubt', 'weakness', 'raw emotion', 'insecurity', 'lack of confidence', 'cowardice', 'inner critic'],
  'A serene young woman in white robes and a floral crown gently holds open the jaws of a golden lion. An infinity symbol (lemniscate) floats above her head. Mountains rise in the distance under a yellow sky. A garland of flowers links the woman and lion, and flowers adorn her gown.',
  '{"figures": ["woman in white", "golden lion"], "colors": ["white (purity/spirit)", "gold/yellow (consciousness)", "green (nature)"], "objects": ["infinity symbol", "floral crown", "garland of flowers"], "background": "mountains, yellow sky", "symbols": ["infinity symbol (mastery of cycles)", "white robe (spiritual purity)", "lion (instinct/passion tamed)", "flowers (cultivated nature/beauty)", "garland (union of spirit and nature)", "mountains (achievement ahead)"]}'::jsonb,
  'Fire', 'Leo', 8
);

-- The Hermit (IX)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Hermit', 'Major', NULL, 9,
  'Soul-searching, introspection, being alone, inner guidance.',
  'Isolation, loneliness, withdrawal from the world, or lost your way.',
  'The Hermit stands at the summit of a grey mountain, alone in the darkness, his lantern held high. Within that lantern blazes the six-pointed Star of Solomon — the light of integrated wisdom, the hermetic truth that what is above is also below. This card is the archetype of the inner teacher, the one who has withdrawn from the world not out of fear but to honor the sacred work of self-knowledge. The Hermit has climbed to the heights of consciousness and now shines his light to guide those who seek the path. When this card appears, you are called to retreat, to listen to the voice that speaks only in silence, and to trust that the answers you seek live within you — not in the noise of the world.',
  'Reversed, The Hermit can indicate excessive isolation, loneliness turned to despair, or a withdrawal that is avoidance rather than wisdom. You may have lost your way on the inner journey, become too reclusive, or be refusing the guidance of others when you genuinely need it. This card can also indicate the shadow of the sage: becoming so detached from the world that wisdom curdles into cynicism or eccentricity.',
  ARRAY['introspection', 'solitude', 'guidance', 'inner wisdom', 'soul-searching', 'contemplation', 'retreat', 'truth'],
  ARRAY['isolation', 'loneliness', 'withdrawal', 'lost path', 'reclusion', 'anti-social', 'rejection of others'],
  'A grey-robed, white-bearded old man stands alone at the peak of a snowy mountain at night. In his right hand he holds a lantern containing a six-pointed star. In his left hand he leans on a long staff. The mountains beneath him suggest great heights already climbed. The landscape is barren and silent.',
  '{"figures": ["old man with lantern"], "colors": ["grey (wisdom/neutrality)", "white (purity/snow)", "gold (inner light)"], "objects": ["lantern with Star of Solomon", "long staff", "grey robes"], "background": "snow-capped mountain peak, night sky", "symbols": ["lantern (inner light shared)", "six-pointed star (wisdom/as above so below)", "staff (support/authority)", "mountain peak (spiritual attainment)", "grey robes (renunciation)", "darkness (the unknown illuminated)"]}'::jsonb,
  'Earth', 'Virgo', 9
);

-- Wheel of Fortune (X)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Wheel of Fortune', 'Major', NULL, 10,
  'Good luck, karma, life cycles, destiny, and turning points.',
  'Bad luck, resistance to change, breaking cycles, or clinging to control.',
  'The Wheel of Fortune is the great cosmic law of cycles made visible. The wheel turns ceaselessly — what rises must fall, and what falls must rise. At its center sit the alchemical symbols of the four elements, the Hebrew letters of the divine name, and the word TARO inscribed upon its rim. Figures ascend and descend: the jackal-headed Anubis rises on the right, the serpent Typhon descends on the left, and the Sphinx perches at the top in eternal wisdom. The four winged creatures in the corners — Man, Eagle, Lion, Bull — represent the fixed signs of the zodiac: the stabilizing forces within constant change. This card announces a turning point, a stroke of fortune, a moment when the invisible hand of destiny moves the pieces of your life.',
  'Reversed, the Wheel of Fortune suggests resistance to inevitable change, bad luck, or a cycle of misfortune that feels inescapable. You may be clinging to the past, fighting the natural turning of events, or unable to see the larger pattern at work. This card reminds you that resisting the wheel only prolongs suffering — wisdom lies in flowing with the cycles of life, trusting that this too shall pass.',
  ARRAY['luck', 'karma', 'destiny', 'cycles', 'turning point', 'fortune', 'change', 'fate'],
  ARRAY['bad luck', 'resistance', 'breaking cycles', 'no control', 'clinging', 'misfortune', 'external forces'],
  'A great wheel dominates the card, inscribed with TARO and alchemical symbols, flanked by Hebrew letters forming the divine name. A sphinx with a sword sits atop the wheel. Anubis (the jackal-headed god) ascends on the right; a serpent (Typhon) descends on the left. In the four corners float winged figures: an angel, an eagle, a lion, and a bull — each reading from a book.',
  '{"figures": ["sphinx atop wheel", "Anubis ascending", "Typhon descending", "four winged creatures in corners"], "colors": ["blue (sky/spirit)", "gold (divine)", "red (life force)"], "objects": ["inscribed wheel", "TARO letters", "Hebrew divine name", "four books"], "background": "clouds, cosmic space", "symbols": ["wheel (cycles of fortune)", "sphinx (eternal wisdom)", "Anubis (death/transformation)", "Typhon (chaos/destruction)", "four fixed signs (stability within change)", "TARO/ROTA (wheel of law)", "alchemical symbols (elements in motion)"]}'::jsonb,
  'Fire', 'Jupiter', 10
);

-- Justice (XI)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Justice', 'Major', NULL, 11,
  'Justice, fairness, truth, cause and effect, and law.',
  'Unfairness, lack of accountability, dishonesty, or karmic debt avoided.',
  'Justice sits enthroned between two pillars, sword raised in one hand and scales perfectly balanced in the other. This is not blind justice — the veil behind her parts to reveal a yellow curtain, a flash of higher truth. She sees clearly, without sentiment or distortion. The sword of discernment cuts through illusion; the scales weigh every action against the feather of truth. When Justice appears, karmic law is at work. The universe is recalibrating. Every action, every choice, every thought carries a weight, and the scales will not rest until balance is restored. This card calls you to radical honesty — with yourself first, and with the world. The truth will set you free, but only if you are willing to face it.',
  'Reversed, Justice warns of injustice, denial of accountability, or a karmic imbalance that you are refusing to acknowledge. You may be avoiding the consequences of your actions, engaging in dishonesty, or experiencing a situation where the system has failed to deliver a fair outcome. This card can also indicate excessive self-judgment — holding yourself to an impossible standard that tips the scales inward. True justice begins with the willingness to see clearly.',
  ARRAY['justice', 'fairness', 'truth', 'law', 'cause and effect', 'accountability', 'balance', 'karma'],
  ARRAY['injustice', 'dishonesty', 'unaccountability', 'bias', 'legal trouble', 'karmic debt', 'avoidance', 'corruption'],
  'A crowned figure sits on a stone throne between two grey pillars, draped in red robes with a green cloak. In the right hand, a double-edged sword is raised upright. In the left hand, golden scales hang in perfect balance. A yellow curtain is visible between the pillars. The figure''s gaze is direct and unflinching.',
  '{"figures": ["crowned Justice figure"], "colors": ["red (active force/blood)", "green (natural law)", "gold (divine standard)"], "objects": ["raised sword", "balanced scales", "stone throne", "crown"], "background": "two pillars, yellow curtain between them", "symbols": ["raised sword (discernment/truth that cuts)", "balanced scales (karmic equilibrium)", "crown (authority of cosmic law)", "pillars (gateway to truth)", "yellow curtain (flash of higher wisdom)", "double edge (law cuts both ways)"]}'::jsonb,
  'Air', 'Libra', 11
);

-- The Hanged Man (XII)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Hanged Man', 'Major', NULL, 12,
  'Pause, surrender, letting go, new perspectives, and sacrifice.',
  'Delays, resistance, stalling, or martyrdom without purpose.',
  'The Hanged Man hangs serenely by one foot from a living T-shaped cross of wood, his free leg bent in the figure 4, his arms behind him forming a downward triangle. His expression is beatific — not suffering, but illuminated. Around his head blazes a golden halo. This is the great mystery of voluntary sacrifice: Odin hanging from Yggdrasil to receive the runes; the soul suspended between worlds to receive divine knowledge unavailable to those who stand upright in ordinary time. When this card appears, the universe is asking you to stop. To wait. To release your grip on outcomes and allow a higher wisdom to reorder reality. The sacrifice required is often nothing more than your attachment to knowing the answer before it is time.',
  'Reversed, The Hanged Man suggests resistance to necessary surrender, delays caused by avoidance, or a martyrdom complex — suffering without wisdom or spiritual growth. You may be hanging there out of stubbornness rather than sacred pause, or you are finally emerging from a long period of suspension and must now act. This card reversed can also indicate the stalling tactics of someone who refuses to make a necessary sacrifice.',
  ARRAY['surrender', 'letting go', 'new perspective', 'pause', 'sacrifice', 'wisdom', 'suspension', 'enlightenment'],
  ARRAY['delays', 'resistance', 'stalling', 'martyrdom', 'avoidance', 'indecision', 'stuck', 'purposeless sacrifice'],
  'A young man hangs upside down by his right foot from a living T-shaped wooden cross (a Tau cross). His left leg is bent and crossed behind the right, forming a figure 4. His arms are folded behind his back, forming a downward-pointing triangle with his head. His expression is serene, and a golden halo or nimbus glows around his head. He wears red trousers and a blue vest.',
  '{"figures": ["serene hanging man"], "colors": ["red (life force)", "blue (spirit/wisdom)", "gold nimbus"], "objects": ["living T-cross (Tau)", "golden halo", "figure-4 leg position"], "background": "simple, undefined", "symbols": ["Tau cross (life and resurrection)", "golden halo (enlightenment through sacrifice)", "figure-4 leg (earth plus spirit)", "inverted position (reversed worldview, new sight)", "living tree (sacrifice rooted in life)", "red trousers (vital force preserved)", "blue vest (spiritual knowledge)"]}'::jsonb,
  'Water', 'Neptune', 12
);

-- Death (XIII)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Death', 'Major', NULL, 13,
  'Endings, change, transformation, transition, and inevitable cycles.',
  'Resistance to change, stagnation, decay, or fear of endings.',
  'Death rides a white horse across a field of fallen kings and weeping mourners. He carries a black banner emblazoned with a white five-petaled rose — the mystic rose of life blooming against the dark. The sun sets between two towers on the horizon, yet the light persists. Death in the Tarot is the great transformer: not the end of life, but the end of a form that has served its purpose. The caterpillar does not mourn its dissolution in the chrysalis — it trusts the transformation. When this card appears, something must end so that something new can be born. The clinging to what is already dead is itself a form of death. Release what must be released. Walk through the gate.',
  'Reversed, Death warns of resistance to necessary endings, clinging to the past, or a prolonged stagnation. You may be refusing to let go of a relationship, identity, or situation long past its expiration. This card can also indicate a transformation that is being blocked, a slow decay rather than clean release, or a fear of change so profound it has become its own kind of death — the slow death of unlived life.',
  ARRAY['endings', 'transformation', 'transition', 'change', 'release', 'letting go', 'cycle completion', 'rebirth'],
  ARRAY['resistance to change', 'stagnation', 'clinging to past', 'decay', 'fear of endings', 'inability to move on', 'slow death'],
  'A skeleton in black armor rides a white horse across a scene of fallen figures. Before the horse lies a dead king in his crown. A bishop clasps his hands in prayer. A woman faints in grief. A child holds out flowers. In the background, the sun sets between two stone towers, and a river winds to the horizon. The skeleton carries a black banner with a white rose on it.',
  '{"figures": ["skeleton on white horse", "fallen king", "praying bishop", "grieving woman", "child with flowers"], "colors": ["black (death/ending)", "white (purity/transformation)", "grey (neutrality of death)"], "objects": ["black banner", "white rose", "black armor", "crown of fallen king"], "background": "river, setting sun, two towers", "symbols": ["white horse (purity/conquest)", "white rose on black (life within death)", "fallen king (death spares no rank)", "setting sun (endings become new dawns)", "two towers (gateway to the next world)", "river (the river Styx/transition)", "child with flowers (innocence faces death without fear)"]}'::jsonb,
  'Water', 'Scorpio', 13
);

-- Temperance (XIV)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Temperance', 'Major', NULL, 14,
  'Balance, moderation, patience, purpose, and alchemy.',
  'Imbalance, excess, lack of long-term vision, or self-indulgence.',
  'An angelic figure stands at the threshold of a pool, one foot in the water of the subconscious, one foot on the land of the manifest world. Between two golden cups, water flows upward — defying physics, following the laws of spirit. A solar crown rises on the horizon above the angel''s head, marking the culmination of the path. Temperance is the card of divine alchemy: the patient mixing and transmutation of opposites into something greater than their parts. It speaks of the middle path — not the grey mediocrity of compromise, but the luminous third way that transcends opposition altogether. Flow, patience, and trust in the slow work of transformation are this card''s gifts.',
  'Reversed, Temperance warns of imbalance, excess, or a rush to outcomes that requires patient process. You may be overindulging in one area while neglecting another, or forcing a resolution before its natural time. This card can indicate inner conflict that is disrupting your equilibrium, or the inability to find a middle way in a conflict. It calls you to slow down, find your center, and let the alchemy proceed at its own sacred pace.',
  ARRAY['balance', 'moderation', 'patience', 'purpose', 'alchemy', 'harmony', 'transcendence', 'flow'],
  ARRAY['imbalance', 'excess', 'self-indulgence', 'lack of vision', 'discord', 'rushing', 'extremes', 'misalignment'],
  'A great winged angel with a golden halo stands at the edge of a pool, one foot resting on land, one foot in the water. The angel wears white robes with a triangle inscribed within a square on the chest. Two golden cups are held at chest height as water flows mysteriously between them. In the background, a winding path leads to mountains where a golden crown rises above a glowing horizon.',
  '{"figures": ["winged angel"], "colors": ["white (purity/spirit)", "gold (divine)", "blue (water/subconscious)"], "objects": ["two golden cups", "white robes", "triangle in square symbol", "golden halo"], "background": "pool, mountains, glowing crown on horizon", "symbols": ["water flowing between cups (alchemy/transmutation)", "one foot in water one on land (integration of worlds)", "golden crown on horizon (spiritual destination)", "triangle in square (spirit within matter)", "wings (angelic nature/higher guidance)", "winding path (the middle way)", "pool (subconscious depths)"]}'::jsonb,
  'Fire', 'Sagittarius', 14
);

-- The Devil (XV)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Devil', 'Major', NULL, 15,
  'Bondage, addiction, materialism, shadow self, and illusion of entrapment.',
  'Releasing limiting beliefs, detachment, freedom, or reclaiming power.',
  'The Devil looms over two naked figures — the same souls who stood in The Lovers — now chained to his pedestal. Yet look closely: the chains around their necks are loose. They could remove them at any moment. The Devil is Baphomet, the great horned figure representing the union of opposites trapped in matter — the pentagram inverted, the torch of the half-world illuminating from below rather than above. This card is the shadow side of The Lovers: what happens when union is based not on truth but on need, fear, or compulsion. The Devil speaks of addiction, materialism, toxic relationships, and the seductive comfort of familiar chains. Its deepest teaching is this: the prison you believe yourself locked in has no lock. Only the belief that you are bound makes it so.',
  'Reversed, The Devil heralds liberation — the moment of awakening when you see the chains for what they are and choose freedom. This can be a powerful card of recovery, release from toxic patterns, or a sudden recognition of how an unconscious belief has been running your life. However, reversed, it can also indicate the more dangerous pull: temptation resisted then surrendered to, or shadow material erupting uncontrolled.',
  ARRAY['bondage', 'addiction', 'materialism', 'shadow self', 'illusion', 'entrapment', 'obsession', 'unconscious patterns'],
  ARRAY['releasing chains', 'freedom', 'detachment', 'awakening', 'reclaiming power', 'shadow integration', 'overcoming addiction'],
  'A large horned, bat-winged figure resembling Baphomet perches on a black cube pedestal. The figure has the head of a goat, body of a man, wings of a bat, and arms bearing an inverted pentagram and a raised torch. Two naked human figures — one male, one female — are chained by loose chains to the pedestal. Both figures have small horns and tails, suggesting partial demonization. The background is entirely black.',
  '{"figures": ["Baphomet/Devil on pedestal", "chained man", "chained woman"], "colors": ["black (ignorance/materialism)", "grey (oppression)", "red-orange (lust/fire)"], "objects": ["black cube pedestal", "loose chains", "inverted pentagram", "raised torch", "bat wings"], "background": "complete darkness", "symbols": ["loose chains (bondage is self-chosen)", "inverted pentagram (spirit dominated by matter)", "black cube (limited material consciousness)", "horns on humans (corruption through attachment)", "torch (false light from below)", "bat wings (creature of darkness)", "darkness (ignorance that can be illuminated)"]}'::jsonb,
  'Earth', 'Capricorn', 15
);

-- The Tower (XVI)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Tower', 'Major', NULL, 16,
  'Sudden change, upheaval, chaos, revelation, and awakening.',
  'Fear of change, averting disaster, personal transformation delayed.',
  'Lightning strikes the crown of a great tower built on a rocky crag. The crown — a symbol of false sovereignty — is blasted into the sky, and two figures hurl themselves from the heights as flames erupt from the windows. This is the divine bolt of truth that reduces all false constructions to rubble. The Tower represents every edifice we build on sand: the belief system assembled for comfort rather than truth, the relationship held together by fear rather than love, the career built on others'' expectations rather than your own soul. When The Tower appears, something is about to fall — and the fall is a mercy. What cannot survive the lightning was never meant to last. The crown falls so that a truer sovereignty can be built from the ground up.',
  'Reversed, The Tower can indicate an impending disaster that is being narrowly averted — or delayed. You may be clinging to a crumbling structure, making increasingly desperate repairs to something that must fall. This card reversed can also speak to personal transformation: the tower is falling within, in the private architecture of your mind and heart, and the rubble is your old self. Fear of this inner collapse can manifest as resistance, avoidance, or a slow unraveling rather than a clean break.',
  ARRAY['upheaval', 'sudden change', 'revelation', 'chaos', 'awakening', 'destruction of false structures', 'breakthrough', 'lightning'],
  ARRAY['fear of change', 'averting disaster', 'delayed collapse', 'inner upheaval', 'resistance', 'clinging', 'prolonged suffering'],
  'A tall stone tower topped with a golden crown perches on a rocky cliff. A lightning bolt from a dark stormy sky blasts the crown from the top, sending it spinning. Flames burst from the tower''s windows. Two human figures — a crowned man and a woman — tumble headlong through the air from the tower''s heights. Twenty-two flames (or sparks) fall around them in a black sky.',
  '{"figures": ["falling crowned man", "falling woman"], "colors": ["black (darkness/chaos)", "orange/red (fire/transformation)", "gold (false crown)"], "objects": ["stone tower", "lightning bolt", "dislodged crown", "flames", "twenty-two sparks"], "background": "dark storm clouds, rocky crag", "symbols": ["lightning (divine truth/sudden revelation)", "falling crown (false sovereignty destroyed)", "tower (ego constructions/false safety)", "two figures falling (no rank spared by truth)", "twenty-two flames (22 paths of the Kabbalistic Tree of Life)", "flames in windows (illumination from within as without)", "rocky foundation (what the false was built upon)"]}'::jsonb,
  'Fire', 'Mars', 16
);

-- The Star (XVII)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Star', 'Major', NULL, 17,
  'Hope, faith, renewal, serenity, and divine inspiration.',
  'Despair, lack of faith, discouragement, or feeling disconnected from purpose.',
  'After the destruction of The Tower comes The Star — the cosmos pouring its healing waters over the shattered earth. A naked woman kneels at the edge of a pool under a vast night sky blazing with eight-pointed stars. With her right hand she pours water onto the earth, nourishing five streams. With her left hand she pours into the pool, replenishing what was taken. The large central star blazes with eight points — the number of renewal and cosmic law. This is the card of hope reborn from ruin: the soul''s quiet certainty that the universe has not abandoned it, that the stars still guide, that beauty still exists, that the long night carries in it the seed of dawn. Allow yourself to be nourished. Trust the flow.',
  'Reversed, The Star warns of despair, a loss of faith, or a disconnection from your guiding light. After great upheaval you may feel hopeless, unworthy of renewal, or unable to trust that things will improve. This card reversed can also indicate a star that shines only for others — the healer who cannot receive healing, the light-bearer who has extinguished their own flame. It calls you to turn the waters of renewal inward.',
  ARRAY['hope', 'faith', 'renewal', 'serenity', 'inspiration', 'healing', 'purpose', 'cosmic guidance'],
  ARRAY['despair', 'lack of faith', 'discouragement', 'disconnection', 'hopelessness', 'lost purpose', 'spiritual drought'],
  'A nude woman kneels at the edge of a pool of water beneath an open night sky. In each hand she holds a large golden ewer. With her right she pours water onto land, creating five rivulets; with her left she pours into the pool. One foot is on land, one knee is on the pool''s edge. Above her blazes a large eight-pointed star surrounded by seven smaller eight-pointed stars. A bird — an ibis — perches in a tree to her right.',
  '{"figures": ["kneeling nude woman"], "colors": ["blue (water/spirit/healing)", "gold/yellow (stars/divine light)", "green (renewal)"], "objects": ["two golden ewers", "eight-pointed stars", "pool", "land"], "background": "night sky with eight stars, ibis in tree", "symbols": ["eight-pointed star (Venus/renewal/cosmic law)", "seven smaller stars (seven chakras/seven planets)", "water poured on land (spirit nourishing matter)", "water into pool (replenishing the subconscious)", "nudity (vulnerability as strength)", "ibis (Thoth/divine wisdom)", "one foot in water (intuitive awareness)", "five rivulets (five senses renewed)"]}'::jsonb,
  'Air', 'Aquarius', 17
);

-- The Moon (XVIII)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Moon', 'Major', NULL, 18,
  'Illusion, fear, the unconscious, intuition, and confusion.',
  'Release of fear, repressed emotions emerging, confusion clearing.',
  'The Moon hangs full and watchful in the midnight sky between two grey towers. From a pool of the collective unconscious, a crayfish — the most ancient of creatures — slowly crawls onto the path. A wolf and a domesticated dog bay at the moon from the banks: the wild and the tamed, the instinctual and the conditioned, both overwhelmed by lunar energy. The path between the towers winds into distant mountains — visible, yet the moonlight distorts everything, casting shadows within shadows. The Moon is the realm between waking and dreaming, between instinct and understanding, between what you know and what you merely fear. Nothing here is as it seems. What you encounter in this landscape is a mirror of your unconscious — and what you do with that encounter determines whether you walk the path in wisdom or in fear.',
  'Reversed, The Moon suggests the clearing of confusion, the slow emergence of truth from shadow, or repressed emotional material finally surfacing for integration. Fear is losing its grip; the illusions that have clouded your perception are beginning to dissolve. However, this card reversed can also indicate deception coming to light — not your own unconscious this time, but a deliberate manipulation by another. Trust your deepest gut feeling.',
  ARRAY['illusion', 'fear', 'unconscious', 'intuition', 'confusion', 'shadow', 'dreams', 'mystery'],
  ARRAY['confusion clearing', 'releasing fear', 'repressed emotions', 'truth emerging', 'deception revealed', 'inner calm', 'clarity'],
  'A full moon with a human face peers out from behind a crescent moon in a dark sky. Fifteen rays of light drop down like falling tears. Between two grey stone towers, a narrow path winds toward distant mountains. From a pool in the foreground, a crayfish climbs onto the path. On either side of the path, a wolf and a domestic dog sit howling at the moon. The scene is blue-grey and haunting.',
  '{"figures": ["wolf", "dog", "crayfish"], "colors": ["blue-grey (dreamworld)", "silver (lunar)", "dark (unconscious)"], "objects": ["full moon with face", "crescent moon", "two towers", "winding path", "pool"], "background": "mountains in far distance, night landscape", "symbols": ["full moon (the unconscious)", "crescent within full moon (cycles within cycles)", "crayfish (primordial mind emerging)", "wolf (wild instinct)", "dog (conditioned mind)", "two towers (threshold of the unconscious)", "fifteen drops (the paths of the Tree of Life)", "winding path (the soul''s uncertain journey through shadow)"]}'::jsonb,
  'Water', 'Pisces', 18
);

-- The Sun (XIX)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The Sun', 'Major', NULL, 19,
  'Positivity, fun, warmth, success, vitality, and joy.',
  'Inner child blocked, excessive pessimism, sadness, or temporary setbacks.',
  'A naked child rides a white horse beneath a blazing sun, arms stretched wide in pure exultation. Sunflowers turn their faces upward from the enclosed garden wall behind. The child wears a wreath of red feathers and carries a red banner — the blood of life transmuted into the flag of victory. The Sun card radiates the uncomplicated truth that existence itself is good: that consciousness is a gift, that the body is a temple, that joy is the natural state of the awakened soul. After the trials of the previous arcana — the shadows, the chains, the storms — here is the card that restores the childlike knowing that everything is essentially, fundamentally, luminously all right. This is the light that casts no shadow.',
  'Reversed, The Sun suggests that joy is temporarily obscured — clouds passing before the light rather than the light extinguished. You may be struggling with pessimism, feeling cut off from your own vitality, or allowing others'' perceptions to dim your inner radiance. The child within may be suppressed, the playful spirit contracted by fear or responsibility. This card calls you to let the clouds move and to believe in the return of the light — because it is already there.',
  ARRAY['joy', 'success', 'vitality', 'positivity', 'warmth', 'clarity', 'abundance', 'confidence', 'innocence'],
  ARRAY['pessimism', 'sadness', 'temporary setback', 'blocked joy', 'inner child wounded', 'dimmed vitality', 'overconfidence'],
  'A radiant sun blazes overhead, its face serene and beaming, ringed with both straight and wavy rays suggesting alternating masculine and feminine emanations. Below it, a naked young child rides a white horse bareback, arms wide open, head thrown back in joy. The child wears a wreath of red flowers and a single red feather, and carries a large red banner. Behind, a low stone wall is covered in four large sunflowers facing the sun.',
  '{"figures": ["naked child on white horse"], "colors": ["gold/yellow (consciousness/joy)", "white (purity)", "red (life force/vitality)", "green (life)"], "objects": ["blazing sun with face", "white horse", "red banner", "red wreath", "sunflowers"], "background": "clear sky, garden wall", "symbols": ["blazing sun (consciousness/divine light)", "naked child (innocence/the soul unashamed)", "white horse (purity of spirit)", "red banner (victory of life)", "sunflowers (turning toward the light)", "garden wall (paradise within reach)", "wavy and straight rays (divine masculine and feminine united in light)"]}'::jsonb,
  'Fire', 'Sun', 19
);

-- Judgement (XX)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Judgement', 'Major', NULL, 20,
  'Judgement, rebirth, inner calling, absolution, and awakening.',
  'Self-doubt, refusal to heed calling, ignoring inner voice, or self-judgment.',
  'The Archangel Gabriel blows a trumpet from the clouds, and below, the dead rise from their coffins — men, women, and children, arms outstretched in ecstasy of answered prayer. The mountains of ice in the distance do not bar the way; they are witnesses. This is the penultimate card of the Major Arcana: the great reckoning, the moment when the soul hears its true name called from beyond the veil and rises to answer. Judgement is the card of spiritual awakening in its most dramatic form — the realization that you are not who you thought you were, that a greater self has been waiting, that the call you have been ignoring or doubting is real and will not stop until you respond. Rise. You are being called.',
  'Reversed, Judgement warns of self-doubt, refusal to heed a deep inner calling, or harsh self-judgment that keeps you in the coffin of old identity. You may be hearing the call but dismissing it as fantasy, or punishing yourself for past actions rather than allowing the grace of absolution. This card reversed can also indicate judgment of others as a way of avoiding your own inner reckoning. It asks: what do you need to forgive so that you can finally rise?',
  ARRAY['awakening', 'rebirth', 'calling', 'reckoning', 'absolution', 'renewal', 'transformation', 'inner calling'],
  ARRAY['self-doubt', 'refusal of calling', 'self-judgment', 'ignoring inner voice', 'stagnation', 'guilt', 'denial of awakening'],
  'The Archangel Gabriel fills the upper sky, blowing a great trumpet from which hangs a white banner bearing a red cross. Below, grey figures — men, women, and children — rise from rectangular stone coffins set in a grey sea. Their arms are raised toward the angel. Snow-capped mountains fill the far background. The figures'' grey color suggests they are newly resurrected from death.',
  '{"figures": ["Archangel Gabriel", "rising figures (man, woman, child)"], "colors": ["grey (transition from death)", "white (purification)", "red cross (life/resurrection)"], "objects": ["trumpet", "white banner with red cross", "stone coffins", "grey sea"], "background": "icy mountains, clouds, sky", "symbols": ["trumpet (the call of the divine)", "rising figures (resurrection/awakening)", "white banner (surrender to the divine)", "red cross (Christ consciousness/sacrifice to life)", "grey sea (collective unconscious)", "coffins opened (release from dead identity)", "mountains (the witness of eternity)", "angel above (higher self calling lower self)"]}'::jsonb,
  'Fire', 'Pluto', 20
);

-- The World (XXI)
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'The World', 'Major', NULL, 21,
  'Completion, integration, accomplishment, wholeness, and the end of a cycle.',
  'Seeking personal closure, incompletion, shortcuts, or delayed success.',
  'A dancing figure at the center of an oval laurel wreath holds two wands — one in each hand, as The Magician did at the beginning of the journey. But The Magician stood before the altar of possibility; this dancer moves within the completed mandala of manifest reality. The purple cloth wraps and flows around them, revealing all, concealing all. In the four corners blaze the four fixed signs of the zodiac — the winged man (Aquarius), the eagle (Scorpio), the lion (Leo), and the bull (Taurus) — the same guardians who watched over the Wheel of Fortune, now witnesses to its full completion. This is the card that every soul in the Tarot has been journeying toward: the integration of all experience into wisdom, the return to the center after the long circumference of the path. You have arrived. And this arrival is not an ending — it is the completion of a spiral that begins again at a higher octave.',
  'Reversed, The World suggests incompletion, shortcuts that have left important work unfinished, or a reluctance to fully commit to the final steps of a long journey. You may be so close to the completion of a great cycle that fear of what lies beyond has caused a subconscious stalling. This card reversed can also indicate carrying unresolved karmic patterns into the next cycle — the spiral begins again, but the lesson returns with it.',
  ARRAY['completion', 'integration', 'achievement', 'wholeness', 'harmony', 'cycle end', 'success', 'fulfillment'],
  ARRAY['incompletion', 'seeking closure', 'shortcuts', 'delayed success', 'stagnation near end', 'unresolved patterns', 'carrying old baggage'],
  'A lithe figure dances within a large oval wreath of laurel leaves, holding two wands (one in each hand), in a posture mirroring The Magician. A purple cloth wraps around the figure. In each of the four corners of the card blazes one of the four fixed signs: top left, a winged angel/man; top right, an eagle; bottom left, a bull; bottom right, a lion. Each holds an open book. The wreath is bound top and bottom by red ribbons tied in infinity-like bows.',
  '{"figures": ["dancing central figure", "winged angel (Aquarius)", "eagle (Scorpio)", "lion (Leo)", "bull (Taurus)"], "colors": ["green (life/completion)", "purple (spiritual royalty)", "gold (achievement)"], "objects": ["laurel wreath", "two wands", "purple cloth", "four open books", "red ribbon bows"], "background": "open sky, four-corner guardians", "symbols": ["laurel wreath (victory/completion)", "dancing figure (freedom of the integrated soul)", "two wands (mastery over duality)", "purple cloth (concealment/revelation of mystery)", "four fixed signs (the totality of creation)", "infinity bows (the cycle completes and begins again)", "open books (all knowledge recorded)", "oval wreath (the World egg/cosmic womb)"]}'::jsonb,
  'Earth', 'Saturn', 21
);
