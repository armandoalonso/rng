import { action, condition, expression } from "../template/aceDefine.js";

// ------------------------------
//        Seed Settings
// ------------------------------
const settings= "settings";

action(
  settings,
  "SetSeed",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "SetSeed",
    displayText: "Set seed to {0}",
    description: "Sets the seed to use for the RNG",
    params: [
      {
        id: "seed",
        name: "Seed",
        desc: "The seed to use for the RNG",
        type: "string",
        initialValue: "",
      },
    ],
  },
  function (seed) {
    this.setSeed(seed);
  }
);

action(
  settings,
  "RandomizeSeed",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "RandomSeed",
    displayText: "RandomSeed",
    description: "Generates a random seed",
    params: [],
  },
  function () {
    this.setSeed(this.randomSeed());
  }
)

expression(
  settings,
  "Seed",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the seed used for the RNG",
    params: [],
  },
  function () {
    return this.seed;
  }
);

// ------------------------------
//        Dice Rolls
// ------------------------------

const dice= "dice";

action(
  dice,
  "RollDice",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Roll Dice",
    displayText: "Roll {0}d{1}+{2} with tag ({3})",
    description: "Rolls a number of dice with a number of sides and adds a modifier",
    params: [
      {
        id: "numDice",
        name: "Number of Dice",
        desc: "The number of dice to roll",
        type: "number",
        initialValue: "1",
      },
      {
        id: "numSides",
        name: "Number of Sides",
        desc: "The number of sides on each die",
        type: "number",
        initialValue: "6",
      },
      {
        id: "modifier",
        name: "Modifier",
        desc: "The modifier to add to the roll",
        type: "number",
        initialValue: "0",
      },
      {
        id: "tag",
        name: "Tag",
        desc: "Tag of the dice",
        type: "string",
        initialValue: "",
      }
    ],
  },
  function (numDice, numSides, modifier, tag) {
    this.rollDice(numDice, numSides, modifier, tag);
  }
);

action(
  dice,
  "ClearDiceRollHistory",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Clear Dice Roll History",
    displayText: "Clear Dice Roll History",
    description: "Clears the dice roll history",
    params: [],
  },
  function () {
    this.clearDiceRollHistory();
  }
);

condition(
  dice,
  'ForEachRolledDice',
  {
    highlight: false,
    deprecated: false,
    listName: "For Each Rolled Dice",
    displayText: "For each rolled dice",
    isLooping: true,
    isTrigger: true,
    description: "Triggered for each dice rolled",
    params: [],
  },
  function () {
    return this.forEachLastRolledDice();
  }
);

condition(
  dice,
  'OnDiceRoll',
  {
    highlight: false,
    deprecated: false,
    listName: "On Dice Roll",
    displayText: "On dice roll",
    isTrigger: true,
    description: "Triggered when a dice is rolled",
    params: [],
  },
  function () {
    return true
  }
)

expression(
  dice,
  "LoopDiceValue",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the value of the dice in the loop",
    params: [],
  },
  function () {
    return this.last_die_value;
  }
);

expression(
  dice,
  "LastDiceRollSum",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the sum of the last dice roll",
    params: [],
  },
  function () {
    return this.getDiceRollHistorySum();
  }
);

expression(
  dice,
  "LastDiceRollDiceValue",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the value of a dice in the last dice roll",
    params: [
      {
        id: "index",
        name: "Index",
        desc: "The index of the dice to get the value of",
        type: "number"
      }
    ],
  },
  function (index) {
    return this.getDiceRollHistoryValue(-1, index);
  }
);

expression(
  dice,
  "LastDiceRollModifier",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the modifier of the last dice roll",
    params: [],
  },
  function () {
    return this.getDiceRollHistoryModifier();
  }
);

expression(
  dice,
  "LastDiceRollDiceId",
  {
    highlight: false,
    deprecated: false,
    returnType: "string",
    description: "Get the dice id of the last dice roll",
    params: [],
  },
  function () {
    return this.getDiceRollHistoryDiceId();
  }
);

expression(
  dice,
  "DiceRollSum",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the sum of a dice roll",
    params: [
      {
        id: "tag",
        name: "Tag",
        desc: "The tag of the dice roll",
        type: "string"
      }
    ],
  },
  function (tag) {
    return this.getDiceRollSum(tag);
  }
);

expression(
  dice,
  "DiceRollValue",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the value of a dice roll",
    params: [
      {
        id: "tag",
        name: "Tag",
        desc: "The tag of the dice roll",
        type: "string"
      },
      {
        id: "index",
        name: "Index",
        desc: "The index of the dice to get the value of",
        type: "number"
      }
    ],
  },
  function (tag, index) {
    return this.getDiceRollValue(tag, index);
  }
);  

expression(
  dice,
  "DiceRollModifier",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get the modifier of a dice roll",
    params: [
      {
        id: "tag",
        name: "Tag",
        desc: "The tag of the dice roll",
        type: "string"
      }
    ],
  },
  function (tag) {
    return this.getDiceRollHistoryModifier(tag);
  }
);

expression(
  dice,
  "DiceRollDiceId",
  {
    highlight: false,
    deprecated: false,
    returnType: "string",
    description: "Get the dice id of a dice roll",
    params: [
      {
        id: "tag",
        name: "Tag",
        desc: "The tag of the dice roll",
        type: "string"
      }
    ],
  },
  function (tag) {
    return this.getDiceRollHistoryDiceId(tag);
  }
);

// ------------------------------
//        Random Numbers
// ------------------------------
const general = "general";

condition(
  general,
  "Chance",
  {
    highlight: false,
    deprecated: false,
    listName: "Chance",
    displayText: "{0}% Chance ",
    description: "if a random chance is true",
    params: [
      {
        id: "likelihood",
        name: "Likelihood",
        desc: "The likelihood of the condition being true (0-100)%",
        type: "number",
        initialValue: "50",
      },
    ],
  },
  function (likelihood) {
    return this.chance(likelihood);
  }
);

expression(
  general,
  "RandomInt",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get a random integer",
    params: [
      {
        id: "min",
        name: "Min",
        desc: "The minimum value",
        type: "number"
      },
      {
        id: "max",
        name: "Max",
        desc: "The maximum value",
        type: "number"
      },
    ],
  },
  function (min, max) {
    return this.randomInt(min, max);
  }
);

expression(
  general,
  "RandomFloat",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get a random float",
    params: [
      {
        id: "min",
        name: "Min",
        desc: "The minimum value",
        type: "number"
      },
      {
        id: "max",
        name: "Max",
        desc: "The maximum value",
        type: "number"
      },
    ],
  },
  function (min, max) {
    return this.randomFloat(min, max);
  }
);

expression(
  general,
  "RandomSign",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get a random sign (-1 or 1)",
    params: [],
  },
  function () {
    return this.randomSign();
  }
);

expression(
  general,
  "RandomChoice",
  {
    highlight: false,
    deprecated: false,
    returnType: "any",
    description: "Get a random choice from a list",
    params: [
      {
        id: "list",
        name: "List",
        desc: "The list of choices, separated by commas",
        type: "string"
      },
    ],
  },
  function (list) {
    return this.randomChoice(list);
  }
);

expression(
  general,
  "RandomChoiceWeighted",
  {
    highlight: false,
    deprecated: false,
    returnType: "any",
    description: "Get a random weighted choice from a list",
    params: [
      {
        id: "list",
        name: "List",
        desc: "The list of choices, separated by commas",
        type: "string"
      },
      {
        id: "weights",
        name: "Weights",
        desc: "The list of weights, separated by commas",
        type: "string"
      },
    ],
  },
  function (list, weights) {
    return this.randomChoiceWeighted(list, weights);
  }
);

expression(
  general,
  "RandomString",
  {
    highlight: false,
    deprecated: false,
    returnType: "string",
    description: "Get a random string",
    params: [
      {
        id: "length",
        name: "Length",
        desc: "The length of the string",
        type: "number"
      }
    ],
  },
  function (length) {
    return this.randomString(length, true, false, false);
  }
);

expression(
  general,
  "RandomNumber",
  {
    highlight: false,
    deprecated: false,
    returnType: "string",
    description: "Get a random number",
    params: [
      {
        id: "length",
        name: "Length",
        desc: "The length of the number",
        type: "number",
      }
    ],
  },
  function (length) {
    return this.randomString(length, false, true, false);
  }
);

expression(
  general,
  "RandomUUID",
  {
    highlight: false,
    deprecated: false,
    returnType: "string",
    description: "Get a random UUID",
    params: [],
  },
  function () {
    return this.randomUUID();
  }
);

expression(
  general,
  "Shuffle",
  {
    highlight: false,
    deprecated: false,
    returnType: "string",
    description: "Shuffle a comma seperated list",
    params: [
      {
        id: "list",
        name: "List",
        desc: "The list to shuffle, comma separated",
        type: "string"
      }
    ],
  },
  function (list) {
    return this.shuffle(list);
  }
);

expression(
  general,
  "RandomToken",
  {
    highlight: false,
    deprecated: false,
    returnType: "string",
    description: "Get a random token",
    params: [
      {
        id: "list",
        name: "List",
        desc: "The list to get token from, comma separated",
        type: "string"
      }
    ],
  },
  function (list) {
    return this.randomToken(list);
  }
);

expression(
  general,
  "PerlinNoise2D",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get a 2D Perlin noise value",
    params: [
      {
        id: "x",
        name: "X",
        desc: "The X position",
        type: "number"
      },
      {
        id: "y",
        name: "Y",
        desc: "The Y position",
        type: "number"
      },
      {
        id: "resolution",
        name: "Resolution",
        desc: "The resolution of the noise",
        type: "number"
      }
    ],
  },
  function (x, y,resolution) {
    return this.perlinNoise2D(x, y, resolution);
  }
);

expression(
  general,
  "SimplexNoise2D",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get a 2D Simplex noise value",
    params: [
      {
        id: "x",
        name: "X",
        desc: "The X position",
        type: "number"
      },
      {
        id: "y",
        name: "Y",
        desc: "The Y position",
        type: "number"
      },
      {
        id: "resolution",
        name: "Resolution",
        desc: "The resolution of the noise",
        type: "number"
      }
    ],
  }, 
  function (x, y, resolution) {
    return this.simplexNoise2D(x, y, resolution);
  }
);

expression(
  general,
  "RandomNormal",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Get a random number from a normal distribution",
    params: [
      {
        id: "mean",
        name: "Mean",
        desc: "The mean of the distribution",
        type: "number"
      },
      {
        id: "stdDev",
        name: "Standard Deviation",
        desc: "The standard deviation of the distribution",
        type: "number"
      }
    ],
  }, 
  function (mean, stdDev) {
    return this.randomNormal(mean, stdDev);
  }
);

// ------------------------------
//        World Position
// ------------------------------

const world= "world";

action(
  world,
  "PickRandomPositionInSprite",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Pick Random Position In Sprite",
    displayText: "Pick Random Position In Sprite {0}, Edge: {1}",
    description: "Picks a random position in a sprite, can access using RandomX and RandomY expressions",
    params: [
      {
        id: "sprite",
        name: "Sprite",
        desc: "The sprite to use",
        type: "object",
        allowedPluginIds: ["Sprite", "TiledBg"],
      },
      {
        id: "edge",
        name: "Edge",
        desc: "Whether to pick a point on the edge of the sprite",
        type: "boolean",
        initialValue: "false",
      }
    ],
  },
  function (sprite, edge) {
    this.randomPointInSprite(sprite, edge);
  }
);

action(
  world,
  "PickRandomPositionInLayout",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Pick Random Position In Layout",
    displayText: "Pick Random Position In Layout",
    description: "Picks a random position in the layout, can access using RandomX and RandomY expressions",
    params: [],
  },
  function () {
    this.randomPositionInLayout();
  }
);

action(
  world,
  "PickRandomPositionInLayoutWithMargin",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Pick Random Position In Layout With Margin",
    displayText: "Pick Random Position In Layout With Margin {0} {1} {2} {3}",
    description: "Picks a random position in the layout with a margin, can access using RandomX and RandomY expressions",
    params: [
      {
        id: "left",
        name: "Left",
        desc: "The left margin",
        type: "number",
        initialValue: "0",
      },
      {
        id: "right",
        name: "Right",
        desc: "The right margin",
        type: "number",
        initialValue: "0",
      },
      {
        id: "top",
        name: "Top",
        desc: "The top margin",
        type: "number",
        initialValue: "0",
      },
      {
        id: "bottom",
        name: "Bottom",
        desc: "The bottom margin",
        type: "number",
        initialValue: "0",
      }
    ],
  },
  function (left, right, top, bottom) {
    this.randomPositionInLayoutWithMargin(left, right, top, bottom);
  }
);

action(
  world,
  "PickRandomPositionInRect",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Pick Random Position In Rect",
    displayText: "Pick Random Position In Rect {0} {1} {2} {3}",
    description: "Picks a random position in a rectangle, can access using RandomX and RandomY expressions",
    params: [
      {
        id: "left",
        name: "Left",
        desc: "The left position",
        type: "number",
        initialValue: "0",
      },
      {
        id: "top",
        name: "Top",
        desc: "The top position",
        type: "number",
        initialValue: "0",
      },
      {
        id: "right",
        name: "Right",
        desc: "The right position",
        type: "number",
        initialValue: "0",
      },
      {
        id: "bottom",
        name: "Bottom",
        desc: "The bottom position",
        type: "number",
        initialValue: "0",
      }
    ],
  },
  function (left, top, right, bottom) {
    this.randomPositionInRect(left, top, right, bottom);
  }
);

action(
  world,
  "PickRandomPositionInViewport",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Pick Random Position In Viewport",
    displayText: "Pick Random Position In Viewport",
    description: "Picks a random position in the viewport, can access using RandomX and RandomY expressions",
    params: [],
  },
  function () {
    this.randomPositionInViewport();
  }
);

action(
  world,
  "PickRandomPositionInViewportWithMargin",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Pick Random Position In Viewport With Margin",
    displayText: "Pick Random Position In Viewport With Margin {0} {1} {2} {3}",
    description: "Picks a random position in the viewport with a margin, can access using RandomX and RandomY expressions",
    params: [
      {
        id: "left",
        name: "Left",
        desc: "The left margin",
        type: "number",
        initialValue: "0",
      },
      {
        id: "right",
        name: "Right",
        desc: "The right margin",
        type: "number",
        initialValue: "0",
      },
      {
        id: "top",
        name: "Top",
        desc: "The top margin",
        type: "number",
        initialValue: "0",
      },
      {
        id: "bottom",
        name: "Bottom",
        desc: "The bottom margin",
        type: "number",
        initialValue: "0",
      }
    ],
  },
  function (left, right, top, bottom) {
    this.randomPositionInViewportWithMargin(left, right, top, bottom);
  }
);

action(
  world,
  "PickRandomPointInCircle",
  {
    highlight: false,
    deprecated: false,
    isAsync: false,
    listName: "Pick Random Point In Circle",
    displayText: "Pick Random Point In Circle (Origin{0},{1}, Radius: {2} Edge:{3})",
    description: "Picks a random point in a circle, can access using RandomX and RandomY expressions",
    params: [
      {
        id: "centerX",
        name: "Center X",
        desc: "The center X position",
        type: "number",
        initialValue: "0",
      },
      {
        id: "centerY",
        name: "Center Y",
        desc: "The center Y position",
        type: "number",
        initialValue: "0",
      },
      {
        id: "radius",
        name: "Radius",
        desc: "The radius of the circle",
        type: "number",
        initialValue: "0",
      },
      {
        id: "edge",
        name: "Edge",
        desc: "Whether to pick a point on the edge of the circle",
        type: "boolean",
        initialValue: "false",
      }
    ],
  },
  function (centerX, centerY, radius, edge) {
    this.randomPointInCircle(centerX, centerY, radius, edge);
  }
);

expression(
  world,
  "LastX",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Gets the last random X position",
    params: [],
  },
  function () {
    return this.position.x
  }
);

expression(
  world,
  "LastY",
  {
    highlight: false,
    deprecated: false,
    returnType: "number",
    description: "Gets the last random Y position",
    params: [],
  },
  function () {
    return this.position.y
  }
);


