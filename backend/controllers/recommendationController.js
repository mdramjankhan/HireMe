const recommendationService = require('../services/recommendationService');

const getRecommendations = async (req, res) => {
  try {
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Only jobseekers can access recommendations' });
    }

    const recommendations = await recommendationService.getRecommendations(req.user.id);
    res.json(recommendations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getRecommendations };