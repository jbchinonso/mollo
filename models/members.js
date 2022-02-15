const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const member = new mongoose.Schema({
  groupId: { type: String},
  userId: { type: String },
  balance: { type: Number, default: 0 },

});



const Member = mongoose.model("member", member);

function validateMember(member) {
  const schema = {
    groupId: Joi.objectId().required(),
      userId: Joi.objectId().required(),
    balance: Joi.number()
  };

  return Joi.object(schema).validate(member);
}

exports.Member = Member;
exports.validateMember = validateMember;
