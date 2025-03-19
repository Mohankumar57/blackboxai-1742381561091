const express = require('express');
const { protect, isStudent, validateStudentType } = require('../middleware/auth');
const { catchAsync, APIError } = require('../middleware/errorHandler');
const Skill = require('../models/Skill');
const Assessment = require('../models/Assessment');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(isStudent);

// Get available skills based on student type
router.get('/available-skills', catchAsync(async (req, res) => {
  const studentType = req.user.studentType;
  let query = {
    'budget.status': 'approved',
    status: 'active'
  };

  // If day scholar, only show day skills
  if (studentType === 'dayScholar') {
    query.type = 'day';
  }
  // If hosteller, show both day and night skills
  // No additional filter needed as hostellers can access all types

  const skills = await Skill.find(query)
    .populate('faculty', 'name email')
    .select('-budget.rejectionReason -attendance');

  res.status(200).json({
    status: 'success',
    results: skills.length,
    data: {
      skills
    }
  });
}));

// Register for a skill
router.post('/register/:skillId', 
  validateStudentType,
  catchAsync(async (req, res) => {
    const skill = await Skill.findById(req.params.skillId);

    if (!skill) {
      throw new APIError('Skill not found', 404);
    }

    // Check if skill is approved and active
    if (skill.budget.status !== 'approved' || skill.status !== 'active') {
      throw new APIError('This skill is not available for registration', 400);
    }

    // Check if student is already enrolled
    if (skill.isStudentEnrolled(req.user._id)) {
      throw new APIError('You are already enrolled in this skill', 400);
    }

    // Check if student has reached skill limit for this type
    if (await req.user.hasReachedSkillLimit(skill.type)) {
      throw new APIError(`You have reached the maximum limit for ${skill.type} skills`, 400);
    }

    // Check if skill has available slots
    if (!skill.hasAvailableSlots()) {
      throw new APIError('No available slots in this skill', 400);
    }

    // Add student to enrolled students
    skill.enrolledStudents.push({
      student: req.user._id,
      enrolledAt: Date.now()
    });

    // Add skill to user's enrolled skills
    req.user.enrolledSkills.push(skill._id);

    await Promise.all([skill.save(), req.user.save()]);

    res.status(200).json({
      status: 'success',
      message: 'Successfully enrolled in skill'
    });
}));

// View attendance for enrolled skills
router.get('/my-attendance', catchAsync(async (req, res) => {
  const enrolledSkills = await Skill.find({
    'enrolledStudents.student': req.user._id
  }).select('name attendance schedule');

  const attendanceData = enrolledSkills.map(skill => ({
    skillName: skill.name,
    attendancePercentage: skill.getStudentAttendance(req.user._id),
    attendanceDetails: skill.attendance
      .map(record => ({
        date: record.date,
        present: record.presentStudents.includes(req.user._id)
      }))
  }));

  res.status(200).json({
    status: 'success',
    data: {
      attendance: attendanceData
    }
  });
}));

// Submit feedback for a skill
router.post('/submit-feedback/:skillId', catchAsync(async (req, res) => {
  const { rating, comment } = req.body;

  const skill = await Skill.findById(req.params.skillId);

  if (!skill) {
    throw new APIError('Skill not found', 404);
  }

  // Verify student is enrolled in the skill
  if (!skill.isStudentEnrolled(req.user._id)) {
    throw new APIError('You are not enrolled in this skill', 403);
  }

  // Check if student has already submitted feedback
  const existingFeedback = skill.feedback.find(
    f => f.student.toString() === req.user._id.toString()
  );

  if (existingFeedback) {
    throw new APIError('You have already submitted feedback for this skill', 400);
  }

  // Add feedback
  skill.feedback.push({
    student: req.user._id,
    rating,
    comment,
    submittedAt: Date.now()
  });

  await skill.save();

  res.status(200).json({
    status: 'success',
    message: 'Feedback submitted successfully'
  });
}));

// Get available assessments
router.get('/available-assessments', catchAsync(async (req, res) => {
  const enrolledSkills = await Skill.find({
    'enrolledStudents.student': req.user._id,
    assessment: { $exists: true }
  }).select('assessment');

  const assessmentIds = enrolledSkills.map(skill => skill.assessment);

  const assessments = await Assessment.find({
    _id: { $in: assessmentIds },
    status: 'published',
    startTime: { $lte: new Date() },
    endTime: { $gte: new Date() }
  }).select('-questions.options.isCorrect');

  res.status(200).json({
    status: 'success',
    data: {
      assessments
    }
  });
}));

// Take assessment
router.post('/take-assessment/:assessmentId', catchAsync(async (req, res) => {
  const { answers } = req.body;
  const assessment = await Assessment.findById(req.params.assessmentId);

  if (!assessment) {
    throw new APIError('Assessment not found', 404);
  }

  // Verify assessment is active
  if (!assessment.isActive()) {
    throw new APIError('This assessment is not currently active', 400);
  }

  // Verify student hasn't already submitted
  if (assessment.hasStudentSubmitted(req.user._id)) {
    throw new APIError('You have already submitted this assessment', 400);
  }

  // Calculate score
  const score = assessment.calculateScore(answers);

  // Record student response
  assessment.studentResponses.push({
    student: req.user._id,
    answers,
    score,
    submittedAt: Date.now()
  });

  await assessment.save();

  res.status(200).json({
    status: 'success',
    data: {
      score,
      totalPoints: assessment.totalPoints,
      passed: score >= assessment.passingScore
    }
  });
}));

// Get enrolled skills
router.get('/my-skills', catchAsync(async (req, res) => {
  const enrolledSkills = await Skill.find({
    'enrolledStudents.student': req.user._id
  })
    .populate('faculty', 'name email')
    .select('-budget.rejectionReason -attendance');

  res.status(200).json({
    status: 'success',
    results: enrolledSkills.length,
    data: {
      skills: enrolledSkills
    }
  });
}));

// Get assessment results
router.get('/assessment-results/:assessmentId', catchAsync(async (req, res) => {
  const assessment = await Assessment.findById(req.params.assessmentId);

  if (!assessment) {
    throw new APIError('Assessment not found', 404);
  }

  const studentResponse = assessment.studentResponses.find(
    response => response.student.toString() === req.user._id.toString()
  );

  if (!studentResponse) {
    throw new APIError('You have not taken this assessment', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      score: studentResponse.score,
      totalPoints: assessment.totalPoints,
      submittedAt: studentResponse.submittedAt,
      passed: studentResponse.score >= assessment.passingScore
    }
  });
}));

module.exports = router;
