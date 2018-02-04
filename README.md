# Game of Thrones Challange


1) Unzip <br>
2) Download and unzip or clone the url  <br>
3)  run `npm install`  <br>
4)  run `npm start`  <br>
   OR  <br>
4) run `npm i -g gulp` <br>
4.1) run `gulp` <br>
5) The app should be up and running on `http://localhost:3000` <br>

## UI
Have put together a basic UI to get an overview at `http://localhost:3000`

## APIs

### Get Locations
- URL - /battle/locations (GET)
- Returns list of distinct battle locations

### Get Battle Count
- URL - /battle/count (GET)
- Returns total no. of battles.

### Search
- URL - /battle/search (GET)
- Generic search allows you to search with any attribute.
- king = `attacker_king` or `defender_king` (rest of the attributes have a one to one mapping)
- Eg: `/search?king=Robb Stark&location=Golden Tooth&battle_type=pitched battle`

### Get Stats
- URL - /battle/stats (GET)
- Returns Battle stats.
- Response
```
{
    "most_active": {
        "attacker_king": "Joffrey/Tommen Baratheon",
        "defender_king": "Robb Stark",
        "name": "Battle of Moat Cailin",
        "region": "The Riverlands"
    },
    "defender_size": {
        "min": 100,
        "max": 20000,
        "avg": 6428.1578947368425
    },
    "battle_type": [
        "siege",
        "ambush",
        "pitched battle"
    ],
    "attacker_outcome": {
        "win": 32,
        "loss": 5
    }
}
```

