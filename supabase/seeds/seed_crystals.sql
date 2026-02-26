-- Seed data for popular crystals
-- Includes properties, chakras, elements, and metaphysical uses

INSERT INTO crystals (name, scientific_name, color, chakra, element, planetary_ruler, properties, metaphysical_uses, physical_properties) VALUES
-- Fire Sign Crystals
('Carnelian', 'Chalcedony', ARRAY['Orange', 'Red'], ARRAY['Sacral', 'Root'], 'Fire', 'Mars', 
 ARRAY['courage', 'vitality', 'confidence', 'action'], 
 'Boosts creativity, courage, and motivation. Excellent for Aries, Leo, and fire signs.',
 'Variety of chalcedony, hardness 6-7 on Mohs scale'),

('Citrine', 'Silicon Dioxide', ARRAY['Yellow', 'Golden'], ARRAY['Solar Plexus'], 'Fire', 'Sun',
 ARRAY['abundance', 'manifestation', 'joy', 'success'],
 'Attracts wealth and prosperity. Enhances Leo energy and personal power.',
 'Quartz family, hardness 7, heat-treated amethyst is common'),

('Ruby', 'Corundum', ARRAY['Red', 'Pink'], ARRAY['Root', 'Heart'], 'Fire', 'Sun',
 ARRAY['passion', 'protection', 'vitality', 'leadership'],
 'Amplifies Leo energy, courage, and heart chakra strength.',
 'Hardness 9, second only to diamond'),

-- Earth Sign Crystals
('Emerald', 'Beryl', ARRAY['Green'], ARRAY['Heart'], 'Earth', 'Venus',
 ARRAY['love', 'abundance', 'growth', 'healing'],
 'Perfect for Taurus. Enhances love, prosperity, and emotional balance.',
 'Hardness 7.5-8, beryl family'),

('Malachite', 'Copper Carbonate', ARRAY['Green'], ARRAY['Heart', 'Solar Plexus'], 'Earth', 'Venus',
 ARRAY['transformation', 'protection', 'grounding'],
 'Capricorn stone. Facilitates change and releases negative patterns.',
 'Hardness 3.5-4, toxic in raw form'),

('Moss Agate', 'Chalcedony', ARRAY['Green', 'White'], ARRAY['Heart'], 'Earth', 'Moon',
 ARRAY['abundance', 'grounding', 'stability'],
 'Virgo's stone. Connects to nature, promotes new beginnings and growth.',
 'Form of chalcedony with mineral inclusions'),

-- Air Sign Crystals
('Aquamarine', 'Beryl', ARRAY['Blue', 'Green'], ARRAY['Throat'], 'Air', 'Neptune',
 ARRAY['communication', 'clarity', 'courage', 'calm'],
 'Gemini and Aquarius stone. Enhances communication and clear thinking.',
 'Hardness 7.5-8, beryl family, blue variety'),

('Lapis Lazuli', 'Multiple Minerals', ARRAY['Blue', 'Gold'], ARRAY['Third Eye', 'Throat'], 'Air', 'Jupiter',
 ARRAY['wisdom', 'truth', 'intuition', 'communication'],
 'Libra and Aquarius stone. Enhances intellectual ability and spiritual truth.',
 'Metamorphic rock, hardness 5-5.5, contains pyrite'),

('Fluorite', 'Calcium Fluoride', ARRAY['Purple', 'Green', 'Clear'], ARRAY['All'], 'Air', 'Mercury',
 ARRAY['focus', 'clarity', 'learning', 'mental clarity'],
 'Gemini stone. Improves mental focus, decision-making, and learning.',
 'Hardness 4, highly fluorescent under UV light'),

-- Water Sign Crystals
('Moonstone', 'Feldspar', ARRAY['White', 'Peach', 'Blue'], ARRAY['Crown', 'Sacral'], 'Water', 'Moon',
 ARRAY['intuition', 'emotional balance', 'feminine energy', 'new beginnings'],
 'Cancer's primary stone. Enhances intuition and emotional intelligence.',
 'Hardness 6-6.5, displays adularescence'),

('Amethyst', 'Silicon Dioxide', ARRAY['Purple', 'Violet'], ARRAY['Third Eye', 'Crown'], 'Water', 'Jupiter',
 ARRAY['spiritual awareness', 'intuition', 'protection', 'clarity'],
 'Pisces stone. Enhances spirituality, intuition, and psychic abilities.',
 'Quartz variety, hardness 7, purple color from iron'),

('Black Obsidian', 'Volcanic Glass', ARRAY['Black'], ARRAY['Root'], 'Water', 'Saturn',
 ARRAY['protection', 'grounding', 'truth', 'release'],
 'Scorpio stone. Powerful protection and helps release negative patterns.',
 'Natural volcanic glass, hardness 5-5.5, forms from lava'),

-- Universal/All-Purpose Crystals
('Clear Quartz', 'Silicon Dioxide', ARRAY['Clear', 'White'], ARRAY['All'], 'All', 'Sun',
 ARRAY['amplification', 'clarity', 'healing', 'programmable'],
 'Master healer. Works with all signs. Amplifies energy and intention.',
 'Hardness 7, most common mineral on Earth'),

('Rose Quartz', 'Silicon Dioxide', ARRAY['Pink'], ARRAY['Heart'], 'Water', 'Venus',
 ARRAY['unconditional love', 'compassion', 'healing', 'self-love'],
 'Universal love stone. Excellent for Libra and Taurus (Venus-ruled signs).',
 'Quartz variety, hardness 7, pink from trace titanium/iron'),

('Black Tourmaline', 'Boron Silicate', ARRAY['Black'], ARRAY['Root'], 'Earth', 'Saturn',
 ARRAY['protection', 'grounding', 'clearing', 'shielding'],
 'Powerful protection stone. Good for all signs, especially earth signs.',
 'Hardness 7-7.5, pyroelectric and piezoelectric properties'),

('Selenite', 'Gypsum', ARRAY['White', 'Clear'], ARRAY['Crown', 'Third Eye'], 'Air', 'Moon',
 ARRAY['cleansing', 'clarity', 'angelic connection', 'charging'],
 'Cleanses other crystals and spaces. Good for all signs, especially water signs.',
 'Hardness 2, very soft, water-soluble');
