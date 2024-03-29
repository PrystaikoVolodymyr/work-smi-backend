const axios = require("axios");
const User = require("../models/User");
const UserFilters = require("../models/UserFilters");
const Response = require("../models/Response");
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
const {
  LINKEDIN_CLIENT_SECRET,
  LINKEDIN_CALLBACK_URL,
  LINKEDIN_CLIENT_ID,
} = require("../config/config");

module.exports = {
  async signUpUser(req, res) {
    try {
      const { userId, role } = req.body;

      const user = await getUserByUid(userId);

      let claims = user.customClaims?.role ? user.customClaims : { role };

      const isUserExist = await User.findOne({ uid: userId });

      if (!isUserExist) {
        const name = user?.displayName ? user.displayName.split(" ")[0] : "";
        const surname = user?.displayName ? user.displayName.split(" ")[1] : "";

        const { _id } = await User.create({
          email: user.email || "",
          displayName: user.displayName || "",
          uid: userId,
          photo: user.photoURL || "",
          role: role,
          name,
          surname,
        });
        const newClaims = { role, _id };

        if (role === "recruiter") {
          if (req.body.companyId) {
            Object.assign(newClaims, {
              companyId: req.body.companyId,
              company: true,
              isAdmin: false,
            });
            await User.findByIdAndUpdate(_id, {
              company: req.body.companyId,
            });
          } else {
            Object.assign(newClaims, { company: false });
          }

          await RecruiterFilters.create({
            userId: _id,
          });
        } else {
          await UserFilters.create({
            userId: _id,
          });

          await Response.create({
            userId: _id,
          });

          Object.assign(newClaims, { onboarding: false });
        }

        claims = await setClaims(userId, newClaims);
      }
      res.status(201).json({ status: "success", data: { claims } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async singUpLinkedin(req, res) {
    try {
      const { code, role } = req.body;

      const data = await axios.post(
        `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&client_id=${LINKEDIN_CLIENT_ID}&client_secret=${LINKEDIN_CLIENT_SECRET}&redirect_uri=${LINKEDIN_CALLBACK_URL}`,
        {
          grant_type: "authorization_code",
          code,
          redirect_uri: LINKEDIN_CALLBACK_URL,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
        },
      );

      const accessToken = data.data.access_token;
      const userProfile = await axios.get(
        "https://api.linkedin.com/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const linkedinUserData = userProfile.data;

      let firebaseUser = await getUserByEmail(linkedinUserData.email);
      let userClaims = firebaseUser?.customClaims;

      if (!firebaseUser) {
        firebaseUser = await createUser({
          email: linkedinUserData.email,
          emailVerified: linkedinUserData.email_verified,
          name: linkedinUserData.given_name,
          surname: linkedinUserData.family_name,
          displayName: linkedinUserData.name,
          photoURL: linkedinUserData.picture,
          providerData: [
            {
              uid: linkedinUserData.sub,
              displayName: linkedinUserData.name,
              email: linkedinUserData.email,
              photoURL: linkedinUserData.picture,
              providerId: "linkedin.com",
            },
          ],
        });

        const isUserExist = await User.findOne({ uid: firebaseUser.uid });

        const name = firebaseUser?.displayName
          ? firebaseUser.displayName.split(" ")[0]
          : "";

        const surname = firebaseUser?.displayName
          ? firebaseUser.displayName.split(" ")[1]
          : "";

        if (!isUserExist) {
          const { _id } = await User.create({
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "",
            uid: firebaseUser.uid,
            photo: firebaseUser.photoURL || "",
            role: role,
            name,
            surname,
          });

          await UserFilters.create({
            userId: _id,
          });

          await Response.create({
            userId: _id,
          });

          await setClaims(firebaseUser.uid, { _id, role });
        }
      }

      const token = await getCustomToken(firebaseUser.uid);

      res.status(201).json({ status: "success", data: { token } });
    } catch (e) {
      console.log(e);
      res.status(400).json(e.message);
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await getUsersList();
      res.status(201).json(users);
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async deleteUserById(req, res) {
    try {
      const { userId } = req.body;
      const users = await deleteUsersInBatches(20);
      res.status(201).json(users);
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async setClaims(req, res) {
    try {
      const { userId } = req.body;
      const users = await setClaims(userId, { role: "admin" });
      console.log(users);
      res.status(201).json(users);
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async getUserToken(req, res) {
    try {
      const { uid } = req.body;
      const users = await signInWithCustomToken(uid);
      res.status(201).json(users);
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async getMyProfile(req, res) {
    try {
      const { _id } = req.user;
      const user = await User.findById(_id).populate("company");

      res.status(201).json({ status: "success", data: { user } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async getUserInfo(req, res) {
    try {
      const _id = req.params.id;
      const user = await User.findById(_id).select(
        "email firstName lastName middleName jobData educationData achievements phone resume image",
      );

      const filters = await UserFilters.findOne({ userId: _id });

      res.status(201).json({ status: "success", data: { user, filters } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async getRecruiterInfo(req, res) {
    try {
      const _id = req.params.id;
      const user = await User.findById(_id)
        .select("email firstName lastName middleName position phone company")
        .populate({
          path: "company",
          select: "companyName companyDescription companyWebsite",
        });

      res.status(201).json({ status: "success", data: { user } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async getUserFilters(req, res) {
    try {
      const { _id } = req.user;
      const filters = await UserFilters.findOne({ userId: _id });

      res.status(201).json({ status: "success", data: { filters } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async getRecruiterFilters(req, res) {
    try {
      const { _id } = req.user;
      const filters = await RecruiterFilters.findOne({ userId: _id });

      res.status(201).json({ status: "success", data: { filters } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async updateUsersFilters(req, res) {
    try {
      const { _id } = req.user;
      const {
        activity,
        position,
        experience,
        workFormat,
        employmentType,
        businessTrip,
        relocate,
        location,
        skills,
        keyWords,
        languages,
        salary,
      } = req.body;

      const filters = await UserFilters.findOneAndUpdate(
        { userId: _id },
        {
          activity,
          position,
          experience,
          workFormat,
          employmentType,
          businessTrip,
          relocate,
          location,
          skills,
          keyWords,
          languages,
          salary,
        },
        { new: true },
      );

      res.status(201).json({ status: "success", data: { filters } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async updateRecruiterFilters(req, res) {
    try {
      const { _id } = req.user;
      const { activity, keyWords, templates } = req.body;

      const filters = await RecruiterFilters.findOneAndUpdate(
        { userId: _id },
        {
          activity,
          keyWords,
          templates,
        },
        { new: true },
      );

      res.status(201).json({ status: "success", data: { filters } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async getUserResponses(req, res) {
    try {
      const { _id } = req.user;
      const response = await Response.findOne({ userId: _id });

      res.status(201).json({ status: "success", data: { response } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async updateUsersResponse(req, res) {
    try {
      const { _id } = req.user;
      const { resume, coverLetter, templates } = req.body;

      const response = await Response.findOneAndUpdate(
        { userId: _id },
        {
          resume,
          coverLetter,
          templates,
        },
        { new: true },
      );

      res.status(201).json({ status: "success", data: { response } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async updateEmployeeProfile(req, res) {
    try {
      const {
        firstName,
        lastName,
        middleName,
        phone,
        achievements,
        jobData,
        educationData,
        socialNetworks,
      } = req.body;

      const { _id } = req.user;

      const user = await User.findOneAndUpdate(
        { _id: _id },
        {
          firstName,
          lastName,
          middleName,
          phone,
          achievements,
          jobData,
          educationData,
          socialNetworks,
        },
        { new: true },
      );

      if (!user) {
        throw Error("No user in DB");
      }

      res.status(201).json({ status: "success", data: { user } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async updateRecruiterProfile(req, res) {
    try {
      const {
        firstName,
        lastName,
        middleName,
        position,
        phone,
        socialNetworks
      } = req.body;

      const { _id } = req.user;

      const user = await User.findOneAndUpdate(
        { _id: _id },
        {
          firstName,
          lastName,
          middleName,
          position,
          phone,
          socialNetworks
        },
        { new: true },
      ).populate("company");

      if (!user) {
        throw Error("No user in DB");
      }

      res.status(201).json({ status: "success", data: { user } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },

  async setUserOnboarding(req, res) {
    try {
      const {
        categories,
        skills,
        experience,
        workFormat,
        location,
        employmentType,
        benefits,
      } = req.body;

      const { _id, uid } = req.user;

      await UserFilters.findOneAndUpdate(
        { userId: _id },
        {
          categories,
          skills,
          experience,
          workFormat,
          location,
          employmentType,
          benefits,
        },
        { new: true },
      );

      await setClaims(uid, { onboarding: true });

      res.status(201).json({ status: "success", data: { user } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },
};
