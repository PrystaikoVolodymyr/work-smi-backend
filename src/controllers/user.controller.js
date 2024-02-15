const axios = require("axios");

const {LINKEDIN_CLIENT_SECRET, LINKEDIN_CALLBACK_URL, LINKEDIN_CLIENT_ID } = require('../config/config')

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
      const { code } = req.body;

      const data = await axios.post(
        `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&client_id=${LINKEDIN_CLIENT_ID}&client_secret=${LINKEDIN_CLIENT_SECRET}&redirect_uri=${LINKEDIN_CALLBACK_URL}`,
        {
          grant_type: 'authorization_code',
          code,
          redirect_uri: LINKEDIN_CALLBACK_URL,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET
        },
      );

      const accessToken = data.data.access_token
        const userProfile = await axios.get(
            'https://api.linkedin.com/v2/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

      console.log(userProfile.data)
        res.status(201).json("data");
    } catch (e) {
        console.log(e)
      res.status(400).json(e.message);
    }
  },
};
