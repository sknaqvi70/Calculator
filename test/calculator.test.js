// test/calculator.test.js
const { add, subtract, divide } = require("../src/calculator");

test("adds 2 + 3 to equal 5", () => {
  expect(add(2, 3)).toBe(5);
});

test("subtracts 5 - 2 to equal 3", () => {
  expect(subtract(5, 2)).toBe(3);
});

test("divides 10 / 2 to equal 5", () => {
  expect(divide(10, 2)).toBe(5);
});

test("throws when dividing by zero", () => {
  expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
});
