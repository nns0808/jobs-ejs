// tests/test_multiply.js
const multiply = require("../utils/multiply"); // match the folder name
const get_chai = require("../utils/get_chai");

describe("testing multiply", () => {
  it("should give 7*6 is 42", async () => {
    const { expect } = await get_chai();
    expect(multiply(7, 6)).to.equal(42);
  });

  it("should give 7*6 is 97", async () => {
    const { expect } = await get_chai();
    expect(multiply(7, 6)).to.equal(97); // this will fail — expected
  });
});