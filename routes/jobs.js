const express = require("express");
const router = express.Router();
const csrf = require("host-csrf");
const auth = require("../middleware/auth");

const jobsController = require("../controllers/jobs");

const csrfMiddleware = csrf.csrf();

router.get("/", auth, jobsController.getAllJobs);

router.get("/new", auth, jobsController.newJobForm);

router.post("/", auth, csrfMiddleware, jobsController.createJob);

router.get("/edit/:id", auth, jobsController.editJobForm);

router.post("/update/:id", auth, csrfMiddleware, jobsController.updateJob);

router.post("/delete/:id", auth, csrfMiddleware, jobsController.deleteJob);

module.exports = router;

