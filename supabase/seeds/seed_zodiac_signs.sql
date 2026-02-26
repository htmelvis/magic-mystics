-- Seed data for all 12 zodiac signs
-- Complete with element, modality, ruling planet, keywords, strengths, weaknesses

INSERT INTO zodiac_signs (name, symbol, element, modality, ruling_planet, date_range_start, date_range_end, description, keywords, strengths, weaknesses) VALUES
-- Aries
('Aries', '♈', 'Fire', 'Cardinal', 'Mars', '03-21', '04-19', 
 'The Ram. First sign of the zodiac, represents new beginnings, pioneering spirit, and courage.',
 ARRAY['passionate', 'motivated', 'confident', 'determined', 'honest', 'strong', 'brave'],
 ARRAY['courageous', 'passionate', 'confident', 'enthusiastic', 'optimistic', 'honest', 'determined'],
 ARRAY['impatient', 'moody', 'short-tempered', 'impulsive', 'aggressive']),

-- Taurus
('Taurus', '♉', 'Earth', 'Fixed', 'Venus', '04-20', '05-20',
 'The Bull. Represents stability, loyalty, and appreciation for beauty and material comforts.',
 ARRAY['reliable', 'patient', 'practical', 'devoted', 'responsible', 'stable'],
 ARRAY['reliable', 'patient', 'practical', 'devoted', 'responsible', 'stable', 'persistent'],
 ARRAY['stubborn', 'possessive', 'uncompromising', 'materialistic']),

-- Gemini
('Gemini', '♊', 'Air', 'Mutable', 'Mercury', '05-21', '06-20',
 'The Twins. Symbolizes duality, communication, and intellectual curiosity.',
 ARRAY['gentle', 'affectionate', 'curious', 'adaptable', 'quick-learner', 'witty', 'communicative'],
 ARRAY['gentle', 'affectionate', 'curious', 'adaptable', 'quick-learner', 'witty', 'communicative'],
 ARRAY['nervous', 'inconsistent', 'indecisive', 'superficial']),

-- Cancer
('Cancer', '♋', 'Water', 'Cardinal', 'Moon', '06-21', '07-22',
 'The Crab. Represents emotion, intuition, home, and family bonds.',
 ARRAY['tenacious', 'imaginative', 'loyal', 'emotional', 'sympathetic', 'nurturing'],
 ARRAY['tenacious', 'imaginative', 'loyal', 'emotional', 'sympathetic', 'persuasive', 'protective'],
 ARRAY['moody', 'pessimistic', 'suspicious', 'manipulative', 'insecure', 'overly sensitive']),

-- Leo
('Leo', '♌', 'Fire', 'Fixed', 'Sun', '07-23', '08-22',
 'The Lion. Symbolizes leadership, creativity, warmth, and generosity.',
 ARRAY['creative', 'passionate', 'generous', 'warm-hearted', 'cheerful', 'humorous', 'confident'],
 ARRAY['creative', 'passionate', 'generous', 'warm-hearted', 'cheerful', 'humorous', 'confident', 'loyal'],
 ARRAY['arrogant', 'stubborn', 'self-centered', 'inflexible', 'lazy', 'dominating']),

-- Virgo
('Virgo', '♍', 'Earth', 'Mutable', 'Mercury', '08-23', '09-22',
 'The Virgin. Represents practicality, analytical mind, and service to others.',
 ARRAY['loyal', 'analytical', 'kind', 'hardworking', 'practical', 'meticulous', 'organized'],
 ARRAY['loyal', 'analytical', 'kind', 'hardworking', 'practical', 'meticulous', 'organized', 'helpful'],
 ARRAY['shyness', 'worry', 'overly critical', 'perfectionist', 'conservative']),

-- Libra
('Libra', '♎', 'Air', 'Cardinal', 'Venus', '09-23', '10-22',
 'The Scales. Symbolizes balance, harmony, justice, and partnership.',
 ARRAY['cooperative', 'diplomatic', 'gracious', 'fair-minded', 'social', 'charming'],
 ARRAY['cooperative', 'diplomatic', 'gracious', 'fair-minded', 'social', 'charming', 'balanced'],
 ARRAY['indecisive', 'avoids confrontations', 'holds grudges', 'self-pity', 'people-pleaser']),

-- Scorpio
('Scorpio', '♏', 'Water', 'Fixed', 'Pluto', '10-23', '11-21',
 'The Scorpion. Represents transformation, intensity, passion, and regeneration.',
 ARRAY['resourceful', 'brave', 'passionate', 'stubborn', 'true friend', 'intense', 'magnetic'],
 ARRAY['resourceful', 'brave', 'passionate', 'stubborn', 'true friend', 'intense', 'determined', 'powerful'],
 ARRAY['distrusting', 'jealous', 'secretive', 'violent', 'manipulative', 'vindictive']),

-- Sagittarius
('Sagittarius', '♐', 'Fire', 'Mutable', 'Jupiter', '11-22', '12-21',
 'The Archer. Symbolizes adventure, optimism, freedom, and philosophical pursuit.',
 ARRAY['generous', 'idealistic', 'great sense of humor', 'adventurous', 'honest', 'optimistic'],
 ARRAY['generous', 'idealistic', 'great sense of humor', 'adventurous', 'honest', 'optimistic', 'enthusiastic'],
 ARRAY['promises more than can deliver', 'impatient', 'tactless', 'restless']),

-- Capricorn
('Capricorn', '♑', 'Earth', 'Cardinal', 'Saturn', '12-22', '01-19',
 'The Goat. Represents discipline, responsibility, ambition, and tradition.',
 ARRAY['responsible', 'disciplined', 'self-control', 'good managers', 'ambitious', 'patient'],
 ARRAY['responsible', 'disciplined', 'self-control', 'good managers', 'ambitious', 'patient', 'practical'],
 ARRAY['know-it-all', 'unforgiving', 'condescending', 'pessimistic', 'stubborn']),

-- Aquarius
('Aquarius', '♒', 'Air', 'Fixed', 'Uranus', '01-20', '02-18',
 'The Water Bearer. Symbolizes innovation, humanitarian ideals, and independence.',
 ARRAY['progressive', 'original', 'independent', 'humanitarian', 'inventive', 'visionary'],
 ARRAY['progressive', 'original', 'independent', 'humanitarian', 'inventive', 'visionary', 'intellectual'],
 ARRAY['runs from emotional expression', 'temperamental', 'uncompromising', 'aloof', 'detached']),

-- Pisces
('Pisces', '♓', 'Water', 'Mutable', 'Neptune', '02-19', '03-20',
 'The Fish. Represents compassion, imagination, spirituality, and empathy.',
 ARRAY['compassionate', 'artistic', 'intuitive', 'gentle', 'wise', 'musical', 'spiritual'],
 ARRAY['compassionate', 'artistic', 'intuitive', 'gentle', 'wise', 'musical', 'spiritual', 'empathetic'],
 ARRAY['fearful', 'overly trusting', 'sad', 'desire to escape reality', 'victim mentality', 'indecisive']);
