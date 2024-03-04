const axios = require("axios");
const User = require("../models/User");
const UserFilters = require("../models/UserFilters");
const Response = require("../models/Response");
const {
  getUsersList,
  createUser,
  getCustomToken,
  setClaims,
  deleteUserByEmail,
  getUserByEmail,
  getUserByUid,
  signInWithCustomToken,
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

      const name = user?.displayName ? user.displayName.split(" ")[0] : "";

      const surname = user?.displayName ? user.displayName.split(" ")[1] : "";

      if (!isUserExist) {
        const { _id } = await User.create({
          email: user.email || "",
          displayName: user.displayName || "",
          uid: userId,
          photo: user.photoURL || "",
          role: role,
          name,
          surname,
        });

        claims = await setClaims(userId, { _id, role });
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

        userClaims = await setClaims(firebaseUser.uid, { role });
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
      const users = await deleteUserByEmail(userId);
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

  async getUserInfo(req, res) {
    try {
      const { _id } = req.user;
      const user = await User.findById(_id);

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
        skils,
        keyWords,
        languages,
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
          skils,
          keyWords,
          languages,
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

  async updateUserProfile(req, res) {
    try {
      const {
        firstName,
        lastName,
        middleName,
        phone,
        achievements,
        jobData,
        educationData,
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
          },
           {new: true}
        );

        if (!user) {
          throw Error("No user in DB");

        }

      res.status(201).json({ status: "success", data: { user } });
    } catch (e) {
      res.status(400).json(e.message);
    }
  },
};
