const Message = require('../models/Message');

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ recipient: req.user.id })
            .populate('sender', 'profile.companyName')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { recipient, subject, body } = req.body;
        const sender = req.user.id;

        const message = new Message({
            sender,
            recipient,
            subject,
            body,
        });
        await message.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const markMessageAsRead = async (req, res) => {
    try {
        const message = await Message.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { isRead: true },
            { new: true }
        );
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.json({ message: 'Message marked as read' });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user.id,
        });
        if (!message) return res.status(404).json({ message: 'Message not found' });
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { sendMessage, getMessages, markMessageAsRead, deleteMessage };