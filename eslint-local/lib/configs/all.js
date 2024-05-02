import baseConfig from "./base.js";
export default (plugin, parser) => [
    baseConfig(plugin, parser),
    {
        name: "local-rules/all",
        rules: {
            "@local-rules/no-default-error-type": "error",
        },
    },
];
