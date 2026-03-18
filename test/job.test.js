const get_chai = require("../utils/get_chai"); // use require(), NOT import

describe("multiply function test", () => {
  it("7 * 6 should equal 42", async () => {
    const { expect } = await get_chai(); // call async function inside `it()`
    expect(7 * 6).to.equal(42);
  });
});