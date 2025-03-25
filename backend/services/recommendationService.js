const Job = require('../models/Job');
const User = require('../models/User');

class RecommendationService {
  async getRecommendations(userId) {
    try {
      const user = await User.findById(userId).select('profile.skills');
      if (!user) {
        throw new Error('User not found');
      }

      const userSkills = user.profile.skills || [];

      if (!userSkills.length) {
        const allJobs = await Job.find()
          .populate('employer', 'email name')
          .limit(10);
        return allJobs;
      }

      const recommendedJobs = await Job.find({
        requirements: { $regex: userSkills.join('|'), $options: 'i' },
      })
        .populate('employer', 'email name')
        .limit(10);

      return recommendedJobs;
    } catch (error) {
      throw new Error(`Failed to fetch recommendations: ${error.message}`);
    }
  }
}

module.exports = new RecommendationService();