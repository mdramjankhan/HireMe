const Notification = require('../models/Notification');
const Job = require('../models/Job');
const Application = require('../models/Application');

const createNotification = async (userId, message, type, relatedId, relatedModel) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
      relatedId,
      relatedModel,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const getNotifications = async (req, res) => {
  try {

    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });

    const populatedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        let relatedDoc = null;
        if (notif.relatedModel === 'Job') {
          relatedDoc = await Job.findById(notif.relatedId).select('title company location');
        } else if (notif.relatedModel === 'Application') {
          relatedDoc = await Application.findById(notif.relatedId)
            .populate('job', 'title company location');
        }
        return {
          ...notif.toObject(),
          relatedId: relatedDoc ? relatedDoc : notif.relatedId,
        };
      })
    );

    res.json(populatedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(400).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createNotification, getNotifications, markAsRead, deleteNotification };