# RNG
## Provides random utilities functions
## Properties
| Property | Description |
| --- | --- |
| Replace System Seed | Replace the seed with a new one |
| Seed | The seed to use for the RNG |

### Replace System Seed
**Description:** Replace the seed with a new one
**Type:** check

### Seed
**Description:** The seed to use for the RNG
**Type:** text


## Actions
| Action | Description |
| --- | --- |
| Set Seed | Sets the seed to use for the RNG |
| Roll Dice | Rolls a number of dice with a number of sides and adds a modifier |
| Load JSON Data | Loads JSON data |

### Set Seed
**Description:** Sets the seed to use for the RNG
**Parameters:**
- Seed: The seed to use for the RNG
### Roll Dice
**Description:** Rolls a number of dice with a number of sides and adds a modifier
**Parameters:**
- Number of Dice: The number of dice to roll
- Number of Sides: The number of sides on each die
- Modifier: The modifier to add to the roll
- Tag: Tag of the dice
### Load JSON Data
**Description:** Loads JSON data
**Parameters:**
- JSON: The JSON to load

## Conditions
| Condition | Description |
| --- | --- |
| Chance | Returns true with a given chance |
### Chance
**Description:** Returns true with a given chance
**Parameters:**
- Chance: The chance of the condition being true

## Expressions
| Expression | Description |
| --- | --- |
| Roll | Rolls a number of dice with a number of sides and adds a modifier |
| GetDiceFromLastRoll | Gets a die from the last roll |
| GetDiceRollSum | Gets the sum of a roll |
| GetDiceRollValue | Gets the value of a roll |
| GetRandomFromCSV | Gets a random value from a CSV |
| GetRandomFromCSVWeighted | Gets a random value from a CSV with weights |
| RandomString | Generates a random string |
| RandomNumber | Generates a random number |
| RandomStringFromPool | Generates a random string from a pool of characters |
| RandomFromJson | Gets a random value from a JSON array |
| Guid | Generates a Guid |

### Roll
**Description:** Rolls a number of dice with a number of sides and adds a modifier
**Parameters:**
- Number of Dice: The number of dice to roll
- Number of Sides: The number of sides on each die
- Modifier: The modifier to add to the roll
### GetDiceFromLastRoll
**Description:** Gets a die from the last roll
**Parameters:**
- Index: The index of the die to get
### GetDiceRollSum
**Description:** Gets the sum of a roll
**Parameters:**
- Tag: The tag of the roll to get the sum of
### GetDiceRollValue
**Description:** Gets the value of a roll
**Parameters:**
- Tag: The tag of the roll to get the value of
- Index: The index of the die to get the value of
### GetRandomFromCSV
**Description:** Gets a random value from a CSV
**Parameters:**
- CSV: The CSV to get a random value from
### GetRandomFromCSVWeighted
**Description:** Gets a random value from a CSV with weights
**Parameters:**
- CSV: The CSV to get a random value from
- Weights: The weights of the CSV values
### RandomString
**Description:** Generates a random string
**Parameters:**
- Length: The length of the string to generate
### RandomNumber
**Description:** Generates a random number
**Parameters:**
- Length: The length of the number to generate
### RandomStringFromPool
**Description:** Generates a random string from a pool of characters
**Parameters:**
- Length: The length of the string to generate
- Pool: The pool of characters to generate the string from
### RandomFromJson
**Description:** Gets a random value from a JSON array
**Parameters:**
- Path: The path to the JSON array
### Guid
**Description:** Generates a Guid
**Parameters:**

## Usage
To build the addon, run the following commands:

```
npm i
node ./build.js
```

To run the dev server, run

```
npm i
node ./dev.js
```

The build uses the pluginConfig file to generate everything else.
The main files you may want to look at would be instance.js and scriptInterface.js