"use strict";

const brandColorsRule = require('./rules/use-brand-color-variables');
const purpleDetectorRule = require('./rules/no-purple-colors');

module.exports = [brandColorsRule, purpleDetectorRule];