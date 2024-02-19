const axios = require("axios");

const {
  getUsersList,
  createUser,
  deleteUserByUid,
  getCustomToken,
  signInWithCustomToken,
  setClaims,
  deleteUserByEmail,
    getUserByEmail
} = require("../service/firebase.service");
const {
  LINKEDIN_CLIENT_SECRET,
  LINKEDIN_CALLBACK_URL,
  LINKEDIN_CLIENT_ID,
} = require("../config/config");

module.exports = {
  async signUpUser(req, res) {
    try {
      const {} = req.body;

      res.status(201).json();
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

      let firebaseUser = await getUserByEmail(linkedinUserData.email)
      let userClaims = firebaseUser?.customClaims

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

      res.status(201).json({ token });
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
};
