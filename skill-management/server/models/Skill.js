const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['day', 'night', 'both'],
    required: true
  },
  faculty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  budget: {
    numberOfVenues: {
      type: Number,
      required: true
    },
    numberOfStudents: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      default: null
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: {
      type: Date
    }
  },
  schedule: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    venue: {
      type: String,
      required: true
    }
  },
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    }
  }],
  attendance: [{
    date: {
      type: Date,
      required: true
    },
    presentStudents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  feedback: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'completed'],
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
skillSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if skill has available slots
skillSchema.methods.hasAvailableSlots = function() {
  return this.enrolledStudents.length < this.budget.numberOfStudents;
};

// Method to check if student is already enrolled
skillSchema.methods.isStudentEnrolled = function(studentId) {
  return this.enrolledStudents.some(enrollment => 
    enrollment.student.toString() === studentId.toString()
  );
};

// Method to get attendance percentage for a student
skillSchema.methods.getStudentAttendance = function(studentId) {
  const totalClasses = this.attendance.length;
  if (totalClasses === 0) return 100;

  const classesAttended = this.attendance.filter(record =>
    record.presentStudents.includes(studentId)
  ).length;

  return (classesAttended / totalClasses) * 100;
};

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
