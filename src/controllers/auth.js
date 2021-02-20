import argon2 from 'argon2';
import Users from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { email, password, affiliation, firstName, lastName } = req.body;

  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
  });
  const existing_user = await Users.findOne({ email: email }).catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'There was an error with the database.' });
    return;
  });

  if (existing_user) {
    res.status(404).json({ error: 'This user already exists.' });
    return;
  }

  const data = {
    email,
    password: hashedPassword,
    affiliation,
    firstName,
    lastName,
  };

  const newUser = await Users.create(data).catch((err) => {
    console.error(err);
    res.status(500).json({
      error: 'There was an error signing up the user. Please try again!',
    });
    return;
  });
  res.status(200).json({ success: true, user: newUser });
};

export const login = (req, res) => {
  if (req.body === null) {
    throw console.error;
  }
  const inEmail = req.body.email;
  const inPassword = req.body.password;

  Users.findOne({ email: inEmail })
    .then((user) => {
      if (!user) {
        res.status(404).json({
          error: 'Email does not exist',
        });
        return;
      }
      argon2.verify(user.password, inPassword).then((isMatch) => {
        if (isMatch) {
          jwt.sign(
            { id: user.id },
            SECRET_KEY,
            { expiresIn: 2592000 },
            (err, token) => {
              if (err) {
                console.error(err);
                res
                  .status(500)
                  .json({ error: 'There was an error creating token' });
              }
              res.status(200).json({
                success: true,
                user,
                token: 'Bearer ' + token,
              });
            }
          );
        } else {
          res.status(400).json({ error: 'Password Incorrect' });
        }
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'There was an error with the database' });
    });
};
