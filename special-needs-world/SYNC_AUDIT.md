# Special Needs World - Data Sync Audit

## Decision Framework
- **SYNC**: Organizational data that doesn't reveal health conditions
- **LOCAL ONLY**: Health-related data (PHI concerns)
- **OPT-IN SYNC**: Borderline data where user can choose

---

## Already Synced (Supabase)
✅ Visual Schedules - Organizational routine data
✅ Point to Talk Custom Buttons - Communication tool customization  
✅ Calendar Events - General scheduling
✅ User Profiles - Account data
✅ Appointments - Scheduling data (not diagnoses)
✅ Social Stories - Educational behavioral content (not PHI)

---

## Audit Results

### TOOLS
| Tool | Current Storage | Recommendation | Reason |
|------|----------------|----------------|--------|
| Milestone Guide | None (reference) | N/A | Static content, no user data |
| Visual Timer | Session only | N/A | Temporary use, no persistence needed |
| First/Then Board | localStorage | LOCAL | Simple utility, cross-device not critical |
| Calm Down | Session only | N/A | Temporary use, no persistence needed |

### SERVICES & TRACKERS
| Tracker | Current Storage | Recommendation | Reason |
|---------|----------------|----------------|--------|
| Appointments | Supabase | **SYNCED** | Scheduling data, not diagnoses |
| Goal Tracker | localStorage | **LOCAL ONLY** | IEP/therapy goals reveal disabilities (PHI) |
| My Team | localStorage | **LOCAL ONLY** | Provider types reveal health conditions |
| Quick Notes | localStorage | **LOCAL ONLY** | Could contain sensitive health notes |
| Reminders | localStorage | **LOCAL ONLY** | Medication/therapy categories = PHI |

### HEALTH TRACKERS
| Tracker | Current Storage | Recommendation | Reason |
|---------|----------------|----------------|--------|
| Feelings Tracker | localStorage | **LOCAL ONLY** | Mental/emotional health data (PHI) |
| Water Tracker | localStorage | **LOCAL ONLY** | Could indicate medical conditions |
| Sleep Tracker | localStorage | **LOCAL ONLY** | Sleep disorder data (PHI) |
| Nutrition/Recipes | None (reference) | N/A | Static recipes, no tracking |

### ACTIVITIES
| Activity | Current Storage | Recommendation | Reason |
|----------|----------------|----------------|--------|
| Social Stories | Supabase | **SYNCED** | Educational content, not health data |
| Coloring Book | Session only | N/A | Temporary drawings |

### GAMES
| Game | Current Storage | Recommendation | Reason |
|------|----------------|----------------|--------|
| All 6 games | Session only | N/A | No persistent data needed |

---

## Why Social Stories Sync

Social Stories are educational/behavioral tools, NOT health data:
- Stories about social situations (going to dentist, making friends)
- Not diagnostic or treatment information
- Benefits from reuse (consistency helps special needs individuals)
- Reduces AI generation costs by sharing popular stories
- Users save their favorites to a personal library

---

## Privacy Notice Locations

### Full Notice (health trackers with PHI):
- Goal Tracker
- My Team
- Reminders

### Compact Notice (sensitive but less critical):
- Quick Notes
- Feelings Tracker
- Water Tracker
- Sleep Tracker

### Sync Status Indicator:
- Appointments (green cloud icon when synced)
- Social Stories (green cloud icon when synced)

---

## Database Tables

### Synced Tables (Supabase):
1. `appointments` - User appointments (scheduling)
2. `social_stories` - Generated stories (shared pool)
3. `user_saved_stories` - User's saved story favorites
4. `visual_schedules` - Daily schedules
5. `point_to_talk_buttons` - Custom AAC buttons
6. `calendar_events` - Calendar entries

### Local Only (localStorage):
- `snw_goals` - IEP/therapy goals
- `snw_team` - Care team contacts
- `snw_notes` - Quick notes
- `snw_reminders` - Reminders with times
- `snw_feelings` - Emotion tracking
- `snw_water` - Water intake
- `snw_sleep` - Sleep patterns
