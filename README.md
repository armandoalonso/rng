# RNG <br>
Provides random utilities functions <br>

Author: piranha305 <br>
Website: https://piranha305.itch.io/ <br>
Addon Url: https://www.construct.net/en/make-games/addons/1075/rng <br>
Download Latest Version : [Version: 1.0.0.1](https://github.com/armandoalonso/rng/releases/latest) <br>
## Table of Contents
- [Usage](#usage)
- [Examples Files](#examples-files)
- [Properties](#properties)
- [Actions](#actions)
- [Conditions](#conditions)
- [Expressions](#expressions)
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
## Examples Files
- [piranha305_rng_exmaple](./examples/piranha305_rng_exmaple.c3p)
## Properties
| Property Name | Description
| --- | --- |
| [Replace System Seed](#replace-system-seed) | Replace the seed with a new one |
| [Seed](#seed) | The seed to use for the RNG |
---
### Replace System Seed
**Description:** Replace the seed with a new one </br>
**Type:** check
### Seed
**Description:** The seed to use for the RNG </br>
**Type:** text
## Actions
| Action | Description |
| --- | --- |
| [Set Seed](#set-seed) | Sets the seed to use for the RNG |
| [Roll Dice](#roll-dice) | Rolls a number of dice with a number of sides and adds a modifier |
| [Load JSON Data](#load-json-data) | Loads JSON data |
---
### Set Seed
**Description:** Sets the seed to use for the RNG </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| Seed | string | The seed to use for the RNG |
### Roll Dice
**Description:** Rolls a number of dice with a number of sides and adds a modifier </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| Number of Dice | number | The number of dice to roll |
| Number of Sides | number | The number of sides on each die |
| Modifier | number | The modifier to add to the roll |
| Tag | string | Tag of the dice |
### Load JSON Data
**Description:** Loads JSON data </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| JSON | string | The JSON to load |
## Conditions
| Condition | Description |
| --- | --- |
| [Chance](#chance) | Returns true with a given chance |
---
### Chance
**Description:** Returns true with a given chance </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| Chance | number | The chance of the condition being true |

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
---
### Roll
**Description:** Rolls a number of dice with a number of sides and adds a modifier </br>
**Return Type:** number </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| Number of Dice | number | The number of dice to roll |
| Number of Sides | number | The number of sides on each die |
| Modifier | number | The modifier to add to the roll |
### GetDiceFromLastRoll
**Description:** Gets a die from the last roll </br>
**Return Type:** number </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| Index | number | The index of the die to get |
### GetDiceRollSum
**Description:** Gets the sum of a roll </br>
**Return Type:** number </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| Tag | string | The tag of the roll to get the sum of |
### GetDiceRollValue
**Description:** Gets the value of a roll </br>
**Return Type:** number </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| Tag | string | The tag of the roll to get the value of |
| Index | number | The index of the die to get the value of |
### GetRandomFromCSV
**Description:** Gets a random value from a CSV </br>
**Return Type:** string </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| CSV | string | The CSV to get a random value from |
### GetRandomFromCSVWeighted
**Description:** Gets a random value from a CSV with weights </br>
**Return Type:** string </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| CSV | string | The CSV to get a random value from |
| Weights | string | The weights of the CSV values |
### RandomString
**Description:** Generates a random string </br>
**Return Type:** string </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| Length | number | The length of the string to generate |
### RandomNumber
**Description:** Generates a random number </br>
**Return Type:** string </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| Length | number | The length of the number to generate |
### RandomStringFromPool
**Description:** Generates a random string from a pool of characters </br>
**Return Type:** string </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| Length | number | The length of the string to generate |
| Pool | string | The pool of characters to generate the string from |
### RandomFromJson
**Description:** Gets a random value from a JSON array </br>
**Return Type:** string </br>
#### Parameters:
| Name | Type | Description |
| --- | --- | --- |
| Path | string | The path to the JSON array |
### Guid
**Description:** Generates a Guid </br>
**Return Type:** string </br>