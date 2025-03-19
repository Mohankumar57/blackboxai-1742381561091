const express = require('express');
const { protect, isFaculty, isStudent } = require('../middleware/auth');
const { catchAsync, APIError } = require('../middleware/errorHandler');
const Assessment = require('../models/Assessment');
const Skill = require('../models/Skill');
const emailService = require('../services/emailService');

const router = express.Router();

// Protect all routes
router.use(protect);

// Faculty routes
router.use('/faculty', isFaculty);

// Create new assessment
router.post('/faculty/create/:skillId', catchAsync(async (req, res) => {
  const skill = await Skill.findById(req.params.skillId);
  
  if (!skill) {
    throw new APIError('Skill not found', 404);
  }

  if (!skill.faculty.includes(req.user.id)) {
    throw new APIError('Not authorized to create assessment for this skill', 403);
  }

  const {
    title,
    description,
    questions,
    duration,
    passingScore,
    startTime,
    endTime
  } = req.body;

  const assessment = await Assessment.create({
    skill: skill._id,
    title,
    description,
    questions,
    duration,
    passingScore,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    createdBy: req.user.id,
    status: 'draft'
  });

  // Link assessment to skill
  skill.assessment = assessment._id;
  await skill.save();

  res.status(201).json({
    status: 'success',
    data: {
      assessment
    }
  });
}));

// Update assessment
router.patch('/faculty/update/:assessmentId', catchAsync(async (req, res) => {
  const assessment = await Assessment.findById(req.params.assessmentId);
  
  if (!assessment) {
    throw new APIError('Assessment not found', 404);
  }

  if (assessment.createdBy.toString() !== req.user.id) {
    throw new APIError('Not authorized to update this assessment', 403);
  }

  if (assessment.status !== 'draft') {
    throw new APIError('Cannot update published or completed assessment', 400);
  }

  const updatedAssessment = await Assessment.findByIdAndUpdate(
    req.params.assessmentId,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      assessment: updatedAssessment
    }
  });
}));

// Publish assessment
router.patch('/faculty/publish/:assessmentId', catchAsync(async (req, res) => {
  const assessment = await Assessment.findById(req.params.assessmentId)
    .populate({
      path: 'skill',
      populate: {
        path: 'enrolledStudents.student',
        select: 'email name'
      }
    });

  if (!assessment) {
    throw new APIError('Assessment not found', 404);
  }

  if (assessment.createdBy.toString() !== req.user.id) {
    throw new APIError('Not authorized to publish this assessment', 403);
  }

  if (assessment.status !== 'draft') {
    throw new APIError('Assessment is already published or completed', 400);
  }

  assessment.status = 'published';
  await assessment.save();

  // Send notification to enrolled students
  for (const enrollment of assessment.skill.enrolledStudents) {
    await emailService.sendAssessmentNotification(assessment, enrollment.student);
  }

  res.status(200).json({
    status: 'success',
    message: 'Assessment published successfully'
  });
}));

// Get assessment results (faculty view)
router.get('/faculty/results/:assessmentId', catchAsync(async (req, res) => {
  const assessment = await Assessment.findById(req.params.assessmentId)
    .populate({
      path: 'studentResponses.student',
      select: 'name email'
    });

  if (!assessment) {
    throw new APIError('Assessment not found', 404);
  }

  if (assessment.createdBy.toString() !== req.user.id) {
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

// Student routes
router.use('/student', isStudent);

// Get available assessments for student
router.get('/student/available', catchAsync(async (req, res) => {
  const enrolledSkills = await Skill.find({
    'enrolledStudents.student': req.user.id,
    assessment: { $exists: true }
  });

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

// Submit assessment
router.post('/student/submit/:assessmentId', catchAsync(async (req, res) => {
  const assessment = await Assessment.findById(req.params.assessmentId);

  if (!assessment) {
    throw new APIError('Assessment not found', 404);
  }

  if (!assessment.isActive()) {
    throw new APIError('Assessment is not currently active', 400);
  }

  if (assessment.hasStudentSubmitted(req.user.id)) {
    throw new APIError('You have already submitted this assessment', 400);
  }

  const { answers } = req.body;

  // Validate answers format
  if (!Array.isArray(answers)) {
    throw new APIError('Invalid answers format', 400);
  }

  // Calculate score
  const score = assessment.calculateScore(answers);

  // Record response
  assessment.studentResponses.push({
    student: req.user.id,
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

// Get assessment result (student view)
router.get('/student/result/:assessmentId', catchAsync(async (req, res) => {
  const assessment = await Assessment.findById(req.params.assessmentId);

  if (!assessment) {
    throw new APIError('Assessment not found', 404);
  }

  const studentResponse = assessment.studentResponses.find(
    response => response.student.toString() === req.user.id
  );

  if (!studentResponse) {
    throw new APIError('No submission found for this assessment', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      title: assessment.title,
      score: studentResponse.score,
      totalPoints: assessment.totalPoints,
      passingScore: assessment.passingScore,
      passed: studentResponse.score >= assessment.passingScore,
      submittedAt: studentResponse.submittedAt
    }
  });
}));

module.exports = router;
