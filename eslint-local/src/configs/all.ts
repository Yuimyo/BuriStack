import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";
import baseConfig from "./base.js";

export default (
  plugin: FlatConfig.Plugin,
  parser: FlatConfig.Parser
): FlatConfig.ConfigArray => [
  baseConfig(plugin, parser),
  {
    name: "local-rules/all",
    rules: {
      "@local-rules/no-default-error-type": "error",
    },
  },
];
