const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const group = new mongoose.Schema({
  groupName: { type: String, unique: true },
  description: { type: String },
  capacity: { type: Number },
  amount: { type: Number },
    searchable: { type: Boolean, default: true },
  adminId: {type: String}
});

group.index({ groupName: "text" });

const Group = mongoose.model("group", group);

function validateGroup(group) {
  const schema = {
    groupName: Joi.string().required(),
    description: Joi.string().required(),
    capacity: Joi.number().required(),
    amount: Joi.number().required(),
      searchable: Joi.boolean(),
    adminId: Joi.objectId().required()
  };

  return Joi.object(schema).validate(group);
}

exports.Group = Group;
exports.validateGroup = validateGroup;
