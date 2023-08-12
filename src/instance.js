function getInstanceJs(parentClass, scriptInterface, addonTriggers, C3) {
  return class extends parentClass {
    constructor(inst, properties) {
      super(inst);

      this.NUMBERS = "0123456789";
      this.CHAR_LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
      this.SPECIAL_CHARS = "!@#$%^&*()[]";

      this.mersenneTwister = globalThis._P305.mersenneTwister;

      this.rng = null;
      this.replace_system_seed = false;
      this.seed = null;
      this._last_dice_results = [];
      this._last_modifiers = 0;
      this._rt = this.GetRuntime();
      this._dice_roll = {};
      this.json_data = {};

      if (properties) {
        this.replace_system_seed = properties[0];
        this.seed = properties[1];
      }

      if (this.seed === "") {    
        this.seed = this._RandomSeed(10);
      }

      this._SetRNG(this.seed);

      if (this.replace_system_seed) {
        this._rt.SetRandomNumberGeneratorCallback(() => this.rng.random());
      }
    }

    _RollDice(numDice, numSides, modifier) {
      const results = [];
      for (let i = 0; i < numDice; i++) {
        const roll = Math.floor(this._rt.Random() * numSides) + 1;
        results.push(roll);
      }

      if (modifier && modifier !== 0) {
        this._last_modifiers = modifier;
      }
      
      // save result array for future access
      this._last_dice_results = results;

      // get total of all rolls & modifier
      const sum = results.reduce((acc, val) => acc + val, 0) + this._last_modifiers;
      return sum;
    }

    _RollDiceWithTag(numDice, numSides, modifier, tag) {
      // rolls dice and saves result array with tag
      const _ = this._RollDice(numDice, numSides, modifier);
      this._dice_roll[tag] = this._last_dice_results; 
    }

    _GetDiceFromLastRoll(index) {
      if (index < 0 || index >= this._last_dice_results.length) {
        return 0;
      }
      return this._last_dice_results[index];
    }

    _GetModifierFromLastRoll() {
      return this._last_modifiers;
    }

    _GetDiceRollSum(tag) {
      // if tag is empty, return sum of last dice roll
      if (tag === "") {
        return this._last_dice_results.reduce((acc, val) => acc + val, 0);
      }

      // if tag does not exist, return 0 and throw warning
      if (!this._dice_roll[tag]) {
        console.warn(`Dice tag "${tag}" does not exist.`);
        return 0;
      }

      // return sum of dice roll with tag
      return this._dice_roll[tag].reduce((acc, val) => acc + val, 0);
    }

    _GetDiceRollValue(tag, index) {
      // if tag is empty, return value of last dice roll
      if (tag === "") {
        return this._GetDiceFromLastRoll(index);
      }

      // if tag does not exist, return 0 and throw warning
      if (!this._dice_roll[tag]) {
        console.warn(`Dice tag "${tag}" does not exist.`);
        return 0;
      }

      // if index is out of range, return 0 and throw warning
      if (index < 0 || index >= this._dice_roll[tag].length) {
        console.warn(`Dice index "${index}" is out of range.`);
        return 0;
      }

      // return value of dice roll with tag
      return this._dice_roll[tag][index];
    }

    _Chance(percent) {
      const roll = this._rt.Random() * 100;
      return roll < percent;
    }

    _RandomFloat(min, max) {
      return this._rt.Random() * (max - min) + min;
    }

    _RandomString(length) {
      return this._RandomStringFromPool(length, this.CHAR_LOWERCASE);
    }

    _RandomStringOnlyNumbers(length) {
      return this._RandomStringFromPool(length, this.NUMBERS);
    }

    _RandomStringWithNumbers(length) {
      return this._RandomStringFromPool(length, this.CHAR_LOWERCASE + this.NUMBERS);
    }

    _RandomStringWithNumbersAndSpecialChars(length) {
      return this._RandomStringFromPool(length, this.CHAR_LOWERCASE + this.NUMBERS + this.SPECIAL_CHARS);
    }

    _RandomStringWithSpecialChars(length) {
      return this._RandomStringFromPool(length, this.CHAR_LOWERCASE + this.SPECIAL_CHARS);
    }

    _RandomStringFromPool(length, pool) {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += pool[Math.floor(this._rt.Random() * pool.length)];
      }
      return result;
    }

    _PickRandomFromCVS(csv) {
      const values = csv.split(",");
      return values[Math.floor(this._rt.Random() * values.length)];
    }

    _PickRandomFromCSVWeighted(csv, weights) {
      const values = csv.split(",");
      const weightValues = weights.split(",");

      const weightNumbers = weightValues.map(Number);
      const totalWeight = weightNumbers.reduce((acc, val) => acc + val, 0);
      const random = Math.floor(this._rt.Random() * totalWeight);

      let weightSum = 0;
      for (let i = 0; i < weightNumbers.length; i++) {
        weightSum += weightNumbers[i];
        if (random <= weightSum) {
          return values[i];
        }
      }

      return null;
    }

    _ShuffleCVS(csv) {
      const values = csv.split(",");
      for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(this._rt.Random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
      }
      return values.join(",");
    }

    _LoadJsonData(json) {
      this.json_data = JSON.parse(json);
      console.log(this.json_data);
    }

    _ParseJsoKey(key) {
      const keys = key.split('.');
      let value = this.json_data;

      console.log(value);
      for (let i = 0; i < keys.length; i++) {
        value = value[keys[i]];
        if (value === undefined) {
          return null;
        }
      }
      return value;
    }

    _PickRandomFromJsonArray(path) {
      const values = this._ParseJsoKey(path);

      if (values === null) {
        console.warn(`JSON path "${path}" does not exist.`);
        return "";
      }

      return values[Math.floor(this._rt.Random() * values.length)];
    }

    _Guid() {
      const s4 = () => Math.floor((1 + this._rt.Random()) * 0x10000).toString(16).substring(1);
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4();
    }

    _RandomSeed(length){
      const pool = this.CHAR_LOWERCASE + this.NUMBERS;
      let result = "";
      for (let i = 0; i < length; i++) {
        result += pool[Math.floor(Math.random * pool.length)];
      }
      return result;
    }

    _SetSeed(seed, replace_system_seed) {
      this.seed = seed;
      this.replace_system_seed = replace_system_seed;

      if (this.seed === "") {    
        this.seed = this._RandomSeed(10);
      }

      this._SetRNG(this.seed);
      
      if (this.replace_system_seed) {
        this._rt.SetRandomNumberGeneratorCallback(() => this.rng.random());
      }
    }

    _SetRNG(seed) {
      this.rng = new this.mersenneTwister(seed);
    }

    Release() {
      super.Release();
    }

    SaveToJson() {
      return {
        last_dice_roll : this._last_dice_results,
        _last_modifiers : this._last_modifiers,
        dice_roll : this._dice_roll,
        json_data : this.json_data
      };
    }

    LoadFromJson(o) {
      this._last_dice_results = o["last_dice_roll"];
      this._dice_roll = o["dice_roll"];
      this._last_modifiers = o["_last_modifiers"];
      this.json_data = o["json_data"];
    }

    GetDebuggerProperties() {
      const prefix = "plugin.rng";
      return [{
          title: "$" + this.GetPluginType().GetName(),
          properties: [{
              name: prefix + ".debugger.last_dice_roll",
              value: this._last_dice_results.join(", "),
              onedit: v=>{
                this._last_dice_results = v.split(",").map(x=>parseInt(x));
              }
          },
          {
            name: prefix + ".debugger.dice_roll",
            value: JSON.stringify(this._dice_roll),
            onedit: v=>{
              this._dice_roll = JSON.parse(v);
            }
          },
          {
            name: prefix + ".debugger.last_dice_modifiers",
            value: this._last_modifiers,
            onedit: v=>{
              this._last_modifiers = parseInt(v);
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
