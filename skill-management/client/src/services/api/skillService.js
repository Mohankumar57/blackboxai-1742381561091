import { http } from './axiosConfig';

const skillService = {
  // Faculty Services
  submitBudget: async (skillData) => {
    try {
      const response = await http.post('/faculty/submit-budget', skillData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFacultySkills: async () => {
    try {
      const response = await http.get('/faculty/my-skills');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAttendance: async (skillId, attendanceData) => {
    try {
      const response = await http.post(`/faculty/mark-attendance/${skillId}`, attendanceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFeedback: async (skillId) => {
    try {
      const response = await http.get(`/faculty/feedback/${skillId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSkill: async (skillId, updateData) => {
    try {
      const response = await http.patch(`/faculty/update-skill/${skillId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAttendanceStats: async (skillId) => {
    try {
      const response = await http.get(`/faculty/attendance-stats/${skillId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Student Services
  getAvailableSkills: async () => {
    try {
      const response = await http.get('/student/available-skills');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  registerForSkill: async (skillId) => {
    try {
      const response = await http.post(`/student/register/${skillId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentAttendance: async () => {
    try {
      const response = await http.get('/student/my-attendance');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  submitFeedback: async (skillId, feedbackData) => {
    try {
      const response = await http.post(`/student/submit-feedback/${skillId}`, feedbackData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEnrolledSkills: async () => {
    try {
      const response = await http.get('/student/my-skills');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Skill Team Services
  getPendingBudgets: async () => {
    try {
      const response = await http.get('/team/pending-budgets');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  reviewBudget: async (skillId, reviewData) => {
    try {
      const response = await http.patch(`/team/review-budget/${skillId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFeedbackAnalysis: async () => {
    try {
      const response = await http.get('/team/feedback-analysis');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSkillStatistics: async () => {
    try {
      const response = await http.get('/team/skill-statistics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendFeedbackSummary: async (skillId) => {
    try {
      const response = await http.post(`/team/send-feedback-summary/${skillId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Common Services
  getSkillDetails: async (skillId) => {
    try {
      const response = await http.get(`/skills/${skillId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Helper Functions
  formatSkillData: (data) => {
    return {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };
  },

  validateSkillData: (data) => {
    const errors = {};

    if (!data.name) errors.name = 'Skill name is required';
    if (!data.type) errors.type = 'Skill type is required';
    if (!data.startDate) errors.startDate = 'Start date is required';
    if (!data.endDate) errors.endDate = 'End date is required';
    if (!data.venue) errors.venue = 'Venue is required';
    if (!data.numberOfVenues) errors.numberOfVenues = 'Number of venues is required';
    if (!data.numberOfStudents) errors.numberOfStudents = 'Number of students is required';
    if (!data.amount) errors.amount = 'Budget amount is required';

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default skillService;
