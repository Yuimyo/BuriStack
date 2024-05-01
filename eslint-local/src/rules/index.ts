import type { Linter } from "@typescript-eslint/utils/ts-eslint";
import noDefaultErrorType from "./no-default-error-type.js";

export default {
    "no-default-error-type": noDefaultErrorType,
} satisfies Linter.PluginRules;
