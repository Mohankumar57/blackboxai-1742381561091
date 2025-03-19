const express = require('express');
const { protect, isSkillTeam } = require('../middleware/auth');
const { catchAsync, APIError } = require('../middleware/errorHandler');
const Skill = require('../models/Skill');
const User = require('../models/User');
const emailService = require('../services/emailService');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(isSkillTeam);

// Get all pending budget submissions
router.get('/pending-budgets', catchAsync(async (req, res) => {
  const pendingSkills = await Skill.find({
    'budget.status': 'pending'
  }).populate('faculty', 'name email');

  res.status(200).json({
    status: 'success',
    results: pendingSkills.length,
    data: {
      skills: pendingSkills
    }
  });
}));

// Review budget submission
router.patch('/review-budget/:skillId', catchAsync(async (req, res) => {
  const { status, rejectionReason } = req.body;

  if (status === 'rejected' && !rejectionReason) {
    throw new APIError('Rejection reason is required when rejecting a budget', 400);
  }

  const skill = await Skill.findById(req.params.skillId)
    .populate('faculty', 'name email');

  if (!skill) {
    throw new APIError('Skill not found', 404);
  }

  if (skill.budget.status !== 'pending') {
    throw new APIError('This budget has already been reviewed', 400);
  }

  // Update budget status
  skill.budget.status = status;
  skill.budget.rejectionReason = status === 'rejected' ? rejectionReason : null;
  skill.budget.reviewedAt = Date.now();

  // If approved, update skill status to active
  if (status === 'approved') {
    skill.status = 'active';
    
    // Schedule notification for enrolled students
    await emailService.scheduleSkillNotification(skill);
  }

  await skill.save();

  // Send email notification to faculty
  const emailSubject = `Budget ${status.charAt(0).toUpperCase() + status.slice(1)} - ${skill.name}`;
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Budget Review Update</h2>
      <p>Dear Faculty,</p>
      <p>Your budget submission for skill "${skill.name}" has been ${status}.</p>
      
      ${status === 'rejected' ? `
        <div style="background-color: #fff3f3; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #e74c3c; margin-top: 0;">Reason for Rejection:</h3>
          <p>${rejectionReason}</p>
          <p>Please review and resubmit your budget addressing the above concerns.</p>
        </div>
      ` : `
        <div style="background-color: #f1f8e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #4caf50; margin-top: 0;">Next Steps:</h3>
          <p>You can now proceed with conducting the skill sessions as planned.</p>
        </div>
      `}
      
      <div style="margin-top: 20px;">
        <p><strong>Budget Details:</strong></p>
        <ul>
          <li>Number of Venues: ${skill.budget.numberOfVenues}</li>
          <li>Number of Students: ${skill.budget.numberOfStudents}</li>
          <li>Amount: ${skill.budget.amount}</li>
        </ul>
      </div>
    </div>
  `;

  for (const faculty of skill.faculty) {
    await emailService.sendEmail(faculty.email, emailSubject, emailContent);
  }

  res.status(200).json({
    status: 'success',
    data: {
      skill
    }
  });
}));

// Get feedback analysis for all skills
router.get('/feedback-analysis', catchAsync(async (req, res) => {
  const skills = await Skill.find({
    feedback: { $exists: true, $not: { $size: 0 } }
  }).populate('faculty', 'name email');

  const feedbackAnalysis = skills.map(skill => {
    const totalFeedback = skill.feedback.length;
    const averageRating = skill.feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback;
    
    // Calculate rating distribution
    const ratingDistribution = skill.feedback.reduce((dist, f) => {
      dist[f.rating] = (dist[f.rating] || 0) + 1;
      return dist;
    }, {});

    // Extract common themes from comments (simple keyword analysis)
    const comments = skill.feedback.map(f => f.comment).filter(Boolean);
    const commonThemes = analyzeComments(comments);

    return {
      skillName: skill.name,
      faculty: skill.faculty,
      totalFeedback,
      averageRating,
      ratingDistribution,
      commonThemes
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      analysis: feedbackAnalysis
    }
  });
}));

// Helper function to analyze comments for common themes
function analyzeComments(comments) {
  const keywords = {
    positive: ['excellent', 'good', 'great', 'helpful', 'informative', 'engaging'],
    negative: ['poor', 'bad', 'difficult', 'confusing', 'boring', 'unhelpful'],
    improvement: ['suggest', 'improve', 'could', 'should', 'better', 'more']
  };

  const themes = {
    positive: {},
    negative: {},
    improvement: {}
  };

  comments.forEach(comment => {
    const words = comment.toLowerCase().split(/\W+/);
    
    words.forEach(word => {
      if (keywords.positive.includes(word)) {
        themes.positive[word] = (themes.positive[word] || 0) + 1;
      }
      if (keywords.negative.includes(word)) {
        themes.negative[word] = (themes.negative[word] || 0) + 1;
      }
      if (keywords.improvement.includes(word)) {
        themes.improvement[word] = (themes.improvement[word] || 0) + 1;
      }
    });
  });

  return themes;
}

// Get skill statistics
router.get('/skill-statistics', catchAsync(async (req, res) => {
  const stats = await Skill.aggregate([
    {
      $group: {
        _id: '$type',
        totalSkills: { $sum: 1 },
        averageStudents: { $avg: '$budget.numberOfStudents' },
        totalBudget: { $sum: '$budget.amount' },
        activeSkills: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
          }
        }
      }
    }
  ]);

  const enrollmentStats = await User.aggregate([
    {
      $match: { role: 'student' }
    },
    {
      $group: {
        _id: '$studentType',
        totalStudents: { $sum: 1 },
        avgEnrolledSkills: { $avg: { $size: '$enrolledSkills' } }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      skillStats: stats,
      enrollmentStats
    }
  });
}));

// Send feedback summary to faculty
router.post('/send-feedback-summary/:skillId', catchAsync(async (req, res) => {
  const skill = await Skill.findById(req.params.skillId)
    .populate('faculty', 'name email')
    .populate('feedback.student', 'name');

  if (!skill) {
    throw new APIError('Skill not found', 404);
  }

  // Send feedback summary email to each faculty
  for (const faculty of skill.faculty) {
    await emailService.sendFeedbackSummary(skill, faculty);
  }

  res.status(200).json({
    status: 'success',
    message: 'Feedback summary sent to faculty'
  });
}));

module.exports = router;
