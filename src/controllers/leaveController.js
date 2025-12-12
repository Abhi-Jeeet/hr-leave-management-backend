const Leave = require("../models/Leave.model");
const Joi = require('joi');
const mongoose = require('mongoose');

const leaveSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  reason: Joi.string().min(3).max(500).required()
});

exports.createLeave = async (req, res) => {
  const { error, value } = leaveSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { startDate, endDate, reason } = value;
  if (new Date(endDate) < new Date(startDate)) {
    return res.status(400).json({ message: 'endDate cannot be before startDate' });
  }

  const newLeave = new Leave({
    employee: req.user.sub,
    startDate,
    endDate,
    reason
  });

  await newLeave.save();
  res.status(201).json(newLeave);
};
exports.getMyLeaves = async (req, res) => {
  const leaves = await Leave.find({ employee: req.user.sub }).sort('-createdAt');
  res.json(leaves);
};

exports.getAllLeaves = async (req, res) => {
  // optional query status
  const query = {};
  if (req.query.status) query.status = req.query.status;
  const leaves = await Leave.find(query).populate('employee', 'name email role').sort('-createdAt');
  res.json(leaves);
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

  const { status, managerComment } = req.body;
  if (!['approved','rejected','pending'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const leave = await Leave.findById(id);
  if (!leave) return res.status(404).json({ message: 'Leave not found' });

  leave.status = status;
  if (managerComment) leave.managerComment = managerComment;
  await leave.save();

  res.json(leave);
};

exports.deleteLeave = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });

  const leave = await Leave.findById(id);
  if (!leave) return res.status(404).json({ message: 'Leave not found' });

  // only employee who created can delete and only if pending
  if (leave.employee.toString() !== req.user.sub) return res.status(403).json({ message: 'Not allowed' });
  if (leave.status !== 'pending') return res.status(400).json({ message: 'Only pending leaves can be deleted' });

  await leave.remove();
  res.json({ message: 'Deleted' });
};
