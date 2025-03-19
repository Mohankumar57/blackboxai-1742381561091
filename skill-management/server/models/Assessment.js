const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  points: {
    type: Number,
    default: 1
  }
});

const studentResponseSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedOption: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }],
  score: {
    type: Number,
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const assessmentSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  questions: [questionSchema],
  duration: {
    type: Number, // Duration in minutes
    required: true,
    min: 1
  },
  totalPoints: {
    type: Number,
    default: function() {
      return this.questions.reduce((sum, question) => sum + question.points, 0);
    }
  },
  passingScore: {
    type: Number,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  studentResponses: [studentResponseSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'completed'],
    default: 'draft'
  },
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

// Middleware to update timestamps
assessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if assessment is currently active
assessmentSchema.methods.isActive = function() {
  const now = new Date();
  return now >= this.startTime && now <= this.endTime;
};

// Method to check if student has already submitted
assessmentSchema.methods.hasStudentSubmitted = function(studentId) {
  return this.studentResponses.some(response => 
    response.student.toString() === studentId.toString()
  );
};

// Method to calculate student's score
assessmentSchema.methods.calculateScore = function(studentResponses) {
  let score = 0;
  
  studentResponses.forEach(response => {
    const question = this.questions.id(response.question);
    if (!question) return;

    const selectedOption = question.options.id(response.selectedOption);
    if (selectedOption && selectedOption.isCorrect) {
      score += question.points;
    }
  });

  return score;
};

// Method to get assessment statistics
assessmentSchema.methods.getStatistics = function() {
  const totalStudents = this.studentResponses.length;
  if (totalStudents === 0) {
    return {
      averageScore: 0,
      passRate: 0,
      highestScore: 0,
      lowestScore: 0
    };
  }

  const scores = this.studentResponses.map(response => response.score);
  const passedStudents = this.studentResponses.filter(
    response => response.score >= this.passingScore
  ).length;

  return {
    averageScore: scores.reduce((a, b) => a + b, 0) / totalStudents,
    passRate: (passedStudents / totalStudents) * 100,
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores)
  };
};

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
