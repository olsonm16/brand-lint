/**
 * @fileoverview Color constants for StyleLint rules
 */
"use strict";

// Brand colors with their CSS variable replacements
exports.BRAND_COLORS = {
  '#ebddf8': 'var(--brand-color-prim50)',
  '#c29aea': 'var(--brand-color-prim100)',
  '#8231d4': 'var(--brand-color-prim200)',
  '#521d87': 'var(--brand-color-prim300)'
};

// Helper function to check if a hex color is purple
exports.isPurpleHex = function (hex) {
  // Normalize hex color (remove # and convert to lowercase)
  hex = hex.replace('#', '').toLowerCase();

  // Extract RGB components
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Purples have more red and blue than green
  return (r > g && b > g) &&
    // Some level of blue is required
    (b > 80) &&
    // Red and blue should have some balance for purples
    (Math.abs(r - b) < 100);
};