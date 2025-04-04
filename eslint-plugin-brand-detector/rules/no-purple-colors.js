/**
 * @fileoverview Rule to detect purple hex colors in TSX/CSS/SCSS files
 * @author YourName
 */

"use strict";

const { BRAND_COLORS, isPurpleHex } = require("../consts/colors");

// Regular expression to match 6-digit hex colors
const HEX_COLOR_REGEX = /#([0-9a-f]{6})\b/gi;

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Detect purple hex colors in code for white labeling",
      category: "Stylistic Issues",
      recommended: false,
    },
    hasSuggestions: true, // Use suggestions instead of fixes
    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          brandColors: {
            type: "object",
            description: "Object of brand colors and their CSS variable replacements.",
            additionalProperties: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ]
  },

  create: function (context) {
    const options = context.options[0] || {};
    const brandColorsConfig = options.brandColors || BRAND_COLORS;

    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;

        const value = node.value;

        // Check for hex colors
        let match;
        HEX_COLOR_REGEX.lastIndex = 0; // Reset regex index

        while ((match = HEX_COLOR_REGEX.exec(value)) !== null) {
          const hexColor = match[0].toLowerCase();

          // Check if it's a brand color (exact match)
          if (brandColorsConfig[hexColor]) {
            return;
          }
          // Otherwise check if it's a purple color
          else if (isPurpleHex(hexColor)) {
            context.report({
              node,
              message: `Found purple hex color ${hexColor} that needs to be updated for white labeling.`
            });
          }
        }
      },
    }
  }
};