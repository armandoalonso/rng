import { id, addonType } from "../../config.caw.js";
import AddonTypeMap from "../../template/addonTypeMap.js";
import MersenneTwister from "./mersenneTwister.js";
import Noise from "./noise.js";

const NUMBERS = "0123456789";
const CHAR_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const SPECIAL_CHARACTERS = "!@#$%^&*()[]";

export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();
      
      this.seed = "";
      this.dice_roll_history = [];
      this.max_dice_rolls = 100;
      this.dice_roll_tags = {};
      this.last_die_value = 0;
      this.position = {x: 0, y: 0};

      const properties = this._getInitProperties();
      if (properties) {
        this.seed = properties[0];
      }

      if(this.seed === "") {
        this.seed = this.randomSeed();
      }

      this.mersenneTwister = new MersenneTwister(this.seed);
      this.noise = new Noise(this.seed);
    }

    // ------------------------------
    //        Seed Settings
    // ------------------------------
    randomSeed() {
      const pool = NUMBERS + CHAR_LOWERCASE;
      let results = "";
      for (let i = 0; i < 16; i++) {
        results += pool.charAt(Math.floor(Math.random() * pool.length));
      }
      return results;
    }

    setSeed(seed) {
      this.seed = seed;

      if(this.seed === "") {
        this.seed = this.randomSeed();
      }

      this.mersenneTwister = new MersenneTwister(this.seed);
      this.noise = new Noise(this.seed);
    }

    // ------------------------------
    //        Dice Rolls
    // ------------------------------
    getLastRollIndex() {
      return this.dice_roll_history.length - 1;
    }

    rollDice(diceNum, numSides, modifiers=0, tag="") {
      const results = [];
      for (let i = 0; i < diceNum; i++) {
        const roll = this.mersenneTwister.random() * numSides + 1;
        results.push(Math.floor(roll));
      }

      const sum = results.reduce((a, b) => a + b, 0) + modifiers;
      this.diceRollHistoryAdd({results, modifiers, sum, diceNum, numSides, tag: tag});
      this.dice_roll_tags[tag] = {results, modifiers, sum, diceNum, numSides};
      this._trigger("OnDiceRoll");
      this._trigger("ForEachRolledDice");
      return sum;
    }

    diceRollHistoryAdd({results, modifiers, sum, diceNum, numSides, tag}) {
      this.dice_roll_history.push({results, modifiers, sum, diceNum, numSides, tag});
      if (this.dice_roll_history.length > this.max_dice_rolls) {
        this.dice_roll_history.shift(); // Remove the oldest entry
      }
    }

    getDiceRollHistorySum(index=-1)
    {
      if(index < 0 || index >= this.dice_roll_history.length)
      {
        index = this.getLastRollIndex();
      }

      return this.dice_roll_history[index].sum;
    }

    getDiceRollHistoryModifier(index=-1)
    {
      if(index < 0 || index >= this.dice_roll_history.length)
      {
        index = this.getLastRollIndex();
      }

      return this.dice_roll_history[index].modifiers;
    }

    getDiceRollHistoryDiceId(index=-1)
    {
      if(index < 0 || index >= this.dice_roll_history.length)
      {
        index = this.getLastRollIndex();
      }

      const modifer = this.dice_roll_history[index].modifiers != 0 ? `+${this.dice_roll_history[index].modifiers}` : "";
      return `${this.dice_roll_history[index].diceNum}d${this.dice_roll_history[index].numSides}${modifer}`;
    }

    getDiceRollHistoryValue(index=-1, resultIndex=-1)
    {
      if(index < 0 || index >= this.dice_roll_history.length)
      {
        index = this.getLastRollIndex();
      }

      if(resultIndex < 0 || resultIndex >= this.dice_roll_history[index].results.length)
      {
        resultIndex = this.dice_roll_history[index].results.length - 1;
      }

      return this.dice_roll_history[index].results[resultIndex];
    }

    getDiceRollSum(tag="")
    {
      return this.dice_roll_tags[tag];
    }

    getDiceRollValue(tag="", index=-1)
    {
      if(index < 0 || index >= this.dice_roll_tags[tag].results.length)
      {
        index = this.dice_roll_tags[tag].results.length - 1;
      }

      return this.dice_roll_tags[tag].results[index];
    }

    getDiceRollHistoryModifier(tag="")
    {
      return this.dice_roll_tags[tag].modifiers;
    }

    getDiceRollDiceId(tag="")
    {
      const modifer = this.dice_roll_tags[tag].modifiers != 0 ? `+${this.dice_roll_tags[tag].modifiers}` : "";
      return `${this.dice_roll_tags[tag].diceNum}d${this.dice_roll_tags[tag].numSides}${modifer}`;
    }

    clearDiceRollHistory(){
      this.dice_roll_history = [];
    }

    diceRollHistoryJSON() {
      return JSON.stringify(this.dice_roll_history);
    }

    forEachLastRolledDice() {
      const loopCtx = this.runtime.sdk.createLoopingConditionContext();
      const lastRoll = this.dice_roll_history[this.getLastRollIndex()];

      if(!lastRoll) {
        loopCtx.release();
        return;
      }

      for (let i = 0; i < lastRoll.diceNum ; ++i)
      {
        this.last_die_value = lastRoll.results[i];
        loopCtx.retrigger();

        if (loopCtx.isStopped)
          break;
      }

      loopCtx.release();
      this.last_die_value = -1;
    }

    // ------------------------------
    //        Random Numbers
    // ------------------------------

    chance(percent) {
      return (this.mersenneTwister.random() * 100) < percent;
    }

    randomInt(min, max) {
      return Math.floor(this.mersenneTwister.random() * (max - min + 1) + min);
    }

    randomFloat(min, max) {
      return this.mersenneTwister.random() * (max - min) + min;
    }

    randomSign() {
      return this.mersenneTwister.random() < 0.5 ? -1 : 1;
    }

    randomChoice(options) {
      const items = options.split(",").map(item => item.trim());
      return items[Math.floor(this.mersenneTwister.random() * items.length)];
    }

    randomChoiceWeighted(options, weights) {
      const items = options.split(",").map(item => item.trim());
      const weightArray = weights.split(",").map(weight => parseFloat(weight.trim()));
      const totalWeight = weightArray.reduce((a, b) => a + b, 0);
      const random = this.mersenneTwister.random() * totalWeight;
      let sum = 0;
      for (let i = 0; i < items.length; i++) {
        sum += weightArray[i];
        if (random < sum) {
          return items[i];
        }
      }
      return items[items.length - 1];
    }

    randomStringFromPool(length, pool) {
      let results = "";
      for (let i = 0; i < length; i++) {
        results += pool.charAt(Math.floor(this.mersenneTwister.random() * pool.length));
      }
      return results;
    }

    randomString(length, characters=true, numbers=false, specialCharacters=false) {
      let pool = "";
      if (characters) {
        pool += CHAR_LOWERCASE;
      }
      if (numbers) {
        pool += NUMBERS;
      }
      if (specialCharacters) {
        pool += SPECIAL_CHARACTERS;
      }

      return this.randomStringFromPool(length, pool);
    }

    randomUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.floor(this.mersenneTwister.random() * 16);
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }.bind(this));
    }

    // The Marsaglia Polar method
    randomNormal(mean = 0, standardDeviation = 1, pool = []) {
      if (pool.length > 0) {
        return this.normalPool({ mean, dev: standardDeviation, pool });
      }
    
      let u, v, s, norm;
      do {
        u = this.mersenneTwister.random() * 2 - 1;
        v = this.mersenneTwister.random() * 2 - 1;
        s = u * u + v * v;
      } while (s >= 1 || s === 0);
    
      norm = u * Math.sqrt(-2 * Math.log(s) / s);
      return standardDeviation * norm + mean;
    }
    
    normalPool({ mean, dev, pool }) {
      let performanceCounter = 0;
      do {
        const idx = Math.round(this.randomNormal(mean, dev));
        if (idx < pool.length && idx >= 0) {
          return pool[idx];
        } else {
          performanceCounter++;
        }
      } while (performanceCounter < 100);
    
      throw new RangeError("Your pool is too small for the given mean and standard deviation. Please adjust.");
    }

    // ------------------------------
    //        World Positions
    // ------------------------------

    randomPositionInLayout() {
      const width = this.runtime.layout.width;
      const height = this.runtime.layout.height;

      this.position.x = this.randomInt(0, width);
      this.position.y = this.randomInt(0, height);

      return [this.position.x, this.position.y];
    }

    randomPositionInLayoutWithMargin(left, right, top, bottom) {
      const width = this.runtime.layout.width;
      const height = this.runtime.layout.height;

      this.position.x = this.randomInt(left, width - right);
      this.position.y = this.randomInt(top, height - bottom);

      return [this.position.x, this.position.y];
    }

    randomPositionInRect(left,top,right,bottom) {
      this.position.x = this.randomInt(left, right);
      this.position.y = this.randomInt(top, bottom);

      return [this.position.x, this.position.y];
    }

    randomPositionInViewport() {
      const viewport = this.runtime.layout.getLayer(0).getViewport();

      return this.randomPositionInRect(
        viewport.left, 
        viewport.top, 
        viewport.right, 
        viewport.bottom); 
    }

    randomPositionInViewportWithMargin(left, right, top, bottom) {
      const viewport = this.runtime.layout.getLayer(0).getViewport();
      return this.randomPositionInRect(

        viewport.left + left, 
        viewport.top + top, 
        viewport.right - right, 
        viewport.bottom - bottom); 
    }

    randomPointInCircle(centerX, centerY, radius, edge=false) {
      const angle = this.randomFloat(0, Math.PI * 2);
      const distance = edge ? radius : this.randomFloat(0, radius);
      this.position.x = centerX + Math.cos(angle) * distance;
      this.position.y = centerY + Math.sin(angle) * distance;

      return [this.position.x, this.position.y];
    }

    randomPointInSprite(sprite, edge=false) {
      const instance = sprite.getFirstPickedInstance();
      if (!instance) {
        this.position.x = 0;
        this.position.y = 0;
        return [0, 0];
      }
      const bbox = instance.getBoundingBox();
      if (edge) {
        const side = Math.floor(this.randomFloat(0, 4));
        switch (side) {
          case 0: // Top edge
            this.position.x = this.randomFloat(bbox.left, bbox.right);
            this.position.y = bbox.top;
            break;
          case 1: // Right edge
            this.position.x = bbox.right;
            this.position.y = this.randomFloat(bbox.top, bbox.bottom);
            break;
          case 2: // Bottom edge
            this.position.x = this.randomFloat(bbox.left, bbox.right);
            this.position.y = bbox.bottom;
            break;
          case 3: // Left edge
            this.position.x = bbox.left;
            this.position.y = this.randomFloat(bbox.top, bbox.bottom);
            break;
        }
      } else {
        return this.randomPositionInRect(bbox.left, bbox.top, bbox.right, bbox.bottom);
      }
      return [this.position.x, this.position.y];
    }

    // ------------------------------
    //        Misc
    // ------------------------------

    shuffle(options) {
      const items = options.split(",").map(item => item.trim());
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(this.mersenneTwister.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      return items.join(", ");
    }

    randomToken(options) {
      const items = options.split(",").map(item => item.trim());
      if (items.length === 0) {
        return "";
      }
      return items[Math.floor(this.mersenneTwister.random() * items.length)];
    }

    // ------------------------------
    //        Noise
    // ------------------------------

    perlinNoise2D(x, y, resolution=1) {
      return this.noise.perlin2(x/resolution, y/resolution);
    }

    simplexNoise2D(x, y, resolution=1) {
      return this.noise.simplex2(x/resolution, y/resolution);
    }

    _trigger(method) {
      super._trigger(self.C3[AddonTypeMap[addonType]][id].Cnds[method]);
    }

    _release() {
      super._release();
    }

    _saveToJson() {
      return {
        // data to be saved for savegames
      };
    }

    _loadFromJson(o) {
      // load state for savegames
    }

    _getDebuggerProperties()
    {
      return [{
        title: "piranha305.rng",
        properties: [
          {name: "$seed",	value: this.seed,	onedit: v => this.setSeed(v)},
        ]
      }];
    }
  };
}
