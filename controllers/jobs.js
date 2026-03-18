const Job = require("../models/Job");
const csrf = require("host-csrf");

// GET /jobs
exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id });

  const csrfToken = csrf.refreshToken(req, res);

  res.render("jobs", { jobs, csrfToken });
};

// GET /jobs/new
exports.newJobForm = (req, res) => {
  const csrfToken = csrf.refreshToken(req, res);
  res.render("job", { job: null, csrfToken });
};

// POST /jobs
exports.createJob = async (req, res) => {
  await Job.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.redirect("/jobs");
};

// GET /jobs/edit/:id
exports.editJobForm = async (req, res) => {
  const job = await Job.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  const csrfToken = csrf.refreshToken(req, res);

  res.render("job", { job, csrfToken });
};

// POST /jobs/update/:id
exports.updateJob = async (req, res) => {
  await Job.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body
  );

  res.redirect("/jobs");
};

// POST /jobs/delete/:id
exports.deleteJob = async (req, res) => {
  await Job.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  res.redirect("/jobs");
};