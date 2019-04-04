import * as mongoose from 'mongoose';
import { UserSchema } from '../models/userModel';
import { ItemSchema } from '../models/itemModel';
import { Request, Response } from 'express';
import * as request from 'request';
import * as jwt from 'jsonwebtoken';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from "bcrypt-nodejs";
import * as crypto from "crypto";
const dateTime = require('node-datetime');
import * as nodeemailer from "nodemailer";
import * as gridfsstorage from "multer-gridfs-storage";
import * as Grid from "gridfs-stream";
import { Conf } from '../conf';
import { GridFSBucket } from 'mongo';
const User = mongoose.model('User', UserSchema);
const Item = mongoose.model('Item', ItemSchema);
let isDefault = false;
const SALT_FACTOR = 5;
const node_host = Conf.nodeHost   
const remote_mongo = Conf.mongoURL;
const mail_user_name = Conf.mailUserName;     
const mail_user = Conf.mailUser;          
const mail_pass = Conf.mailPassword;         
const mail_port = Conf.mailPort;     
const avatarStore = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './uploads/avatar');
    },
    filename:function(req,file,cb){
        cb(null, Date.now()+'.'+file.originalname);
    }
});
const storage = new gridfsstorage({
	url: remote_mongo,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
				return reject(err);
				}
				let fileNamePrefix = buf.toString('hex');
				if(isDefault){
				}
				const filename = fileNamePrefix + path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: 'uploads'
				};
				resolve(fileInfo);
			});
		});
	}
});

const upload = multer({ storage }).single('file');


const avatarUpload = multer({storage:avatarStore}).single('file');


export class UserController {
	public signUP(req: Request, res: Response) {
		let userData = req.body;
		User.findOne({ email: userData.email }, (error, user) => {
			if (error) {
				console.log(error);
			} else {
				if (user) {
					return res.status(400).send('Already Exist');
				}else{
					bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
						if (err){
							return res.status(401).send('password salt for cryption  failed');
						}else{
							bcrypt.hash(userData.password, salt, null, function(err, hash) {
								if (err) {
									return res.status(401).send('password cryption  failed');
								}
								else{
									userData.password = hash;
									userData.ipAddress = req.connection.remoteAddress;
									let user = new User(userData);
									user.save((error, registeredUser) => {
										if (error) {
											console.log(error);
										} else {
											let payload = { user_id: registeredUser._id };
											let token = jwt.sign(payload, 'secretKey');
											res.status(200).send({ token });
										}
									});
								}
								
							  });
						} 
					  });
					
				}
			}
		});
		
	}

	public signIn(req: Request, res: Response) {
		let userData = req.body;

		User.findOne({ email: userData.email }, (error, user) => {
			if (error) {
				console.log(error);
			} else {
				if (!user) {
					res.status(401).send('Invalid email');
				} else {
					if(user.active === 1){
						res.status(401).send('deactived user');
					}else{
						bcrypt.compare(userData.password, user.password, function(err, match) {
							// res == true
							if(match){
								Item.find({user_id: user._id}, (err, item) => {
									if(err){

									}else{
										let payload = { user_id: user._id, role: user.role, item_ids: item.toString()};
										let token = jwt.sign(payload, 'secretKey');
										let role = user.role;
										let userName = user.firstName + " " + user.lastName;
										let userId = user._id;
										let picture = user.picture;
										let extraBlob = user.extraBlob;
										res.cookie('XSRF-TOKEN', userId);
										res.status(200).send({ token , role, userName, userId, picture, extraBlob});
										
									}
								});
								
							}else{
								res.status(401).send('Invalid password');
							}
						});
					}
				}
			}
		});
	}
	
	forgot = (req: Request, res: Response) => {
		let userData = req.body;
		User.findOne({ email: userData.emailForResetPassword }, (error, user) => {
			if (error) {
				console.log(error);
			} else {
				if (!user) {
					return res.status(401).send('Invalid email');
				} else {
					crypto.randomBytes(20, function(err, buf) {
						if(err){
							return res.status(401).send('Failed Creating Token');
						}else{
							const token = buf.toString('hex');
							user.resetPasswordToken = token;
							user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
							user.save((error, registeredUser) => {
								if (error) {
									return res.status(401).send('Failed Savi Token');
								} else {
									let smtpTransport = nodeemailer.createTransport({
										  service: 'gmail',
										  auth: {
											user: mail_user_name,
											pass: mail_pass
										  }
										});
										let mailOptions = {
										  to: user.email,
										  from: mail_user,
										  subject: 'Emet Website Password Reset',
										  html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.<br><br>' +
											'Please click on the following link, or paste this into your browser to complete the process:<br><br>' +
											 '<a href="'+node_host + "/#/auth/reset/" + token + '">' + node_host + "/auth/reset/" + token + '</a><br><br>' +
											'If you did not request this, please ignore this email and your password will remain unchanged.<br><br>'
										};
										smtpTransport.sendMail(mailOptions, function(err) {
										  if(err){
											  console.log(err);
										  }
										});
									return res.status(200).send({'msg' : 'Sent Successfully' });
								}
							});
						}
					});
					
				}
			}
		});
	}
	
	public sendEmail (token, email) {
		let smtpTransport = nodeemailer.createTransport({
		  host: "smtp.mailtrap.io",
		  port: 2525,
		  auth: {
			user: mail_user_name,
			pass: mail_pass
		  }
		});
		let mailOptions = {
		  to: email,
		  from: mail_user,
		  subject: 'Node.js Password Reset',
		  text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
			 + node_host + '/reset/' + token + '\n\n' +
			'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		};
		smtpTransport.sendMail(mailOptions, function(err) {
		  if(err){
			  console.log(err);
		  }
		});
	  }


	public reset(req: Request, res: Response) {
		let userData = req.body;

		User.findOne({ resetPasswordToken: userData.token }, (error, user) => {
			if (error) {
				console.log(error);
			} else {
				if (!user) {
					res.status(401).send('Invalid User');
				} else {
					bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
						if (err){
							return res.status(401).send('password salt for cryption  failed');
						}else{
							bcrypt.hash(userData.password, salt, null, function(err, hash) {
								if (err) {
									return res.status(401).send('password cryption  failed');
								}
								else{
									user.password = hash;
									user.resetPasswordToken = '';
									user.resetPasswordExpires = '';
									user.save((error, registeredUser) => {
										if (error) {
											console.log(error);
										} else {
											let payload = { subject: registeredUser._id };
											let token = jwt.sign(payload, 'secretKey');
											return res.status(200).send({ 'msg' : 'changed successfully' });
										}
									});
								}
							});
						} 
					});
					
				}
			}
		});
	}

	public validCaptchaUrl(req: Request, res: Response){
		const token = req.params.token;
		const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + Conf.captchaSecretKey + '&response=' + token + '&remoteip=' + req.connection.remoteAddress;
		request(verificationUrl, (error, response, body) => {
			body = JSON.parse(body);
			if (body.success !== undefined && !body.success) {
				return res.json({'responseCode': 1, 'responseDesc': 'Failed captcha verification'});
			}
			res.json({'responseCode': 0, 'responseDesc': 'Sucess'});
		});
	}

	public getUsers(req: Request, res: Response){
		User.find({}, (err, user) => {
            if(err){
                res.send(err);
			}
			for(let i = 0; i < user.length; i++){
				user[i].id = user[i]._id;
				user[i].userName = user[i].firstName + " " + user[i].lastName;
			}
            res.json(user);
        });
	}

	public getUserForSearch(req: Request, res: Response){
		const perPage = 6;
		const page = req.params.page || 1;
		const searchText = req.body.searchText;
		const matchCondition = {
			$or: [
				{ firstName: { $regex: searchText, $options: 'i' } },
				{ lastName: { $regex: searchText, $options: 'i' } },
				{ country: { $regex: searchText, $options: 'i' } },
				{ city: { $regex: searchText, $options: 'i' } },
				{ companyName: { $regex: searchText, $options: 'i' } },
				{ jobTitle: { $regex: searchText, $options: 'i' } }
			]
		};
		User.find(matchCondition)
			.sort({ updateDate: -1 })
			.skip(perPage * page - perPage)
			.limit(perPage)
			.exec((err, users) => {
				if (err) {
					res.send(err);
				} else {
					User.find(matchCondition).exec(function(err, count) {
						if (err) {
							return res.json({ error: 'cant calculate the items count' });
						}
						for (let i = 0; i < users.length; i++) {
							users[i].id = users[i]._id;
						}
						return res.send({
							user: users,
							current: page,
							pages: Math.ceil(count.length / perPage)
						});
					});
				}
			});
	}

	public getUsersByPage(req: Request, res: Response){
		const perPage = 8;
		const page = req.params.page || 1;
		const from_data = req.body.fromDate;
		const to_data = req.body.toDate;
		let match = {
			"registerDate" : {
     			"$gte": new Date(Number(from_data.split("-")[0]), Number(from_data.split("-")[1]) -1, Number(from_data.split("-")[2])),
     			"$lte": new Date(Number(to_data.split("-")[0]), Number(to_data.split("-")[1]) - 1, Number(to_data.split("-")[2]))
			}
		};
		if(req.body.country != 'All'){
			match["country"] = {
				"$in": req.body.country.split(',')
			};
		}
		User.aggregate().match(match)
		.sort({registerDate: -1})
		.skip((perPage * page) - perPage)
		.limit(perPage)
		.exec(function(err, users) {
            if(err){
                res.send(err);
			}
			User.aggregate().match(match)
			.exec(function(err, count) {
                if (err){
					return res.json({'error': 'cant calculate the users count'});
				}
                for(let i = 0; i < users.length; i++){
					users[i].id = users[i]._id;
					users[i].userName = users[i].firstName + " " + users[i].lastName;
				}
				return res.send({
					'user': users,
					'current': page,
					'pages': Math.ceil(count.length / perPage)
				});
            });
			
        });
	}

	public addUser(req: Request, res: Response) {
		let userData = req.body;
		bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
			if (err){
				return res.status(401).send('password salt for cryption  failed');
			}else{
				bcrypt.hash(userData.password, salt, null, function(err, hash) {
					if (err) {
						return res.status(401).send('password cryption  failed');
					}
					else{
						userData.password = hash;
						if(userData.picture == '') userData.picture = 'default.png';
						let user = new User(userData);
						user.save((error, registeredUser) => {
							if (error) {
								console.log(error);
							} else {
								res.status(200).send({'msg' : 'Added Successfully' });
							}
						});
					}
				});
			} 
		});
		
	}

	public getUserByID(req: Request, res: Response) {
		User.findById(req.params.id, (err, user) =>{
			if(err)
			console.log(err)
			else
			res.json(user);
		});  
	};


	public updateUser(req: Request, res: Response){
		User.findById({_id:req.params.id}, (err,user)=>{
			
			user.firstName=req.body.firstName;
			user.lastName=req.body.lastName;
			user.email=req.body.email;
			user.city=req.body.city;
			user.country=req.body.country;
			user.companyName=req.body.companyName;
			user.jobTitle=req.body.jobTitle;
			user.phoneNumber=req.body.phoneNumber;
			user.facebook=req.body.facebook;
			user.linkdin=req.body.linkdin;
			user.password=req.body.password;
			user.role=req.body.role;
			user.active=req.body.active;
			user.comments=req.body.comments;
			user.picture = req.body.picture;
			if(req.body.pictureChanged) user.extraBlob = '1';

			const dt = dateTime.create();
			const formatUpdateDate = dt.format('Y-m-d H:M:S');
			user.updateDate = formatUpdateDate;
	
			user.save().then(user=>{
				res.json('Update done');
			}).catch(err=>{
				res.status(400).send('Update failed');
			})
	});
	}

	public updateUserbyRegular(req: Request, res: Response){
		User.findById({_id:req.params.id}, (err,user)=>{
			
			user.firstName=req.body.firstName;
			user.lastName=req.body.lastName;
			user.email=req.body.email;
			user.city=req.body.city;
			user.country=req.body.country;
			user.companyName=req.body.companyName;
			user.jobTitle=req.body.jobTitle;
			user.phoneNumber=req.body.phoneNumber;
			user.facebook=req.body.facebook;
			user.linkdin=req.body.linkdin;
			user.password=req.body.password;
			user.comments=req.body.comments;
			user.picture = req.body.picture;
			user.extraBlob = '1';

			const dt = dateTime.create();
			const formatUpdateDate = dt.format('Y-m-d H:M:S');
			user.updateDate = formatUpdateDate;
	
			user.save().then(user=>{
				res.json('Update done');
			}).catch(err=>{
				res.status(400).send('Update failed');
			})
	});
	}

	public removeUser(req: Request, res: Response){
		User.findByIdAndRemove({_id:req.params.id},(err,user)=>
    	{
			if(err)
			res.json(err);
			else
			res.json('Remove successfully');
		})
	}

	public uploadPicture(req: Request, res: Response) {
		avatarUpload(req,res,function(err){
			if(err){
				return res.status(501).json({error:err});
			}
			const realFileName = req['file'].filename;
			return res.json({"fileName" : realFileName});
		});
	}

	public uploadPictureToMonogoose(req: Request, res: Response) {
		upload(req,res,function(err){
			if(err){
				return res.status(501).json({error:err});
			}
			const realFileName = req['file'].filename;
			return res.json({"fileName" : realFileName});
		})
	}

	public displayPicture(req: Request, res: Response){
	
		try{
			mongoose.connect(remote_mongo, { useNewUrlParser: true });
			const conn = mongoose.connection;
			Grid.mongo = mongoose.mongo;
			let gfs;
			gfs = Grid(conn.db);
			gfs.collection('uploads');
			gfs.files.find({ filename: req.params.filename }).toArray((err, files) => {
				// Check if file
				if (!files || files.length === 0) {
				  return res.status(404).json({
					err: 'No file exists'
				  });
				}
			
				// Check if image
				if (files[files.length - 1].contentType === 'image/jpeg' || files[files.length - 1].contentType === 'image/png') {
				  // Read output to browser
				  const readstream = gfs.createReadStream(files[files.length - 1].filename);
				  readstream.pipe(res);
				} else {
				  res.status(404).json({
					err: 'Not an image'
				  });
				}
			});
		}catch(e) {

		}
		
	}

	
}
