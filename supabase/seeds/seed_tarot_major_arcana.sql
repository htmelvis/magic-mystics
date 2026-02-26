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

-- NOTE: This is a sample of 6 Major Arcana cards showing the enhanced structure.
-- The full seed file would include all 22 Major Arcana cards (0-XXI).
-- Plus 56 Minor Arcana cards would be in a separate file: seed_tarot_minor_arcana.sql

-- For now, we''ve established the pattern. The remaining 16 Major Arcana would be:
-- VI - The Lovers
-- VII - The Chariot
-- VIII - Strength
-- IX - The Hermit
-- X - Wheel of Fortune
-- XI - Justice
-- XII - The Hanged Man
-- XIII - Death
-- XIV - Temperance
-- XV - The Devil
-- XVI - The Tower
-- XVII - The Star
-- XVIII - The Moon
-- XIX - The Sun
-- XX - Judgement
-- XXI - The World
