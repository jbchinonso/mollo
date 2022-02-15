const bcrypt = require("bcrypt")
const { User, validateUser } = require("../models/user")
const { Group, validateGroup } = require("../models/group")
const { Member, validateMember} = require("../models/members")



class Controller{

    static async signUp(req, res) {
        const userData = req.body

        const { error, value:cleanData } = validateUser(userData)
        
        if (error) return res.status(400).send({ statusCode: 400, message: error.message })
        
        const existingUser = await User.findOne({ email: cleanData.email })
        
        if (existingUser) return res.status(400).send({ statusCode: 400, message: `${cleanData.email} is already taken` })
        
        const hashedpass = await bcrypt.hash(cleanData.password, await bcrypt.genSalt(8));

        cleanData.password = hashedpass

        try {
            
            await new User(cleanData).save()
            return res.status(200).send({status: 200, message: "registration Successful"})

        } catch (error) {
            
            return res.status(400).send({status: res.statusCode, message: error.message})
        }


    }


    static async createGroup(req, res) {
        const groupData = req.body

        const { error, value: cleanData } = validateGroup(groupData)

        if (error) return res.status(400).send({ status: res.status, message: error.message });



        try {
            await new Group(cleanData).save()
            return res.status(200).send({status: res.statusCode, message: "Group setup successfully"})
        } catch (error) {
            return res.status(500).send({status: res.statusCode, message: error.message})
        }
    }



    static async searchGroup(req, res) {
        const { query } = req.query
        
        try {
            const result = await Group.aggregate([
                { $match: { searchable: true, $text: { $search: query } } },
              {
                  $project: {
                    _id: 0,
                      groupName: 1,
                      capacity: 1,
                    amount: 1
                },
              },
            ]);

            return res.status(200).send({status: res.statusCode, data: result})
        } catch (error) {
            
            return res.status(400).send({status: res.statusCode, message: error.message})
        }
    }


    static async joinGroup(req, res) {
        const  userData  = req.body
        const { error, value: cleanData } = validateMember(userData);
        
        try {

            if (error) throw new Error(error.message)

            const group = Group.findOne({ _id: cleanData.groupId });

            if(!group) throw new Error("Invalid group")

            const existingMember = Member.findOne({ userId: cleanData.userId, groupId: cleanData.groupId })
            
            if(existingMember) throw new Error("You are Already a member of this Group")
            await new Member(cleanData).save()
            return res.status(200).send({ status: res.statusCode, message: "you have Joined the Group" })
            
        } catch (error) {
            return res.status(400).send({status: res.statusCode, message: error.message})
        }
    }


    static async groupMembers(req, res) {
        const { adminId } = req.params
        
        try {
        
            if (!adminId) throw new Error("please provide an admin Id ")

            const group = await Group.findOne({ adminId: adminId })

            if (!group) throw new Error("you are not a group admin")

            let groupId = String(group._id)
            const members = await Member.aggregate([
              { $match: { groupId: groupId } },
              {
                $lookup: {
                  from: "users",
                  let: { searchId: { $toObjectId: "$userId" } },
                  pipeline: [
                    { $match: { $expr: [{ _id: "$$searchId" }] } },
                    { $project: {_id: 0, username: 1 } },
                  ],

                  as: "user",
                },
              },
              {
                $project: {
                  _id: 0,
                userId: 0,
                  __v:0
                },
              },
            ]);
     
        


        return res.status(200).send({ status: res.statusCode, data: members });
            
        } catch (error) {
            return res
              .status(400)
              .send({ status: res.statusCode, message: error.message });
        }

        

    }
}




module.exports = Controller