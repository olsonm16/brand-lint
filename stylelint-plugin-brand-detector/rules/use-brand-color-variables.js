const stylelint = require('stylelint');
const valueParser = require('postcss-value-parser');
const ruleName = 'brand-detector/use-brand-color-variables';
const { BRAND_COLORS } = require("../../consts/colors");

const messages = stylelint.utils.ruleMessages(ruleName, {
  found: (color, replacement) =>
    `Unexpected hardcoded color ${color}. Replace with ${replacement}.`
});

// Rule function
const ruleFunction = () => {
  return (root, result) => {
    root.walkDecls(decl => {
      const parsedValue = valueParser(decl.value);
      parsedValue.walk((node) => {
        if (node.type === "word") {
          Object.entries(BRAND_COLORS).forEach(([hardcodedColor, recommendedColor]) => {
            if (node.value === hardcodedColor) {
              stylelint.utils.report({
                result,
                ruleName,
                message: messages.found(hardcodedColor, recommendedColor),
                node: decl,
                word: node.value,
                fix: (fixer) => {
                  node.value = recommendedColor;
                  decl.value = parsedValue.toString();
                },
              });
            }
          });
        }
      });
    });
  };
};

// Attach metadata to the rule
ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = {
  fixable: true,
  type: "suggestion" // This helps VS Code understand it's a suggestion
};

module.exports = stylelint.createPlugin(ruleName, ruleFunction);