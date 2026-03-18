// test/crud_operations.js
const Job = require("../models/Job");
const User = require("../models/User");
const { seed_db, testUserPassword } = require("../utils/seed_db"); // utils folder
const app = require("../app"); 
const get_chai = require("../utils/get_chai");

describe("Job CRUD Operations", function () {
  // Seed DB and log in before tests
  before(async function () {
    const { expect, request } = await get_chai();

    // 1️⃣ Seed the database
    this.test_user = await seed_db();

    // 2️⃣ Get logon page to fetch CSRF token
    let req = request.execute(app).get("/session/logon").send();
    let res = await req;

    const textNoLineEnd = res.text.replaceAll("\n", "");
    this.csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd)[1];

    let cookies = res.headers["set-cookie"];
    this.csrfCookie = cookies.find((element) =>
      element.startsWith("csrfToken")
    );

    // 3️⃣ Log in and save session cookie
    const dataToPost = {
      email: this.test_user.email,
      password: testUserPassword,
      _csrf: this.csrfToken,
    };

    req = request
      .execute(app)
      .post("/session/logon")
      .set("Cookie", this.csrfCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(dataToPost);

    res = await req;
    cookies = res.headers["set-cookie"];
    this.sessionCookie = cookies.find((element) =>
      element.startsWith("connect.sid")
    );

    expect(this.csrfToken).to.not.be.undefined;
    expect(this.sessionCookie).to.not.be.undefined;
    expect(this.csrfCookie).to.not.be.undefined;
  });

  it("should get the job list", async function () {
    const { expect, request } = await get_chai();

    const req = request
      .execute(app)
      .get("/jobs") // adjust URL if needed
      .set("Cookie", this.csrfCookie + ";" + this.sessionCookie)
      .send();

    const res = await req;
    expect(res).to.have.status(200);

    // Count <tr> entries on the page
    const pageParts = res.text.split("<tr>");
    // pageParts[0] is header row, so 21 = 20 jobs + 1 header
    expect(pageParts.length).to.equal(21);
  });

  it("should add a new job", async function () {
    const { expect, request } = await get_chai();

    // Build new job data without saving
    const newJob = await factory.build("job");

    const req = request
      .execute(app)
      .post("/jobs") // adjust URL if needed
      .set("Cookie", this.csrfCookie + ";" + this.sessionCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ ...newJob, _csrf: this.csrfToken });

    const res = await req;
    expect(res).to.have.status(200);

    // Check DB now has 21 jobs
    const jobs = await Job.find({ createdBy: this.test_user._id });
    expect(jobs.length).to.equal(21);
  });
});