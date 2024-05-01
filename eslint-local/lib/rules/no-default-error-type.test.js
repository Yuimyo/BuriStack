import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "./no-default-error-type.js";
const ruleTester = new RuleTester();
ruleTester.run("no-default-error-type", rule, {
    valid: [
        {
            code: 'throw new CustomError("hoge.");',
        },
    ],
    invalid: [
        {
            code: 'throw new Error("hoge.");',
            errors: [],
        },
    ],
});
console.log("All tests passed!");
