# ATLASassist Sound Files Setup

## Folder Structure
Create this folder in your project:
```
public/
  sounds/
    animals/
    instruments/
    vehicles/
    fun/
    match/
    ambient/
```

## Required Sound Files

### 🎮 Sound Match Game (`/public/sounds/match/`)

| Filename | Description | Mixkit Link |
|----------|-------------|-------------|
| `bell.mp3` | Bell ring | https://mixkit.co/free-sound-effects/bell/ → "Small bell ring" |
| `drum.mp3` | Drum hit | https://mixkit.co/free-sound-effects/drum/ → "Drum bass hit" |
| `whistle.mp3` | Whistle | https://mixkit.co/free-sound-effects/whistle/ → "Sport whistle blow" |
| `buzz.mp3` | Buzzing | https://mixkit.co/free-sound-effects/bee/ → "Bee buzzing" |
| `bird.mp3` | Bird chirp | https://mixkit.co/free-sound-effects/bird/ → "Little bird singing" |
| `boop.mp3` | Boop sound | https://mixkit.co/free-sound-effects/click/ → "Positive interface beep" |
| `siren.mp3` | Siren | https://mixkit.co/free-sound-effects/siren/ → "Police short siren" |
| `pop.mp3` | Pop sound | https://mixkit.co/free-sound-effects/pop/ → "Bubble pop" |
| `horn.mp3` | Horn honk | https://mixkit.co/free-sound-effects/horn/ → "Car horn honk" |
| `chime.mp3` | Chime | https://mixkit.co/free-sound-effects/chime/ → "Achievement chime" |
| `dog.mp3` | Dog bark | https://mixkit.co/free-sound-effects/dog/ → "Small dog barking" |
| `cat.mp3` | Cat meow | https://mixkit.co/free-sound-effects/cat/ → "Cat meow" |
| `success.mp3` | Success sound | https://mixkit.co/free-sound-effects/win/ → "Winning chime" |
| `error.mp3` | Error sound | https://mixkit.co/free-sound-effects/wrong/ → "Wrong answer fail" |

---

### 🔊 Sound Board (`/public/sounds/`)

#### Animals (`/public/sounds/animals/`)
| Filename | Mixkit Search |
|----------|---------------|
| `dog.mp3` | https://mixkit.co/free-sound-effects/dog/ → "Small dog barking" |
| `cat.mp3` | https://mixkit.co/free-sound-effects/cat/ → "Cat meow" |
| `bird.mp3` | https://mixkit.co/free-sound-effects/bird/ → "Little bird singing" |
| `cow.mp3` | https://mixkit.co/free-sound-effects/cow/ → "Cow mooing" |
| `duck.mp3` | https://mixkit.co/free-sound-effects/duck/ → "Duck quacking" |
| `frog.mp3` | https://mixkit.co/free-sound-effects/frog/ → "Frog croaking" |

#### Instruments (`/public/sounds/instruments/`)
| Filename | Mixkit Search |
|----------|---------------|
| `drum.mp3` | https://mixkit.co/free-sound-effects/drum/ → "Drum bass hit" |
| `bell.mp3` | https://mixkit.co/free-sound-effects/bell/ → "Bell ring" |
| `piano.mp3` | https://mixkit.co/free-sound-effects/piano/ → "Piano key press" |
| `guitar.mp3` | https://mixkit.co/free-sound-effects/guitar/ → "Acoustic guitar strum" |
| `trumpet.mp3` | https://mixkit.co/free-sound-effects/trumpet/ → "Trumpet fanfare" |
| `xylophone.mp3` | https://mixkit.co/free-sound-effects/xylophone/ → "Xylophone hit" |

#### Vehicles (`/public/sounds/vehicles/`)
| Filename | Mixkit Search |
|----------|---------------|
| `car-horn.mp3` | https://mixkit.co/free-sound-effects/car/ → "Car horn double honk" |
| `train.mp3` | https://mixkit.co/free-sound-effects/train/ → "Train whistle" |
| `airplane.mp3` | https://mixkit.co/free-sound-effects/airplane/ → "Airplane fly by" |
| `boat-horn.mp3` | https://mixkit.co/free-sound-effects/boat/ → "Boat horn" |
| `siren.mp3` | https://mixkit.co/free-sound-effects/siren/ → "Police siren" |
| `bike-bell.mp3` | https://mixkit.co/free-sound-effects/bicycle/ → "Bicycle bell" |

#### Fun Sounds (`/public/sounds/fun/`)
| Filename | Mixkit Search |
|----------|---------------|
| `pop.mp3` | https://mixkit.co/free-sound-effects/pop/ → "Balloon pop" |
| `boing.mp3` | https://mixkit.co/free-sound-effects/cartoon/ → "Cartoon boing" |
| `whoosh.mp3` | https://mixkit.co/free-sound-effects/whoosh/ → "Fast swoosh" |
| `sparkle.mp3` | https://mixkit.co/free-sound-effects/magic/ → "Magic sparkle" |
| `laugh.mp3` | https://mixkit.co/free-sound-effects/laugh/ → "Child laughing" |
| `applause.mp3` | https://mixkit.co/free-sound-effects/applause/ → "Audience clapping" |

---

### 🎵 Music & Ambient Sounds (`/public/sounds/ambient/`)

| Filename | Mixkit Search |
|----------|---------------|
| `rain.mp3` | https://mixkit.co/free-sound-effects/rain/ → "Light rain ambient" |
| `ocean.mp3` | https://mixkit.co/free-sound-effects/ocean/ → "Ocean waves" |
| `wind.mp3` | https://mixkit.co/free-sound-effects/wind/ → "Soft wind blowing" |
| `stream.mp3` | https://mixkit.co/free-sound-effects/water/ → "Stream flowing" |
| `birds-ambient.mp3` | https://mixkit.co/free-sound-effects/forest/ → "Forest birds" |
| `singing-bowl.mp3` | https://mixkit.co/free-sound-effects/meditation/ → "Singing bowl" |
| `wind-chimes.mp3` | https://mixkit.co/free-sound-effects/chime/ → "Wind chimes" |
| `meditation-bell.mp3` | https://mixkit.co/free-sound-effects/bell/ → "Meditation bell" |

---

## Download Instructions

1. Go to each Mixkit link above
2. Find the recommended sound (or similar)
3. Click "Download Free"
4. Rename the file to match the filename in the table
5. Place in the correct folder

## Tips

- Keep files SHORT (under 5 seconds for sound effects, 30-60 seconds for ambient loops)
- Ambient sounds should be LOOPABLE (seamless when repeated)
- All Mixkit sounds are FREE and don't require attribution
- Files will be served from your Netlify deployment

## Testing

After adding sounds, test each one works:
1. Run your dev server (`npm run dev`)
2. Open Sound Board and tap each button
3. Open Sound Match and play a game
4. Open Music Sounds and try each ambient sound

If a sound file is missing, the app will fall back to synthesized audio.
