-- =====================================================
-- ADDITIONAL COLORING PAGES
-- =====================================================
-- Run this AFTER coloring-book-setup.sql
-- Adds 8 more coloring page designs

INSERT INTO coloring_pages (title, title_normalized, description, category, difficulty, svg_content, is_public, use_count)
VALUES 

-- 1. Dinosaur (Animals)
(
  'Friendly Dinosaur',
  'friendly dinosaur',
  'A cute T-Rex dinosaur',
  'animals',
  'easy',
  '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <ellipse id="body" cx="200" cy="280" rx="100" ry="70" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="head" cx="280" cy="180" rx="60" ry="50" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="eye" cx="300" cy="170" r="12" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="pupil" cx="303" cy="170" r="5" fill="black"/>
    <ellipse id="snout" cx="330" cy="195" rx="25" ry="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="nostril" cx="340" cy="190" rx="4" ry="3" fill="black"/>
    <path id="mouth" d="M310 210 Q330 225 350 210" fill="none" stroke="black" stroke-width="2"/>
    <ellipse id="arm-front" cx="250" cy="280" rx="15" ry="30" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="arm-back" cx="150" cy="280" rx="15" ry="30" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="leg-front" cx="230" cy="350" rx="25" ry="35" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="leg-back" cx="160" cy="350" rx="25" ry="35" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <path id="tail" d="M100 280 Q50 280 30 250 Q20 230 40 220" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <polygon id="spike1" points="180,210 190,180 200,210" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <polygon id="spike2" points="200,205 210,175 220,205" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <polygon id="spike3" points="220,210 230,180 240,210" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
  </svg>',
  TRUE,
  8
),

-- 2. Rocket Ship (Vehicles)
(
  'Space Rocket',
  'space rocket',
  'A rocket ship blasting off',
  'vehicles',
  'medium',
  '<svg viewBox="0 0 400 450" xmlns="http://www.w3.org/2000/svg">
    <ellipse id="body" cx="200" cy="200" rx="50" ry="120" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <polygon id="nose" points="200,50 160,120 240,120" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <polygon id="fin-left" points="150,280 100,350 150,320" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <polygon id="fin-right" points="250,280 300,350 250,320" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="window1" cx="200" cy="150" rx="25" ry="25" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="window2" cx="200" cy="220" rx="20" ry="20" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="exhaust" cx="200" cy="330" rx="30" ry="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <path id="flame1" d="M200 345 Q180 400 200 430 Q220 400 200 345" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <path id="flame2" d="M180 340 Q160 380 175 400" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <path id="flame3" d="M220 340 Q240 380 225 400" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="star1" cx="50" cy="100" r="10" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="star2" cx="350" cy="150" r="8" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="star3" cx="80" cy="300" r="6" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="star4" cx="320" cy="80" r="7" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
  </svg>',
  TRUE,
  10
),

-- 3. Cupcake (Food)
(
  'Birthday Cupcake',
  'birthday cupcake',
  'A yummy cupcake with a candle',
  'food',
  'easy',
  '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <path id="wrapper" d="M120 250 L100 380 L300 380 L280 250 Z" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <line x1="130" y1="260" x2="115" y2="370" stroke="black" stroke-width="2"/>
    <line x1="160" y1="250" x2="150" y2="380" stroke="black" stroke-width="2"/>
    <line x1="200" y1="250" x2="200" y2="380" stroke="black" stroke-width="2"/>
    <line x1="240" y1="250" x2="250" y2="380" stroke="black" stroke-width="2"/>
    <line x1="270" y1="260" x2="285" y2="370" stroke="black" stroke-width="2"/>
    <ellipse id="frosting-base" cx="200" cy="200" rx="100" ry="60" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="frosting-mid" cx="200" cy="160" rx="70" ry="45" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="frosting-top" cx="200" cy="130" rx="40" ry="30" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <rect id="candle" x="190" y="70" width="20" height="50" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="flame" cx="200" cy="55" rx="12" ry="20" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="sprinkle1" cx="150" cy="180" r="6" fill="white" stroke="black" stroke-width="1" data-colorable="true"/>
    <circle id="sprinkle2" cx="250" cy="175" r="6" fill="white" stroke="black" stroke-width="1" data-colorable="true"/>
    <circle id="sprinkle3" cx="180" cy="150" r="5" fill="white" stroke="black" stroke-width="1" data-colorable="true"/>
    <circle id="sprinkle4" cx="220" cy="145" r="5" fill="white" stroke="black" stroke-width="1" data-colorable="true"/>
    <circle id="cherry" cx="200" cy="100" r="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
  </svg>',
  TRUE,
  14
),

-- 4. Unicorn (Fantasy)
(
  'Magic Unicorn',
  'magic unicorn',
  'A magical unicorn with a horn',
  'fantasy',
  'medium',
  '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <ellipse id="body" cx="200" cy="260" rx="100" ry="60" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="head" cx="280" cy="160" rx="50" ry="45" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <polygon id="horn" points="300,80 290,130 310,130" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <line x1="295" y1="95" x2="305" y2="95" stroke="black" stroke-width="1"/>
    <line x1="293" y1="105" x2="307" y2="105" stroke="black" stroke-width="1"/>
    <line x1="291" y1="115" x2="309" y2="115" stroke="black" stroke-width="1"/>
    <ellipse id="ear-left" cx="265" cy="120" rx="10" ry="20" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="ear-right" cx="295" cy="120" rx="10" ry="20" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="eye" cx="295" cy="155" r="8" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="snout" cx="320" cy="175" rx="20" ry="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="nostril" cx="330" cy="175" rx="3" ry="4" fill="black"/>
    <path id="mane1" d="M250 130 Q220 120 230 160 Q240 140 250 160" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <path id="mane2" d="M240 160 Q210 160 220 200 Q235 180 245 200" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <path id="mane3" d="M230 200 Q200 200 210 240" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="leg-fl" cx="150" cy="330" rx="15" ry="40" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="leg-fr" cx="180" cy="330" rx="15" ry="40" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="leg-bl" cx="220" cy="330" rx="15" ry="40" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="leg-br" cx="250" cy="330" rx="15" ry="40" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <path id="tail" d="M100 260 Q60 250 70 300 Q80 260 90 310 Q95 270 100 320" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
  </svg>',
  TRUE,
  16
),

-- 5. Sun and Cloud (Nature)
(
  'Sunny Day',
  'sunny day',
  'A happy sun with fluffy clouds',
  'nature',
  'easy',
  '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <circle id="sun" cx="200" cy="150" r="60" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="sun-eye-l" cx="180" cy="140" r="8" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="sun-eye-r" cx="220" cy="140" r="8" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <path id="sun-smile" d="M175 165 Q200 190 225 165" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>
    <line id="ray1" x1="200" y1="70" x2="200" y2="40" stroke="black" stroke-width="4" stroke-linecap="round"/>
    <line id="ray2" x1="260" y1="90" x2="285" y2="65" stroke="black" stroke-width="4" stroke-linecap="round"/>
    <line id="ray3" x1="280" y1="150" x2="320" y2="150" stroke="black" stroke-width="4" stroke-linecap="round"/>
    <line id="ray4" x1="260" y1="210" x2="285" y2="235" stroke="black" stroke-width="4" stroke-linecap="round"/>
    <line id="ray5" x1="140" y1="90" x2="115" y2="65" stroke="black" stroke-width="4" stroke-linecap="round"/>
    <line id="ray6" x1="120" y1="150" x2="80" y2="150" stroke="black" stroke-width="4" stroke-linecap="round"/>
    <line id="ray7" x1="140" y1="210" x2="115" y2="235" stroke="black" stroke-width="4" stroke-linecap="round"/>
    <ellipse id="cloud1-1" cx="100" cy="300" rx="50" ry="35" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="cloud1-2" cx="150" cy="290" rx="45" ry="40" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="cloud1-3" cx="190" cy="310" rx="40" ry="30" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="cloud2-1" cx="280" cy="320" rx="45" ry="30" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="cloud2-2" cx="320" cy="310" rx="40" ry="35" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="cloud2-3" cx="355" cy="325" rx="35" ry="25" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
  </svg>',
  TRUE,
  11
),

-- 6. Fish (Animals)
(
  'Tropical Fish',
  'tropical fish',
  'A colorful fish swimming',
  'animals',
  'easy',
  '<svg viewBox="0 0 400 350" xmlns="http://www.w3.org/2000/svg">
    <ellipse id="body" cx="200" cy="175" rx="120" ry="80" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <polygon id="tail" points="80,175 30,100 30,250" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <polygon id="fin-top" points="200,95 160,50 240,50" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <polygon id="fin-bottom" points="200,255 160,300 240,300" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="fin-side" cx="180" cy="175" rx="30" ry="20" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="eye" cx="280" cy="155" r="20" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="pupil" cx="285" cy="155" r="8" fill="black"/>
    <path id="mouth" d="M310 185 Q330 175 310 165" fill="none" stroke="black" stroke-width="3"/>
    <path id="stripe1" d="M150 120 Q160 175 150 230" fill="none" stroke="black" stroke-width="2" data-colorable="true" data-stroke-colorable="true"/>
    <path id="stripe2" d="M200 105 Q210 175 200 245" fill="none" stroke="black" stroke-width="2" data-colorable="true" data-stroke-colorable="true"/>
    <path id="stripe3" d="M250 115 Q260 175 250 235" fill="none" stroke="black" stroke-width="2" data-colorable="true" data-stroke-colorable="true"/>
    <circle id="bubble1" cx="340" cy="120" r="10" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="bubble2" cx="360" cy="90" r="7" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="bubble3" cx="370" cy="60" r="5" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
  </svg>',
  TRUE,
  13
),

-- 7. Robot (Fantasy)
(
  'Friendly Robot',
  'friendly robot',
  'A cute robot friend',
  'fantasy',
  'medium',
  '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <rect id="body" x="120" y="160" width="160" height="140" rx="10" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <rect id="head" x="140" y="60" width="120" height="90" rx="10" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="antenna-ball" cx="200" cy="35" r="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <line x1="200" y1="50" x2="200" y2="60" stroke="black" stroke-width="3"/>
    <rect id="eye-left" x="160" y="85" width="30" height="25" rx="5" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <rect id="eye-right" x="210" y="85" width="30" height="25" rx="5" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <rect id="mouth" x="170" y="125" width="60" height="15" rx="3" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <line x1="185" y1="125" x2="185" y2="140" stroke="black" stroke-width="2"/>
    <line x1="200" y1="125" x2="200" y2="140" stroke="black" stroke-width="2"/>
    <line x1="215" y1="125" x2="215" y2="140" stroke="black" stroke-width="2"/>
    <rect id="arm-left" x="80" y="180" width="40" height="80" rx="10" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <rect id="arm-right" x="280" y="180" width="40" height="80" rx="10" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <circle id="hand-left" cx="100" cy="275" r="20" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="hand-right" cx="300" cy="275" r="20" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <rect id="leg-left" x="145" y="300" width="40" height="70" rx="5" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <rect id="leg-right" x="215" y="300" width="40" height="70" rx="5" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="foot-left" cx="165" cy="375" rx="30" ry="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="foot-right" cx="235" cy="375" rx="30" ry="15" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="button1" cx="200" cy="195" r="12" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="button2" cx="200" cy="235" r="12" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <rect id="panel" x="150" y="265" width="100" height="25" rx="3" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
  </svg>',
  TRUE,
  9
),

-- 8. Heart with Wings (Shapes)
(
  'Flying Heart',
  'flying heart',
  'A heart with angel wings',
  'shapes',
  'easy',
  '<svg viewBox="0 0 400 350" xmlns="http://www.w3.org/2000/svg">
    <path id="heart" d="M200 280 C200 280 100 180 100 130 C100 80 150 60 200 110 C250 60 300 80 300 130 C300 180 200 280 200 280" fill="white" stroke="black" stroke-width="3" data-colorable="true"/>
    <ellipse id="wing-l1" cx="80" cy="140" rx="50" ry="25" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="wing-l2" cx="60" cy="160" rx="45" ry="22" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="wing-l3" cx="50" cy="185" rx="40" ry="20" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="wing-r1" cx="320" cy="140" rx="50" ry="25" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="wing-r2" cx="340" cy="160" rx="45" ry="22" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <ellipse id="wing-r3" cx="350" cy="185" rx="40" ry="20" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="halo" cx="200" cy="70" r="35" fill="none" stroke="black" stroke-width="4" data-colorable="true" data-stroke-colorable="true"/>
    <circle id="eye-l" cx="170" cy="150" r="8" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <circle id="eye-r" cx="230" cy="150" r="8" fill="white" stroke="black" stroke-width="2" data-colorable="true"/>
    <path id="smile" d="M175 180 Q200 210 225 180" fill="none" stroke="black" stroke-width="3" stroke-linecap="round"/>
    <circle id="cheek-l" cx="150" cy="170" r="10" fill="white" stroke="black" stroke-width="1" data-colorable="true"/>
    <circle id="cheek-r" cx="250" cy="170" r="10" fill="white" stroke="black" stroke-width="1" data-colorable="true"/>
  </svg>',
  TRUE,
  17
)
ON CONFLICT DO NOTHING;
