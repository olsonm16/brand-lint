/**
 * @fileoverview StyleLint rule to detect purple hex colors and suggest brand variables
 * @author YourName
 */
"use strict";

const stylelint = require("stylelint");
const valueParser = require("postcss-value-parser");
const { BRAND_COLORS, isPurpleHex } = require("../consts/colors");

const ruleName = "brand-detector/no-purple-colors";
const messages = stylelint.utils.ruleMessages(ruleName, {
  purpleColor: (hex) => `Found purple hex color ${hex} that needs to be updated for white labeling.`
});

// Define rule function
function rule(primaryOption, secondaryOptions) {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primaryOption
    }, {
      actual: secondaryOptions,
      possible: {
        brandColors: ['object'],
      },
      optional: true,
    });

    if (!validOptions) {
      return;
    }

    const brandColorsConfig = (secondaryOptions && secondaryOptions.brandColors) || BRAND_COLORS;

    // Process all declarations in the CSS/SCSS
    root.walkDecls(decl => {
      const { value } = decl;

      // Skip if no value or not a string
      if (!value || typeof value !== 'string') {
        return;
      }

      // Parse the value to find hex colors
      const parsedValue = valueParser(value);

      // Process all nodes in the value
      parsedValue.walk(node => {
        // Only process word nodes that might be colors
        if (node.type !== 'word') {
          return;
        }

        // Check if it's a hex color
        if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(node.value)) {
          return;
        }

        const hexColor = node.value.toLowerCase();

        // Skip known brand colors (they're handled by the other rule)
        if (brandColorsConfig[hexColor]) {
          return;
        }

        // Check if it's a purple color
        if (isPurpleHex(hexColor)) {
          // Calculate the end index for proper position reporting
          const startIndex = node.sourceIndex;
          const endIndex = startIndex + node.value.length;

          stylelint.utils.report({
            message: messages.purpleColor(node.value),
            node: decl,
            index: startIndex,
            endIndex: endIndex,
            result,
            ruleName
            // No fix provided since this is just detection
          });
        }
      });
    });
  };
}

// Define metadata for the rule
rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = {
  url: "https://github.com/yourusername/stylelint-purple-detector",
};

module.exports = stylelint.createPlugin(ruleName, rule);