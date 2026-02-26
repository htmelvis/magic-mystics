-- Zodiac ↔ Crystal Associations
-- Maps crystals to zodiac signs with association types and strength ratings

-- First, we need the IDs. These will be inserted after zodiac_signs and crystals are seeded.
-- Run this file AFTER seed_zodiac_signs.sql and seed_crystals.sql

-- Aries (Fire, Cardinal, Mars) - ID will be 1
INSERT INTO zodiac_crystal_associations (zodiac_sign_id, crystal_id, association_type, strength, description)
SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Aries'),
  (SELECT id FROM crystals WHERE name = 'Carnelian'),
  'birthstone', 9, 'Primary Aries stone - boosts courage and action'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Aries'),
  (SELECT id FROM crystals WHERE name = 'Ruby'),
  'recommended', 8, 'Enhances Aries passion and leadership'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Aries'),
  (SELECT id FROM crystals WHERE name = 'Clear Quartz'),
  'amplifier', 7, 'Amplifies Aries dynamic energy';

-- Taurus (Earth, Fixed, Venus)
INSERT INTO zodiac_crystal_associations (zodiac_sign_id, crystal_id, association_type, strength, description)
SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Taurus'),
  (SELECT id FROM crystals WHERE name = 'Emerald'),
  'birthstone', 10, 'Ruled by Venus - perfect for Taurus love and abundance'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Taurus'),
  (SELECT id FROM crystals WHERE name = 'Rose Quartz'),
  'recommended', 9, 'Venus energy - love, beauty, self-care'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Taurus'),
  (SELECT id FROM crystals WHERE name = 'Malachite'),
  'healing', 7, 'Helps Taurus embrace transformation';

-- Gemini (Air, Mutable, Mercury)
INSERT INTO zodiac_crystal_associations (zodiac_sign_id, crystal_id, association_type, strength, description)
SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Gemini'),
  (SELECT id FROM crystals WHERE name = 'Aquamarine'),
  'birthstone', 9, 'Enhances Gemini communication and clarity'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Gemini'),
  (SELECT id FROM crystals WHERE name = 'Fluorite'),
  'recommended', 8, 'Improves mental focus and learning'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Gemini'),
  (SELECT id FROM crystals WHERE name = 'Citrine'),
  'amplifier', 7, 'Boosts Gemini creativity and joy';

-- Cancer (Water, Cardinal, Moon)
INSERT INTO zodiac_crystal_associations (zodiac_sign_id, crystal_id, association_type, strength, description)
SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Cancer'),
  (SELECT id FROM crystals WHERE name = 'Moonstone'),
  'birthstone', 10, 'Ruled by Moon - perfect for Cancer intuition'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Cancer'),
  (SELECT id FROM crystals WHERE name = 'Rose Quartz'),
  'recommended', 9, 'Emotional healing and self-love'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Cancer'),
  (SELECT id FROM crystals WHERE name = 'Selenite'),
  'cleansing', 8, 'Cleanses emotional energy';

-- Leo (Fire, Fixed, Sun)
INSERT INTO zodiac_crystal_associations (zodiac_sign_id, crystal_id, association_type, strength, description)
SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Leo'),
  (SELECT id FROM crystals WHERE name = 'Ruby'),
  'birthstone', 10, 'Ruled by Sun - amplifies Leo leadership'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Leo'),
  (SELECT id FROM crystals WHERE name = 'Citrine'),
  'recommended', 9, 'Solar energy - joy, confidence, manifestation'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Leo'),
  (SELECT id FROM crystals WHERE name = 'Carnelian'),
  'amplifier', 8, 'Boosts Leo creativity and passion';

-- Virgo (Earth, Mutable, Mercury)
INSERT INTO zodiac_crystal_associations (zodiac_sign_id, crystal_id, association_type, strength, description)
SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Virgo'),
  (SELECT id FROM crystals WHERE name = 'Moss Agate'),
  'birthstone', 9, 'Grounds Virgo energy and connects to nature'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Virgo'),
  (SELECT id FROM crystals WHERE name = 'Fluorite'),
  'recommended', 8, 'Mental clarity for analytical Virgo'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Virgo'),
  (SELECT id FROM crystals WHERE name = 'Amethyst'),
  'healing', 7, 'Calms Virgo worry and overthinking';

-- Libra (Air, Cardinal, Venus)
INSERT INTO zodiac_crystal_associations (zodiac_sign_id, crystal_id, association_type, strength, description)
SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Libra'),
  (SELECT id FROM crystals WHERE name = 'Rose Quartz'),
  'birthstone', 10, 'Venus-ruled - perfect for Libra love and harmony'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Libra'),
  (SELECT id FROM crystals WHERE name = 'Lapis Lazuli'),
  'recommended', 9, 'Truth and wisdom for balanced Libra'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Libra'),
  (SELECT id FROM crystals WHERE name = 'Aquamarine'),
  'amplifier', 7, 'Enhances communication in relationships';

-- Scorpio (Water, Fixed, Pluto)
INSERT INTO zodiac_crystal_associations (zodiac_sign_id, crystal_id, association_type, strength, description)
SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Scorpio'),
  (SELECT id FROM crystals WHERE name = 'Black Obsidian'),
  'birthstone', 10, 'Powerful protection and transformation'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Scorpio'),
  (SELECT id FROM crystals WHERE name = 'Malachite'),
  'recommended', 9, 'Facilitates Scorpio transformation'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Scorpio'),
  (SELECT id FROM crystals WHERE name = 'Black Tourmaline'),
  'protection', 9, 'Shields intense Scorpio energy';

-- Sagittarius (Fire, Mutable, Jupiter)
INSERT INTO zodiac_crystal_associations (zodiac_sign_id, crystal_id, association_type, strength, description)
SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Sagittarius'),
  (SELECT id FROM crystals WHERE name = 'Lapis Lazuli'),
  'birthstone', 9, 'Jupiter-ruled - wisdom and truth-seeking'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Sagittarius'),
  (SELECT id FROM crystals WHERE name = 'Citrine'),
  'recommended', 8, 'Optimism and abundance'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Sagittarius'),
  (SELECT id FROM crystals WHERE name = 'Amethyst'),
  'spiritual', 8, 'Enhances spiritual exploration';

-- Capricorn (Earth, Cardinal, Saturn)
INSERT INTO zodiac_crystal_associations (zodiac_sign_id, crystal_id, association_type, strength, description)
SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Capricorn'),
  (SELECT id FROM crystals WHERE name = 'Malachite'),
  'birthstone', 9, 'Facilitates disciplined transformation'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Capricorn'),
  (SELECT id FROM crystals WHERE name = 'Black Tourmaline'),
  'recommended', 9, 'Grounding and protection for ambitious Capricorn'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Capricorn'),
  (SELECT id FROM crystals WHERE name = 'Black Obsidian'),
  'grounding', 8, 'Keeps Capricorn grounded while climbing';

-- Aquarius (Air, Fixed, Uranus)
INSERT INTO zodiac_crystal_associations (zodiac_sign_id, crystal_id, association_type, strength, description)
SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Aquarius'),
  (SELECT id FROM crystals WHERE name = 'Aquamarine'),
  'birthstone', 10, 'Perfect for Aquarius humanitarian vision'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Aquarius'),
  (SELECT id FROM crystals WHERE name = 'Lapis Lazuli'),
  'recommended', 9, 'Intellectual clarity and truth'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Aquarius'),
  (SELECT id FROM crystals WHERE name = 'Fluorite'),
  'amplifier', 7, 'Enhances innovative thinking';

-- Pisces (Water, Mutable, Neptune)
INSERT INTO zodiac_crystal_associations (zodiac_sign_id, crystal_id, association_type, strength, description)
SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Pisces'),
  (SELECT id FROM crystals WHERE name = 'Amethyst'),
  'birthstone', 10, 'Primary Pisces stone - spiritual intuition'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Pisces'),
  (SELECT id FROM crystals WHERE name = 'Moonstone'),
  'recommended', 9, 'Enhances Pisces intuition and dreams'
UNION ALL SELECT 
  (SELECT id FROM zodiac_signs WHERE name = 'Pisces'),
  (SELECT id FROM crystals WHERE name = 'Aquamarine'),
  'healing', 8, 'Emotional clarity for sensitive Pisces';
