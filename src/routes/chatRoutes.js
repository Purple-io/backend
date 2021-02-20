import { Router } from 'express';
import { sendMessage } from '../controllers/chat.js';
const SECRET_KEY = process.env.SECRET_KEY;


const router = Router();
router.use('/', verifyAuthToken);
router.route('/send').post(sendMessage);
router.route('/getMessages').get(getMessages);
router.route('/delete').delete(deleteMessage);

// middleware function that validates user is signed in with an auth token
function verifyAuthToken(req, res, next) {
    const tokenString = req.headers['authorization']
    if (tokenString) {
        const token = tokenString.split(' ')[1]
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
              return res.sendStatus(403)
            } 
            req.user = user
            next() 
          })
    } else {
        return res.sendStatus(403)
    }
}

export default router;
