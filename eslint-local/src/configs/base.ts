import type { FlatConfig } from "@typescript-eslint/utils/ts-eslint";

export default (
  plugin: FlatConfig.Plugin,
  parser: FlatConfig.Parser
): FlatConfig.Config => ({
  name: "local-rules/base",
  languageOptions: {
    parser,
    sourceType: "module",
  },
  plugins: {
    "@local-rules": plugin,
  },
});
