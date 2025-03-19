const express = require('express');
const { protect, isFaculty } = require('../middleware/auth');
const { catchAsync, APIError } = require('../middleware/errorHandler');
const Skill = require('../models/Skill');
const Assessment = require('../models/Assessment');
const emailService = require('../services/emailService');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(isFaculty);

// Submit budget for a new skill
router.post('/submit-budget', catchAsync(async (req, res) => {
  const {
    name,
    type,
    numberOfVenues,
    numberOfStudents,
    amount,
    coFaculties,
    startDate,
    endDate,
    venue
  } = req.body;

  // Create new skill with budget details
  const skill = await Skill.create({
    name,
    type,
    faculty: [req.user.id, ...coFaculties],
    budget: {
      numberOfVenues,
      numberOfStudents,
      amount,
      status: 'pending'
    },
    schedule: {
      startDate,
      endDate,
      venue
    }
  });

  res.status(201).json({
    status: 'success',
    data: {
      skill
    }
  });
}));

// Get all skills created by faculty
router.get('/my-skills', catchAsync(async (req, res) => {
  const skills = await Skill.find({
    faculty: req.user.id
  }).populate('enrolledStudents.student', 'name email');

  res.status(200).json({
    status: 'success',
    results: skills.length,
    data: {
      skills
    }
  });
}));

// Mark attendance for a skill
router.post('/mark-attendance/:skillId', catchAsync(async (req, res) => {
  const { date, presentStudents } = req.body;
  const skill = await Skill.findById(req.params.skillId);

  if (!skill) {
    throw new APIError('Skill not found', 404);
  }

  // Verify faculty is assigned to this skill
  if (!skill.faculty.includes(req.user.id)) {
    throw new APIError('Not authorized to mark attendance for this skill', 403);
  }

  // Check if attendance already marked for this date
  const existingAttendance = skill.attendance.find(
    a => a.date.toDateString() === new Date(date).toDateString()
  );

  if (existingAttendance) {
    throw new APIError('Attendance already marked for this date', 400);
  }

  // Add attendance record
  skill.attendance.push({
    date: new Date(date),
    presentStudents,
    markedBy: req.user.id
  });

  await skill.save();

  res.status(200).json({
    status: 'success',
    message: 'Attendance marked successfully'
  });
}));

// View feedback for a skill
router.get('/feedback/:skillId', catchAsync(async (req, res) => {
  const skill = await Skill.findById(req.params.skillId)
    .populate({
      path: 'feedback.student',
      select: 'name email'
    });

  if (!skill) {
    throw new APIError('Skill not found', 404);
  }

  if (!skill.faculty.includes(req.user.id)) {
    throw new APIError('Not authorized to view feedback for this skill', 403);
  }

  res.status(200).json({
    status: 'success',
    data: {
      feedback: skill.feedback
    }
  });
}));

// Create assessment for a skill
router.post('/create-assessment/:skillId', catchAsync(async (req, res) => {
  const {
    title,
    description,
    questions,
    duration,
    passingScore,
    startTime,
    endTime
  } = req.body;

  const skill = await Skill.findById(req.params.skillId);

  if (!skill) {
    throw new APIError('Skill not found', 404);
  }

  if (!skill.faculty.includes(req.user.id)) {
    throw new APIError('Not authorized to create assessment for this skill', 403);
  }

  const assessment = await Assessment.create({
    skill: skill._id,
    title,
    description,
    questions,
    duration,
    passingScore,
    startTime,
    endTime,
    createdBy: req.user.id
  });

  // Update skill with assessment reference
  skill.assessment = assessment._id;
  await skill.save();

  // Send notification to enrolled students
  const enrolledStudents = await skill.populate('enrolledStudents.student');
  for (const enrollment of enrolledStudents.enrolledStudents) {
    await emailService.sendAssessmentNotification(assessment, enrollment.student);
  }

  res.status(201).json({
    status: 'success',
    data: {
      assessment
    }
  });
}));

// Get assessment results
router.get('/assessment-results/:assessmentId', catchAsync(async (req, res) => {
  const assessment = await Assessment.findById(req.params.assessmentId)
    .populate({
      path: 'studentResponses.student',
      select: 'name email'
    });

  if (!assessment) {
    throw new APIError('Assessment not found', 404);
  }

  const skill = await Skill.findById(assessment.skill);
  if (!skill.faculty.includes(req.user.id)) {
    throw new APIError('Not authorized to view these results', 403);
  }

  const statistics = assessment.getStatistics();

  res.status(200).json({
    status: 'success',
    data: {
      assessment,
      statistics
    }
  });
}));

// Update skill details
router.patch('/update-skill/:skillId', catchAsync(async (req, res) => {
  const skill = await Skill.findById(req.params.skillId);

  if (!skill) {
    throw new APIError('Skill not found', 404);
  }

  if (!skill.faculty.includes(req.user.id)) {
    throw new APIError('Not authorized to update this skill', 403);
  }

  // Only allow updating certain fields
  const allowedUpdates = ['name', 'schedule'];
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const updatedSkill = await Skill.findByIdAndUpdate(
    req.params.skillId,
    updates,
    { new: true, runValidators: true }
  );

  // If start date is updated, reschedule notification
  if (req.body.schedule?.startDate) {
    await emailService.scheduleSkillNotification(updatedSkill);
  }

  res.status(200).json({
    status: 'success',
    data: {
      skill: updatedSkill
    }
  });
}));

// Get attendance statistics
router.get('/attendance-stats/:skillId', catchAsync(async (req, res) => {
  const skill = await Skill.findById(req.params.skillId)
    .populate('enrolledStudents.student', 'name email');

  if (!skill) {
    throw new APIError('Skill not found', 404);
  }

  if (!skill.faculty.includes(req.user.id)) {
    throw new APIError('Not authorized to view attendance for this skill', 403);
  }

  const attendanceStats = skill.enrolledStudents.map(enrollment => ({
    student: enrollment.student,
    attendancePercentage: skill.getStudentAttendance(enrollment.student._id)
  }));

  res.status(200).json({
    status: 'success',
    data: {
      attendanceStats
    }
  });
}));

module.exports = router;
