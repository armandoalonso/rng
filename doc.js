const fs = require("fs");
const path = require("path");

const camelCasedMap = new Map();

function camelCasify(str) {
  // If the string is already camelCased, return it
  if (camelCasedMap.has(str)) {
    return camelCasedMap.get(str);
  }
  // Replace any non-valid JavaScript identifier characters with spaces
  let cleanedStr = str.replace(/[^a-zA-Z0-9$_]/g, " ");

  // Split the string on spaces
  let words = cleanedStr.split(" ").filter(Boolean);

  // Capitalize the first letter of each word except for the first one
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
  }

  // Join the words back together
  let result = words.join("");

  // If the first character is a number, prepend an underscore
  if (!isNaN(parseInt(result.charAt(0)))) {
    result = "_" + result;
  }

  camelCasedMap.set(str, result);

  return result;
}

function getFileListFromConfig(config) {
  const files = [];
  if (config.domSideScripts) {
    config.domSideScripts.forEach(function (file) {
      files.push(`c3runtime/${file}`);
    });
  }

  if (config.fileDependencies) {
    config.fileDependencies.forEach(function (file) {
      files.push(`c3runtime/${file.filename}`);
    });
  }

  if (config.defaultImageUrl) {
    files.push(`c3runtime/${config.defaultImageUrl}`);
  }

  return files;
}

function addonFromConfig(config) {
  return {
    "is-c3-addon": true,
    type: config.addonType,
    name: config.name,
    id: config.id,
    version: config.version,
    author: config.author,
    website: config.website,
    documentation: config.documentation,
    description: config.description,
    "editor-scripts": ["editor.js"],
    "file-list": [
      "c3runtime/actions.js",
      "c3runtime/conditions.js",
      "c3runtime/expressions.js",
      "c3runtime/instance.js",
      "c3runtime/plugin.js",
      "c3runtime/type.js",
      "lang/en-US.json",
      "aces.json",
      "addon.json",
      config.icon ? config.icon : "icon.svg",
      "editor.js",
      ...getFileListFromConfig(config),
    ],
  };
}

function langFromConfig(config) {
  let id = config.id.toLowerCase();
  const lang = {
    languageTag: "en-US",
    fileDescription: `Strings for ${id}.`,
    text: {},
  };

  let root;
  if (config.addonType === "plugin") {
    lang.text.plugins = {};
    lang.text.plugins[id] = {};
    root = lang.text.plugins[id];
  } else if (config.addonType === "behavior") {
    lang.text.behaviors = {};
    lang.text.behaviors[id] = {};
    root = lang.text.behaviors[id];
  } else if (config.addonType === "effect") {
    lang.text.effects = {};
    lang.text.effects[id] = {};
    root = lang.text.effects[id];
  } else {
    throw new Error("Invalid addon type");
  }
  root.name = config.name;
  root.description = config.description;
  root["help-url"] = config.documentation;
  root.aceCategories = config.aceCategories;
  root.properties = {};
  config.properties.forEach((property) => {
    root.properties[property.id] = {
      name: property.name,
      desc: property.desc,
    };
    if (property.type === "combo") {
      root.properties[property.id].items = {};
      property.options.items.forEach((item) => {
        const key = Object.keys(item)[0];
        root.properties[property.id].items[key] = item[key];
      });
    } else if (property.type === "link") {
      root.properties[property.id]["link-text"] = property.linkText;
    }
  });

  root.actions = {};
  Object.keys(config.Acts).forEach((key) => {
    const action = config.Acts[key];
    root.actions[key] = {
      "list-name": action.listName,
      "display-text": action.displayText,
      description: action.description,
      params: {},
    };

    action.params.forEach((param) => {
      root.actions[key].params[param.id] = {
        name: param.name,
        desc: param.desc,
      };
      if (param.type === "combo") {
        root.actions[key].params[param.id].items = {};
        param.items.forEach((item) => {
          const itemkey = Object.keys(item)[0];
          root.actions[key].params[param.id].items[itemkey] = item[itemkey];
        });
      }
    });
  });

  root.conditions = {};
  Object.keys(config.Cnds).forEach((key) => {
    const condition = config.Cnds[key];
    root.conditions[key] = {
      "list-name": condition.listName,
      "display-text": condition.displayText,
      description: condition.description,
      params: {},
    };

    condition.params.forEach((param) => {
      root.conditions[key].params[param.id] = {
        name: param.name,
        desc: param.desc,
      };
      if (param.type === "combo") {
        root.conditions[key].params[param.id].items = {};
        param.items.forEach((item) => {
          const itemkey = Object.keys(item)[0];
          root.conditions[key].params[param.id].items[itemkey] = item[itemkey];
        });
      }
    });
  });

  root.expressions = {};
  Object.keys(config.Exps).forEach((key) => {
    const expression = config.Exps[key];
    root.expressions[key] = {
      "translated-name": key,
      description: expression.description,
      params: {},
    };

    expression.params.forEach((param) => {
      root.expressions[key].params[param.id] = {
        name: param.name,
        desc: param.desc,
      };
      if (param.type === "combo") {
        root.expressions[key].params[param.id].items = {};
        param.items.forEach((item) => {
          const itemkey = Object.keys(item)[0];
          root.expressions[key].params[param.id].items[itemkey] = item[itemkey];
        });
      }
    });
  });

  return lang;
}

function acesFromConfig(config) {
  const aces = {};

  Object.keys(config.aceCategories).forEach((category) => {
    aces[category] = {
      conditions: Object.keys(config.Cnds)
        .filter((key) => config.Cnds[key].category === category)
        .map((key) => {
          const ace = config.Cnds[key];
          const ret = {
            id: key,
            scriptName: camelCasify(key),
          };
          Object.keys(ace).forEach((key) => {
            switch (key) {
              case "category":
              case "forward":
              case "handler":
              case "autoScriptInterface":
              case "listName":
              case "displayText":
              case "description":
              case "params":
                break;
              default:
                ret[key] = ace[key];
            }
          });
          if (ace.params) {
            ret.params = ace.params.map((param) => {
              const ret = {};
              Object.keys(param).forEach((key) => {
                switch (key) {
                  case "name":
                  case "desc":
                  case "items":
                    break;
                  default:
                    ret[key] = param[key];
                }
              });
              if (param.items) {
                ret.items = param.items.map((item) => Object.keys(item)[0]);
              }

              return ret;
            });
          }
          return ret;
        }),
      actions: Object.keys(config.Acts)
        .filter((key) => config.Acts[key].category === category)
        .map((key) => {
          const ace = config.Acts[key];
          const ret = {
            id: key,
            scriptName: camelCasify(key),
          };
          Object.keys(ace).forEach((key) => {
            switch (key) {
              case "category":
              case "forward":
              case "handler":
              case "autoScriptInterface":
              case "listName":
              case "displayText":
              case "description":
              case "params":
                break;
              default:
                ret[key] = ace[key];
            }
          });
          if (ace.params) {
            ret.params = ace.params.map((param) => {
              const ret = {};
              Object.keys(param).forEach((key) => {
                switch (key) {
                  case "name":
                  case "desc":
                  case "items":
                    break;
                  default:
                    ret[key] = param[key];
                }
              });
              if (param.items) {
                ret.items = param.items.map((item) => Object.keys(item)[0]);
              }

              return ret;
            });
          }
          return ret;
        }),
      expressions: Object.keys(config.Exps)
        .filter((key) => config.Exps[key].category === category)
        .map((key) => {
          const ace = config.Exps[key];
          const ret = {
            id: key,
            scriptName: camelCasify(key),
            expressionName: camelCasify(key),
          };
          Object.keys(ace).forEach((key) => {
            switch (key) {
              case "category":
              case "forward":
              case "handler":
              case "autoScriptInterface":
              case "listName":
              case "displayText":
              case "description":
              case "params":
                break;
              default:
                ret[key] = ace[key];
            }
          });
          if (ace.params) {
            ret.params = ace.params.map((param) => {
              const ret = {};
              Object.keys(param).forEach((key) => {
                switch (key) {
                  case "name":
                  case "desc":
                  case "items":
                    break;
                  default:
                    ret[key] = param[key];
                }
              });
              if (param.items) {
                ret.items = param.items.map((item) => Object.keys(item)[0]);
              }

              return ret;
            });
          }
          return ret;
        }),
    };
  });

  return aces;
}

const config = require("./src/pluginConfig.js");

const addonJson = addonFromConfig(config);
const lang = langFromConfig(config);
const aces = acesFromConfig(config);

//console.log(addonJson);
//console.log(lang);
//console.log(aces);

// write addon documentation to a markdown file (RAEDME.md)
const readme = [];
readme.push(`# ${config.name}`);
readme.push(`## ${config.description}`);

readme.push(`## Properties`);
readme.push(`| Property | Description |`);
readme.push(`| --- | --- |`);
config.properties.forEach((property) => {
  readme.push(`| ${property.name} | ${property.desc} |`);
});
readme.push(``);

// explain each property
config.properties.forEach((property) => {
  readme.push(`### ${property.name}`);
  readme.push(`**Description:** ${property.desc}`);
  readme.push(`**Type:** ${property.type}`);
  if (property.type === "combo") {
    readme.push(`**Options:**`);
    property.options.items.forEach((item) => {
      const key = Object.keys(item)[0];
      readme.push(`- ${key}: ${item[key]}`);
    });
  }
  if (property.type === "link") {
    readme.push(`**Link Text:** ${property.linkText}`);
  }
  readme.push(``);
});

readme.push(``);
readme.push(`## Actions`);
readme.push(`| Action | Description |`);
readme.push(`| --- | --- |`);
Object.keys(config.Acts).forEach((key) => {
  const action = config.Acts[key];
  readme.push(`| ${action.listName} | ${action.description} |`);
});
readme.push(``);

//explain each eaction
Object.keys(config.Acts).forEach((key) => {
  const action = config.Acts[key];
  readme.push(`### ${action.listName}`);
  readme.push(`**Description:** ${action.description}`);
  readme.push(`**Parameters:**`);
  action.params.forEach((param) => {
    readme.push(`- ${param.name}: ${param.desc}`);
    if (param.type === "combo") {
      readme.push(`  - Options:`);
      param.items.forEach((item) => {
        const key = Object.keys(item)[0];
        readme.push(`    - ${key}: ${item[key]}`);
      });
    }
  });
});

readme.push(``);
readme.push(`## Conditions`);
readme.push(`| Condition | Description |`);
readme.push(`| --- | --- |`);
Object.keys(config.Cnds).forEach((key) => {
  const condition = config.Cnds[key];
  readme.push(`| ${condition.listName} | ${condition.description} |`);
});

//explain each condition
Object.keys(config.Cnds).forEach((key) => {
  const condition = config.Cnds[key];
  readme.push(`### ${condition.listName}`);
  readme.push(`**Description:** ${condition.description}`);
  readme.push(`**Parameters:**`);
  condition.params.forEach((param) => {
    readme.push(`- ${param.name}: ${param.desc}`);
    //TODO: is trigger? other cnd options?
    if (param.type === "combo") {
      readme.push(`  - Options:`);
      param.items.forEach((item) => {
        const key = Object.keys(item)[0];
        readme.push(`    - ${key}: ${item[key]}`);
      });
    }
  });
});

readme.push(``);
readme.push(`## Expressions`);
readme.push(`| Expression | Description |`);
readme.push(`| --- | --- |`);
Object.keys(config.Exps).forEach((key) => {
  const expression = config.Exps[key];
  readme.push(`| ${key} | ${expression.description} |`);
});
readme.push(``);

//explain each expression
Object.keys(config.Exps).forEach((key) => {
  const expression = config.Exps[key];
  readme.push(`### ${key}`);
  readme.push(`**Description:** ${expression.description}`);
  readme.push(`**Parameters:**`);
  expression.params.forEach((param) => {
    readme.push(`- ${param.name}: ${param.desc}`);
    if (param.type === "combo") {
      readme.push(`  - Options:`);
      param.items.forEach((item) => {
        const key = Object.keys(item)[0];
        readme.push(`    - ${key}: ${item[key]}`);
      });
    }
  });
});

readme.push(``);

// add usage instructions
readme.push(`## Usage`);
readme.push(`To build the addon, run the following commands:`);
readme.push(``);
readme.push(`\`\`\``);
readme.push(`npm i`);
readme.push(`node ./build.js`);
readme.push(`\`\`\``);
readme.push(``);
readme.push(`To run the dev server, run`);
readme.push(``);
readme.push(`\`\`\``);
readme.push(`npm i`);
readme.push(`node ./dev.js`);
readme.push(`\`\`\``);
readme.push(``);
readme.push(`The build uses the pluginConfig file to generate everything else.`);
readme.push(
  `The main files you may want to look at would be instance.js and scriptInterface.js`
);

fs.writeFileSync(path.join(__dirname, "README.md"), readme.join("\n"));

