import type { TSESLint } from "@typescript-eslint/utils";
import type { Linter } from "@typescript-eslint/utils/ts-eslint";
import * as parserBase from "@typescript-eslint/parser";

import rules from "./rules/index.js";

import allConfig from "./configs/all.js";
import baseConfig from "./configs/base.js";

const parser: TSESLint.FlatConfig.Parser = {
    meta: parserBase.meta,
    parseForESLint: parserBase.parseForESLint,
};

const plugin = {
    meta: {
        name: "eslint-local",
        version: "1.0.0",
    },
    rules,
} satisfies Linter.Plugin;

const configs = {
    all: allConfig(plugin, parser),
    base: baseConfig(plugin, parser),
};

export default { configs, parser, plugin };
export { configs, parser, plugin };
