import { Router } from 'express';
import {
  createChat,
  deleteMessage,
  getChat,
  getMessages,
  sendMessage,
  getAllChats,
  getAllPendingChats,
  censorSenderMessage,
  deleteChat,
  deletePendingChat
} from '../controllers/chat.js';
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY;

const router = Router();
router.use('/', verifyAuthToken);
router.route('/send').post(sendMessage);
// router.route('/createChat').post(createChat);
router.route('/getMessages').get(getMessages);
router.route('/getChat').get(getChat);
router.route('/getAllChats').get(getAllChats);
router.route('/getAllPendingChats').get(getAllPendingChats);
router.route('/delete').delete(deleteMessage);
router.route('/censorSenderMessage').post(censorSenderMessage);
router.route('/deleteChat').post(deleteChat);
router.route('/deletePendingChat').post(deletePendingChat);

// middleware function that validates user is signed in with an auth token
function verifyAuthToken(req, res, next) {
  const tokenString = req.headers['authorization'];
  if (tokenString) {
    const token = tokenString.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      console.log('user: ');
      console.log(req.user);
      next();
    });
  } else {
    return res.sendStatus(403);
  }
}

export default router;
