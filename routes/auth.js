const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.Controller');
const bodyParser = require('body-parser')
router.use(bodyParser.json())
// router.post('/login',[validateLoginRequest], (req, res,next) => {
// 	connection.query('select * from user where email = ?',[req.body.email],(err,result,field)=>{
// 		if(result.length == 1){
// 			if (result[0].password == hashPasswordWithSalt(req.body.password,result[0].salt).password)
// 			{
// 				res.json({accessToken : signToken(result[0])})
// 			} else {
// 				res.status(401).json({message :'Email or password not correct'})
// 			}
// 		} else {
// 			res.status(400).json({message :'user not exist'})
// 		}
// 	})
// })
router.post('/login',AuthController.login)
router.post('/register',AuthController.register)
router.put('/:id',AuthController.updateUserInfo)
router.delete('/:id',AuthController.deleteUser)
// router.post('/forgot-password',async (req, res,next) => {
// 	try{
// 		await mailServices.sendMail({
// 			from:req.body.from, 
// 			to:req.body.to,
// 			subject: "hi",
// 			text: "text"
// 		})
// 		res.send("Success")
// 	} catch (e){
// 		console.log(e);
// 		res.status(500).json({message: "Error"})
// 	}
// })
module.exports = router;