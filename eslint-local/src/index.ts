import allRules from "./rules/index.js";

const plugin = {
  meta: {
    name: "eslint-local",
    version: "1.0.0",
  },
  rules: {
    ...allRules,
  },
};
export default plugin;
