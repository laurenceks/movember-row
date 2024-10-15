module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    extends: ["airbnb", "prettier"],
    plugins: ["prettier"],
    rules: {
        "prettier/prettier": ["error", { tabWidth: 4 }],
        "no-param-reassign": ["error", { props: false }],
    },
};
