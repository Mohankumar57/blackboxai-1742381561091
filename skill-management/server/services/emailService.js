const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Send immediate email
  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Schedule email notification for skill start
  async scheduleSkillNotification(skill) {
    try {
      // Schedule notification 24 hours before skill starts
      const notificationDate = new Date(skill.schedule.startDate);
      notificationDate.setDate(notificationDate.getDate() - 1);

      // Get all enrolled students' emails
      const enrolledStudents = await skill.populate('enrolledStudents.student', 'email');
      const studentEmails = enrolledStudents.enrolledStudents.map(
        enrollment => enrollment.student.email
      );

      if (studentEmails.length === 0) {
        console.log('No students enrolled for skill notification');
        return;
      }

      // Create email content
      const emailContent = this.createSkillNotificationEmail(skill);

      // Schedule the job
      schedule.scheduleJob(notificationDate, async () => {
        try {
          await this.sendEmail(
            studentEmails,
            `Reminder: ${skill.name} starts tomorrow`,
            emailContent
          );
          console.log(`Notification sent for skill: ${skill.name}`);
        } catch (error) {
          console.error('Error sending scheduled notification:', error);
        }
      });

      console.log(`Notification scheduled for skill: ${skill.name} at ${notificationDate}`);
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  // Create HTML content for skill notification email
  createSkillNotificationEmail(skill) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Skill Session Reminder</h2>
        <p>Dear Student,</p>
        <p>This is a reminder that your enrolled skill session <strong>${skill.name}</strong> starts tomorrow.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Session Details:</h3>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Date:</strong> ${new Date(skill.schedule.startDate).toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${new Date(skill.schedule.startDate).toLocaleTimeString()}</li>
            <li><strong>Venue:</strong> ${skill.schedule.venue}</li>
            <li><strong>Duration:</strong> Until ${new Date(skill.schedule.endDate).toLocaleDateString()}</li>
          </ul>
        </div>

        <p>Please ensure you arrive at the venue on time.</p>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 0.9em;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;
  }

  // Send assessment notification
  async sendAssessmentNotification(assessment, student) {
    const subject = `Assessment Scheduled: ${assessment.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Assessment Notification</h2>
        <p>Dear ${student.name},</p>
        <p>An assessment has been scheduled for your enrolled skill.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Assessment Details:</h3>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Title:</strong> ${assessment.title}</li>
            <li><strong>Start Time:</strong> ${new Date(assessment.startTime).toLocaleString()}</li>
            <li><strong>Duration:</strong> ${assessment.duration} minutes</li>
            <li><strong>Total Points:</strong> ${assessment.totalPoints}</li>
          </ul>
        </div>

        <p>Please be prepared and ensure you have a stable internet connection during the assessment.</p>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 0.9em;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    await this.sendEmail(student.email, subject, html);
  }

  // Send feedback summary to faculty
  async sendFeedbackSummary(skill, faculty) {
    const feedbackStats = this.calculateFeedbackStats(skill.feedback);
    const subject = `Feedback Summary: ${skill.name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Skill Feedback Summary</h2>
        <p>Dear ${faculty.name},</p>
        <p>Here's a summary of student feedback for your skill: ${skill.name}</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Feedback Statistics:</h3>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Average Rating:</strong> ${feedbackStats.averageRating}/5</li>
            <li><strong>Total Responses:</strong> ${feedbackStats.totalResponses}</li>
            <li><strong>Rating Distribution:</strong></li>
            ${Object.entries(feedbackStats.ratingDistribution)
              .map(([rating, count]) => `
                <li style="margin-left: 20px;">
                  ${rating} stars: ${count} responses
                </li>
              `).join('')}
          </ul>
        </div>

        <p>You can view detailed feedback and comments in the skill management portal.</p>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 0.9em;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    await this.sendEmail(faculty.email, subject, html);
  }

  // Helper method to calculate feedback statistics
  calculateFeedbackStats(feedback) {
    const totalResponses = feedback.length;
    if (totalResponses === 0) {
      return {
        averageRating: 0,
        totalResponses: 0,
        ratingDistribution: {}
      };
    }

    const ratingSum = feedback.reduce((sum, item) => sum + item.rating, 0);
    const ratingDistribution = feedback.reduce((dist, item) => {
      dist[item.rating] = (dist[item.rating] || 0) + 1;
      return dist;
    }, {});

    return {
      averageRating: (ratingSum / totalResponses).toFixed(1),
      totalResponses,
      ratingDistribution
    };
  }
}

module.exports = new EmailService();
