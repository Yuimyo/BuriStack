export default (plugin, parser) => ({
    name: "local-rules/base",
    languageOptions: {
        parser,
        sourceType: "module",
    },
    plugins: {
        "@local-rules": plugin,
    },
});
