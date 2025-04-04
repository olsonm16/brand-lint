const stylelint = require('stylelint');
const valueParser = require('postcss-value-parser');
const ruleName = 'brand-detector/use-brand-color-variables';

const { BRAND_COLORS } = require("../consts/colors");

const messages = stylelint.utils.ruleMessages(ruleName, {
  found: (color, replacement) =>
    `Unexpected hardcoded color ${color}. Replace with ${replacement}.`
});


const ruleFunction = (primaryOption, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption
    }, {
      actual: secondaryOptions,
      possible: {
        brandColors: (option) => typeof option === 'object' || option == null || option == undefined,
        severity: ['warning', 'error'],
      },
      optional: ['severity', 'brandColors'],
    });

    if (!validOptions) {
      console.log(validOptions);
      return;
    }
    const brandColorsConfig = (secondaryOptions && secondaryOptions.brandColors) || BRAND_COLORS;

    root.walkDecls(decl => {
      const parsedValue = valueParser(decl.value);
      parsedValue.walk((node) => {
        if (node.type === "word") {
          Object.entries(brandColorsConfig).forEach(([hardcodedColor, recommendedColor]) => {
            if (node.value.toLowerCase() === hardcodedColor.toLowerCase()) {
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