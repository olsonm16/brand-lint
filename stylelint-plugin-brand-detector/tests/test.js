import stylelint from "stylelint";
import fs from 'node:fs/promises';

const { lint } = stylelint;
const pluginPath = '../index.js';

describe("brand-detector/use-brand-color-variables rule", () => {
  const testScssPath = './test.scss';
  let testScssContent;

  beforeAll(async () => {
    try {
      testScssContent = await fs.readFile(testScssPath, 'utf8');
    } catch (error) {
      console.error("Error reading test.scss:", error);
      throw error;
    }
  });

  it("warns for multiple hardcoded colors with custom brandColors", async () => {
    const customConfig = {
      plugins: [pluginPath],
      rules: {
        "brand-detector/use-brand-color-variables": [true, {
          "severity": "error",
          "brandColors": {
            "#8231d4": "var(--custom-purple)",
            "#ebddf8": "var(--custom-light-purple)",
            "#c29aea": "var(--custom-medium-purple)",
            "#521d87": "var(--custom-dark-purple)",
            "#000000": "var(--custom-black)"
          }
        }]
      }
    };

    const {
      results: [{ warnings, parseErrors }]
    } = await lint({
      code: testScssContent,
      config: customConfig,
      syntax: "scss"
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(6);

    let { text, line, column } = warnings[0];
    expect(text).toBe('Unexpected hardcoded color #8231d4. Replace with var(--custom-purple). (brand-detector/use-brand-color-variables)');
    expect(line).toBe(2);
    expect(column).toBe(10);

    ({ text, line, column } = warnings[1]);
    expect(text).toBe('Unexpected hardcoded color #ebddf8. Replace with var(--custom-light-purple). (brand-detector/use-brand-color-variables)');
    expect(line).toBe(3);
    expect(column).toBe(21);

    ({ text, line, column } = warnings[2]);
    expect(text).toBe('Unexpected hardcoded color #c29aea. Replace with var(--custom-medium-purple). (brand-detector/use-brand-color-variables)');
    expect(line).toBe(7);
    expect(column).toBe(21);

    ({ text, line, column } = warnings[3]);
    expect(text).toBe('Unexpected hardcoded color #8231d4. Replace with var(--custom-purple). (brand-detector/use-brand-color-variables)');
    expect(line).toBe(11);
    expect(column).toBe(24);

    ({ text, line, column } = warnings[4]);
    expect(text).toBe('Unexpected hardcoded color #521d87. Replace with var(--custom-dark-purple). (brand-detector/use-brand-color-variables)');
    expect(line).toBe(15);
    expect(column).toBe(23);

    ({ text, line, column } = warnings[5]);
    expect(text).toBe('Unexpected hardcoded color #000000. Replace with var(--custom-black). (brand-detector/use-brand-color-variables)');
    expect(line).toBe(19);
    expect(column).toBe(10);
  });

  it("warns for multiple hardcoded colors with empty brandColors (using default)", async () => {
    const defaultConfig = {
      plugins: [pluginPath],
      rules: {
        "brand-detector/use-brand-color-variables": [true, {
          "severity": "error"
        }]
      }
    };

    const {
      results: [{ warnings, parseErrors }]
    } = await lint({
      code: testScssContent,
      config: defaultConfig,
      syntax: "scss"
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(5);

    let { text, line, column } = warnings[0];
    expect(text).toBe('Unexpected hardcoded color #8231d4. Replace with var(--brand-color-prim200). (brand-detector/use-brand-color-variables)');
    expect(line).toBe(2);
    expect(column).toBe(10);

    ({ text, line, column } = warnings[1]);
    expect(text).toBe('Unexpected hardcoded color #ebddf8. Replace with var(--brand-color-prim50). (brand-detector/use-brand-color-variables)');
    expect(line).toBe(3);
    expect(column).toBe(21);

    ({ text, line, column } = warnings[2]);
    expect(text).toBe('Unexpected hardcoded color #c29aea. Replace with var(--brand-color-prim100). (brand-detector/use-brand-color-variables)');
    expect(line).toBe(7);
    expect(column).toBe(21);

    ({ text, line, column } = warnings[3]);
    expect(text).toBe('Unexpected hardcoded color #8231d4. Replace with var(--brand-color-prim200). (brand-detector/use-brand-color-variables)');
    expect(line).toBe(11);
    expect(column).toBe(24);

    ({ text, line, column } = warnings[4]);
    expect(text).toBe('Unexpected hardcoded color #521d87. Replace with var(--brand-color-prim300). (brand-detector/use-brand-color-variables)');
    expect(line).toBe(15);
    expect(column).toBe(23);
  });

  it("does not warn when no hardcoded colors match brandColors", async () => {
    const noMatchConfig = {
      plugins: [pluginPath],
      rules: {
        "brand-detector/use-brand-color-variables": [true, {
          "brandColors": {
            "#fffffd": "var(--white)"
          }
        }]
      }
    };

    const {
      results: [{ warnings, parseErrors }]
    } = await lint({
      code: testScssContent,
      config: noMatchConfig,
      syntax: "scss"
    });

    expect(parseErrors).toHaveLength(0);
    expect(warnings).toHaveLength(0);
  });
});