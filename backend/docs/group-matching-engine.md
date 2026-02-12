# Group-Based Matching Engine

## Scope
This matching engine matches a user to **groups/events** only. It does not create direct user-to-user matches.

## Matching Schema

### User profile inputs
- `personalityType`: optional MBTI/segment label
- `personalityTraits[]`: normalized traits from personality test
- `interests[]`: user interests
- `preferredEventTypes[]`: preferred event formats
- `city`: user city

### Event/group inputs
- `eventType`: event format (`workshop`, `webinar`, `meetup`, ...)
- `targetPersonalityTraits[]`: personality traits suitable for the event/group
- `tags[]` and `category`: interests expected in the event
- `city`: host city (for local groups/events)

### Persisted output
`group_matches` stores:
- user id + event id
- total score (`0..100`)
- component scores (`personality`, `interests`, `city`, `eventType`)
- machine-readable breakdown (`jsonb`)
- human-readable explanation

## Compatibility Scoring

```
score = personality(35%) + interests(30%) + city(20%) + eventType(15%)
```

- **Personality score**: overlap between user `personalityTraits[]` and event `targetPersonalityTraits[]`
- **Interests score**: overlap between user interests and event tags/category
- **City score**: exact city match => `1`, otherwise `0`
- **Event type score**: if event type exists in `preferredEventTypes[]` => `1`, otherwise `0`

The final score is normalized to `0..100`.

## API

### `GET /match/groups`
Query params:
- `userId` (uuid, required)
- `limit` (integer, optional, default: 10)

Returns:
- scoring formula and weights
- ranked groups/events
- per-result breakdown and explanation

## Notes
- This endpoint persists each generated match row in `group_matches`.
- Existing recommendation endpoints stay available for dashboard/telegram flows.
