/**
 * @fileoverview Rule to detect purple hex colors in TSX/CSS/SCSS files
 * @author YourName
 */

"use strict";

const { BRAND_COLORS } = require("../consts/colors");

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
    ],
  },

  create: function (context) {
    const options = context.options[0] || {};
    const brandColorsConfig = options.brandColors || BRAND_COLORS;

    // Get the file extension to determine how to process it
    const filename = context.getFilename();
    const isStylesheet = /\.(css|scss)$/i.test(filename);
    const isTSX = /\.tsx$/i.test(filename);

    // Skip files that aren't CSS, SCSS, or TSX
    if (!isStylesheet && !isTSX) {
      return {};
    }

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
            context.report({
              node,
              message: `Found brand color ${hexColor} that should use CSS variable ${brandColorsConfig[hexColor]}.`,
              suggest: [
                {
                  desc: `Replace with ${brandColorsConfig[hexColor]}`,
                  fix: function (fixer) {
                    return fixer.replaceText(node, `"${value.replace(match[0], brandColorsConfig[hexColor])}"`);
                  }
                }],
            });
          }
        }
      },
    }
  }
};