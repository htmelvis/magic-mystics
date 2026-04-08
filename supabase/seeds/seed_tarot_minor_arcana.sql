-- =====================================================
-- Minor Arcana Tarot Cards (56 cards)
-- Based on Rider-Waite-Smith deck
-- Includes imagery descriptions from Pictorial Key to the Tarot
-- =====================================================
-- Suits: Wands (Fire), Cups (Water), Swords (Air), Pentacles (Earth)
-- Each suit: Ace–10 (pip cards) + Page, Knight, Queen, King (court cards)
-- =====================================================

-- =====================================================
-- SUIT OF WANDS (Fire) — Cards 1–14
-- Element: Fire | Keywords: action, passion, creativity, will
-- =====================================================

-- Ace of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Ace of Wands', 'Minor', 'Wands', 1,
  'New beginnings, inspiration, creative spark, and the birth of a bold venture.',
  'Delays, lack of motivation, creative blocks, or a promising start that fizzles.',
  'The Ace of Wands is the primordial spark of creation — pure Fire in its most undiluted, electric form. A hand emerges from a cloud gripping a flowering wooden wand, leaves bursting from its sides even as the branch is freshly cut. This is the moment before the moment: potential that has not yet chosen a direction but burns with absolute readiness. When this card appears, the universe is handing you a torch. A new creative project, a bold business idea, a passionate relationship, a spiritual calling — something is beginning that has the power to change your life. The question is not whether you have what it takes. The question is whether you will reach out and take hold.',
  'Reversed, the Ace of Wands suggests creative energy that has been blocked at the source. You may have a vision but feel unable to ignite the flame — through self-doubt, poor timing, or circumstances outside your control. This card can also indicate a false start: an exciting beginning that loses momentum before it truly launches. The fire is still there; it needs more oxygen. Revisit your foundations, find your true motivation, and let the spark find dry kindling.',
  ARRAY['inspiration', 'new beginnings', 'creative spark', 'potential', 'enthusiasm', 'boldness', 'initiation'],
  ARRAY['delays', 'creative blocks', 'lack of motivation', 'false starts', 'hesitation', 'missed opportunity', 'burnout'],
  'A single hand emerges from a white cloud on the right side of the card, gripping a thick wooden wand or club. Green leaves and small buds sprout from the wand at several points. In the distance, a lush green landscape with a river, rolling hills, and a castle or manor on a hill can be seen. The sky is clear and bright.',
  '{"figures": ["disembodied hand from cloud"], "colors": ["green (new life)", "gold/yellow (fire/potential)", "white (divine source)"], "objects": ["sprouting wand", "bursting leaves"], "background": "castle on a hill, river, lush landscape", "symbols": ["hand from cloud (divine gift of potential)", "sprouting leaves (creativity alive within raw material)", "castle (destination/goal of the journey)", "river (flow of life)", "wand (will/fire/the creative impulse)"]}'::jsonb,
  'Fire', 'Fire (pure element)', 1
);

-- Two of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Two of Wands', 'Minor', 'Wands', 2,
  'Future planning, progress, decisions, and bold vision for what lies ahead.',
  'Fear of the unknown, lack of planning, playing it too safe, or indecision.',
  'A wealthy merchant lord stands on the parapet of his castle holding a small globe in his right hand, surveying the world spread below him. In his left hand, another wand is fixed to the wall. He has already achieved one thing — the castle behind him speaks to that — but his gaze is fixed outward, on the sea, on the horizon, on the vast territory yet to be claimed. The Two of Wands is the card of the visionary who has tasted success and found it insufficient to contain the magnitude of their dream. The globe in the hand is the world held as possibility. You have established a base. Now comes the question: what will you do with what you have built? The courageous answer is to walk toward the horizon.',
  'Reversed, the Two of Wands suggests fear of venturing beyond familiar territory, poor planning that undermines a promising vision, or indecision at a critical crossroads. You may be holding the globe but unwilling to loosen your grip on the security of what you already have. This card reversed can also indicate a plan that is too confined to one''s current circumstances — thinking small when the situation calls for sweeping vision.',
  ARRAY['planning', 'future vision', 'bold goals', 'progress', 'decisions', 'ambition', 'personal power'],
  ARRAY['fear of unknown', 'indecision', 'playing it safe', 'lack of planning', 'restricted vision', 'hesitation', 'poor foresight'],
  'A figure in rich robes and a red hat stands on a stone parapet or battlement, gazing out over a wide landscape of mountains, sea, and distant lands. They hold a small globe in one hand. Behind them, two tall wands are fixed to the wall — one on each side. Red roses and white lilies are carved into the parapet wall. The figure''s posture is confident and contemplative.',
  '{"figures": ["lord/merchant surveying from parapet"], "colors": ["red (passion/power)", "white (purity/clarity)", "green/blue (the world beyond)"], "objects": ["small globe", "two wands on wall", "rose and lily carvings"], "background": "mountains, sea, distant horizon", "symbols": ["globe in hand (world as potential)", "two wands (duality of safety vs. adventure)", "parapet (vantage point of achieved position)", "roses and lilies (desire and purity of intent)", "sea and mountains (the unknown to be traversed)", "gaze outward (vision beyond the present)"]}'::jsonb,
  'Fire', 'Mars in Aries', 2
);

-- Three of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Three of Wands', 'Minor', 'Wands', 3,
  'Expansion, foresight, overseas ventures, and the first returns on bold action.',
  'Obstacles to long-term plans, delays in progress, or lack of foresight.',
  'The figure from the Two of Wands has made his choice. He stands now on the clifftop, three wands planted around him, watching his ships sail out into the open sea. His back is to us — he is fully committed to what lies ahead, not looking back at the security of the castle. This is the card of the entrepreneur who has launched their venture and now watches to see where the winds carry it. The Three of Wands speaks of commerce, expansion, and the confidence of someone who has put real stakes in the game. You have set your ships sailing. There is an exhilarating mixture of anticipation and earned patience here — you''ve done your part, and now the wider world will respond.',
  'Reversed, the Three of Wands suggests obstacles appearing on the path to expansion: delays in returns, setbacks in overseas ventures, or a plan that looked solid but now shows cracks. You may have launched before fully preparing, or external forces are complicating a well-laid plan. This card reversed can also indicate a reluctance to embrace a wider horizon — a pulling back from expansion just when it was becoming possible.',
  ARRAY['expansion', 'foresight', 'enterprise', 'overseas ventures', 'confidence', 'long-term vision', 'anticipation'],
  ARRAY['delays', 'obstacles to plans', 'lack of foresight', 'setbacks', 'restricted growth', 'retreating from expansion', 'poor timing'],
  'A figure in a red robe and green mantle stands on a rocky clifftop with three tall wands planted around them. They grip one wand from behind while gazing out over a wide bay or sea where ships can be seen sailing. The landscape is expansive and golden. Mountains rise in the distance. The figure''s posture is that of confident waiting and forward vision.',
  '{"figures": ["robed figure watching from cliff"], "colors": ["red (active will)", "green (growth)", "gold/amber (sun, success)"], "objects": ["three wands", "ships on sea"], "background": "wide sea, mountains, golden sky", "symbols": ["three wands (established foundation of will)", "ships on sea (ventures launched into the wider world)", "clifftop (elevated vantage of earned experience)", "back to viewer (total commitment to what lies ahead)", "mountains (challenges acknowledged and accepted)", "gold sky (solar confidence)"]}'::jsonb,
  'Fire', 'Sun in Aries', 3
);

-- Four of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Four of Wands', 'Minor', 'Wands', 4,
  'Celebration, harmony, homecoming, community, and a joyful milestone.',
  'Transition, instability at home, delayed celebration, or inner disharmony.',
  'Four wands are decorated with garlands of flowers and fruit, forming a festive canopy beneath which two figures dance and wave bouquets in welcome. Beyond them, a crowd gathers at the gate of a great manor. This is the card of the harvest festival, the wedding reception, the housewarming, the graduation party — the moment when a community gathers to honor what has been built and celebrate what is to come. The Four of Wands carries a radiant, uncomplicated happiness that is rarer than it appears: the joy of completion, of belonging, of being welcomed home by people who love you. It speaks of a foundation solid enough to hold a celebration. Rest here. Let yourself receive the joy.',
  'Reversed, the Four of Wands suggests that a celebration is delayed, that a homecoming is complicated by conflict or instability, or that what looks like harmony on the surface conceals unresolved tensions. You may be working through a period of transition where the foundation is being rebuilt — not destroyed, but renovated. The joy is coming. This card reversed can also indicate celebrating in private, milestones reached that go unacknowledged by those whose recognition you sought.',
  ARRAY['celebration', 'harmony', 'homecoming', 'community', 'milestone', 'joy', 'stability', 'reunion'],
  ARRAY['transition', 'instability', 'delayed celebration', 'disharmony', 'inner conflict', 'postponement', 'incomplete foundation'],
  'Four tall wands are planted in the ground with their tops decorated by a long garland of flowers, forming a kind of ceremonial arch or canopy. Beneath it, two figures in colorful robes wave large bouquets of flowers in joyful greeting. Beyond them, a grand castle or manor rises in the background. Other figures can be seen celebrating near the castle gate. The sky is clear and bright.',
  '{"figures": ["two celebrating figures with bouquets", "crowd near manor gate"], "colors": ["red/yellow (fire and joy)", "green (abundance)", "gold (celebration)"], "objects": ["four flower-garlanded wands", "bouquets", "grand manor"], "background": "castle gate, clear sky, gathering crowd", "symbols": ["four wands (stable material foundation)", "garlands (harvest/celebration)", "two figures (union celebrated)", "manor (home/achievement of security)", "open gate (welcome, belonging)", "bouquets (gifts freely given and received)"]}'::jsonb,
  'Fire', 'Venus in Aries', 4
);

-- Five of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Five of Wands', 'Minor', 'Wands', 5,
  'Competition, conflict, tension, struggle, and the chaos of competing forces.',
  'Avoiding conflict, inner tension, suppressed rivalry, or finding resolution.',
  'Five young men in different colored tunics wave and clash their wands in apparent combat — but look more carefully. No one is wounded. No one is fleeing. This is the melee of competition, not war. The Five of Wands represents the productive chaos of competing ideas, rival ambitions, and the friction that sharpens everyone involved. In a brainstorm, in a marketplace, in a sport — conflict at this level creates energy, innovation, and growth. However, when it becomes personal, when the competition turns corrosive, the lesson of this card is to step back and ask: what am I actually fighting for? Are we competing toward something, or merely competing against each other?',
  'Reversed, the Five of Wands can indicate avoiding necessary conflict, suppressing tensions that need airing, or an inner battle between competing desires and directions. You may be backing down when you should hold your ground, or finding that an external struggle is reaching its resolution as the other players tire. This card reversed sometimes indicates conflict that is becoming more personal and spiteful — no longer constructive, but corrosive.',
  ARRAY['competition', 'conflict', 'struggle', 'chaos', 'tension', 'rivalry', 'diversity of ideas', 'sport'],
  ARRAY['avoiding conflict', 'inner tension', 'suppressed rivalry', 'resolution', 'backing down', 'end of conflict', 'personal attacks'],
  'Five young men wearing different colored tunics wield large wooden wands in a disordered melee. Each figure appears to be contending with the others — some wands are raised overhead, others are crossed. Their postures suggest vigorous competition or mock battle rather than lethal combat. No blood, no wounds. The scene has a chaotic, energetic quality. The background is plain and bright.',
  '{"figures": ["five young men in different colored tunics"], "colors": ["varied tunics (diversity/different viewpoints)", "bright sky (the situation is not catastrophic)"], "objects": ["five crossing wands"], "background": "plain, minimal, suggesting the action is the focus", "symbols": ["five figures (the disruptive energy of five/change)", "crossed wands (competing forces, ideas in conflict)", "varied clothing (different backgrounds and approaches)", "no wounds (productive not destructive conflict)", "energy of motion (the chaos that precedes new order)"]}'::jsonb,
  'Fire', 'Saturn in Leo', 5
);

-- Six of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Six of Wands', 'Minor', 'Wands', 6,
  'Victory, public recognition, progress, self-confidence, and triumph.',
  'Egotism, disrepute, private victory, or fall from public grace.',
  'A warrior rides a white horse through an adoring crowd, wearing a laurel wreath crown and carrying a wand adorned with another wreath. The crowd walks alongside him carrying wands upright in salute. This is the hero''s return — the conqueror welcomed home, the artist at the opening night, the athlete at the medal ceremony. The Six of Wands is unambiguous: you have won, and the world knows it. This card speaks not only of external achievement but of the internal confidence that comes from having fought hard and prevailed. Let yourself receive the acknowledgment. You earned it. And notice: the white horse carries you with dignity — this victory was won not through domination but through excellence.',
  'Reversed, the Six of Wands warns of a fall from public recognition, a victory that goes unacknowledged, or the corrupting influence of ego at the peak of success. You may have achieved something significant but find the recognition hollow, or you may be falling from a position of esteem through arrogance. This card reversed can also indicate a private victory that must be celebrated quietly — the world does not need to know for it to be real.',
  ARRAY['victory', 'public recognition', 'triumph', 'confidence', 'success', 'leadership', 'acclaim', 'progress'],
  ARRAY['egotism', 'disrepute', 'private victory', 'fall from grace', 'arrogance', 'delayed success', 'lack of recognition'],
  'A confident rider on a white horse wears a laurel wreath and carries a tall wand topped with another wreath. The rider is surrounded by a crowd of people on foot, each carrying an upright wand in what appears to be a procession of celebration or triumph. The rider''s expression and posture exude victory and pride. The crowd''s posture is supportive and admiring.',
  '{"figures": ["triumphant rider on white horse", "crowd carrying wands"], "colors": ["white horse (purity/noble victory)", "green laurel (earned honor)", "gold/warm tones (celebration)"], "objects": ["laurel wreath on rider", "wreath on wand", "six wands"], "background": "crowd procession, celebratory atmosphere", "symbols": ["white horse (noble conquest through excellence)", "laurel wreath (classical victory/earned honor)", "wand with wreath (the will crowned with success)", "crowd with wands upright (communal recognition)", "procession (public acknowledgment)"]}'::jsonb,
  'Fire', 'Jupiter in Leo', 6
);

-- Seven of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Seven of Wands', 'Minor', 'Wands', 7,
  'Challenge, competition, perseverance, and defending your position.',
  'Giving up, overwhelmed, yielding under pressure, or abandoning convictions.',
  'A young man stands on a rocky outcrop above six upthrusting wands, wielding his own wand in defense against them. He is outnumbered, but he has the high ground. His posture is precarious yet defiant — one foot solid, one foot on uncertain footing (some decks show mismatched boots, hinting at the imperfect preparation of the embattled). This is the card of the person who has reached a position of hard-won success and must now defend it against challengers who want what they have. Leadership, creativity, authority, conviction — all of these attract opposition once they become visible. The Seven of Wands does not counsel you to back down. It tells you that the high ground is yours, and you have every advantage if you choose to use it.',
  'Reversed, the Seven of Wands suggests giving way under pressure, abandoning a position or conviction you should have held, or becoming overwhelmed by the scale of the opposition. You may be backing down out of exhaustion or self-doubt rather than wisdom. This card reversed can also indicate that the battle is genuinely unwinnable and that strategic retreat is the intelligent move — knowing the difference between surrender and wisdom is the lesson here.',
  ARRAY['challenge', 'competition', 'perseverance', 'defensiveness', 'conviction', 'courage', 'holding ground', 'advantage'],
  ARRAY['giving up', 'overwhelmed', 'yielding', 'abandoning convictions', 'retreat', 'exhaustion', 'capitulation', 'wavering'],
  'A young man in a green tunic stands on high rocky ground, wielding a long wand defensively against six wands that thrust upward from below the ledge. His posture is combative and braced. His feet are not entirely stable on the rocky outcrop. The six opposing wands suggest multiple challengers, though no opponents are visible — only their weapons.',
  '{"figures": ["young man on high ground with wand"], "colors": ["green (vitality/growth under pressure)", "rocky grey (difficult terrain defended)", "warm sky"], "objects": ["seven wands — one held, six opposing"], "background": "rocky outcrop, suggestion of height advantage", "symbols": ["high ground (strategic advantage of achieved position)", "six wands below (challengers/competition)", "one vs many (the isolated defender)", "rocky terrain (the difficulty of the position)", "defensive wand (the will as shield)", "mismatched footing (imperfect preparation, yet still standing)"]}'::jsonb,
  'Fire', 'Mars in Leo', 7
);

-- Eight of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Eight of Wands', 'Minor', 'Wands', 8,
  'Swift action, movement, rapid progress, and things finally in motion.',
  'Delays, frustration, opposition, slowing down, or misaligned timing.',
  'Eight wands streak diagonally through a clear blue sky above a peaceful, flowering landscape — moving fast, in perfect parallel, aimed at a single destination. There are no figures in this card. Only pure vector: kinetic, directed, unstoppable. The Eight of Wands is the card of momentum unleashed. Everything that has been building — the plans, the preparations, the waiting — suddenly resolves into motion. Messages arrive. Travel begins. Projects accelerate. Decisions crystallize. The air practically hums. This is the card of the universe saying "yes" after a long pause, of the gate swinging open, of the wind finally filling the sails. Move quickly. The window is open now.',
  'Reversed, the Eight of Wands brings its message of swift motion to a grinding halt. Delays frustrate, messages are misunderstood or fail to arrive, travel plans collapse, and the momentum you worked to build dissipates before it reaches its destination. There may also be an excess of hasty energy — acting so quickly that you miss important details. The reversed Eight of Wands asks you to check your aim before releasing the arrow.',
  ARRAY['swift action', 'momentum', 'rapid progress', 'communication', 'travel', 'speed', 'clarity of direction', 'acceleration'],
  ARRAY['delays', 'frustration', 'slowing down', 'opposition', 'misaligned timing', 'hasty action', 'miscommunication', 'stagnation'],
  'Eight wooden wands streak diagonally across the card from upper left to lower right through a clear blue sky. Below them, a lush green landscape with a river and rolling hills is visible. The wands are in parallel formation, all aimed at the same point in the lower right of the card. There are no human figures. The scene conveys tremendous speed and directional clarity.',
  '{"figures": [], "colors": ["blue (clarity of sky/mind)", "green (fertile destination)", "brown wands (grounded will in flight)"], "objects": ["eight parallel wands in flight"], "background": "clear blue sky, lush green landscape, river below", "symbols": ["eight wands in parallel (unified, directed will)", "diagonal trajectory (movement toward goal)", "no figures (pure kinetic energy, no hesitation)", "clear sky (no obstacles)", "green land below (fertile arrival)", "river (the flow of events)"]}'::jsonb,
  'Fire', 'Mercury in Sagittarius', 8
);

-- Nine of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Nine of Wands', 'Minor', 'Wands', 9,
  'Resilience, grit, last stand, and the strength to persist to the end.',
  'Exhaustion, giving up near the finish, paranoia, or defensive rigidity.',
  'A weary figure leans on a wand, a bandage wrapped around his head — he has clearly been in a fight. Behind him, eight wands are planted in a row like a palisade, a defensive barrier he has built from his own ordeal. His expression is wary, watchful, battle-worn. He is not defeated. He is resting between rounds. The Nine of Wands speaks to that specific exhaustion known only to those who have been truly tested: the body wants to stop, the mind holds the line. You are closer to completion than you realize. The nine wands have been gathered — only one more to go before the ten. This card asks everything of you precisely because it knows what you are capable of. You have not come this far to give up now.',
  'Reversed, the Nine of Wands warns of exhaustion that has tipped into defeat, or a defensive rigidity born of too many battles. You may be so wounded by past betrayals that you can no longer trust when trust is appropriate. The barriers you built for protection may now be walls that keep out needed support. This card reversed can also indicate paranoia, an unwillingness to adapt, or a stubborn insistence on one approach that is no longer working.',
  ARRAY['resilience', 'grit', 'persistence', 'last stand', 'inner strength', 'defensiveness', 'endurance', 'courage under fire'],
  ARRAY['exhaustion', 'giving up', 'paranoia', 'rigidity', 'over-cautiousness', 'inability to trust', 'stubbornness', 'defensive collapse'],
  'A figure with a bandaged head leans heavily on a tall wand, facing the viewer with a wary, battle-worn expression. Behind the figure, eight tall wands are planted side by side in a row, forming a fence or barrier. The figure appears exhausted but undefeated — posture suggesting they are braced for whatever comes next. The landscape is sparse.',
  '{"figures": ["battle-worn figure with bandaged head"], "colors": ["muted earth tones (exhaustion/endurance)", "grey (weariness)", "green (vitality still present)"], "objects": ["wand leaned on", "eight wands as palisade barrier", "head bandage"], "background": "sparse, minimal landscape", "symbols": ["bandaged head (wounds of past battles)", "palisade of wands (defenses built from experience)", "leaning on wand (using will as support)", "wary gaze (experience-born vigilance)", "nine wands (penultimate — so close to completion)", "sparse landscape (stripped down to essentials)"]}'::jsonb,
  'Fire', 'Moon in Sagittarius', 9
);

-- Ten of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Ten of Wands', 'Minor', 'Wands', 10,
  'Burden, responsibility, hard work, and carrying too much for too long.',
  'Delegating, releasing burdens, offloading responsibilities, or collapse.',
  'A figure staggers under the weight of ten wands clutched to their chest, head bowed, inching toward a town just visible in the distance. The destination is in sight — the journey is nearly done — but the weight is immense and the posture speaks of someone who has taken on more than any single person should carry alone. The Ten of Wands is the completion card of the suit — all that Fire, all that ambition, all that creative will, now bundled into a single crushing armload. This card asks: what are you carrying that belongs to someone else? What responsibilities have you accumulated beyond your true capacity? The town is close. But you may need to set some of the wands down before you get there, or you will arrive in collapse rather than in triumph.',
  'Reversed, the Ten of Wands brings its overwhelming burden to a tipping point. You may be finally releasing obligations that have exhausted you, delegating what you have hoarded out of a need to control, or experiencing the collapse of a system built on one person doing too much. This card reversed can also signal the recognition of burnout — the moment before a necessary breakdown that leads to a wiser reconstruction of how you spend your energy.',
  ARRAY['burden', 'responsibility', 'overwork', 'hard work', 'completion', 'overwhelm', 'obligation', 'carrying too much'],
  ARRAY['delegating', 'releasing', 'burnout', 'collapse', 'offloading', 'end of struggle', 'recognizing limits', 'letting go'],
  'A figure is hunched forward under the weight of ten long wands bundled together in their arms, pressed against their chest and face. Their head is bowed beneath the load so they can barely see ahead. A village or town with trees is visible in the near distance — the destination is tantalizingly close. The landscape is flat and fields stretch to the horizon.',
  '{"figures": ["hunched figure carrying all ten wands"], "colors": ["earthy tones (the weight of the material)", "green (destination visible)", "muted (exhaustion)"], "objects": ["ten bundled wands pressed to chest"], "background": "village in near distance, flat fields", "symbols": ["ten wands (the full weight of accumulated ambition)", "hunched posture (burden bowing the will)", "head bowed (inability to see clearly under load)", "village in sight (completion is near)", "flat fields (the final stretch)", "bundled together (taking everything instead of distributing)"]}'::jsonb,
  'Fire', 'Saturn in Sagittarius', 10
);

-- =====================================================
-- SUIT OF CUPS (Water) — Cards 1–14
-- Element: Water | Keywords: emotion, intuition, relationships, the unconscious
-- =====================================================

-- Ace of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Ace of Cups', 'Minor', 'Cups', 1,
  'New love, emotional beginnings, intuition, and an overflowing heart.',
  'Emotional blockage, repressed feelings, emptiness, or an unopened heart.',
  'A great golden chalice overflows with five streams of water — one for each of the senses — held aloft by a hand emerging from a cloud. A dove descends from above bearing a communion wafer marked with a cross, dropping it into the cup. Below, a lotus-covered lake receives the overflow. This is the Grail of legend, the cup of the soul: the vessel through which divine love pours into human experience. The Ace of Cups announces a new emotional beginning — a love that is ready to be born, an intuition that is opening like a flower, a creative well that has been replenished. It is the primordial YES of the heart. When this card appears, something in you is ready to feel — fully, openly, without armoring. The question is whether you will hold out your cup to receive what is being offered.',
  'Reversed, the Ace of Cups suggests emotional repression, a heart not yet ready to open, or a creative and spiritual well that has run dry. You may be holding the cup upside down — unable to receive love, blocked from your own feeling life, or choosing numbness over the vulnerability of feeling. This card can also indicate a new emotional beginning that is being unconsciously sabotaged. The water is there. Something is stopping it from flowing.',
  ARRAY['new love', 'emotional beginning', 'intuition', 'overflow', 'compassion', 'creativity', 'spiritual opening', 'gift'],
  ARRAY['emotional blockage', 'repression', 'emptiness', 'blocked intuition', 'closed heart', 'creative drought', 'unreceived love'],
  'A hand emerges from a cloud on the right side of the card, holding up a large golden chalice or cup. From the cup, five streams of water overflow and pour downward. A white dove descends from above, carrying a circular wafer or host marked with a cross, and drops it into the cup. Below, a body of water is covered with open water lilies. The background sky is clear.',
  '{"figures": ["disembodied hand from cloud", "descending dove"], "colors": ["gold (divine vessel)", "white (purity/spirit)", "blue (water/emotion)"], "objects": ["overflowing golden chalice", "wafer with cross", "five streams", "lotus lilies"], "background": "lotus-covered lake, clear sky", "symbols": ["golden cup (the grail/vessel of the soul)", "five streams (the five senses opened to love)", "dove (the Holy Spirit/divine love descending)", "wafer (communion/grace)", "lotus (spiritual awakening from the waters of emotion)", "overflow (abundance that cannot be contained)"]}'::jsonb,
  'Water', 'Water (pure element)', 1
);

-- Two of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Two of Cups', 'Minor', 'Cups', 2,
  'Unified love, partnership, mutual attraction, and the sacred bond between two.',
  'Imbalance in a relationship, broken bond, incompatibility, or self-love lacking.',
  'A young man and woman stand facing each other, each raising a cup toward the other in a mutual toast. Between them floats the caduceus of Hermes — the winged staff of two entwined serpents — surmounted by a lion''s head with wings. This is a card of profound recognition: the moment two souls see each other clearly and choose each other consciously. The caduceus speaks of the alchemical marriage, the union of opposites that creates something greater than either part. Whether this is a romantic partnership, a business alliance, or a deep friendship, the Two of Cups announces a bond formed on genuine mutuality — equal giving, equal receiving, equal seeing. This is love as a sacred agreement, not a transaction.',
  'Reversed, the Two of Cups suggests an imbalance in a relationship — one person giving more than the other receives, or a connection built on incompatible foundations. The bond may be breaking, the caduceus fallen, the mutual recognition lost. This card reversed can also indicate a lack of self-love that makes authentic partnership impossible: you cannot truly meet another if you have not first made peace with yourself.',
  ARRAY['partnership', 'mutual attraction', 'union', 'love', 'harmony', 'connection', 'equality', 'sacred bond'],
  ARRAY['imbalance', 'broken bond', 'incompatibility', 'disharmony', 'one-sided love', 'separation', 'lack of self-love'],
  'A young man dressed in a floral tunic extends a cup toward a woman who extends her own cup in return. Between them, at the level of their offered cups, floats the caduceus — a winged staff with two serpents entwined around it — topped by a winged lion''s head. The setting appears to be a garden or open landscape. Their gazes meet with warmth and openness.',
  '{"figures": ["young man", "young woman facing each other"], "colors": ["red/orange (passion)", "blue (emotion)", "white (purity)"], "objects": ["two raised cups", "caduceus with lion head", "serpents entwined on staff"], "background": "garden, open landscape", "symbols": ["caduceus (sacred balance of opposites/Hermetic union)", "lion''s head (Leo/the passionate heart)", "two entwined serpents (duality becoming one)", "wings (aspiration beyond the purely physical)", "mutual cups (equal exchange)", "face-to-face (full recognition of the other)"]}'::jsonb,
  'Water', 'Venus in Cancer', 2
);

-- Three of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Three of Cups', 'Minor', 'Cups', 3,
  'Celebration, friendship, community, abundance, and collective joy.',
  'Overindulgence, gossip, isolation, or the end of a celebration.',
  'Three women dance in a circle in a garden overflowing with fruit and flowers, each raising a golden cup toward the center in a joyful toast. This is the card of sisterhood, of chosen family, of the people who gather around you not because they have to but because they delight in your presence. The Three of Cups celebrates the richness of human connection at its most uncomplicated: shared laughter, honest conversation, the table that is always set, the friend who always picks up the phone. It speaks of creative collaboration where each voice strengthens the whole, of community rituals that mark the sacred passages of life. There is a special magic in gatherings of three — the triangle holds energy that the dyad cannot.',
  'Reversed, the Three of Cups warns of overindulgence tipping into excess, or the shadow side of close circles — gossip, exclusion, or a clique dynamic that has become toxic. You may be isolating yourself from the community and celebration that would genuinely nourish you, or you are at the tail end of a festive period and must return to more solitary work. This card reversed can also speak of the dissolution of a friendship group or the ending of a shared creative project.',
  ARRAY['celebration', 'friendship', 'community', 'abundance', 'joy', 'sisterhood', 'collaboration', 'reunion'],
  ARRAY['overindulgence', 'gossip', 'isolation', 'excess', 'toxic group', 'end of celebration', 'exclusion', 'independence'],
  'Three women in flowing robes dance in a circle in a lush garden, each raising a golden cup overhead with one hand. Flowers adorn their hair and gowns. Around their feet, an abundant garden displays pumpkins, grapes, and other ripe fruits. The women''s faces are turned upward and toward each other in joyful celebration. The sky is bright and clear.',
  '{"figures": ["three dancing women"], "colors": ["red/orange/white (different aspects of feminine energy)", "gold (abundance/celebration)", "green (fertile garden)"], "objects": ["three raised golden cups", "ripe fruits", "flower crowns"], "background": "abundant garden, bright sky", "symbols": ["circular dance (the sacred circle/continuity)", "three women (the Triple Goddess — maiden, mother, crone)", "raised cups (toast/shared joy)", "abundant fruit (harvest of emotional investment)", "flower crowns (beauty and seasonal celebration)", "upward gaze (joy reaching toward the divine)"]}'::jsonb,
  'Water', 'Mercury in Cancer', 3
);

-- Four of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Four of Cups', 'Minor', 'Cups', 4,
  'Contemplation, apathy, re-evaluation, and missing what is being offered.',
  'Retreat ending, new motivation, emerging from withdrawal, or seizing opportunity.',
  'A young man sits cross-legged beneath a tree with arms folded and eyes downcast, lost in contemplation. Before him on the ground stand three cups. A hand reaches from a cloud on his right, offering a fourth cup — and he does not see it. This is one of the most psychologically precise cards in the deck: the person so absorbed in their own inner world, their discontent or disappointment with what they already have, that the gift being held out to them goes unnoticed. The Four of Cups speaks of the fertile but dangerous territory of deep introspection — necessary for growth, but potentially a form of withdrawal that mistakes its own depth for wisdom. Look up. Something is being offered to you.',
  'Reversed, the Four of Cups signals the end of withdrawal — eyes opening, arms unfolding, the willingness to re-engage. You are emerging from a period of deep introspection or depression and beginning to see the cup that has been waiting. This card reversed can also indicate that the retreat was necessary and productive: you went inside, did the work, and have returned ready to participate. Sometimes reversed, it speaks of the danger of remaining in comfortable apathy even when motivation is returning.',
  ARRAY['contemplation', 'apathy', 're-evaluation', 'withdrawal', 'discontent', 'introspection', 'missed opportunity', 'meditation'],
  ARRAY['emerging from withdrawal', 'new motivation', 'seizing opportunity', 'end of apathy', 'returning engagement', 'reawakening', 'openness'],
  'A young man sits with legs crossed and arms folded tightly across his chest beneath the canopy of a large tree. His expression is withdrawn and contemplative. Three golden cups stand before him on the grass. To his right, a hand reaches out from a white cloud, offering a fourth cup. The man does not appear to notice the offered cup — his gaze is inward or downward.',
  '{"figures": ["young man under tree"], "colors": ["green (growth/nature)", "grey/muted (withdrawal)", "gold (opportunity offered)"], "objects": ["three cups on ground", "fourth cup from cloud", "large tree"], "background": "simple landscape, tree providing shelter", "symbols": ["crossed arms (closed off, defensive withdrawal)", "three cups ignored (dissatisfaction with available gifts)", "cup offered from cloud (divine opportunity unnoticed)", "tree (shelter of solitude)", "folded legs (meditative retreat)", "downward gaze (absorbed in inner world)"]}'::jsonb,
  'Water', 'Moon in Cancer', 4
);

-- Five of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Five of Cups', 'Minor', 'Cups', 5,
  'Regret, loss, grief, disappointment, and fixation on what has been lost.',
  'Moving on, acceptance, finding hope after loss, or recovering from grief.',
  'A cloaked figure in black stands before three spilled cups, head bowed in grief, back turned to two cups that stand upright behind them. In the distance, a bridge spans a river toward a castle or keep. This is the card of grief in its most human form — the moment after the loss, when the mind can register only what is gone and cannot yet perceive what remains. Three cups lie spilled, their contents seeping into the earth. But two cups stand behind the mourner, full and untouched. The bridge is there. The castle is there. The way forward exists. The Five of Cups does not diminish grief — it honors it — but it also holds the gentle, unflinching truth: you have not lost everything. When you are ready to turn around, life is still waiting.',
  'Reversed, the Five of Cups suggests the beginning of recovery — the slow turn away from what was lost and toward what remains. Acceptance is arriving. The mourning period is not over, but you can feel the first faint pull of the forward direction. This card reversed can also indicate grief that has become a permanent identity, a refusal to move on that is itself a form of loss. The two full cups stand behind you still.',
  ARRAY['grief', 'regret', 'loss', 'disappointment', 'mourning', 'fixation on the past', 'sorrow', 'emotional pain'],
  ARRAY['moving on', 'acceptance', 'recovery', 'hope after loss', 'forgiveness', 'turning around', 'healing', 'finding what remains'],
  'A tall figure in a long black cloak stands with their back to the viewer, head bowed. Three ornate cups lie on their sides before the figure, their contents spilled. Behind the figure, two cups stand upright. In the background, a river flows beneath a stone bridge that leads to a distant castle. The sky is grey and overcast.',
  '{"figures": ["cloaked figure in black, back turned"], "colors": ["black (grief/mourning)", "grey sky (heaviness)", "silver river (passage of time/the way through)"], "objects": ["three spilled cups", "two standing cups behind", "stone bridge", "castle"], "background": "river, bridge, castle in distance, grey sky", "symbols": ["black cloak (the weight of grief)", "three spilled cups (the losses acknowledged)", "back turned (unable yet to see what remains)", "two upright cups (what is not lost)", "bridge (the crossing available)", "castle (home/belonging still accessible)", "grey sky (temporary — not eternal — darkness)"]}'::jsonb,
  'Water', 'Mars in Scorpio', 5
);

-- Six of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Six of Cups', 'Minor', 'Cups', 6,
  'Nostalgia, childhood memories, innocence, reunion, and gifts from the past.',
  'Living in the past, nostalgia as avoidance, naivety, or stuck in old patterns.',
  'A young boy stoops to offer a cup overflowing with white flowers to a smaller girl who reaches up to receive it. Five more flower-filled cups surround them in a courtyard of what appears to be an old, safe village. Behind them, a guard walks away — protection receding, no longer needed in this remembered place of safety. This is the card of the innocent past — not sanitized nostalgia, but the genuine sweetness of a time when the world felt comprehensible and safe, when gifts were given without calculation, when wonder was the default state. The Six of Cups can speak of literal reunion with people from the past, of karmic connections returning, or of the inner child asking to be acknowledged and tended.',
  'Reversed, the Six of Cups warns of living so firmly in the past that the present becomes inaccessible. Nostalgia has curdled into avoidance; the innocent memory has become a prison of what-was rather than a resource for what-is. You may be idealizing a past relationship, refusing to grow beyond a childhood identity, or naively trusting someone whose sweetness belongs to a chapter that is closed. The gift has been received — now it must be integrated, not enshrined.',
  ARRAY['nostalgia', 'childhood', 'innocence', 'reunion', 'past', 'gifts', 'karmic connections', 'memories'],
  ARRAY['living in the past', 'nostalgia as avoidance', 'naivety', 'stuck in old patterns', 'idealization', 'refusing to grow', 'childishness'],
  'A young boy in a tunic bends forward to present a large cup filled with white star-shaped flowers to a smaller girl. Five other cups filled with the same white flowers are arranged around them in the courtyard of a quaint, old-fashioned village. In the background, a guard or adult figure walks away. The setting has the quality of a peaceful, protected past.',
  '{"figures": ["young boy giving flowers", "small girl receiving"], "colors": ["white flowers (innocence/purity)", "warm tones (safety/the past)", "gold/amber (memory)"], "objects": ["six cups filled with white flowers", "village courtyard"], "background": "old village, guard walking away", "symbols": ["flower-filled cups (gifts of the heart given freely)", "boy giving to girl (innocent generosity)", "old village (the past as a place/time)", "guard walking away (protection no longer needed — or no longer there)", "white flowers (star flowers — purity, memory, the spirit of innocence)", "six cups (six as the number of harmony restored)"]}'::jsonb,
  'Water', 'Sun in Scorpio', 6
);

-- Seven of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Seven of Cups', 'Minor', 'Cups', 7,
  'Illusion, fantasy, wishful thinking, choices, and the temptation of dreams.',
  'Clarity emerging from confusion, decisive action, or illusion dispelled.',
  'A silhouetted figure stands with arms raised before seven cups floating in clouds, each containing a different vision: a head, a veiled figure, a snake, a castle, jewels, a wreath of victory, a dragon. Each cup offers a different fantasy — wealth, beauty, power, romance, conquest, mystery, danger. The figure is overwhelmed, transfixed, paralyzed by the multiplicity of seductions. This is the card of the imagination in its shadow form: not the disciplined creative vision of The Magician but the unfocused dreaming that mistakes the map for the territory. When the Seven of Cups appears, you are in the realm of illusion — and not all of what glitters is gold. One of these cups contains something real. The work is discernment: to look past the glamour and find the true offering.',
  'Reversed, the Seven of Cups signals the piercing of illusion — the dreamer waking up, the fog lifting, the false options falling away to reveal the one true path. You are moving from paralysis to decision, from fantasy to intention. This card reversed can also indicate that you have been choosing illusions over reality for so long that the awakening is jarring — reality feels harsh compared to the dream world. But it is only in reality that anything can actually be built.',
  ARRAY['illusion', 'fantasy', 'wishful thinking', 'choices', 'temptation', 'daydreaming', 'confusion', 'multiple options'],
  ARRAY['clarity', 'decisive action', 'illusion dispelled', 'waking up', 'choosing reality', 'focus', 'emerging from confusion'],
  'A dark silhouetted figure stands with arms raised in wonder or overwhelm before seven golden cups that float in swirling clouds. Each cup holds a different vision: a crowned human head; a glowing veiled figure; a snake; a castle tower; a pile of jewels; a laurel wreath; and a dragon or beast. The figure is featureless — a universal stand-in for anyone lost in fantasy.',
  '{"figures": ["silhouetted figure (universal dreamer)"], "colors": ["dark silhouette (ignorance)", "gold cups (temptation/allure)", "swirling clouds (illusion/the realm of dreams)"], "objects": ["seven cups in clouds", "head", "veiled figure", "snake", "castle", "jewels", "wreath", "dragon"], "background": "billowing purple-grey clouds", "symbols": ["seven cups (seven temptations/seven illusions)", "silhouette (the unindividuated self, lost in options)", "veiled figure (mystery that may be empty)", "snake (wisdom or temptation)", "castle (ambition)", "jewels (material desire)", "wreath (vanity of victory)", "dragon (power/danger)", "clouds (the insubstantial nature of all these visions)"]}'::jsonb,
  'Water', 'Venus in Scorpio', 7
);

-- Eight of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Eight of Cups', 'Minor', 'Cups', 8,
  'Abandonment, withdrawal, walking away, and the courage to seek deeper meaning.',
  'Drifting, aimlessness, fear of moving on, or returning to what was left behind.',
  'Under a waning moon, a figure in a red cloak uses a staff to pick their way through a rocky landscape, their back to eight carefully stacked cups and heading into the darkness of the mountains. There is nothing wrong with those cups — they are stacked neatly, intact — and that is precisely the point. The Eight of Cups does not speak of leaving because something is broken. It speaks of leaving because your soul knows there is something more. This is the card of the spiritual seeker who abandons comfort, security, and social approval to walk toward what is true. The moon, waning yet luminous, illuminates just enough of the path. You do not need to see the destination. You only need to know that you cannot stay.',
  'Reversed, the Eight of Cups suggests drifting without direction — leaving not toward something but simply away from something, which is a different and more hollow departure. You may be abandoning situations prematurely, or conversely, you may be afraid to leave what you know even though your soul is ready. This card reversed can also indicate a return: you left, and now you are considering going back to what you walked away from. Ask whether the return is wisdom or retreat.',
  ARRAY['walking away', 'withdrawal', 'seeking deeper meaning', 'abandonment', 'spiritual journey', 'courage to leave', 'transition'],
  ARRAY['drifting', 'aimlessness', 'fear of moving on', 'returning to the past', 'avoidance', 'directionless wandering', 'stagnation'],
  'A cloaked figure walks away from the foreground into a dark mountainous landscape, using a staff or wand for support. Behind them, eight golden cups are arranged in two rows — stacked neatly, apparently complete. A large waning moon dominates the night sky, partially eclipsed by the sun in some depictions, casting just enough light to see the path. The mountains ahead are dark and shadowed.',
  '{"figures": ["cloaked figure walking away"], "colors": ["red cloak (courage/life force)", "dark blues (night/the unknown)", "gold cups (what is left behind)"], "objects": ["eight stacked cups", "walking staff", "waning moon"], "background": "dark mountains, night sky, waning moon", "symbols": ["waning moon (a cycle ending, the soul in transition)", "eight intact cups (leaving what is whole because the soul seeks more)", "back turned (the commitment of departure)", "red cloak (the life force moving on)", "mountains ahead (the difficulty and dignity of the spiritual path)", "staff (support on the uncertain way)", "darkness (the necessary unknown)"]}'::jsonb,
  'Water', 'Saturn in Pisces', 8
);

-- Nine of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Nine of Cups', 'Minor', 'Cups', 9,
  'Contentment, satisfaction, gratitude, wishes fulfilled, and emotional abundance.',
  'Overindulgence, dissatisfaction despite success, materialism, or shallow happiness.',
  'A stout, well-dressed man sits on a bench with arms folded across his chest and a broad, self-satisfied smile. Behind him, on a curved table draped with blue cloth, nine golden cups stand in a perfect arc. He has everything — and he knows it. This is traditionally called the "wish card" of the tarot: the card that whispers that what you have been hoping for is very close to manifestation. The Nine of Cups speaks of the deep contentment that comes not merely from getting what you want but from genuinely knowing that you have enough — and that you have earned it. Sit with this feeling. Receive it without immediately reaching for the next thing. Let the moment be what it is: full.',
  'Reversed, the Nine of Cups warns that the wish has been granted but something is still missing — the contentment is hollow, the satisfaction conditional. You may have achieved material abundance while neglecting inner fulfillment, or you are overindulging in pleasures that provide diminishing returns. This card reversed can also indicate that your deepest wish, when granted, has turned out not to be what you truly needed. The cups are full — but full of what?',
  ARRAY['contentment', 'satisfaction', 'wishes fulfilled', 'gratitude', 'abundance', 'emotional fulfillment', 'pleasure', 'wellbeing'],
  ARRAY['overindulgence', 'dissatisfaction', 'shallow happiness', 'materialism', 'greed', 'complacency', 'emptiness despite success'],
  'A portly, well-dressed man sits on a wooden bench with his arms folded and a smug, self-satisfied expression. He wears a white turban and a colorful jacket. Behind him, a curved table covered with blue cloth displays nine golden cups arranged in a perfect arc. His posture speaks of complete satisfaction and comfortable pride in his achievements.',
  '{"figures": ["smug satisfied man on bench"], "colors": ["blue cloth (emotional satisfaction)", "gold cups (material and emotional abundance)", "red/colorful clothing (vitality and pleasure)"], "objects": ["nine cups in arc", "wooden bench", "blue draped table", "white turban"], "background": "simple, interior or garden setting", "symbols": ["nine cups in arc (completion of the emotional journey", "arms folded (self-containment/satisfaction)", "smug smile (earned pride in fulfillment)", "blue drape (the emotions held in beautiful order)", "nine (penultimate — so close to the ten/completion)", "turban (success and distinction)", "wooden bench (practical, earthly contentment)"]}'::jsonb,
  'Water', 'Jupiter in Pisces', 9
);

-- Ten of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Ten of Cups', 'Minor', 'Cups', 10,
  'Divine love, blissful union, harmony, family, and the fullness of an emotional life.',
  'Broken home, disharmony beneath the surface, unhappy family, or unrealistic ideals.',
  'A couple stands with arms outstretched, gazing at a rainbow arc of ten cups spanning the sky above their home. Beside them, two children dance with spontaneous joy. The house, the land, the river — everything speaks of a life built on love and sustained by it. This is the card of the happy ending that is not an ending but a living state: the deep relational contentment that comes when love, shared over time, has created a home, a family, a community of meaning. The rainbow — the divine covenant — arches over all of it as if the universe itself has blessed this particular arrangement of hearts. The Ten of Cups is the emotional equivalent of the Ten of Pentacles: a life well-loved, a legacy of warmth, a home the heart can always return to.',
  'Reversed, the Ten of Cups suggests disharmony beneath a surface that appears idyllic: a family held together by appearance rather than genuine connection, an emotional ideal that no one actually inhabits, or a loving home that is fracturing under unspoken pressures. You may be pursuing an image of happiness rather than the substance of it, or you are realizing that the picture-perfect life does not match what your soul actually needs. What would true emotional fulfillment look like for you — not borrowed from convention, but genuinely yours?',
  ARRAY['divine love', 'family', 'harmony', 'bliss', 'emotional fulfillment', 'home', 'community', 'lasting happiness'],
  ARRAY['disharmony', 'broken home', 'unrealistic ideals', 'surface happiness', 'family conflict', 'disconnection', 'emotional distance'],
  'A couple stands side by side in a lush landscape, their arms raised and outstretched toward the sky. Above them, a rainbow arcs across the sky, bearing ten golden cups in its curve. Beside the couple, two young children dance with arms wide open. In the background, a cozy house sits among green hills, and a river winds peacefully through the scene. The sky is bright and the colors are warm.',
  '{"figures": ["couple with arms raised", "two dancing children"], "colors": ["rainbow (divine promise/full spectrum)", "gold cups (emotional abundance)", "green (fertile happiness)", "warm light (divine blessing)"], "objects": ["rainbow of ten cups", "house", "river"], "background": "green hills, river, cottage, bright sky", "symbols": ["rainbow (the divine covenant/blessing over the home)", "ten cups (the full completion of emotional life)", "couple side by side (partnership as foundation)", "dancing children (joy as natural consequence of love)", "house (the home created by love)", "river (the ongoing flow of emotional life)", "raised arms (gratitude/reception of grace)"]}'::jsonb,
  'Water', 'Mars in Pisces', 10
);

-- =====================================================
-- SUIT OF SWORDS (Air) — Cards 1–14
-- Element: Air | Keywords: intellect, truth, conflict, communication, the mind
-- =====================================================

-- Ace of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Ace of Swords', 'Minor', 'Swords', 1,
  'Mental clarity, breakthrough, truth, and the cutting power of a new idea.',
  'Confusion, misinformation, clouded thinking, or a truth wielded without wisdom.',
  'A hand emerges from a cloud gripping an upright sword, its tip crowned with a golden crown encircled by a wreath. From the crown hang the yod — the primal Hebrew letter, the hand of God, falling like sparks of divine fire. Mountains rise in the grey distance. This is the primordial power of mind: the blade of pure intellect that cuts through illusion, separates truth from falsehood, and opens the way forward where confusion had closed it. The Ace of Swords is the moment of breakthrough — the answer that arrives in the middle of the night, the conversation that changes everything, the realization that cannot be undone. Truth, once seen, cannot be unseen. The sword is double-edged for a reason: the same blade that liberates also wounds. Use it with care.',
  'Reversed, the Ace of Swords suggests mental confusion, misinformation, or a breakthrough that is being blocked — perhaps by your own avoidance of a truth too uncomfortable to face. You may have the sword but be swinging it recklessly, wounding with words what could have been healed. This card reversed can also indicate a creative or intellectual project that has stalled before it could take shape, or arguments that produce noise rather than clarity.',
  ARRAY['clarity', 'breakthrough', 'truth', 'intellect', 'new idea', 'mental force', 'justice', 'decisive thinking'],
  ARRAY['confusion', 'misinformation', 'clouded thinking', 'reckless words', 'blocked clarity', 'deception', 'mental chaos'],
  'A hand reaches out from a white cloud on the right side of the card, gripping the hilt of a large upright sword. The blade is long and double-edged. At the tip, a golden crown sits encircled by a wreath of laurel and palm. Small yod-shaped flames or drops fall from the crown. In the grey distance below, jagged mountain peaks rise. The sky is pale and overcast.',
  '{"figures": ["disembodied hand from cloud"], "colors": ["grey (the mind''s impartial clarity)", "gold (divine truth)", "silver blade (discernment)"], "objects": ["double-edged sword", "golden crown", "laurel and palm wreath", "falling yods"], "background": "grey mountains, overcast sky", "symbols": ["double-edged blade (truth cuts both ways)", "crown at tip (mind in service of higher law)", "laurel (victory of the mind)", "palm (peace after conflict)", "yods (divine sparks/the hand of God)", "grey mountains (the clarity that sees difficulty without flinching)", "cloud (the higher realm from which pure mind descends)"]}'::jsonb,
  'Air', 'Air (pure element)', 1
);

-- Two of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Two of Swords', 'Minor', 'Swords', 2,
  'Indecision, stalemate, blocked emotions, and the paralysis of a difficult choice.',
  'Indecision broken, truth revealed, removing the blindfold, or facing what was avoided.',
  'A blindfolded woman sits rigidly on a stone bench before a grey sea, holding two crossed swords against her chest with arms folded in perfect symmetry. The crescent moon floats above the water behind her. She has chosen not to see. The crossed swords hold everything in suspension — no decision can be made because she refuses to look at the situation clearly. The Two of Swords speaks of the particular anguish of a choice where both options feel threatening: the mind reaches a deadlock because the heart is too defended to inform it. The blindfold is self-imposed. The truth necessary for resolution exists — she simply cannot yet bear to see it. The sea behind her is the unconscious that knows what the defended mind refuses to acknowledge.',
  'Reversed, the Two of Swords announces a breaking of the stalemate — the blindfold coming off, the crossed swords lowering, the truth finally permitted to enter. This can feel abrupt and destabilizing after a long impasse. Information arrives that forces a decision. What was blocked becomes visible. However, reversed it can also indicate that too much information is now flooding in — the opposite of blindness, an overwhelming of the senses that makes clear thinking equally difficult.',
  ARRAY['indecision', 'stalemate', 'blocked emotions', 'paralysis', 'avoidance', 'difficult choice', 'truce', 'denial'],
  ARRAY['truth revealed', 'blindfold removed', 'decision made', 'information arrives', 'facing reality', 'overwhelmed', 'breaking impasse'],
  'A woman in white robes sits upright and rigid on a stone bench or ledge. Her eyes are covered by a white blindfold. She holds two long swords crossed over her chest, one in each hand, with arms folded. Behind her stretches a grey sea with a crescent moon visible above the water. Small rocky islands or crags dot the water. Her posture is tense and deliberately defensive.',
  '{"figures": ["blindfolded woman with crossed swords"], "colors": ["white (the pretense of purity/willful blindness)", "grey (the mind in stalemate)", "silver swords (the intellect weaponized as defense)"], "objects": ["two crossed swords", "white blindfold", "stone bench"], "background": "grey sea, crescent moon, rocky islands", "symbols": ["blindfold (deliberate not-seeing)", "crossed swords (the mind at war with itself)", "stone bench (the hardness of the defended position)", "grey sea (the unconscious known but not acknowledged)", "crescent moon (intuition present but blocked)", "rocky islands (isolated fragments of feeling)", "rigid posture (the cost of maintaining the standoff)"]}'::jsonb,
  'Air', 'Moon in Libra', 2
);

-- Three of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Three of Swords', 'Minor', 'Swords', 3,
  'Heartbreak, grief, sorrow, painful truth, and the necessary pain of loss.',
  'Recovery, releasing grief, the wound healing, or suppressed pain surfacing.',
  'Three swords pierce a red heart against a sky of storm clouds and driving rain. This is perhaps the most viscerally immediate image in the entire Tarot — the picture says everything and it says it plainly. The Three of Swords does not soften the blow. It is the card of heartbreak: the phone call that changes everything, the betrayal discovered, the relationship ended, the diagnosis received, the dream that will not happen after all. But the sword of the mind piercing the heart has a hidden mercy: it is only when pain is consciously acknowledged — when it enters the mind as a known fact rather than a vague dread — that grief can begin to move. The storm clouds will pass. The heart, even pierced three times, is still whole.',
  'Reversed, the Three of Swords brings the storm toward its end. The swords may be withdrawing, the grief processing, the heart beginning to scar over in preparation for something new. However, reversed can also indicate pain that is being suppressed rather than integrated — grief driven underground where it cannot heal. It can also signal pain surfacing unexpectedly from an old wound you believed had closed.',
  ARRAY['heartbreak', 'grief', 'sorrow', 'painful truth', 'loss', 'betrayal', 'anguish', 'separation'],
  ARRAY['recovery', 'releasing grief', 'healing', 'suppressed pain', 'old wounds', 'moving through sorrow', 'forgiveness'],
  'Three long swords pierce a large red heart directly in the center of the card. The background is dominated by dark grey and black storm clouds, and diagonal lines suggest heavy rain falling. There are no figures. The image is stark, symbolic, and immediate — a heart impaled by three blades against a weeping sky.',
  '{"figures": [], "colors": ["red heart (love/the emotional center)", "grey-black storm (grief/sorrow)", "silver swords (the truth that wounds)"], "objects": ["three swords through heart", "storm clouds", "driving rain"], "background": "dark storm sky, rain", "symbols": ["three swords (the triple wound — mind, word, and fact all pierce the heart)", "red heart (love made vulnerable)", "storm (the emotional climate of grief)", "rain (tears/cleansing)", "no figures (the experience is universal — it belongs to everyone)", "pierced but whole heart (survival of the wound)"]}'::jsonb,
  'Air', 'Saturn in Libra', 3
);

-- Four of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Four of Swords', 'Minor', 'Swords', 4,
  'Rest, recovery, contemplation, and a necessary retreat from conflict.',
  'Restlessness, recovery from rest, or being forced back into action too soon.',
  'A knight lies in effigy on a tomb in what appears to be a church or chapel, hands clasped in prayer, three swords mounted on the wall above him, one sword laid horizontally beneath him along the tomb. A stained glass window casts colored light across the scene. This is not the death of the Death card — this knight is in the posture of the living dead, the deliberate suspension of the warrior who knows that rest is not defeat but strategy. The Four of Swords prescribes stillness after the ravages of the Three: the heart has been pierced, the mind has been in battle, and now the sacred obligation is to stop. To let the body recover, the nervous system settle, the unconscious process what the waking mind cannot. Retreat is not withdrawal from life — it is the preparation for return.',
  'Reversed, the Four of Swords marks the end of imposed rest — the knight rising from the tomb, the recuperation period complete or forcibly ended. You may be emerging from a period of illness, withdrawal, or contemplation ready to re-engage. However, reversed can also indicate restlessness that is breaking the rest before the healing is complete — returning to battle too soon because stillness has become intolerable.',
  ARRAY['rest', 'recovery', 'contemplation', 'retreat', 'sanctuary', 'preparation', 'stillness', 'recuperation'],
  ARRAY['restlessness', 'recovery ending', 'forced action', 'mental activation', 'returning too soon', 'inability to rest', 'awakening'],
  'A stone effigy of an armored knight lies on a tomb with hands clasped in prayer. Above the tomb, three swords hang on the wall pointing downward; a fourth sword lies flat along the side of the tomb beneath the figure. A stained glass window depicts a seated figure and a kneeling supplicant. The setting is a chapel or church interior. The atmosphere is still and reverent.',
  '{"figures": ["stone knight effigy lying in repose"], "colors": ["grey stone (permanence/stillness)", "colored glass light (spirit entering the material)", "gold (the divine at rest)"], "objects": ["three swords on wall", "one sword under tomb", "stained glass window", "stone tomb"], "background": "chapel interior, stained glass", "symbols": ["lying effigy (the warrior at deliberate rest)", "three swords above (the past conflicts acknowledged but set aside)", "one sword beneath (will preserved but laid down)", "chapel (sacred sanctuary of recovery)", "clasped hands (prayer/surrender to a higher process)", "stained glass (the light of spirit illuminating the stillness)"]}'::jsonb,
  'Air', 'Jupiter in Libra', 4
);

-- Five of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Five of Swords', 'Minor', 'Swords', 5,
  'Conflict, defeat, betrayal, winning at a cost, and hollow victory.',
  'Reconciliation after conflict, releasing resentment, or avoiding further damage.',
  'A sneering figure gathers up three swords from the ground while two other figures walk away dejected into the distance. The sky behind is turbulent and torn — clouds ripped apart, grey and yellow, the aftermath of storm. The winner holds the most swords. He has prevailed. But look at his face: there is contempt there, not joy. And the two who walk away — one head bowed in tears, one looking back — they are not broken, only defeated today. This is the card of the battle won through dishonor, the argument that destroyed the relationship even though you were technically right, the victory that empties you more than the loss would have. The question the Five of Swords asks is not "Did you win?" but "What did you win, and what did winning cost you?"',
  'Reversed, the Five of Swords opens the door to reconciliation — the conflict approaching resolution, the resentment softening, the willingness to lay down arms beginning to emerge. You may be releasing the compulsive need to be right in favor of something more valuable: the relationship, the peace, the forward motion. This card reversed can also indicate the ongoing consequences of a past conflict that was never properly resolved, old wounds still festering.',
  ARRAY['conflict', 'defeat', 'betrayal', 'hollow victory', 'dishonor', 'self-interest', 'aggression', 'winning at a cost'],
  ARRAY['reconciliation', 'releasing resentment', 'moving on', 'avoiding conflict', 'making peace', 'consequences', 'regret'],
  'A smirking young man in the foreground holds three swords and looks back with contempt at two figures walking away into the distance. Two more swords lie on the ground before him. The sky behind is agitated — torn grey and yellow clouds suggest the aftermath of storm. One of the retreating figures appears to weep; the other looks back toward the figure holding the swords.',
  '{"figures": ["contemptuous victor", "two defeated retreating figures"], "colors": ["turbulent grey-yellow sky (aftermath of bitter conflict)", "muted tones (hollow victory)"], "objects": ["five swords — three held, two on ground"], "background": "stormy agitated sky, desolate landscape", "symbols": ["contemptuous expression (the character of the victory)", "three swords gathered (taking more than one''s share)", "two swords on ground (the spoils of conflict)", "retreating figures (the defeated not destroyed — they will return)", "torn sky (the emotional atmosphere of betrayal)", "looking back (either guilt or dominance — the card holds both)"]}'::jsonb,
  'Air', 'Venus in Aquarius', 5
);

-- Six of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Six of Swords', 'Minor', 'Swords', 6,
  'Transition, moving on, passage through difficulty, and calmer waters ahead.',
  'Resisting transition, unfinished business, or returning to what was left behind.',
  'A ferryman poles a small boat across still water, carrying a woman with her head bowed and a child. Six swords stand upright in the prow of the boat. The water on the left — the side they are leaving — is choppy. The water on the right — where they are headed — is glassy and calm. The far shore is visible but undefined: there is a destination, though its exact nature is not yet clear. This is one of the great transition cards of the Tarot — the passage through sorrow, the movement from turbulence toward peace, the crossing that carries all the weight of what has been survived. The swords are brought along: this is not a flight from the past but a carrying-forward of hard-won knowledge. The far shore awaits. The ferryman knows the way.',
  'Reversed, the Six of Swords suggests resistance to a necessary transition — something is pulling you back to the choppy waters you should be leaving, or the passage itself has hit an obstacle. You may have unfinished business on the shore you thought you had left, or you are returning from the calmer waters to re-enter the storm, whether by necessity or by compulsion. This card reversed can also indicate that the transition is taking longer and is more turbulent than expected.',
  ARRAY['transition', 'moving on', 'passage', 'calmer waters', 'relief', 'travel', 'gradual change', 'leaving behind'],
  ARRAY['resisting transition', 'unfinished business', 'returning to difficulty', 'turbulent passage', 'stuck between', 'baggage carried', 'delay'],
  'A robed ferryman uses a long pole to guide a small flat-bottomed boat across a body of water. In the boat, a woman sits hunched with her head bowed and covered; a small child sits beside her. Six swords stand upright in the prow of the boat, their blades planted into the wood. The water on the left side of the boat is slightly choppy; the water on the right and ahead is noticeably calmer. A wooded far shore is visible in the distance.',
  '{"figures": ["ferryman poling", "huddled woman", "small child"], "colors": ["grey-blue (the crossing between states)", "dark water (the depths of the emotional passage)", "green far shore (the destination)"], "objects": ["six upright swords in prow", "flat boat", "long pole"], "background": "choppy water left, calm water right, wooded far shore", "symbols": ["ferryman (the guide/the one who knows the passage)", "six swords (the weight of the mind''s experience carried forward)", "hunched woman (grief in transit)", "child (innocence carried through difficulty)", "choppy to calm water (the actual movement from trouble to peace)", "far shore (the destination that holds promise without false specificity)"]}'::jsonb,
  'Air', 'Mercury in Aquarius', 6
);

-- Seven of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Seven of Swords', 'Minor', 'Swords', 7,
  'Deception, strategy, cunning, getting away with something, and going it alone.',
  'Coming clean, exposure of deception, returning what was taken, or admitting failure.',
  'A figure creeps away from a military encampment, glancing back over his shoulder with a sly, self-congratulatory look. He carries five swords bundled in his arms — stolen. Behind him, two swords remain planted in the ground, left behind because he could not carry them all. In the distance, soldiers at a yellow tent seem oblivious. This is the card of the thief, the strategist, the lone operator who believes they can outsmart the system — and sometimes they are right. The Seven of Swords speaks of cunning over confrontation, of working the angles, of incomplete solutions and plans that rely on not being caught. But two swords were left behind. The escape is not clean. And the backward glance tells you everything: part of this figure is already expecting to be found out.',
  'Reversed, the Seven of Swords brings exposure — the deception unraveling, the truth coming to light, the stolen goods being returned. You may be confessing something you have been hiding, or someone around you is being revealed in their duplicity. This card reversed can also represent the abandoning of a strategy that relied on cunning — a decision to engage honestly even when it is more costly. Sometimes reversed, it speaks of self-deception: the lies you have been telling yourself.',
  ARRAY['deception', 'strategy', 'cunning', 'stealth', 'getting away with it', 'lone wolf', 'avoidance', 'incomplete action'],
  ARRAY['exposure', 'coming clean', 'deception revealed', 'returning what was taken', 'confession', 'self-deception', 'conscience awakening'],
  'A figure in a tunic and pointed hat tiptoes away from a military encampment, carrying five swords bundled in their arms and glancing back over their shoulder with a mischievous or self-satisfied expression. Behind them, two swords remain stuck upright in the ground. In the background, yellow tents and oblivious soldiers are visible. The figure''s posture is stealthy, hurried, and slightly triumphant.',
  '{"figures": ["sneaking figure with five swords", "distant oblivious soldiers"], "colors": ["yellow tents (awareness that has been evaded)", "muted earth (stealth)", "grey-blue sky (the mind at its most calculating)"], "objects": ["five bundled swords", "two swords left behind", "military encampment"], "background": "tents, distant soldiers, open ground", "symbols": ["five swords taken (partial success, incomplete theft)", "two left behind (the plan has a flaw)", "backward glance (expecting consequences)", "tiptoed posture (the energy of evasion)", "soldiers not watching (complacency exploited)", "lone figure (the strategy of isolation and self-reliance)"]}'::jsonb,
  'Air', 'Moon in Aquarius', 7
);

-- Eight of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Eight of Swords', 'Minor', 'Swords', 8,
  'Restriction, imprisonment, self-imposed limitation, and the mind as its own prison.',
  'Freedom from restriction, releasing limiting beliefs, or reclaiming personal power.',
  'A woman stands blindfolded and loosely bound in a marshy landscape, surrounded by eight swords planted in the earth around her. She is not chained to the ground. The bonds are loose. The blindfold obscures her vision but does not physically restrain her. The swords form a barrier around her, but there are gaps. If she could only see — if she could only feel the looseness of the rope — she could walk free. The Eight of Swords is the card of the mind as prison: the belief system so thoroughly convincing that it generates its own confinement. You are not as trapped as you believe. The cage is largely constructed from thought. And the first step toward freedom is not the dramatic escape — it is the quiet recognition that the bars are not as solid as they appear.',
  'Reversed, the Eight of Swords signals the beginning of freedom — the blindfold slipping, the bonds loosening, the mind beginning to question the beliefs that imprisoned it. You are reclaiming your agency, your voice, your sense of options. The path out of restriction is becoming visible. However, reversed can also indicate a deeper entrenchment: the mind doubling down on its prison rather than acknowledging the door that stands open.',
  ARRAY['restriction', 'imprisonment', 'self-limitation', 'trapped', 'powerlessness', 'fear', 'mental prison', 'blindness'],
  ARRAY['freedom', 'releasing limits', 'reclaiming power', 'new perspective', 'escape', 'clarity', 'empowerment', 'open door'],
  'A woman stands bound with rope and blindfolded in what appears to be a marshy or muddy area. Eight swords are planted in the earth around her, several on each side, creating a loose enclosure. Her bonds appear to be loose around her body. She faces forward but cannot see. In the background, a castle or keep sits on a rocky hill. The ground beneath her feet is wet and uncertain.',
  '{"figures": ["bound blindfolded woman"], "colors": ["red (life force constrained)", "grey (the mind''s fog)", "dark ground (the marsh of stagnation)"], "objects": ["eight swords in earth", "loose rope bonds", "white blindfold"], "background": "marshy ground, castle on hill in distance", "symbols": ["loose bonds (the prison is self-maintained)", "blindfold (chosen not-seeing)", "eight swords (the mind has created a complete enclosure)", "marshy ground (the instability of the fearful mental state)", "gaps between swords (the exits that are not seen)", "castle in distance (the life that could be lived, visible to all but her)"]}'::jsonb,
  'Air', 'Jupiter in Gemini', 8
);

-- Nine of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Nine of Swords', 'Minor', 'Swords', 9,
  'Anxiety, nightmares, worry, anguish, and the darkest hour before dawn.',
  'Releasing anxiety, recovery from depression, facing fears, or inner work beginning.',
  'A figure sits upright in bed in the dead of night, face buried in hands, overwhelmed. Nine swords line the wall horizontally above them like a row of dark thoughts that will not be silenced. The quilt on the bed is embroidered with roses and astrological symbols — the mundane beauty of an ordinary life invaded by extraordinary dread. This is the card of the 3 a.m. mind: the catastrophizing, the replaying of every mistake, the anticipatory grief for losses that may never materialize. The Nine of Swords does not indicate that the feared events will occur — it maps the internal landscape of acute anxiety with terrifying precision. What is keeping you awake? And is the darkness of 3 a.m. the most reliable narrator of your life?',
  'Reversed, the Nine of Swords suggests the beginning of recovery from a period of intense anxiety or depression — the dawn beginning to lighten the edges of the dark. You may be reaching out for help, beginning therapy, facing the fears that have been terrorizing you in the night, or simply finding that the nightmare is lifting. This card reversed can also indicate anxiety driven underground — appearing to resolve while actually intensifying below the surface.',
  ARRAY['anxiety', 'nightmares', 'worry', 'anguish', 'despair', 'fear', 'insomnia', 'mental suffering'],
  ARRAY['releasing anxiety', 'recovery', 'facing fears', 'dawn after darkness', 'inner work', 'reaching for help', 'hope returning'],
  'A figure sits bolt upright in a bed, face buried in both hands in a posture of deep anguish or weeping. Nine swords hang horizontally on the dark wall behind them, arranged in a descending row. The bed is covered with a quilt embroidered with roses and astrological symbols. The room is dark. There is no window, no light — only the figure and the swords and the darkness.',
  '{"figures": ["anguished figure sitting up in bed"], "colors": ["black (the night/the unconscious at its most overwhelming)", "red roses on quilt (life persisting beneath the anguish)", "grey swords (the thoughts that torment)"], "objects": ["nine swords on wall", "embroidered quilt", "bed"], "background": "dark room, no windows, no light source", "symbols": ["nine swords on wall (the accumulation of anxious thoughts)", "buried face (the overwhelming of the senses)", "sitting upright (awakened from nightmare, or unable to sleep)", "quilt with roses (the beauty and continuity of ordinary life, present even now)", "astrological symbols on quilt (the cosmic order that persists within the personal chaos)", "total darkness (the 3 a.m. perspective)", "no window (the loss of perspective — no exit visible from inside the anguish)"]}'::jsonb,
  'Air', 'Mars in Gemini', 9
);

-- Ten of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Ten of Swords', 'Minor', 'Swords', 10,
  'Painful endings, rock bottom, betrayal, and the finality of collapse.',
  'Recovery, surviving the worst, rising again, or resisting an inevitable ending.',
  'A figure lies face down on the ground with ten swords buried in their back. The sky above is black and menacing to the right, but on the left horizon a thin band of gold announces the dawn. The sea is still. The card is brutal in its imagery and merciful in its message: this is rock bottom. The swords are all in — there is nowhere further to fall. And that is precisely the grace of the Ten of Swords. The worst has happened. The betrayal is complete, the failure is total, the ending is absolute. From here, the only direction available is up. The golden horizon is not a metaphor — it is the structural promise of the card itself: the darkest moment immediately precedes the light. The dawn is already there if you can bear to look left.',
  'Reversed, the Ten of Swords speaks of rising from the lowest point — survival, the slow return of vitality, the first steps taken after total defeat. You are not the same person who fell; something fundamental has been transformed by the extremity of the experience. However, reversed can also indicate resistance to an ending that has already occurred — continuing to fight a battle that is definitively over, or refusing to acknowledge how complete the collapse really was.',
  ARRAY['painful ending', 'rock bottom', 'betrayal', 'collapse', 'defeat', 'crisis', 'finality', 'rock bottom reached'],
  ARRAY['recovery', 'surviving the worst', 'rising again', 'resistance to ending', 'slow healing', 'transformation through extremity', 'new dawn'],
  'A figure in a red robe lies face down on the ground, ten swords plunged into their back and protruding upward. Their right hand appears to form a gesture of blessing. The sky above is dramatically divided: to the right, black storm clouds; to the left and on the horizon, a golden sunrise over a calm sea. The landscape is barren and flat.',
  '{"figures": ["prone figure with ten swords in back"], "colors": ["black sky (total darkness of this moment)", "gold horizon (the dawn that follows)", "red robe (the life force — still present, even now)"], "objects": ["ten swords in back", "calm sea", "golden horizon"], "background": "divided sky — black right, gold left; calm sea", "symbols": ["ten swords (the full culmination of mental/conflict energy — nothing more can be added)", "face down (complete surrender to the moment)", "golden horizon (dawn — the promise inherent in absolute endings)", "calm sea (the stillness after complete storm)", "blessing gesture of hand (even in extremity, grace)", "black and gold sky divided (the simultaneous reality of ending and beginning)", "red robe (the life force that persists even at zero)"]}'::jsonb,
  'Air', 'Sun in Gemini', 10
);

-- =====================================================
-- SUIT OF PENTACLES (Earth) — Cards 1–14
-- Element: Earth | Keywords: material, career, finances, body, nature, craft
-- =====================================================

-- Ace of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Ace of Pentacles', 'Minor', 'Pentacles', 1,
  'New financial opportunity, material beginnings, abundance, and a prosperous path opening.',
  'Missed opportunity, poor financial planning, or material potential squandered.',
  'A hand reaches from a cloud holding a single great golden pentacle — a five-pointed star set within a circle, the ancient symbol of the perfected human being and of spirit made manifest in matter. Below, an archway of flowers opens onto a garden path that winds toward distant mountains. This is the primordial gift of Earth: the coin pressed into your hand by the universe that says — here is the seed, here is the starting capital, here is the body, here is the land. What will you grow? The Ace of Pentacles marks the beginning of something tangible: a business opportunity, a financial windfall, a new job, a physical creative project, the beginning of a healthy body practice. The garden gate is open. The path is clear. The pentacle is real and weighty in your palm.',
  'Reversed, the Ace of Pentacles suggests that a material opportunity is being missed, poorly timed, or squandered through lack of planning. You may be holding the seed but refusing to plant it, or you are attempting to plant it in the wrong season or the wrong soil. Financial instability, a failed venture at the starting line, or excessive focus on security that prevents necessary risk — all fall under this card reversed. The potential is real. The question is whether you are ready to steward it.',
  ARRAY['new opportunity', 'material beginnings', 'abundance', 'prosperity', 'financial seed', 'grounded potential', 'practical gift', 'manifestation'],
  ARRAY['missed opportunity', 'poor planning', 'financial instability', 'squandered potential', 'bad investment', 'materialism', 'greed'],
  'A hand extends from a white cloud on the upper right, holding a large golden pentacle — a coin bearing a five-pointed star within a circle. Below, a lush garden is framed by a floral archway. A winding path leads through the garden gate toward rolling green hills and distant mountains. The garden blooms with flowers and the scene radiates abundance and invitation.',
  '{"figures": ["disembodied hand from cloud"], "colors": ["gold (material abundance/divine gift)", "green (growth/fertility)", "white (divine source)"], "objects": ["golden pentacle", "floral archway", "winding garden path"], "background": "lush garden, rolling hills, distant mountains", "symbols": ["pentacle (the five-pointed star — spirit made manifest in matter)", "hand from cloud (divine gift of material potential)", "garden gate (the threshold of material opportunity)", "winding path (the journey of building)", "floral arch (the beauty available within material life)", "mountains (the long-term horizon of what can be achieved)"]}'::jsonb,
  'Earth', 'Earth (pure element)', 1
);

-- Two of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Two of Pentacles', 'Minor', 'Pentacles', 2,
  'Balance, adaptability, juggling priorities, and managing change with grace.',
  'Imbalance, overwhelm, disorganization, or dropping the ball on responsibilities.',
  'A young man dances lightly on one foot, juggling two pentacles linked by an infinity loop of green ribbon. Behind him, two ships ride enormous waves on a turbulent sea — and yet he juggles, apparently effortless, apparently unbothered. This is the card of the skilled juggler of life: the person who manages multiple income streams, balances work and family, keeps several creative projects alive at once, and somehow makes it look graceful. The infinity symbol looping between the pentacles speaks to the dynamic equilibrium involved — not the rigid stillness of balance achieved, but the perpetual, active, alive quality of balance maintained. The waves remind you that the conditions are never perfectly still. The dance must continue regardless.',
  'Reversed, the Two of Pentacles reveals what happens when the juggling act finally falters: one ball drops, then another. Overwhelm, disorganization, and the inability to prioritize effectively bring multiple responsibilities crashing down simultaneously. You may be taking on more than is sustainable, or you have lost the rhythm that was keeping everything in motion. This card reversed asks: what can be set down, delegated, or simplified so that what truly matters can receive full attention?',
  ARRAY['balance', 'adaptability', 'juggling', 'multitasking', 'managing change', 'flexibility', 'flow', 'priorities'],
  ARRAY['imbalance', 'overwhelm', 'disorganization', 'dropping responsibilities', 'overextension', 'poor time management', 'chaos'],
  'A young man in a tall pointed hat and colorful tunic dances energetically, balancing on one foot. He holds two large pentacles, each connected by a flowing green ribbon that forms a continuous figure-eight or infinity loop between them. Behind him, a grey sea churns with large waves upon which two sailing ships ride — one cresting a wave, one in a trough. His expression is concentrated but light.',
  '{"figures": ["dancing young juggler"], "colors": ["green ribbon (the living flow of balance)", "grey sea (the turbulent conditions of real life)", "colorful tunic (vitality/adaptability)"], "objects": ["two pentacles", "infinity loop ribbon", "two ships on waves"], "background": "stormy sea with ships, grey sky", "symbols": ["infinity loop (dynamic equilibrium — balance as perpetual motion)", "juggling (active management of competing demands)", "dancing on one foot (grace under the conditions of imbalance)", "two ships on waves (the turbulent material world navigated)", "pointed hat (the fool''s wisdom — lightness in difficulty)", "grey sea (real conditions are never calm — balance must be found within them)"]}'::jsonb,
  'Earth', 'Jupiter in Capricorn', 2
);

-- Three of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Three of Pentacles', 'Minor', 'Pentacles', 3,
  'Teamwork, collaboration, craftsmanship, skill, and learning from masters.',
  'Disorganization, poor collaboration, lack of skill, or working in isolation.',
  'A young stonemason stands on a workbench in a cathedral, chisel in hand, three pentacles carved above him in an arch. Before him stand two figures — a monk and an architect holding plans — who consult with him and review his work. This scene is remarkable for the equality it depicts: the craftsman, the religious authority, and the designer all gathered in mutual consultation, each bringing something the others need. The Three of Pentacles is the card of the working team functioning at its best — where hierarchy dissolves in the face of shared purpose and each person''s expertise is genuinely valued. It speaks of the joy of mastery being applied, of apprenticeship to the standards of great work, of the cathedral that takes generations and requires everyone.',
  'Reversed, the Three of Pentacles reveals collaboration gone wrong: poor communication, conflicting visions, credit-hogging, or an unwillingness to take direction from those with relevant expertise. You may be working in isolation when the project requires a team, or the team has assembled without the shared vision necessary to produce coherent work. This card reversed can also indicate mediocrity — the standards of craftsmanship being lowered beneath what the work demands.',
  ARRAY['teamwork', 'collaboration', 'craftsmanship', 'skill', 'apprenticeship', 'mastery', 'planning', 'building'],
  ARRAY['disorganization', 'poor collaboration', 'lack of skill', 'isolation', 'conflict of vision', 'mediocrity', 'miscommunication'],
  'A young artisan or stonemason stands on a low workbench or scaffold inside a cathedral or church, working on a carved stone arch above which three pentacles are set. Two figures stand before him — one appears to be a monk or religious figure holding a scroll or book, the other an architect or planner also holding architectural drawings. All three are engaged in consultation. The carved stonework around them is elaborate and detailed.',
  '{"figures": ["young stonemason on workbench", "monk with scroll", "architect with plans"], "colors": ["grey stone (the work of building)", "warm earth tones (craft, skill, devotion)", "gold pentacles (the material achievement of spiritual purpose)"], "objects": ["three pentacles in arch", "chisel", "architectural plans", "scroll"], "background": "cathedral interior, elaborate stonework", "symbols": ["three figures consulting equally (the democracy of shared craft)", "cathedral (the great work that exceeds any individual)", "pentacles in arch (spirit made permanent in stone)", "workbench (the elevated position of the skilled craftsman)", "plans and scroll (the union of concept and tradition)", "chisel (the active tool of making)"]}'::jsonb,
  'Earth', 'Mars in Capricorn', 3
);

-- Four of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Four of Pentacles', 'Minor', 'Pentacles', 4,
  'Security, control, possessiveness, and the fear of loss beneath the holding.',
  'Releasing control, generosity opening, financial insecurity, or scarcity mindset breaking.',
  'A crowned figure sits on a stone throne at the edge of a city, clutching one pentacle to their chest, balancing one atop their crown, and pinning one under each foot. They cannot move. They cannot look anywhere but straight ahead, rigidly maintaining their grip on every coin. Behind them, the city — community, commerce, connection — recedes. This is the miser''s card, the card of the person who has survived scarcity so profoundly that abundance has become its own prison. There is a difference between security and hoarding, between stewardship and control, between the health of saving and the sickness of clinging. The Four of Pentacles asks: what are you holding so tightly that it has begun to hold you? And what would you have to feel if you opened your hands?',
  'Reversed, the Four of Pentacles signals either the crumbling of excessive control — generosity beginning to flow, the fist unclenching — or the opposite: financial instability, careless spending, or a scarcity panic that had been masked by the appearance of security. The coins are moving again, for better or worse. This card reversed asks whether the loosening is chosen wisdom or forced reckoning.',
  ARRAY['security', 'control', 'possessiveness', 'stability', 'materialism', 'hoarding', 'fear of loss', 'blocked generosity'],
  ARRAY['releasing control', 'generosity', 'financial insecurity', 'scarcity mindset breaking', 'open hands', 'spending', 'loss of control'],
  'A crowned figure sits rigidly on a stone throne or block, positioned at the edge of a city visible in the background. The figure clutches one large pentacle tightly against their chest with both arms. A second pentacle is balanced on top of their crown. One pentacle is pressed under each foot. Their posture is closed, guarded, and immovable. Their gaze is forward and fixed.',
  '{"figures": ["crowned figure gripping pentacles"], "colors": ["grey stone (rigidity/hoarding)", "gold pentacles (the value being controlled)", "muted city tones (the community left behind)"], "objects": ["four pentacles — one on crown, one at chest, two underfoot", "stone throne", "city behind"], "background": "city receding into distance", "symbols": ["pentacle on crown (material thoughts dominating the mind)", "pentacle at chest (hoarding what the heart should give)", "pentacles underfoot (standing on wealth rather than using it)", "rigid posture (the body becomes the cage of fear)", "city behind (social life abandoned for security)", "crown (the irony of kingship without freedom)"]}'::jsonb,
  'Earth', 'Sun in Capricorn', 4
);

-- Five of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Five of Pentacles', 'Minor', 'Pentacles', 5,
  'Financial hardship, poverty, insecurity, illness, and feeling left out in the cold.',
  'Recovery from hardship, help arriving, spiritual poverty recognized, or returning to community.',
  'Two destitute figures make their way through a snowstorm past a church window blazing with warm light and five golden pentacles. One figure walks on crutches, their leg bandaged. The other is hunched and thin, wrapped in rags with a bell around their neck — the mark of the outcast, the untouchable, those whom society has declared beyond its care. And the light in the window — the warmth, the community, the five shining pentacles — is right there. They do not look up at it. The Five of Pentacles does not ask you to minimize the reality of hardship. Financial crisis, illness, and the devastating shame of material struggle are real. But the card also holds, in its composition, the radical question: what would happen if you looked up at the window?',
  'Reversed, the Five of Pentacles announces the slow turning of material fortune — help arriving, a door opening, the worst of a financial or health crisis passing. You may be allowing yourself to receive support you had been too proud or too defeated to accept. The window has been noticed. The door is opening. This card reversed can also indicate a recovery from spiritual poverty — the recognition that something beyond the material has been neglected at the true cost of wellbeing.',
  ARRAY['hardship', 'poverty', 'insecurity', 'illness', 'isolation', 'material struggle', 'shame', 'feeling left out'],
  ARRAY['recovery', 'help arriving', 'spiritual poverty recognized', 'returning to community', 'improvement', 'accepting support', 'turning point'],
  'Two ragged figures struggle through a snowstorm. One walks on wooden crutches, with a bandaged or injured leg. The other is hunched, thin, and wrapped in tattered clothing with a bell hung around their neck. Behind them and to one side, a church or stained glass window glows with warm golden light, depicting five pentacles in its pattern. The figures do not look toward the window. Snow falls around them.',
  '{"figures": ["figure on crutches", "hunched figure with bell"], "colors": ["cold blue-white (winter/hardship)", "gold window light (available help and warmth)", "grey rags (destitution)"], "objects": ["wooden crutches", "bell around neck", "church window with five pentacles", "snow"], "background": "snowstorm, church exterior", "symbols": ["crutches (physical impairment/the weight of hardship)", "bell (the mark of the outcast — leper''s bell)", "glowing window (help and community available but unseen)", "five pentacles in window (material abundance existing nearby)", "snow (the cold indifference of material difficulty)", "not looking up (the psychological dimension of poverty — the loss of hope that prevents help being sought)"]}'::jsonb,
  'Earth', 'Mercury in Taurus', 5
);

-- Six of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Six of Pentacles', 'Minor', 'Pentacles', 6,
  'Generosity, charity, giving and receiving, and the flow of material resources.',
  'Strings-attached giving, debt, power imbalance in generosity, or charity withheld.',
  'A wealthy merchant stands in fine robes, holding a scale balanced in one hand and dropping coins with the other to two kneeling beggars. The scale is the same scale held by Justice — material distribution weighed and measured. This card holds a beautiful tension: the generosity is real and the beggars are genuinely helped, but the power differential is unmistakable. The giver stands, the receivers kneel. The Six of Pentacles speaks of the natural circulation of wealth and the generosity that enables it — but it also asks the deeper question of what it means to give from a position of surplus, and what it means to receive from a position of need. Are you the merchant or the beggar today? And what does each role require of you?',
  'Reversed, the Six of Pentacles warns of generosity that comes with strings attached, charity used as control, or debt that creates dependency rather than relief. You may be giving in order to maintain power over another, or receiving help that is not as unconditional as it appears. This card reversed can also indicate a withholding of resources that should be shared, or a refusal to receive support that is genuinely offered without condition.',
  ARRAY['generosity', 'charity', 'giving', 'receiving', 'abundance sharing', 'flow of resources', 'philanthropy', 'balanced exchange'],
  ARRAY['strings attached', 'power imbalance', 'debt', 'conditional giving', 'withholding', 'charity as control', 'inequality'],
  'A well-dressed merchant in fine robes stands in the center of the card, holding a set of balanced scales in one raised hand. With the other hand, he drops gold coins toward two figures who kneel before him on either side, hands outstretched to receive. The merchant''s posture is upright and assured. The kneeling figures are dressed in rags. The setting appears to be a town or marketplace.',
  '{"figures": ["wealthy merchant standing", "two kneeling beggars"], "colors": ["rich purple and red (wealth and authority)", "grey rags (poverty receiving)", "gold coins (the circulating resource)"], "objects": ["balanced scales", "gold coins dropping", "fine robes"], "background": "town, marketplace setting", "symbols": ["scales (material exchange weighed — justice within generosity)", "standing merchant (the power differential of the giver)", "kneeling receivers (the vulnerability of need)", "falling coins (the flow of resources from surplus to lack)", "balanced scales (the ideal of fair distribution)", "fine robes (surplus that enables giving)"]}'::jsonb,
  'Earth', 'Moon in Taurus', 6
);

-- Seven of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Seven of Pentacles', 'Minor', 'Pentacles', 7,
  'Patient investment, long-term vision, pausing to assess progress, and sustainable effort.',
  'Impatience, poor investment, lack of growth, or effort without reward.',
  'A young farmer leans on his hoe in a moment of rest, gazing at a vine heavy with six pentacles while a seventh pentacle rests near his feet. He has worked. The evidence is all around him in the leafy abundance of what he has cultivated. But he pauses — not in defeat, but in the deep, assessing stillness of the long-game thinker who knows that rushing the harvest destroys what patience would have perfected. The Seven of Pentacles is the card of the sustainable builder, the investor who checks in on their portfolio without compulsively trading, the writer who reads back the chapters written and trusts the book will arrive. Are you growing the right things? Is the soil still fertile? What, if anything, needs to be pruned?',
  'Reversed, the Seven of Pentacles reveals impatience coming to a head — the harvest being rushed before it is ready, or the recognition that significant effort has produced disappointing returns. You may be investing time, money, or energy into something that is genuinely not going to grow, and it is time to redirect those resources. This card reversed can also indicate the anxiety of the long-term thinker who cannot endure the discomfort of the gap between planting and harvest.',
  ARRAY['patient investment', 'long-term vision', 'assessment', 'sustainable effort', 'harvest approaching', 'perseverance', 'growth', 'reward of work'],
  ARRAY['impatience', 'poor investment', 'lack of growth', 'wasted effort', 'premature action', 'poor return', 'redirecting resources'],
  'A young man in working clothes leans on a long-handled hoe or spade, pausing to look at a large flowering vine or bush. Six large pentacles are arrayed among the leaves of the plant. A seventh pentacle rests on the ground near his feet. His posture is one of thoughtful assessment — resting after labor, examining what has grown. The background suggests a cultivated field or garden.',
  '{"figures": ["young farmer leaning on hoe"], "colors": ["green (the growth that has been cultivated)", "earth tones (the patient labor of the long game)", "gold pentacles (the harvest taking shape)"], "objects": ["hoe", "vine with six pentacles", "seventh pentacle on ground"], "background": "cultivated garden or field", "symbols": ["leaning on hoe (rest within labor — assessing not abandoning)", "vine with pentacles (the material fruits of patient cultivation)", "seven pentacles (completion approached but not yet arrived)", "seventh pentacle on ground (the beginning that has led to this)", "working clothes (this is earned, not given)", "gaze of assessment (the long-term thinker checking their work)"]}'::jsonb,
  'Earth', 'Saturn in Taurus', 7
);

-- Eight of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Eight of Pentacles', 'Minor', 'Pentacles', 8,
  'Diligence, skill development, craftsmanship, mastery through practice, and dedication.',
  'Perfectionism, lack of focus, cutting corners, or mastery without meaning.',
  'A craftsman sits at a workbench, carefully chiseling a pentacle into a round disc. Six completed pentacles hang on a post beside him; one sits finished on the bench. He is making the eighth. Behind him, a road leads to a distant town — the world of commerce and connection — but he is not looking at it. He is looking only at the work. This is the card of devotion to the craft itself, the joy of skill deepening through repetition, the mastery that can only be earned through the accumulated hours of deliberate practice. Each pentacle is the same, yet with each one the craftsman becomes more himself. The Eight of Pentacles honors the dignity of work done well for its own sake — and reminds us that expertise is not an accident but a choice made repeatedly.',
  'Reversed, the Eight of Pentacles reveals the shadow of dedication: perfectionism that paralyzes, skill developed in service of the wrong goals, or the grinding repetition of work that has lost its meaning. You may be going through the motions without genuine engagement, or you are so fixated on the technical perfection of your output that you have lost sight of its purpose. This card reversed can also indicate shoddy work — corners being cut where genuine craft is required.',
  ARRAY['diligence', 'mastery', 'craftsmanship', 'skill development', 'dedication', 'practice', 'apprenticeship', 'focused work'],
  ARRAY['perfectionism', 'lack of focus', 'cutting corners', 'workaholic', 'lost meaning', 'mediocre work', 'obsession with detail'],
  'A craftsman sits at a wooden workbench, intently carving or chiseling a pentacle into a circular disc. He is focused entirely on his work. To his left, a wooden post displays six completed pentacles hung in a column. A seventh completed pentacle rests on the bench beside him. He works on the eighth. Behind him, a road winds toward a town in the distance. He is dressed in working clothes with an apron.',
  '{"figures": ["craftsman at workbench"], "colors": ["earth tones (the dignity of material craft)", "gold pentacles (the product of skill)", "green (the vitality of meaningful work)"], "objects": ["chisel", "workbench", "eight pentacles — six hung, one complete, one in progress", "wooden post", "apron"], "background": "road to distant town", "symbols": ["eight pentacles in stages of completion (mastery as a process)", "eyes on the work (total absorption in craft)", "road to town not taken (choosing craft over commerce)", "post with hung pentacles (the record of accumulated skill)", "apron (the mark of the worker)", "workbench (the altar of the craftsman)"]}'::jsonb,
  'Earth', 'Sun in Virgo', 8
);

-- Nine of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Nine of Pentacles', 'Minor', 'Pentacles', 9,
  'Abundance, luxury, self-sufficiency, and the fruits of disciplined long-term effort.',
  'Over-dependence on others, financial setback, or hollow luxury without meaning.',
  'A richly dressed woman stands alone in a flourishing vineyard, eight pentacles adorning the vines around her and a ninth at her feet. On her gloved hand perches a hooded falcon. Snails move slowly at the base of the vines. She is the picture of cultivated abundance — not inherited wealth but the specific, earned elegance of someone who has built something real through discipline and vision, and now inhabits the fullness of what she created. The falcon speaks of mastery over the instinctual: she has trained the wild bird as she has trained herself. The Nine of Pentacles is the card of true self-sufficiency — the person who has done the work, built the garden, and now walks through it in the quiet knowledge of what they have become in the process of building it.',
  'Reversed, the Nine of Pentacles warns of luxury built on an insecure foundation, self-sufficiency that has tipped into isolation, or financial abundance that feels hollow because it was pursued without meaning. You may have achieved the external markers of success while neglecting the inner life that gives them context. This card reversed can also indicate financial dependence on another that is beginning to chafe, or a setback threatening the security that was so carefully built.',
  ARRAY['abundance', 'luxury', 'self-sufficiency', 'independence', 'discipline rewarded', 'refinement', 'achievement', 'financial security'],
  ARRAY['over-dependence', 'hollow luxury', 'financial setback', 'isolation', 'insecure foundation', 'loss of independence', 'vanity'],
  'A tall, elegant woman in a long golden gown adorned with a pattern of red flowers or Venus symbols stands in a lush vineyard. Eight large pentacles are arranged among the abundant vines around her. A ninth pentacle rests at her feet. On her raised left hand, a hooded falcon perches. Snails can be seen at the base of the vines. A grand manor or estate is visible in the background. She stands alone, poised and self-contained.',
  '{"figures": ["elegant woman alone in vineyard", "hooded falcon on hand"], "colors": ["gold gown (abundance achieved)", "green vines (flourishing cultivation)", "red pattern (Venus/refinement and desire)"], "objects": ["nine pentacles among vines", "hooded falcon", "gloved hand", "manor in background", "snails"], "background": "lush vineyard, estate in distance", "symbols": ["hooded falcon (mastery over instinct/the disciplined will)", "alone in the garden (self-sufficiency — needing no one to validate what has been built)", "nine pentacles (the near-complete harvest)", "snails (the slow and patient pace of true cultivation)", "golden gown (the clothing of achieved abundance)", "Venus pattern (the beauty cultivated through discipline)", "manor (the material foundation that sustains this moment)"]}'::jsonb,
  'Earth', 'Venus in Virgo', 9
);

-- Ten of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Ten of Pentacles', 'Minor', 'Pentacles', 10,
  'Legacy, inheritance, family wealth, lasting security, and multi-generational abundance.',
  'Family conflict over legacy, financial loss, unstable foundation, or broken tradition.',
  'An old man sits in an archway draped with grapes and pentacles, two white dogs at his feet, watching a couple and child in a courtyard beyond. The ten pentacles are arranged in the pattern of the Kabbalistic Tree of Life — the map of divine emanation, the structure of creation itself — overlaid on this scene of ordinary familial life. This is the final card of the suit and one of the great cards of the entire deck: the moment when material life achieves its deepest purpose, which is not the accumulation of wealth but the creation of a lineage. The old man watches the young family. He has built something that will outlast him. The child is the inheritor not just of property but of the entire web of choices and values that made the property possible. This is legacy: not what you own but what you leave behind in living beings.',
  'Reversed, the Ten of Pentacles reveals cracks in the foundation of a seemingly solid legacy — family conflict over inheritance, the dissolution of a dynasty through poor stewardship, or the recognition that the material abundance has been purchased at the cost of genuine familial connection. This card reversed can also indicate the breaking of a generational cycle — painful in the moment but potentially liberating for those who come after.',
  ARRAY['legacy', 'inheritance', 'family wealth', 'generational security', 'tradition', 'lasting foundation', 'dynasty', 'abundance'],
  ARRAY['family conflict', 'loss of legacy', 'unstable foundation', 'broken tradition', 'generational trauma', 'financial dispute', 'impermanence'],
  'An old white-haired man in a richly embroidered robe sits beneath an archway decorated with vines and grapes. Two white dogs sit at his feet. Through the arch, a man and woman stand together in a courtyard; a small child reaches up toward the man. Ten large pentacles are arranged across the scene in a pattern that echoes the Kabbalistic Tree of Life. A grand estate or castle is visible beyond. The scene encompasses three generations.',
  '{"figures": ["elderly patriarch under arch", "couple in courtyard", "young child", "two white dogs"], "colors": ["rich jewel tones (earned abundance)", "white dogs (purity of the domesticated life)", "gold pentacles (the material achievement of generations)"], "objects": ["ten pentacles in Tree of Life pattern", "grapevine arch", "embroidered robe", "estate beyond"], "background": "grand estate, courtyard, three generations present", "symbols": ["Tree of Life pattern (the divine structure underlying material abundance)", "three generations (the full arc of legacy)", "archway (the threshold between generations)", "grapevines (the harvest of time)", "two dogs (loyal companionship — the animals that have shared the human journey)", "old man watching (the patriarch who has built and now bears witness)", "child reaching up (the future inheriting)"]}'::jsonb,
  'Earth', 'Mercury in Virgo', 10
);

-- =====================================================
-- COURT CARDS — Pages, Knights, Queens, Kings
-- Pages (11): Earth of their element — students, messages, new energy
-- Knights (12): Fire of their element — movement, action, quest
-- Queens (13): Water of their element — mastery internalized, receptive power
-- Kings (14): Air of their element — mastery externalized, commanding authority
-- =====================================================

-- =====================================================
-- WANDS COURT CARDS
-- =====================================================

-- Page of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Page of Wands', 'Minor', 'Wands', 11,
  'Enthusiasm, exploration, discovery, free spirit, and the first spark of creative adventure.',
  'Immaturity, lack of direction, scattered energy, or all talk and no action.',
  'A young figure stands in a desert landscape, both hands gripping a tall wand that towers above them. They gaze up at it with curiosity and wonder — this is someone encountering the fire of creative possibility for perhaps the first time and finding it thrilling. The salamander symbols on their tunic speak to the alchemical fire that is their native element: they were born for this, even if they do not yet know how to direct it. The Page of Wands is the archetype of the eternal student of Fire — eager, enthusiastic, bursting with potential and ideas, unencumbered by the experience that would slow them into strategy. When this card appears, a message is coming, or an energy of fresh creative beginning is at hand. Meet it with the same openness the Page brings: curiosity first, judgment later.',
  'Reversed, the Page of Wands reveals the shadow of undirected fire: all spark and no sustained flame, ideas announced but never pursued, creative enthusiasm that burns brightest at the beginning and then quietly fades. You may be procrastinating, seeking constant novelty without depth, or allowing immaturity and impulsiveness to undermine genuinely promising starts. The fire is real — it simply needs a container, a direction, a commitment longer than the initial excitement.',
  ARRAY['enthusiasm', 'exploration', 'discovery', 'free spirit', 'creative spark', 'messages', 'new beginnings', 'curiosity'],
  ARRAY['immaturity', 'scattered energy', 'all talk', 'lack of direction', 'procrastination', 'impulsiveness', 'creative blocks'],
  'A young figure stands upright in an arid, desert-like landscape. They wear a tunic decorated with salamander symbols and a long flowing hat or cap. Both hands grip the base of a tall wand that stands before them, its tip above their head. They gaze up at the wand with focused curiosity. Three pyramids are visible in the distant background. The sky is bright and clear.',
  '{"figures": ["young page with tall wand"], "colors": ["yellow (fire/intellectual enthusiasm)", "orange (creative spark)", "desert sand (the unformed territory)"], "objects": ["tall wand", "salamander-patterned tunic"], "background": "desert, three pyramids in distance", "symbols": ["salamanders on tunic (the alchemical fire — the page''s native element)", "upward gaze (aspiration, wonder at potential)", "desert (the unformed landscape — everything still to be built)", "three pyramids (the ancient enduring products of great will)", "tall wand (the creative impulse larger than the one who holds it)", "youth (the energy of beginning)"]}'::jsonb,
  'Fire', 'Earth of Fire', 11
);

-- Knight of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Knight of Wands', 'Minor', 'Wands', 12,
  'Energy, passion, adventure, impulse, and the fearless charge toward a bold goal.',
  'Recklessness, hastiness, scattered action, or energy without wisdom or direction.',
  'The Knight of Wands rides a rearing horse at full gallop across a desert landscape, his armor covered in salamander emblems, his wand held aloft with the easy confidence of someone who has never doubted their right to charge. There is no road in this landscape — he makes the road. The Knight of Wands is pure Fire in motion: the entrepreneur who launches before the business plan is finished, the artist who begins the canvas without knowing where it ends, the traveler who buys the ticket and figures out the destination en route. This energy is magnetic, inspiring, and genuinely capable of achieving the remarkable — provided it does not run out of horse before it reaches its destination.',
  'Reversed, the Knight of Wands is fire consuming itself: energy so uncontrolled that it wastes in all directions at once, reckless action that creates messes others must clean up, or the frustrating halt of someone whose momentum has suddenly died. You may be acting before thinking, starting things you cannot finish, or allowing competitive aggression to override the wisdom that would actually serve your goals. The horse is still powerful — it needs a skilled rider.',
  ARRAY['energy', 'passion', 'adventure', 'confidence', 'impulsiveness', 'boldness', 'travel', 'charisma'],
  ARRAY['recklessness', 'hastiness', 'scattered', 'impulsive', 'volatile', 'delayed journey', 'frustration', 'aggression'],
  'An armored knight rides a rearing chestnut horse across a desert landscape. The knight''s armor and surcoat are decorated with salamander emblems. A feathered plume flies from his helmet. He holds a tall wand aloft in one hand with confident ease. The horse is energetic and powerful, front legs raised. Small pyramids are visible in the distance. The sky is clear and bright yellow-gold.',
  '{"figures": ["knight on rearing horse"], "colors": ["gold/orange (the fire element at full expression)", "red-brown horse (passion/vitality)", "yellow sky (solar confidence)"], "objects": ["raised wand", "plumed helmet", "salamander armor"], "background": "desert, pyramids, bright sky", "symbols": ["rearing horse (the power of directed passion)", "salamanders on armor (mastery of fire rather than being mastered by it)", "raised wand (will in motion, not in deliberation)", "desert (the open territory of the adventurer)", "feathered plume (aspiration, flair)", "no road (the Knight makes the way)"]}'::jsonb,
  'Fire', 'Sagittarius', 12
);

-- Queen of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Queen of Wands', 'Minor', 'Wands', 13,
  'Courage, determination, independence, confidence, and magnetic creative authority.',
  'Demanding, self-centered, jealousy, or creative energy turned domineering.',
  'The Queen of Wands sits on a throne decorated with lions and sunflowers, holding her wand upright in one hand and a sunflower in the other. A black cat sits at her feet — the only cat in the Tarot — watching. Her gaze meets yours directly, with the easy, unperformed confidence of someone who has never needed external validation to know their worth. She is the alchemist of Fire who has learned to sustain the flame rather than merely ignite it: her passion does not burn out because it is rooted in genuine self-knowledge. The sunflower she holds turns toward its own light. The Queen of Wands is at home in herself — creative, charismatic, fearlessly original — and that quality of magnetic self-possession is the source of her authority, not rank or title.',
  'Reversed, the Queen of Wands reveals fire without the wisdom of self-awareness: demanding, controlling, jealous of others'' successes, or burning those who get too close. The creative force that, when integrated, radiates warmth becomes — when unexamined — a consuming blaze. This card reversed asks you to look at where passion has become possessiveness, where confidence has curdled into arrogance, where the fire is threatening to devour the very relationships and projects it was meant to warm.',
  ARRAY['courage', 'determination', 'charisma', 'confidence', 'independence', 'creative authority', 'magnetic', 'passion'],
  ARRAY['demanding', 'self-centered', 'jealousy', 'controlling', 'aggressive', 'domineering', 'volatile', 'temperamental'],
  'A confident woman sits on a golden throne, her posture open and assured. The throne is carved with lions on each side and sunflowers on the back. She wears a crown of sunflowers and holds a tall wand upright in her right hand and a single sunflower in her left. A black cat sits at her feet looking outward. Her gaze meets the viewer directly. The background is bright yellow.',
  '{"figures": ["queen on lion throne", "black cat at feet"], "colors": ["gold/yellow (solar authority)", "sunflower yellow (turning toward one''s own light)", "black cat (the shadow self integrated)"], "objects": ["tall upright wand", "sunflower in hand", "lion-carved throne", "black cat"], "background": "bright yellow, warmth", "symbols": ["black cat (the familiar — the shadow integrated into power)", "sunflower (turning toward the light of one''s own nature)", "lions on throne (Leo/the solar force mastered)", "sunflower crown (the sovereignty of self-knowledge)", "direct gaze (the authority of the fully inhabited self)", "open posture (confidence without armor)"]}'::jsonb,
  'Fire', 'Aries', 13
);

-- King of Wands
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'King of Wands', 'Minor', 'Wands', 14,
  'Natural leader, vision, entrepreneur, bold authority, and mastery of creative fire.',
  'Impulsive leadership, high expectations, domineering, or vision without follow-through.',
  'The King of Wands sits forward on his throne as if about to rise — there is an impatience in his posture, a readiness for action barely contained by the formality of the throne. His robes are covered in salamanders and lions. A small lizard sits near his feet. He holds his wand not as a scepter of ceremony but as a tool he is about to use. This is the fully realized master of Fire: the visionary entrepreneur, the charismatic leader who inspires others not through authority alone but through the sheer infectious force of their belief in what is possible. The King of Wands has weathered enough campaigns to know strategy, but he has never lost the Knight''s belief that bold action changes reality. He is what the Page was always moving toward.',
  'Reversed, the King of Wands becomes the tyrant of Fire — the leader whose vision has become a demand, whose charisma has become coercion, whose bold confidence has calcified into an inability to hear contrary counsel. He may be setting expectations so high that those around him burn out trying to match his pace. Alternatively, this card reversed can indicate a leader whose fire has gone cold — the vision lost, the momentum stalled, the inspiring force reduced to an echo of itself.',
  ARRAY['natural leader', 'vision', 'bold authority', 'entrepreneurship', 'mastery', 'charisma', 'decisive', 'inspiring'],
  ARRAY['impulsive', 'domineering', 'high expectations', 'tyrannical', 'inflexible', 'burning out others', 'lost vision'],
  'A mature king sits slightly forward on a throne decorated with lions and salamanders. He wears robes covered in salamander and flame motifs and a crown fitted to a lion-shaped base. He holds a large wand upright, gripping it with intent rather than ceremony. A small lizard sits near the base of the throne. His expression is alert, confident, and forward-looking — as if the throne is simply where he pauses between campaigns.',
  '{"figures": ["king leaning forward on throne", "small lizard near throne"], "colors": ["orange/red (the mature fire element)", "gold (earned authority)", "green (the vitality of living power)"], "objects": ["commanding wand", "lion-and-salamander throne", "salamander robes"], "background": "warm, regal", "symbols": ["forward lean (action-ready authority)", "salamanders on robes (the fire element fully mastered)", "lizard at feet (the instinctual grounded)", "lion throne (Leo/solar kingship)", "wand held as tool not symbol (power in service of doing, not display)", "crown on lion base (the king whose authority is rooted in the element he commands)"]}'::jsonb,
  'Fire', 'Leo', 14
);

-- =====================================================
-- CUPS COURT CARDS
-- =====================================================

-- Page of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Page of Cups', 'Minor', 'Cups', 11,
  'Creative sensitivity, intuitive messages, emotional openness, and imaginative surprise.',
  'Emotional immaturity, escapism, creative blocks, or ignoring the voice of intuition.',
  'A young figure in a flowered tunic stands at the edge of the sea, holding up a cup from which a fish peers out with apparent surprise — and the figure looks back at the fish with equal surprise. This is the image of the psyche encountering its own depth for the first time: the message that arrives from the unconscious, unexpected and alive, when you finally sit still enough to hear it. The Page of Cups is the eternal student of the emotional and intuitive life — sensitive, imaginative, receptive to the subtle messages that others miss. A creative impulse arrives. A dream carries meaning. A feeling speaks louder than logic. This Page asks you to receive what your inner world is offering, even if it makes no rational sense. Especially then.',
  'Reversed, the Page of Cups reveals the shadow of unintegrated sensitivity: emotional immaturity, an overactive fantasy life used as escape from reality, or creative gifts so tender they retreat at the first hint of criticism. You may be receiving intuitive messages but dismissing them as fantasy, or your emotional life is expressing itself in indirect and immature ways. The fish is still in the cup — you simply are not yet ready to look.',
  ARRAY['sensitivity', 'intuition', 'creative messages', 'emotional openness', 'imagination', 'dreaming', 'surprise', 'psychic awareness'],
  ARRAY['emotional immaturity', 'escapism', 'creative blocks', 'ignoring intuition', 'fantasy as avoidance', 'moodiness', 'naivety'],
  'A young figure dressed in a blue tunic decorated with flowers stands at the edge of a calm sea. They hold a golden cup up before them with both hands. From the cup, a small fish peers upward, apparently speaking to the figure. The figure looks at the fish with an expression of gentle surprise and openness. The sea stretches behind them calm and flat. The figure wears a flowing blue hat with a long trailing scarf.',
  '{"figures": ["young page", "fish in cup"], "colors": ["blue (the water element — emotion and intuition)", "floral pattern (sensitivity and beauty)", "gold cup (the vessel of the psyche)"], "objects": ["cup with fish", "flowing hat and scarf", "calm sea behind"], "background": "calm sea, open sky", "symbols": ["fish in cup (the message from the unconscious — unexpected, alive)", "speaking fish (the voice of intuition breaking through)", "surprise expression (the ego encountering the depth of its own inner world)", "calm sea (the unconscious accessible rather than threatening)", "floral tunic (the sensitivity of this figure — attuned to beauty)", "blue hat (the mind open to the element of water)"]}'::jsonb,
  'Water', 'Earth of Water', 11
);

-- Knight of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Knight of Cups', 'Minor', 'Cups', 12,
  'Romance, charm, the arrival of an invitation or offer, and the pursuit of the ideal.',
  'Moodiness, unrealistic expectations, emotional manipulation, or the romantic who cannot commit.',
  'The Knight of Cups rides a white horse at a gentle walk — not the gallop of the Knight of Wands but a measured, almost ceremonial pace. He holds a golden cup extended before him as if bearing an offering, his gaze fixed forward with quiet intensity. His armor is decorated with fish and his winged helmet speaks of the messenger of the gods. This Knight is the romantic par excellence: the one who arrives bearing the cup of his heart''s devotion, who pursues the ideal with a grace and sensitivity rare among knights. He is Galahad, Lancelot, the troubadour beneath the window. When this card appears, something is arriving — an invitation, a romantic overture, a creative offer, a message from the heart. The horse moves slowly because what he carries is precious.',
  'Reversed, the Knight of Cups reveals the shadow of idealized emotion: the romantic who falls in love with love rather than with a real person, the charming manipulator who deploys emotional intelligence as a tool of seduction, or the visionary whose dreams never make contact with reality. You may be pursuing a fantasy while the actual person or situation before you goes unmet. This card reversed can also indicate moodiness, withdrawal, and the danger of the undirected emotional life.',
  ARRAY['romance', 'charm', 'invitation', 'idealism', 'creative offer', 'emotional intelligence', 'pursuit', 'grace'],
  ARRAY['moodiness', 'unrealistic', 'manipulation', 'cannot commit', 'escapism', 'emotional volatility', 'false charm'],
  'A knight in silver armor decorated with fish motifs rides a white horse at a slow, stately walk. His winged helmet features wings on the sides. He extends a golden cup before him in his right hand, holding it reverently and offering it forward. His gaze is focused and somewhat dreamy. The landscape behind him shows a river flowing through rolling hills. The horse moves calmly and deliberately.',
  '{"figures": ["knight on white horse holding cup"], "colors": ["silver armor (the moon/emotional reflection)", "white horse (purity/the ideal)", "gold cup (the offering of the heart)"], "objects": ["golden cup extended", "winged helmet", "fish-decorated armor"], "background": "river, rolling hills, calm landscape", "symbols": ["winged helmet (Hermes/the messenger of feeling)", "fish on armor (the water element worn as identity)", "extended cup (the offering — this knight comes bearing heart, not sword)", "white horse (the ideal — what is pursued in the name of love)", "slow walk (the care taken with what is precious)", "river behind (the emotional life flows through this landscape)"]}'::jsonb,
  'Water', 'Pisces', 12
);

-- Queen of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Queen of Cups', 'Minor', 'Cups', 13,
  'Compassionate authority, deep intuition, emotional wisdom, and the gift of full presence.',
  'Emotional overwhelm, co-dependency, murky intuition, or losing self in others.',
  'The Queen of Cups sits on a throne at the very edge of the sea, her feet resting on colored pebbles at the waterline. She gazes at a closed, elaborate cup — unlike any other cup in the deck, this one has handles formed by angels and a sealed lid. She does not drink from it; she contemplates it. This queen knows what lives in the depths of the unconscious but she is not swept away by it. She sits at the border between land and sea — between the rational and the imaginal, between the self and the other — with the ease of someone completely at home in both worlds. She is the healer, the therapist, the empath who can feel everything another person feels while remaining herself. Her compassion is boundless; her boundaries make that compassion sustainable.',
  'Reversed, the Queen of Cups reveals what happens when the gift of deep feeling lacks the container of selfhood: emotional overwhelm, co-dependency, the healer who absorbs everyone else''s pain until she cannot feel her own. Her intuition, normally so clear, becomes murky — clouded by the feelings of others or by the undrained weight of accumulated emotional labor. This card reversed asks: where have you lost yourself in the emotional world of another? Where does care end and self-abandonment begin?',
  ARRAY['compassion', 'intuition', 'emotional wisdom', 'empathy', 'healing', 'nurturing', 'psychic sensitivity', 'presence'],
  ARRAY['emotional overwhelm', 'co-dependency', 'murky intuition', 'losing self', 'martyrdom', 'insecurity', 'absorbing others'' pain'],
  'A beautiful woman sits on a throne at the very edge of the sea, her feet resting on the wet pebbled shore. She wears white and blue robes and a crown. She holds an elaborate closed golden cup with angel-shaped handles before her, gazing at it with deep contemplative focus. The throne itself is decorated with sea-nymphs, fish, and shells. The sea is calm and luminous behind her.',
  '{"figures": ["queen at the waterline"], "colors": ["blue and white (water/purity/intuition)", "gold cup (the psyche held as precious)", "sea-toned throne (the element as throne)"], "objects": ["sealed cup with angel handles", "sea-shell throne", "pebbled waterline"], "background": "calm luminous sea", "symbols": ["closed cup (the mysteries of the unconscious held, not emptied)", "angel handles (the sacred nature of emotional depth)", "throne at waterline (sovereignty that lives at the boundary of worlds)", "sea-nymph carvings (the element made permanent in the seat of power)", "pebbled shore (the liminal space between land and sea)", "contemplative gaze (wisdom through feeling rather than thinking)"]}'::jsonb,
  'Water', 'Cancer', 13
);

-- King of Cups
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'King of Cups', 'Minor', 'Cups', 14,
  'Emotional mastery, diplomatic wisdom, compassionate authority, and the calm center in the storm.',
  'Emotional manipulation, moodiness, using feelings as control, or repressed emotional life.',
  'The King of Cups sits on a stone throne in the middle of a turbulent sea, waves crashing around him, a fish leaping in the background, a ship tossed by the storm. And he is utterly still. He holds his cup with relaxed authority. His gaze is calm and direct. This is the most remarkable quality of the King of Cups: the sea is not calm — he is. He does not master the ocean of feeling by suppressing it or escaping it but by learning to remain centered within it. This is emotional intelligence at its sovereign expression: the therapist who can hear the most harrowing stories without being destroyed by them, the leader who can make rational decisions in emotional crises, the partner who can meet another''s storm with stillness rather than reactivity. He has felt everything. He has been ruled by none of it.',
  'Reversed, the King of Cups reveals a man whose emotional mastery is a performance — who has learned to project calm while churning beneath the surface, or whose wisdom in managing others'' emotions has never been applied to his own. He may use emotional intelligence as manipulation, reading others'' vulnerabilities with the skill of someone who has never allowed their own to be seen. This card reversed can also indicate emotional repression so complete that it has become dissociation — the king who sits in the eye of the storm because he has learned not to feel the storm at all.',
  ARRAY['emotional mastery', 'diplomatic wisdom', 'compassionate authority', 'calm center', 'balance', 'wisdom', 'counseling', 'generosity'],
  ARRAY['emotional manipulation', 'repression', 'moodiness', 'volatility', 'using feelings as control', 'dissociation', 'dishonesty'],
  'A mature king sits on a stone throne that appears to float in the middle of a turbulent sea. He wears blue and green robes and a crown, with a fish amulet around his neck. He holds a golden cup in one hand and a scepter in the other, his posture relaxed and his expression calm despite the rough water surrounding him. Behind him, a fish leaps from the sea on one side, and a ship is tossed by waves on the other.',
  '{"figures": ["king enthroned in the sea"], "colors": ["blue and green (the water element at sovereign maturity)", "grey turbulent sea (the emotional world he commands)", "gold (the achieved authority)"], "objects": ["golden cup", "scepter", "fish amulet", "stone throne in water"], "background": "turbulent sea, leaping fish, ship in storm", "symbols": ["throne in turbulent sea (sovereignty within the emotional world, not above it)", "calm posture amid waves (the mastery that is presence not control)", "fish amulet (identity rooted in the element)", "leaping fish (the unconscious alive and acknowledged)", "ship in storm (the world of feeling is genuinely turbulent)", "cup held at ease (the emotional content is familiar, not threatening)"]}'::jsonb,
  'Water', 'Scorpio', 14
);

-- =====================================================
-- SWORDS COURT CARDS
-- =====================================================

-- Page of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Page of Swords', 'Minor', 'Swords', 11,
  'Curiosity, vigilance, sharp intellect, gathering information, and mental alertness.',
  'Deception, gossip, spying, all talk, or mental energy without ethical grounding.',
  'A young figure stands on a rocky hilltop in a landscape of turbulent clouds and windswept trees, holding a sword aloft in both hands, body turned as if alert to some threat from behind. They are watchful — almost too watchful, the hyper-vigilance of the very young intelligence that has learned the world contains dangers and responds by scanning constantly. The Page of Swords is the student of the mind: quick, curious, hungry for information, naturally alert to what is being said between the lines. They are the first to notice the inconsistency in a story, the shift in tone, the unasked question. This sharpness is their gift and their edge — literally. The sword is large in young hands. The awareness that one''s intelligence can wound as well as illuminate has not yet arrived.',
  'Reversed, the Page of Swords deploys their sharp mind without ethical grounding: gossip, spying, deception, the gathering of information for manipulation rather than understanding. You may be dealing with someone whose curiosity is actually surveillance, whose questions are a form of control. This card reversed can also indicate mental restlessness with no productive outlet — anxiety masquerading as vigilance, or clever talk substituting for genuine insight.',
  ARRAY['curiosity', 'vigilance', 'sharp intellect', 'alert', 'gathering information', 'mental energy', 'analysis', 'communication'],
  ARRAY['deception', 'gossip', 'spying', 'all talk', 'dishonesty', 'manipulative intelligence', 'anxiety', 'scattered thoughts'],
  'A young figure stands on a rocky, windswept hilltop. They hold a large sword aloft in both hands, body slightly turned as if alert to something behind them. Their hair and clothing are blown by the wind. The sky behind them is filled with fast-moving clouds. Several birds fly overhead. The landscape below features bending trees. The figure''s posture is alert and watchful, the sword a size too large for their slight frame.',
  '{"figures": ["young page on windy hilltop"], "colors": ["grey-blue sky (the mental element)", "windswept (the air element in agitation)", "earthy hilltop (the mind needs grounding it has not yet found)"], "objects": ["large sword raised in both hands", "windswept clothing and hair"], "background": "turbulent clouds, birds, bending trees below", "symbols": ["large sword in young hands (intellectual power not yet matched by wisdom)", "windswept hilltop (the exposed position of the too-alert mind)", "looking backward (hyper-vigilance, scanning for threats)", "birds (the thoughts that fill the air element mind)", "bending trees (the world is responsive to and moved by this wind)", "turbulent clouds (a mind not yet settled)"]}'::jsonb,
  'Air', 'Earth of Air', 11
);

-- Knight of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Knight of Swords', 'Minor', 'Swords', 12,
  'Action, drive, ambition, directness, and charging forward with fierce conviction.',
  'Ruthlessness, aggression, reckless decisions, or charging in the wrong direction.',
  'The Knight of Swords charges at full gallop into a fierce headwind, his horse''s mane and tail streaming backward, the trees behind him bent to breaking. He holds his sword straight ahead — not raised for combat but pointed forward like a compass needle. He is going somewhere specific and he is going there now, at maximum velocity. Of all the knights, this one moves fastest and thinks later. The Knight of Swords represents the power of the mind converted directly into action: the decisive moment, the commitment to a direction, the willingness to cut through hesitation. He is brilliant in a crisis. He is dangerous when unchecked.',
  'Reversed, the Knight of Swords is all blade and no direction: aggression without target, speed without wisdom, the cutting word deployed without care for who bleeds. You may be in a conflict where the energy of attack has become its own justification — no longer about winning a point but about the act of charging itself. This card reversed can also indicate someone charging so fast they are about to ride off a cliff, or the frustration of forward momentum that has hit an immovable wall.',
  ARRAY['action', 'drive', 'ambition', 'directness', 'decisive', 'fast-moving', 'charge', 'cutting through'],
  ARRAY['ruthlessness', 'aggression', 'reckless', 'charging blindly', 'destructive', 'impulsive', 'verbal violence', 'scattered force'],
  'A knight in full silver armor charges forward at full gallop on a grey or white horse. The horse leaps through a windswept landscape, mane and tail streaming backward in the speed of the charge. Trees behind them bend dramatically in the wind. The knight holds a large sword pointed directly forward. Storm clouds gather overhead. The knight''s cape and the horse''s trappings stream backward. The energy is explosive and forward-driving.',
  '{"figures": ["charging knight"], "colors": ["silver armor (the air element — intellect as protection)", "grey horse (the mind at full gallop)", "storm sky (the mental atmosphere of conflict)"], "objects": ["sword pointed forward", "streaming cape", "charging horse"], "background": "bending trees, storm clouds, windswept", "symbols": ["sword as compass (the mind committed to a direction)", "full gallop (thought converted directly into action)", "bending trees (the force of this passage affects everything in its path)", "storm clouds (the conflict this energy both moves through and generates)", "streaming backward (the force of forward motion)", "no looking back (total commitment — for better or worse)"]}'::jsonb,
  'Air', 'Gemini', 12
);

-- Queen of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Queen of Swords', 'Minor', 'Swords', 13,
  'Clear thinking, direct communication, independent mind, and truth spoken with authority.',
  'Cold-heartedness, bitterness, cruelty in communication, or grief hardened into armor.',
  'The Queen of Swords sits on a stone throne high above the clouds, her sword held upright in her right hand while her left hand extends outward, palm up, in a gesture of reception or offering. Her crown bears a butterfly — the symbol of transformation. Her throne is carved with cherubs and a butterfly. She looks out into the distance with an expression of absolute clarity and a certain severity that has been earned rather than assumed. This queen has known loss. The sword she holds upright was tempered in grief, and what emerged is something rarer than simple intellect: the ability to see clearly, speak plainly, and refuse the comfortable lie. Her directness is not cruelty — it is respect. She will tell you the truth when everyone else will only tell you what you want to hear.',
  'Reversed, the Queen of Swords reveals grief that has hardened into armor and armor that has become a weapon. The clarity that, when integrated, becomes wisdom becomes — when unexamined — cold-heartedness, sharp-tongued cruelty, or the bitterness of someone who has decided that vulnerability is weakness and never recovered from the wound that taught them that lesson. This card reversed asks: at what point did discernment become cynicism? Where is the butterfly that was promised by the transformation?',
  ARRAY['clear thinking', 'direct communication', 'truth', 'independence', 'experience', 'intellect', 'perception', 'autonomy'],
  ARRAY['cold-heartedness', 'bitterness', 'cruelty', 'grief as armor', 'sharp tongue', 'isolation', 'cynicism', 'closed heart'],
  'A woman sits on a stone throne elevated above the clouds. She wears a grey robe with a blue cloud-patterned cape and a crown topped with a butterfly. In her right hand, she holds a large upright sword. Her left hand is extended outward and slightly upward, palm open. The throne is carved with winged cherubs and a butterfly. She gazes into the distance with an expression of composed authority and clear-eyed seriousness. Clouds surround the throne and a single bird flies in the background.',
  '{"figures": ["queen above the clouds"], "colors": ["grey and blue (air element/clear cool intellect)", "white clouds (elevated perspective)", "gold (the authority of truth)"], "objects": ["upright sword", "butterfly crown", "cherub-carved throne", "extended open hand"], "background": "clouds, elevated above landscape, single bird", "symbols": ["butterfly crown (transformation — grief alchemized into wisdom)", "above the clouds (the perspective that has risen above the weather of emotion)", "upright sword (truth held firm)", "open left hand (the receptivity that prevents the intellect from closing entirely)", "cherubs on throne (the feeling life not eliminated but carved into the seat of power)", "single bird (the solitary nature of this mind)", "grey robe (experience stripped of pretense)"]}'::jsonb,
  'Air', 'Libra', 13
);

-- King of Swords
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'King of Swords', 'Minor', 'Swords', 14,
  'Authority, truth, intellectual power, ethical leadership, and the rule of law and reason.',
  'Tyrannical thinking, abuse of power, manipulation, or intellect divorced from compassion.',
  'The King of Swords sits on his stone throne with his sword held upright and tilted slightly to the right — a subtle asymmetry that suggests a mind always in motion, never rigidly symmetrical. His gaze is direct and penetrating. His robes are blue; his throne is carved with butterflies and angels. Two birds fly in the background sky. This king is the pinnacle of the Air element: the jurist, the philosopher, the military strategist, the scientist — any mind that has achieved mastery through the sustained, disciplined application of reason in service of truth and justice. His authority rests not on force but on the clarity of his thinking and the consistency of his principles. He is not cold: he is precise. There is a difference.',
  'Reversed, the King of Swords uses his formidable intellect in service of power rather than truth: the autocrat who has constructed an ideology to justify domination, the abuser who is always technically correct, the system that enforces its own logic without mercy. His greatest shadow is the intellect that has severed its connection to the human cost of its conclusions. This card reversed asks: in whose service is this mind operating? Truth, or the self that fears what truth might require of it?',
  ARRAY['authority', 'truth', 'intellectual power', 'ethical leadership', 'principle', 'law', 'clarity', 'judgment'],
  ARRAY['tyrannical', 'abuse of power', 'manipulation', 'cold', 'dictatorial', 'intellect without compassion', 'corrupt authority'],
  'A mature king sits on a stone throne with his sword held upright, angled very slightly to his right. He wears blue and purple robes and a crown with small crescent moons on it. His gaze is direct and penetrating. The throne is carved with butterflies and angel figures. The sky behind him is clear with scattered clouds, and two small birds fly in the distance. His expression is composed, authoritative, and intellectually intent.',
  '{"figures": ["king with upright sword"], "colors": ["blue (the air element at full authority)", "purple (the sovereignty of the thinking mind)", "grey-white sky (clarity of atmosphere)"], "objects": ["upright sword slightly angled", "butterfly-carved throne", "crescent moon crown"], "background": "clear sky, two birds, scattered clouds", "symbols": ["sword angled not rigid (the living mind — always in motion, not dogmatic)", "crescent moons on crown (the mind that includes intuition within its sovereignty)", "butterflies on throne (transformation as the seat of authority)", "angels carved in throne (the higher faculties informing judgment)", "two birds (the dual nature of the thinking mind — analytic and synthetic)", "direct gaze (accountability to truth)", "blue robes (the element worn as identity)"]}'::jsonb,
  'Air', 'Aquarius', 14
);

-- =====================================================
-- PENTACLES COURT CARDS
-- =====================================================

-- Page of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Page of Pentacles', 'Minor', 'Pentacles', 11,
  'Ambition, diligence, a new skill or study, and the careful beginning of material mastery.',
  'Lack of focus, poor planning, learning blocked, or materialistic without purpose.',
  'A young figure stands in a flowering meadow at the edge of a cultivated field, gazing with deep concentration at a single pentacle held up before them. They do not toss it, wave it, or show it off — they study it. The Page of Pentacles is the student of the material world: the apprentice, the scholar, the intern, the person who has understood that mastery of anything real begins with genuine attention to the thing itself. There is a quality of reverence in this figure''s gaze — a recognition that what they hold is not simply a coin but a symbol of the entire material world and their relationship to it. The flowering meadow and cultivated field behind speak to the fertility available to those who take the time to learn before they act.',
  'Reversed, the Page of Pentacles loses the thread of genuine study: distracted, directionless, prone to daydreaming about material success without putting in the foundational work required. You may be starting courses or skills that you never finish, making financial plans without the discipline to follow them, or pursuing money as an end in itself without the patience that building real wealth requires. The pentacle is still there — but the gaze has drifted.',
  ARRAY['ambition', 'diligence', 'new skill', 'study', 'careful beginning', 'scholarship', 'focus', 'practical learning'],
  ARRAY['lack of focus', 'poor planning', 'daydreaming', 'materialistic', 'not following through', 'procrastination', 'unrealistic'],
  'A young figure stands alone in a flowering meadow. They wear a green tunic and a red cap. They hold a single large golden pentacle up before them, slightly elevated, and gaze at it with intense focus and concentration. Behind them stretches a green meadow with flowers, and beyond that a cultivated field of crops. Low mountains are visible in the far distance. Trees frame the scene. The figure appears oblivious to everything except the pentacle.',
  '{"figures": ["young page studying pentacle"], "colors": ["green (the earth element — growth through study)", "red cap (the latent fire of ambition)", "gold pentacle (the material world held as a subject of learning)"], "objects": ["single golden pentacle held up", "green tunic", "red cap"], "background": "flowering meadow, cultivated field, mountains", "symbols": ["pentacle held up to examine (learning before acting)", "singular focus (the earth element attention — deep, not scattered)", "flowering meadow (the beauty available within material life)", "cultivated field (what patient labor of the earth produces)", "mountains in distance (the long journey ahead — acknowledged without intimidation)", "youth in nature (the apprentice who has chosen the right teacher)"]}'::jsonb,
  'Earth', 'Earth of Earth', 11
);

-- Knight of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Knight of Pentacles', 'Minor', 'Pentacles', 12,
  'Hard work, responsibility, patience, routine, and the steady reliable force that builds empires.',
  'Stubbornness, laziness, boredom, or a methodical approach taken to the point of stagnation.',
  'The Knight of Pentacles sits motionless on a heavy, solid draft horse — the only knight in the deck whose horse is not moving. He holds a pentacle before him and surveys a ploughed field with an expression of patient, unhurried assessment. There is no drama here, no gallop, no streaming banners. What there is, is an absolute commitment to the work. This knight will not charge: he will plough the field, systematically, row by row, until it is done. Then he will plough it again. The Knight of Pentacles is the most reliable figure in the entire deck — the one who shows up, who finishes what he starts, who keeps every promise made. In a world that celebrates the sprint, he runs the marathon. And he always finishes.',
  'Reversed, the Knight of Pentacles — already the slowest of knights — becomes gridlocked: mired in routine to the point of stagnation, stubborn in methods that have stopped working, unable to distinguish between the patience that produces excellence and the inertia that produces nothing. You may be so committed to a particular way of doing something that you cannot adapt when the situation requires it. The horse is not moving because the knight has forgotten why they mounted.',
  ARRAY['hard work', 'responsibility', 'patience', 'reliability', 'routine', 'methodical', 'persistence', 'steady progress'],
  ARRAY['stubbornness', 'stagnation', 'boredom', 'laziness', 'inflexible methods', 'stuck in routine', 'no progress', 'obstinate'],
  'A heavily armored knight sits completely still on a large, solid dark horse. The horse stands motionless. The knight holds a large pentacle before him with both hands, examining it. He faces forward with a patient, assessing expression. Behind him, a ploughed field extends in neat furrows toward a tree line. The landscape is orderly, cultivated, and still. The knight''s armor is dark and practical rather than decorative.',
  '{"figures": ["knight on motionless horse"], "colors": ["dark armor (earth element — practical, undecorated)", "dark horse (the reliable power of the earth)", "green field (the productive result of patient labor)"], "objects": ["pentacle held before him", "dark draft horse", "ploughed field"], "background": "cultivated field, tree line, still landscape", "symbols": ["motionless horse (the only knight who does not move — earth as stillness within action)", "ploughed field (the result of systematic labor)", "practical dark armor (no display — function over form)", "pentacle studied not brandished (understanding material reality before acting upon it)", "patient expression (the earth element mastered — in no hurry, but always moving toward completion)"]}'::jsonb,
  'Earth', 'Virgo', 12
);

-- Queen of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'Queen of Pentacles', 'Minor', 'Pentacles', 13,
  'Nurturing abundance, practical wisdom, the art of creating a nourishing home, and grounded generosity.',
  'Financial dependence, smothering, imbalance between work and self-care, or material insecurity.',
  'The Queen of Pentacles sits on a lush and elaborate throne in a bower of flowering vines, a single golden pentacle cradled in her lap with both hands, her gaze directed downward at it with a tender, almost maternal focus. A rabbit runs at the bottom of the card. The throne is carved with fruit, goats, and angels. Everything in this image is in bloom. This is the earth mother at the height of her powers: practical, abundant, deeply embodied, with an extraordinary capacity to create environments in which others flourish. She knows how to manage money, how to nourish a body, how to turn a house into a sanctuary. Her wisdom is not abstract — it lives in the hands, in the kitchen, in the garden, in the way she makes everyone around her feel completely taken care of.',
  'Reversed, the Queen of Pentacles reveals the shadow of her gifts: financial dependence that has become a kind of imprisonment, nurturing that tips into smothering, a material focus so total that the inner life has been neglected until it cries out in ways she cannot explain. You may be working so hard to provide materially that you have forgotten to provide for yourself, or you are allowing security to substitute for intimacy. The garden is beautiful. But who is tending the gardener?',
  ARRAY['nurturing', 'practical wisdom', 'abundance', 'home', 'generosity', 'grounded', 'resourceful', 'sensual'],
  ARRAY['financial dependence', 'smothering', 'imbalance', 'material insecurity', 'self-neglect', 'over-work', 'isolation'],
  'A woman sits on a richly carved stone throne in a flowering garden bower. The throne is decorated with carvings of fruit, goats, and angel faces. She wears rich robes and a crown, and holds a large golden pentacle in her lap with both hands, gazing down at it with focused tenderness. Roses and other flowers bloom around and above her, creating a natural canopy. At the base of the card, a rabbit runs through the garden. The scene is verdant and abundant.',
  '{"figures": ["queen in garden bower", "running rabbit"], "colors": ["green (the abundant earth)", "gold (material richness)", "deep reds and flowers (sensuality and beauty of the material world)"], "objects": ["pentacle cradled in lap", "flower bower throne", "goat and fruit carvings"], "background": "lush garden, flowers overhead, natural abundance", "symbols": ["pentacle in lap (material abundance held with tenderness)", "rabbit (fertility, the earth''s quick generative power)", "downward gaze (attention given to what is in front of her — the practical and near)", "flower bower (the home as sanctuary she creates everywhere)", "goat carvings (Capricorn — the practical wisdom of the mountain goat)", "garden as throne room (her authority is in the world, not above it)"]}'::jsonb,
  'Earth', 'Capricorn', 13
);

-- King of Pentacles
INSERT INTO tarot_cards (
  name, arcana, suit, number, upright_summary, reversed_summary,
  upright_meaning_long, reversed_meaning_long,
  keywords_upright, keywords_reversed,
  imagery_description, symbolism,
  element, astrology_association, numerology
) VALUES (
  'King of Pentacles', 'Minor', 'Pentacles', 14,
  'Abundance mastered, financial authority, reliable success, and the king who built the kingdom.',
  'Stubbornness, materialism, financial corruption, or security at the expense of living.',
  'The King of Pentacles sits on a throne covered in grape vines and bull heads, his robes embroidered with grapevines and clusters of fruit, a golden pentacle resting in his lap while his scepter is held lightly at his side. His castle rises behind him, its towers visible above the lush garden of his court. He is the self-made sovereign of the material world: not someone who inherited the kingdom, but someone who built it — stone by stone, harvest by harvest, investment by investment — through the sustained application of practical wisdom, patience, and the refusal to cut corners. The grape vines that cover everything speak of the long-term thinking of the vintner: you plant for a harvest a decade away, and you tend it daily. This king has earned the right to sit in this garden.',
  'Reversed, the King of Pentacles reveals what happens when the builder becomes the miser, when security becomes an obsession, or when the man who built the kingdom confuses the kingdom with himself. Financial corruption, the hoarding of wealth at the expense of the people the kingdom was meant to serve, or a brutal pragmatism that has crushed everything that cannot be quantified — these are his shadows. Alternatively, this card reversed can indicate the collapse of a material empire through negligence, poor stewardship, or the consequences of shortcuts taken in the building.',
  ARRAY['abundance', 'financial mastery', 'reliable', 'success', 'security', 'provider', 'enterprising', 'disciplined wealth'],
  ARRAY['stubbornness', 'materialism', 'financial corruption', 'hoarding', 'obsession with security', 'inflexible', 'empire at cost'],
  'A mature king sits on a heavy stone throne covered in carved bull heads and grapevines. He wears robes richly embroidered with grapevines and clusters of fruit. A large golden pentacle rests in his lap; he holds a scepter lightly in his other hand. His crown and posture suggest wealth that is entirely at ease with itself — no need to display or justify. His castle and towers are visible behind him above the flourishing garden. Bull heads decorate his throne and armor. The scene is one of mature, settled, legitimate abundance.',
  '{"figures": ["king in vine-covered court"], "colors": ["deep green (the earth abundant)", "gold and black (material mastery)", "rich earth tones (the harvest of a life)"], "objects": ["pentacle in lap", "light scepter", "grapevine-embroidered robes", "bull-head throne"], "background": "castle towers, lush garden, flowering vines", "symbols": ["bull heads (Taurus — the patient earth force that builds)", "grapevines (the harvest of long-term thinking — the vintner''s wisdom)", "castle behind (what has been built)", "pentacle at ease in lap (abundance so established it needs no display)", "light scepter (authority worn lightly by those who have truly earned it)", "garden as court (the kingdom is a living thing, not a monument)"]}'::jsonb,
  'Earth', 'Taurus', 14
);
