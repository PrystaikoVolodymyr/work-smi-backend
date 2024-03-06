const User = require("../models/User");
const UserFilters = require("../models/UserFilters");
const Response = require("../models/Response");
const Company = require("../models/Company");
const RecruiterFilters = require("../models/RecruiterFilters");
const {
  getUsersList,
  createUser,
  getCustomToken,
  setClaims,
  deleteUserByEmail,
  getUserByEmail,
  getUserByUid,
  signInWithCustomToken,
  deleteUsersInBatches,
} = require("../service/firebase.service");
// const {} = require("../config/config");

module.exports = {
  async getCompanies(req, res) {
    try {
      const { name = "" } = req.query;

      const companies = await Company.find({
        companyName: { $regex: name, $options: "i" },
      }).limit(20);
      res.status(201).json({ status: "success", data: { companies } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async createCompany(req, res) {
    try {
      const { comanyName, companyWebsite, companyDescription } = req.body;
      const { _id, uid } = req.user;
      const company = await Company.create({
        comanyName,
        companyWebsite,
        companyDescription,
        admin: _id,
      });

      await User.findByIdAndUpdate(_id, { company: company._id });

      await setClaims(uid, {
        companyId: company._id,
        company: true,
        isAdmin: true,
      });
      res.status(201).json({ status: "success"});
    } catch (e) {
      res.status(400).json(e.message);
    }
  },
};
