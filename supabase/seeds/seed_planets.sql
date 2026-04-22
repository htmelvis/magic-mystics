-- Seed data for the planets table
-- Run after migration 015_enrich_planets.sql

INSERT INTO planets (name, symbol, meaning, rules_sign, keywords, supported_endeavors, transit_meaning, day_of_week, archetype, color)
VALUES
  (
    'Sun', '☉',
    'Planet of identity, vitality, and conscious will — the core self and life force',
    ARRAY['Leo'],
    ARRAY['identity','vitality','ego','creativity','leadership','life force','purpose'],
    ARRAY['leadership decisions','creative projects','self-expression','career advancement','vitality practices','personal branding'],
    'Illuminates the area it touches, brings clarity, visibility, and conscious focus to whatever it activates',
    'Sunday', 'The Sovereign',
    ARRAY['Gold','Orange','Yellow','Amber']
  ),
  (
    'Moon', '☽',
    'Planet of emotion, intuition, and the unconscious mind — the inner world and cyclical nature',
    ARRAY['Cancer'],
    ARRAY['emotion','intuition','nurturing','cycles','memory','instinct','home'],
    ARRAY['emotional healing','family matters','creative intuition','dream work','nurturing relationships','domestic changes'],
    'Shifts emotional tone, activates feelings, heightens sensitivity and instinct in the area it moves through',
    'Monday', 'The Mystic',
    ARRAY['Silver','White','Pearl','Moonstone']
  ),
  (
    'Mercury', '☿',
    'Planet of communication, intellect, and the exchange of information — the mind and its expression',
    ARRAY['Gemini','Virgo'],
    ARRAY['communication','intellect','analysis','travel','trade','wit','learning'],
    ARRAY['writing','contracts','negotiations','learning','short travel','problem-solving','public speaking'],
    'Sharpens thinking, speeds communication, activates the mind and nervous system in its area of influence',
    'Wednesday', 'The Messenger',
    ARRAY['Yellow','Silver','Gray','Quicksilver']
  ),
  (
    'Venus', '♀',
    'Planet of love, beauty, and abundance — harmony, pleasure, and the arts',
    ARRAY['Taurus','Libra'],
    ARRAY['love','beauty','harmony','abundance','pleasure','art','diplomacy'],
    ARRAY['romance','creative projects','financial decisions','social connections','beautification','collaboration'],
    'Amplifies appreciation, draws abundance, favors diplomacy and aesthetic refinement wherever it lands',
    'Friday', 'The Lover',
    ARRAY['Green','Pink','Copper','Rose']
  ),
  (
    'Mars', '♂',
    'Planet of action, desire, and drive — the force of will and the warrior spirit',
    ARRAY['Aries'],
    ARRAY['action','desire','courage','competition','energy','assertion','passion'],
    ARRAY['physical activity','initiating projects','confronting challenges','athletic pursuits','protection','sexual energy'],
    'Ignites drive, increases assertiveness, brings urgency and competitive energy to its area of focus',
    'Tuesday', 'The Warrior',
    ARRAY['Red','Crimson','Iron','Scarlet']
  ),
  (
    'Jupiter', '♃',
    'Planet of expansion, wisdom, and abundance — the great benefic, bringer of opportunity and growth',
    ARRAY['Sagittarius'],
    ARRAY['expansion','wisdom','abundance','philosophy','optimism','growth','generosity'],
    ARRAY['travel','higher education','legal matters','spiritual growth','business expansion','publishing','philanthropy'],
    'Expands whatever it touches, brings optimism, opportunity, and philosophical depth to its area of influence',
    'Thursday', 'The Sage',
    ARRAY['Purple','Royal Blue','Indigo','Amethyst']
  ),
  (
    'Saturn', '♄',
    'Planet of discipline, structure, and karma — the teacher who demands accountability and mastery',
    ARRAY['Capricorn'],
    ARRAY['discipline','structure','responsibility','karma','limitation','mastery','endurance'],
    ARRAY['long-term planning','establishing boundaries','career building','discipline practices','facing fears','structural work'],
    'Demands accountability, builds lasting foundations, reveals where sustained effort and integrity are required',
    'Saturday', 'The Elder',
    ARRAY['Black','Dark Gray','Lead','Onyx']
  ),
  (
    'Uranus', '♅',
    'Planet of revolution, innovation, and awakening — the disruptor who liberates from stagnation',
    ARRAY['Aquarius'],
    ARRAY['innovation','rebellion','awakening','freedom','technology','disruption','originality'],
    ARRAY['innovation','breaking old patterns','technology projects','social reform','sudden pivots','creative experimentation'],
    'Disrupts stagnation, catalyzes liberation, brings flashes of insight and unexpected change',
    NULL, 'The Rebel',
    ARRAY['Electric Blue','Turquoise','Neon','Cobalt']
  ),
  (
    'Neptune', '♆',
    'Planet of dreams, spirituality, and dissolution — the mystic ocean of collective consciousness',
    ARRAY['Pisces'],
    ARRAY['dreams','spirituality','illusion','compassion','mysticism','dissolution','transcendence'],
    ARRAY['artistic creation','spiritual practice','healing work','meditation','letting go','psychic development'],
    'Dissolves boundaries, deepens compassion, and blurs the line between the material and the divine',
    NULL, 'The Dreamer',
    ARRAY['Sea Green','Aquamarine','Seafoam','Violet']
  ),
  (
    'Pluto', '♇',
    'Planet of transformation, power, and regeneration — death and rebirth, the force of total renewal',
    ARRAY['Scorpio'],
    ARRAY['transformation','power','death','rebirth','intensity','purging','evolution'],
    ARRAY['deep transformation','releasing old patterns','shadow work','power dynamics','regeneration','psychological breakthroughs'],
    'Forces profound change, destroys what no longer serves, and enables complete rebirth from the ashes',
    NULL, 'The Transformer',
    ARRAY['Black','Dark Red','Maroon','Obsidian']
  )
ON CONFLICT (name) DO UPDATE SET
  symbol = EXCLUDED.symbol,
  meaning = EXCLUDED.meaning,
  rules_sign = EXCLUDED.rules_sign,
  keywords = EXCLUDED.keywords,
  supported_endeavors = EXCLUDED.supported_endeavors,
  transit_meaning = EXCLUDED.transit_meaning,
  day_of_week = EXCLUDED.day_of_week,
  archetype = EXCLUDED.archetype,
  color = EXCLUDED.color;
