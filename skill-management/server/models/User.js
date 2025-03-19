const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /@bitsathy\.ac\.in$/
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'skillTeam'],
    default: 'student'
  },
  studentType: {
    type: String,
    enum: ['dayScholar', 'hosteller'],
    required: function() {
      return this.role === 'student';
    }
  },
  enrolledSkills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware to update the updatedAt field on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if user can enroll in a skill based on their type
userSchema.methods.canEnrollInSkill = function(skillType) {
  if (this.role !== 'student') return false;
  
  if (this.studentType === 'hosteller') {
    return true; // Hostellers can enroll in both day and night skills
  }
  
  return skillType === 'day'; // Day scholars can only enroll in day skills
};

// Method to check if user has reached skill enrollment limit
userSchema.methods.hasReachedSkillLimit = async function(skillType) {
  const enrolledSkillsCount = await mongoose.model('Skill').countDocuments({
    _id: { $in: this.enrolledSkills },
    type: skillType
  });
  
  return enrolledSkillsCount >= 1;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
