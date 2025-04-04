import stylelint from "stylelint";

const { lint } = stylelint;

const config = {
  plugins: ["../index.js"],
  rules: {
    "brand-detector/use-brand-color-variables": true
  }
};

it("warns for multiple hardcoded colors", async () => {
  const {
    results: [{ warnings, parseErrors }]
  } = await lint({
    files: ["./test.scss"],
    config
  });

  expect(parseErrors).toHaveLength(0);
  expect(warnings).toHaveLength(5);

  // Check the first warning
  let { text, line, column } = warnings[0];
  expect(text).toBe('Unexpected hardcoded color #8231d4. Replace with var(--brand-color-prim200). (brand-detector/simple-brand-color-variables)');
  expect(line).toBe(13);
  expect(column).toBe(10);

  // Check the second warning
  ({ text, line, column } = warnings[1]);
  expect(text).toBe('Unexpected hardcoded color #ebddf8. Replace with var(--brand-color-prim50). (brand-detector/simple-brand-color-variables)');
  expect(line).toBe(17);
  expect(column).toBe(10);

  // Check the third warning
  ({ text, line, column } = warnings[2]);
  expect(text).toBe('Unexpected hardcoded color #c29aea. Replace with var(--brand-color-prim100). (brand-detector/simple-brand-color-variables)');
  expect(line).toBe(21);
  expect(column).toBe(10);

  // Check the fourth warning
  ({ text, line, column } = warnings[3]);
  expect(text).toBe('Unexpected hardcoded color #8231d4. Replace with var(--brand-color-prim200). (brand-detector/simple-brand-color-variables)');
  expect(line).toBe(25);
  expect(column).toBe(10);

  // Check the fifth warning
  ({ text, line, column } = warnings[4]);
  expect(text).toBe('Unexpected hardcoded color #521d87. Replace with var(--brand-color-prim300). (brand-detector/simple-brand-color-variables)');
  expect(line).toBe(29);
  expect(column).toBe(10);
});
