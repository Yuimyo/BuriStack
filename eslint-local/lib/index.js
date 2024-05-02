import * as parserBase from "@typescript-eslint/parser";
import rules from "./rules/index.js";
import allConfig from "./configs/all.js";
import baseConfig from "./configs/base.js";
const parser = {
    meta: parserBase.meta,
    parseForESLint: parserBase.parseForESLint,
};
const plugin = {
    meta: {
        name: "eslint-local",
        version: "1.0.0",
    },
    rules,
};
const configs = {
    all: allConfig(plugin, parser),
    base: baseConfig(plugin, parser),
};
export default { configs, parser, plugin };
export { configs, parser, plugin };
