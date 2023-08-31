function getInstanceJs(parentClass, scriptInterface, addonTriggers, C3) {
  return class extends parentClass {
    constructor(inst, properties) {
      super(inst);

      this.NUMBERS = "0123456789";
      this.CHAR_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
      this.SPECIAL_CHARS = "!@#$%^&*()[]";

      // get prng class from globalThis
      this.mersenneTwister = globalThis._P305.mersenneTwister;

      this.rng = null;
      this.replace_system_seed = false;
      this.seed = null;
      this.last_dice_results = [];
      this.last_modifiers = 0;
      this.runtime = this.GetRuntime();
      this.dice_roll = {};
      this.json_data = {};
      this.position = {x: 0, y: 0};


      if (properties) {
        this.replace_system_seed = properties[0];
        this.seed = properties[1];
      }

      if (this.seed === "") {    
        this.seed = this._RandomSeed(10);
      }

      this.SetRNG(this.seed);

      if (this.replace_system_seed) {
        this.runtime.SetRandomNumberGeneratorCallback(() => this.rng.random());
      }
    }

    RollDice(numDice, numSides, modifier) {
      const results = [];
      for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(this.runtime.Random() * numSides) + 1;
        results.push(roll);
      }

      if (modifier && modifier !== 0) {
        this.last_modifiers = modifier;
      }
      
      // save result array for future access
      this.last_dice_results = results;

      // get total of all rolls & modifier
      const sum = results.reduce((acc, val) => acc + val, 0) + this.last_modifiers;
      return sum;
    }

    RollDiceWithTag(numDice, numSides, modifier, tag) {
      // rolls dice and saves result array with tag
      const _ = this._RollDice(numDice, numSides, modifier);
      this.dice_roll[tag] = this.last_dice_results; 
    }

    GetDiceFromLastRoll(index) {
      if (index < 0 || index >= this.last_dice_results.length) {
        return 0;
      }
      return this.last_dice_results[index];
    }

    GetModifierFromLastRoll() {
      return this.last_modifiers;
    }

    GetDiceRollSum(tag) {
      // if tag is empty, return sum of last dice roll
      if (tag === "") {
        return this.last_dice_results.reduce((acc, val) => acc + val, 0);
      }

      // if tag does not exist, return 0 and throw warning
      if (!this.dice_roll[tag]) {
        console.warn(`Dice tag "${tag}" does not exist.`);
        return 0;
      }

      // return sum of dice roll with tag
      return this.dice_roll[tag].reduce((acc, val) => acc + val, 0);
    }

    GetDiceRollValue(tag, index) {
      // if tag is empty, return value of last dice roll
      if (tag === "") {
        return this._GetDiceFromLastRoll(index);
      }

      // if tag does not exist, return 0 and throw warning
      if (!this.dice_roll[tag]) {
        console.warn(`Dice tag "${tag}" does not exist.`);
        return 0;
      }

      // if index is out of range, return 0 and throw warning
      if (index < 0 || index >= this.dice_roll[tag].length) {
        console.warn(`Dice index "${index}" is out of range.`);
        return 0;
      }

      // return value of dice roll with tag
      return this.dice_roll[tag][index];
    }

    Chance(percent) {
      const roll = this.runtime.Random() * 100;
      return roll < percent;
    }

    RandomFloat(min, max) {
      return this.runtime.Random() * (max - min) + min;
    }

    RandomString(length) {
      return this.RandomStringFromPool(length, this.CHAR_LOWERCASE);
    }

    RandomStringOnlyNumbers(length) {
      return this.RandomStringFromPool(length, this.NUMBERS);
    }

    RandomStringWithNumbers(length) {
      return this.RandomStringFromPool(length, this.CHAR_LOWERCASE + this.NUMBERS);
    }

    RandomStringWithNumbersAndSpecialChars(length) {
      return this.RandomStringFromPool(length, this.CHAR_LOWERCASE + this.NUMBERS + this.SPECIAL_CHARS);
    }

    RandomStringWithSpecialChars(length) {
      return this.RandomStringFromPool(length, this.CHAR_LOWERCASE + this.SPECIAL_CHARS);
    }

    RandomStringFromPool(length, pool) {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += pool[Math.floor(this.runtime.Random() * pool.length)];
      }
      return result;
    }

    PickRandomFromCVS(csv) {
      const values = csv.split(",");
      return values[Math.floor(this.runtime.Random() * values.length)];
    }

    PickRandomFromCSVWeighted(csv, weights) {
      const values = csv.split(",");
      const weightValues = weights.split(",");

      const weightNumbers = weightValues.map(Number);
      const totalWeight = weightNumbers.reduce((acc, val) => acc + val, 0);
      const random = Math.floor(this.runtime.Random() * totalWeight);

      let weightSum = 0;
      for (let i = 0; i < weightNumbers.length; i++) {
        weightSum += weightNumbers[i];
        if (random <= weightSum) {
          return values[i];
        }
      }

      return null;
    }

    PickRandomPositionInLayout() {
      const layout = this.runtime.GetMainRunningLayout();
      const width = layout.GetWidth();
      const height = layout.GetHeight();

      this.position.x = Math.floor(this.runtime.Random() * width);
      this.position.y = Math.floor(this.runtime.Random() * height);
    }

    PickRandomPositionInLayoutWithMargin(margin) {
      const layout = this.runtime.GetMainRunningLayout();
      const width = layout.GetWidth();
      const height = layout.GetHeight();

      this.position.x = Math.floor(this.runtime.Random() * (width - margin * 2)) + margin;
      this.position.y = Math.floor(this.runtime.Random() * (height - margin * 2)) + margin;
    }

    PickRandomPositionInViewport() {
      const layout = this.runtime.GetMainRunningLayout();
      const viewport = layout.GetLayerByIndex(0).GetViewport();
      
      const left = viewport.getLeft();
      const top = viewport.getTop();
      const right = viewport.getRight();
      const bottom = viewport.getBottom();

      this.GetRandomPositionInRect(left, top, right, bottom);
    }

    PickRandomPositionInViewportWithMargin(margin) {
      const layout = this.runtime.GetMainRunningLayout();
      const viewport = layout.GetLayerByIndex(0).GetViewport();

      const left = viewport.getLeft() + margin;
      const top = viewport.getTop() + margin;
      const right = viewport.getRight() - margin;
      const bottom = viewport.getBottom() - margin;

      this.GetRandomPositionInRect(left, top, right, bottom);
    }

    GetRandomPositionInRect(left, top, right, bottom) {
      const width = right - left;
      const height = bottom - top;

      this.position.x = Math.floor(this.runtime.Random() * width) + left;
      this.position.y = Math.floor(this.runtime.Random() * height) + top;
    }

    PickRandomPositionInSprite(sprite) {
      debugger;
      const picked = sprite.GetFirstPicked();
      if (picked == null) {
        this.position.x = 0;
        this.position.y = 0;
        return
      }
      
      const wi = picked.GetWorldInfo();
      const bbox = wi.GetBoundingBox();
      this.GetRandomPositionInRect(bbox.getLeft(), bbox.getTop(), bbox.getRight(), bbox.getBottom());
    }

    PickRandomPositionInCircle(x, y, radius) {
      const angle = this.runtime.Random() * Math.PI * 2;
      const r = Math.sqrt(this.runtime.Random()) * radius;
      this.position.x = x + r * Math.cos(angle);
      this.position.y = y + r * Math.sin(angle);
    }

    RandomX() {
      return this.position.x;
    }

    RandomY() {
      return this.position.y;
    }

    GetRandomToken(text, seperator) {
      if (typeof text !== "string" ||  typeof seperator !== "string") return "";

      const tokens = text.split(seperator);

      if(tokens.length === 0) return "";
      return tokens[Math.floor(this.runtime.Random() * tokens.length)];
    }

    ShuffleCVS(csv) {
      const values = csv.split(",");
      for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(this.runtime.Random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
      }
      return values.join(",");
    }

    LoadJsonData(tag, json) {

      if( typeof tag !== "string" || typeof json !== "string") return;

      if(tag === "") tag = "default";

      if(this.json_data[tag] === undefined) {
        this.json_data[tag] = {};
      }

      this.json_data[tag] = JSON.parse(json);
    }

    ParseJsonKey(tag, key) {
      if(tag === "") tag = "default";

      if(this.json_data[tag] === undefined) {
        console.warn(`JSON tag "${tag}" does not exist.`);
        return null;
      }

      const keys = key.split('.');
      let value = this.json_data[tag];

      for (let i = 0; i < keys.length; i++) {
        value = value[keys[i]];
        if (value === undefined) {
          return null;
        }
      }
      return value;
    }

    PickRandomFromJsonArray(tag, path) {
      if(tag === "") tag = "default";

      if(this.json_data[tag] === undefined) {
        console.warn(`JSON tag "${tag}" does not exist.`);
        return null;
      }
      const values = this.ParseJsonKey(tag, path);

      if (values === null) {
        console.warn(`JSON path "${path}" does not exist.`);
        return "";
      }

      return values[Math.floor(this.runtime.Random() * values.length)];
    }

    Guid() {
      const s4 = () => Math.floor((1 + this.runtime.Random()) * 0x10000).toString(16).substring(1);
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4();
    }

    RandomSeed(length){
      const pool = this.CHAR_LOWERCASE + this.NUMBERS;
      let result = "";
      for (let i = 0; i < length; i++) {
        result += pool[Math.floor(Math.random * pool.length)];
      }
      return result;
    }

    SetSeed(seed, replace_system_seed) {
      this.seed = seed;
      this.replace_system_seed = replace_system_seed;

      if (this.seed === "") {    
        this.seed = this._RandomSeed(10);
      }

      this.SetRNG(this.seed);
      
      if (this.replace_system_seed) {
        this.runtime.SetRandomNumberGeneratorCallback(() => this.rng.random());
      }
      else {
        this.runtime.SetRandomNumberGeneratorCallback(() => Math.random());
      }
    }

    SetRNG(seed) {
      this.rng = new this.mersenneTwister(seed);
    }

    Release() {
      super.Release();
    }

    SaveToJson() {
      return {
        lastdice_roll : this.last_dice_results,
        last_modifiers : this.last_modifiers,
        dice_roll : this.dice_roll,
        json_data : this.json_data
      };
    }

    LoadFromJson(o) {
      this.last_dice_results = o["lastdice_roll"];
      this.dice_roll = o["dice_roll"];
      this.last_modifiers = o["last_modifiers"];
      this.json_data = o["json_data"];
    }

    GetDebuggerProperties() {
      const prefix = "plugin.rng";
      return [{
          title: "$" + this.GetPluginType().GetName(),
          properties: [{
              name: prefix + ".debugger.lastdice_roll",
              value: this.last_dice_results.join(", "),
              onedit: v=>{
                this.last_dice_results = v.split(",").map(x=>parseInt(x));
              }
          },
          {
            name: prefix + ".debugger.dice_roll",
            value: JSON.stringify(this.dice_roll),
            onedit: v=>{
              this.dice_roll = JSON.parse(v);
            }
          },
          {
            name: prefix + ".debugger.last_dice_modifiers",
            value: this.last_modifiers,
            onedit: v=>{
              this.last_modifiers = parseInt(v);
            }
          },  
          {
            name: prefix + ".debugger.json_data",
            value: JSON.stringify(this.json_data),
            onedit: v=>{
              this.json_data = JSON.parse(v);
            }
          }]
      }];
    }

    Trigger(method) {
      super.Trigger(method);
      const addonTrigger = addonTriggers.find((x) => x.method === method);
      if (addonTrigger) {
        this.GetScriptInterface().dispatchEvent(new C3.Event(addonTrigger.id));
      }
    }

    GetScriptInterfaceClass() {
      return scriptInterface;
    }
  }
}
