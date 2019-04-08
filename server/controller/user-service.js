const [axios, User, question] = [
  require("axios"),
  require("../model/user.js"),
  require("./questions.js")
];
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const jwt = require("jsonwebtoken");

class Controller {
  static async login(req, res) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload["sub"];
      // If request specified a G Suite domain:
      //const domain = payload['hd'];
      // }
      const isUser = await User.findOne({ email: payload.email });

      if (!isUser) {
        const createUser = await User.create({
          email: payload.email,
          name: payload.name
        });
        jwt.sign(
          {
            email: payload.email,
            name: payload.name
          },
          process.env.SECRET_KEY,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) {
              res.status(500).json({ err: err });
            } else {
              res.status(200).json(token);
            }
          }
        );
      } else {
        jwt.sign(
          {
            email: payload.email,
            name: payload.name
          },
          process.env.SECRET_KEY,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) {
              res.status(500).json({ err: err });
            } else {
              res.status(202).json(token);
            }
          }
        );
      }
    } catch (e) {
      res.status(500).json({ err: e.message });
    }
  }

  static question(req, res) {
    res.status(200).json(question);
  }
}

module.exports = Controller;
