# RNG
Provides random utilities functions

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
## Properties
| Property | Description |
| --- | --- |
| [Replace System Seed](#replace-system-seed) | Replace the seed with a new one |
| [Seed](#seed) | The seed to use for the RNG |

### Replace System Seed
**Description:** Replace the seed with a new one

**Type:** check
### Seed
**Description:** The seed to use for the RNG

**Type:** text

## Actions
| Action | Description |
| --- | --- |
| [Set Seed](#set-seed) | Sets the seed to use for the RNG |
| [Roll Dice](#roll-dice) | Rolls a number of dice with a number of sides and adds a modifier |
| [Load JSON Data](#load-json-data) | Loads JSON data |

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
| [Chance](#chance) | Returns true with a given chance |
### Chance
**Description:** Returns true with a given chance

**Parameters:**
- Chance: The chance of the condition being true

## Expressions
| Expression | Description |
| --- | --- |
| [Roll](#roll) | Rolls a number of dice with a number of sides and adds a modifier |
| [GetDiceFromLastRoll](#getdicefromlastroll) | Gets a die from the last roll |
| [GetDiceRollSum](#getdicerollsum) | Gets the sum of a roll |
| [GetDiceRollValue](#getdicerollvalue) | Gets the value of a roll |
| [GetRandomFromCSV](#getrandomfromcsv) | Gets a random value from a CSV |
| [GetRandomFromCSVWeighted](#getrandomfromcsvweighted) | Gets a random value from a CSV with weights |
| [RandomString](#randomstring) | Generates a random string |
| [RandomNumber](#randomnumber) | Generates a random number |
| [RandomStringFromPool](#randomstringfrompool) | Generates a random string from a pool of characters |
| [RandomFromJson](#randomfromjson) | Gets a random value from a JSON array |
| [Guid](#guid) | Generates a Guid |

### Roll
**Description:** Rolls a number of dice with a number of sides and adds a modifier
**Return Type:** number

**Parameters:**
- Number of Dice: The number of dice to roll
- Number of Sides: The number of sides on each die
- Modifier: The modifier to add to the roll
### GetDiceFromLastRoll
**Description:** Gets a die from the last roll
**Return Type:** number

**Parameters:**
- Index: The index of the die to get
### GetDiceRollSum
**Description:** Gets the sum of a roll
**Return Type:** number

**Parameters:**
- Tag: The tag of the roll to get the sum of
### GetDiceRollValue
**Description:** Gets the value of a roll
**Return Type:** number

**Parameters:**
- Tag: The tag of the roll to get the value of
- Index: The index of the die to get the value of
### GetRandomFromCSV
**Description:** Gets a random value from a CSV
**Return Type:** string

**Parameters:**
- CSV: The CSV to get a random value from
### GetRandomFromCSVWeighted
**Description:** Gets a random value from a CSV with weights
**Return Type:** string

**Parameters:**
- CSV: The CSV to get a random value from
- Weights: The weights of the CSV values
### RandomString
**Description:** Generates a random string
**Return Type:** string

**Parameters:**
- Length: The length of the string to generate
### RandomNumber
**Description:** Generates a random number
**Return Type:** string

**Parameters:**
- Length: The length of the number to generate
### RandomStringFromPool
**Description:** Generates a random string from a pool of characters
**Return Type:** string

**Parameters:**
- Length: The length of the string to generate
- Pool: The pool of characters to generate the string from
### RandomFromJson
**Description:** Gets a random value from a JSON array
**Return Type:** string

**Parameters:**
- Path: The path to the JSON array
### Guid
**Description:** Generates a Guid
**Return Type:** string

**Parameters:**