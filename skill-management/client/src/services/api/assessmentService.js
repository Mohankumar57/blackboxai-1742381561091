import { http } from './axiosConfig';

const assessmentService = {
  // Faculty Services
  createAssessment: async (skillId, assessmentData) => {
    try {
      const response = await http.post(`/faculty/create-assessment/${skillId}`, assessmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAssessment: async (assessmentId, updateData) => {
    try {
      const response = await http.patch(`/faculty/update-assessment/${assessmentId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  publishAssessment: async (assessmentId) => {
    try {
      const response = await http.patch(`/faculty/publish-assessment/${assessmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAssessmentResults: async (assessmentId) => {
    try {
      const response = await http.get(`/faculty/assessment-results/${assessmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Student Services
  getAvailableAssessments: async () => {
    try {
      const response = await http.get('/student/available-assessments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  submitAssessment: async (assessmentId, answers) => {
    try {
      const response = await http.post(`/student/submit-assessment/${assessmentId}`, { answers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentResult: async (assessmentId) => {
    try {
      const response = await http.get(`/student/assessment-result/${assessmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Helper Functions
  validateAssessmentData: (data) => {
    const errors = {};

    if (!data.title) {
      errors.title = 'Assessment title is required';
    }

    if (!data.duration || data.duration < 1) {
      errors.duration = 'Valid duration is required';
    }

    if (!data.passingScore || data.passingScore < 0) {
      errors.passingScore = 'Valid passing score is required';
    }

    if (!data.startTime) {
      errors.startTime = 'Start time is required';
    }

    if (!data.endTime) {
      errors.endTime = 'End time is required';
    }

    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      errors.questions = 'At least one question is required';
    } else {
      const questionErrors = data.questions.map((question, index) => {
        const qErrors = {};

        if (!question.text) {
          qErrors.text = 'Question text is required';
        }

        if (!Array.isArray(question.options) || question.options.length < 2) {
          qErrors.options = 'At least two options are required';
        } else {
          const hasCorrectOption = question.options.some(opt => opt.isCorrect);
          if (!hasCorrectOption) {
            qErrors.options = 'At least one correct option is required';
          }
        }

        return Object.keys(qErrors).length > 0 ? { index, errors: qErrors } : null;
      }).filter(Boolean);

      if (questionErrors.length > 0) {
        errors.questions = questionErrors;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  formatAssessmentData: (data) => {
    return {
      ...data,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
      questions: data.questions.map(question => ({
        ...question,
        points: question.points || 1 // Default point value if not specified
      }))
    };
  },

  calculateTimeRemaining: (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0
      };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return {
      hours,
      minutes,
      seconds,
      total: diff
    };
  },

  isAssessmentActive: (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  },

  calculateScore: (answers, questions) => {
    let score = 0;
    let totalPossible = 0;

    questions.forEach((question, index) => {
      const studentAnswer = answers[index];
      const correctOptions = question.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt.id);

      totalPossible += question.points || 1;

      if (studentAnswer && Array.isArray(studentAnswer.selectedOptions)) {
        const isCorrect = 
          studentAnswer.selectedOptions.length === correctOptions.length &&
          studentAnswer.selectedOptions.every(opt => correctOptions.includes(opt));

        if (isCorrect) {
          score += question.points || 1;
        }
      }
    });

    return {
      score,
      totalPossible,
      percentage: (score / totalPossible) * 100
    };
  }
};

export default assessmentService;
