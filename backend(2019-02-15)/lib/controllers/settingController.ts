import * as mongoose from 'mongoose';
import { UserSchema } from '../models/userModel';
import { ItemSchema } from '../models/itemModel';
import { AvatarSchema, FirstNameSchema, LastNameSchema, CitySchema, CountrySchema, CompanyNameSchema,
		 JobTitleSchema, PhoneNumberSchema, FacebookSchema, LinkdinSchema, EmailSchema, CommentsSchema } from '../models/userDummyModel';
import {PictureSchema, DetailsSchema, AboutSchema, VideoSchema} from '../models/itemDummyModel'		 
import { Request, Response } from 'express';
import { Conf } from '../conf';
import * as jwt from 'jsonwebtoken';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from "bcrypt-nodejs";


const User = mongoose.model('User', UserSchema);
const Item = mongoose.model('Item', ItemSchema);
//define schema for user dummy
const Avatar = mongoose.model('Avatar', AvatarSchema);
const FirstName = mongoose.model('FirstName', FirstNameSchema);
const LastName  = mongoose.model('LastName', LastNameSchema);
const City = mongoose.model('City', CitySchema);
const Country = mongoose.model('Country', CountrySchema);
const CompanyName = mongoose.model('CompanyName', CompanyNameSchema);
const JobTitle = mongoose.model('JobTitle', JobTitleSchema);
const PhoneNumber = mongoose.model('PhoneNumber', PhoneNumberSchema);
const Facebook = mongoose.model('Facebook', FacebookSchema);
const Linkdin = mongoose.model('Linkdin', LinkdinSchema);
const Email = mongoose.model('Email', EmailSchema);
const Comments = mongoose.model('Comments', CommentsSchema);

//define for item dummy
const Picture = mongoose.model('Picture', PictureSchema);
const Details = mongoose.model('Details', DetailsSchema);
const About = mongoose.model('About', AboutSchema);
const Video = mongoose.model('Video', VideoSchema);




export class SettingController {
	public loadAvatarFromLocalToDb(req: Request, res: Response) {
		const imagePath = Conf.avatarDummyURL;
		let items_path = [];
		fs.readdir(imagePath, function(err, items) {
			items_path = items;
			if(err){
				return res.status(403)
			}else{
				items_path.forEach(function(item){
					let type = '';
					if(item.split('.').length){
						type = item.split('.')[item.split('.').length - 1];
						if(type === 'jpeg' || type === 'png' || type === 'jpg') {
							fs.readFile(imagePath + item,  function (error,data) {
								const imageData = data;
								let avatar = new Avatar({name: item, data: imageData, contentType: 'image/' + type});
								avatar.save((error, avatar) => {
									if (error) {
										console.log(error);
									} else {
									}
								});
							});
							
						}
					}
					
				});
				
			}
		});
		
		
	}

	public loadPictureFromLocalToDb(req: Request, res: Response) {
		const imagePath = Conf.itemPictureDummyURL;
		let items_path = [];
		fs.readdir(imagePath, function(err, items) {
			items_path = items;
			if(err){
				return res.status(403)
			}else{
				items_path.forEach(function(item){
					let type = '';
					if(item.split('.').length){
						type = item.split('.')[item.split('.').length - 1];
						if(type === 'jpeg' || type === 'png' || type === 'jpg') {
							fs.readFile(imagePath + item,  function (error,data) {
								const imageData = data;
								let picture = new Picture({name: item, data: imageData, contentType: 'image/' + type});
								picture.save((error, picture) => {
									if (error) {
										console.log(error);
									} else {
									}
								});
							});
							
						}
					}
					
				});
				
			}
		});
		
		
	}

	public displayPictureFromFS(req: Request, res: Response) {
		Picture.findOne({name:req.params.filename}, function (err, image) {
			if (err) {
				return res.status(404).send({'error' : 'not founding item images'});
			}else{
				res.contentType(image.contentType);
				res.send(image.data);
			}
		});
			
	}

	public displayAvatarFromFS(req: Request, res: Response) {
		Avatar.findOne({name:req.params.filename}, function (err, image) {
			if (err) {
				return res.status(404).send({'error' : 'not founding avatar images'});
			}else{
				res.contentType(image.contentType);
				res.send(image.data);
			}
		});
			
	}

	public loadFromLocalToDb = (req: Request, res: Response) => {
		this.loadAvatarFromLocalToDb(req, res);
		this.loadPictureFromLocalToDb(req, res);
		const jsonDir = Conf.jsonDummyURL;
		fs.readdirSync(jsonDir).forEach(function (file) {
			let data = fs.readFileSync(jsonDir + file).toString();
			if(file === "city.json"){
				City.deleteMany({}, function(err){});
				new City({city: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}
			if(file === "comments.json"){
				Comments.deleteMany({}, function(err){});
				new Comments({comments: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}
			if(file === "companyName.json"){
				CompanyName.deleteMany({}, function(err){});
				new CompanyName({companyName: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}
			if(file === "country.json"){
				Country.deleteMany({}, function(err){});
				new Country({country: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}
			if(file === "email.json"){
				Email.deleteMany({}, function(err){});
				new Email({email: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}
			if(file === "facebook.json"){
				Facebook.deleteMany({}, function(err){});
				new Facebook({facebook: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}
			if(file === "firstName.json"){
				FirstName.deleteMany({}, function(err){});
				new FirstName({firstName: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}
			if(file === "jobTitle.json"){
				JobTitle.deleteMany({}, function(err){});
				new JobTitle({jobTitle: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}
			if(file === "lastName.json"){
				LastName.deleteMany({}, function(err){});
				new LastName({lastName: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}
			if(file === "linkdin.json"){
				Linkdin.deleteMany({}, function(err){});
				new Linkdin({linkdin: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}
			if(file === "phoneNumber.json"){
				PhoneNumber.deleteMany({}, function(err){});
				new PhoneNumber({phoneNumber: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}

			if(file === "video.json"){
				Video.deleteMany({}, function(err){});
				new Video({video: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}
			if(file === "details.json"){
				Details.deleteMany({}, function(err){});
				new Details({details: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}
			if(file === "about.json"){
				About.deleteMany({}, function(err){});
				new About({about: data}).save().catch((err)=>{
					console.log(err.message);
				});
			}

		});
		return res.status(200).send({'msg': 'read jsons successfully'});
	}

	public async createDummyData(req: Request, res: Response) {
		const userCount = req.params.userCount;
		const itemCount = req.params.itemCount;
		let about = [], city = [], comments = [], companyName = [], country = [], details = [], email = [],
					facebook = [], firstName = [], jobTitle = [], lastName = [], linkdin = [], phoneNumber = [], video = [],
					avatar = [], item_picture = [];
		let interest = Conf.interestArr;
		let type = Conf.typeArr;		
		let activity = Conf.activityArr;	
		let not_found_flag = false;
		About.find({}, (err, about_arr) => {
			if(err){ return res.send({'error' : 'not found about'});}
			else{
				if(about_arr[0] == undefined || about_arr[0].about == undefined){
					not_found_flag = true;
				}else{
					about = JSON.parse(about_arr[0].about);
				}
			}
			if(about.length == 0) not_found_flag = true;
		});			
		Details.find({}, (err, details_arr) => {
			if(err){ return res.send({'error' : 'not found details'});}
			else{
				if(details_arr[0] == undefined || details_arr[0].details == undefined){
					not_found_flag = true;
				}else{
					details = JSON.parse(details_arr[0].details);
				}
			}
			if(details.length == 0) not_found_flag = true;
		});
		City.find({}, (err, city_arr) => {
			if(err){ return res.send({'error' : 'not found city'});}
			else{
				if(city_arr[0] == undefined || city_arr[0].city == undefined){
					not_found_flag = true;
				}else{
					city = JSON.parse(city_arr[0].city);
				}
			}
			if(city.length == 0) not_found_flag = true;
		});	
		Comments.find({}, (err, comments_arr) => {
			if(err){ return res.send({'error' : 'not found comments'});}
			else{
				if(comments_arr[0] == undefined || comments_arr[0].comments == undefined){
					not_found_flag = true;
				}else{
					comments = JSON.parse(comments_arr[0].comments);
				}
			}
			if(comments.length == 0) not_found_flag = true;
		});
		CompanyName.find({}, (err, companyName_arr) => {
			if(err){ return res.send({'error' : 'not found companyName'});}
			else{
				if(companyName_arr[0] == undefined || companyName_arr[0].companyName == undefined){
					not_found_flag = true;
				}else{
					companyName = JSON.parse(companyName_arr[0].companyName);
				}
			}
			if(companyName.length == 0) not_found_flag = true;
		});
		Country.find({}, (err, country_arr) => {
			if(err){ return res.send({'error' : 'not found country'});}
			else{
				if(country_arr[0] == undefined || country_arr[0].country == undefined){
					not_found_flag = true;
				}else{
					country = JSON.parse(country_arr[0].country);
				}
			}
			if(country.length == 0) not_found_flag = true;
		});
		Email.find({}, (err, email_arr) => {
			if(err){ return res.send({'error' : 'not found email'});}
			else{
				if(email_arr[0] == undefined || email_arr[0].email == undefined){
					not_found_flag = true;
				}else{
					email = JSON.parse(email_arr[0].email);
				}
			}
			if(email.length == 0) not_found_flag = true;
		});
		Facebook.find({}, (err, facebook_arr) => {
			if(err){ return res.send({'error' : 'not found facebook'});}
			else{
				if(facebook_arr[0] == undefined || facebook_arr[0].facebook == undefined){
					not_found_flag = true;
				}else{
					facebook = JSON.parse(facebook_arr[0].facebook);
				}
			}
			if(facebook.length == 0) not_found_flag = true;
		});
		FirstName.find({}, (err, firstname_arr) => {
			if(err){ return res.send({'error' : 'not found firstname'});}
			else{
				if(firstname_arr[0] == undefined || firstname_arr[0].firstName == undefined){
					not_found_flag = true;
				}else{
					firstName = JSON.parse(firstname_arr[0].firstName);
				}
			}
			if(firstName.length == 0) not_found_flag = true;
		});
		JobTitle.find({}, (err, jobtitle_arr) => {
			if(err){ return res.send({'error' : 'not found jobTitle'});}
			else{
				if(jobtitle_arr[0] == undefined || jobtitle_arr[0].jobTitle == undefined){
					not_found_flag = true;
				}else{
					jobTitle = JSON.parse(jobtitle_arr[0].jobTitle);
				}
			}
			if(jobTitle.length == 0) not_found_flag = true;
		});
		LastName.find({}, (err, lastname_arr) => {
			if(err){ return res.send({'error' : 'not found lastname'});}
			else{
				if(lastname_arr[0] == undefined || lastname_arr[0].lastName == undefined){
					not_found_flag = true;
				}else{
					lastName = JSON.parse(lastname_arr[0].lastName);
				}
			}
			if(lastName.length == 0) not_found_flag = true;
		});
		Linkdin.find({}, (err, linkdin_arr) => {
			if(err){ return res.send({'error' : 'not found linkdin'});}
			else{
				if(linkdin_arr[0] == undefined || linkdin_arr[0].linkdin == undefined){
					not_found_flag = true;
				}else{
					linkdin = JSON.parse(linkdin_arr[0].linkdin);
				}
			}
			if(linkdin.length == 0) not_found_flag = true;
		});
		PhoneNumber.find({}, (err, phonenumber_arr) => {
			if(err){ return res.send({'error' : 'not found phonenumber'});}
			else{
				if(phonenumber_arr[0] == undefined || phonenumber_arr[0].phoneNumber == undefined){
					not_found_flag = true;
				}else{
					phoneNumber = JSON.parse(phonenumber_arr[0].phoneNumber);
				}
			}
			if(phoneNumber.length == 0) not_found_flag = true;
		});
		
		avatar = await Avatar.find({}).select('name -_id').exec();
		item_picture = await Picture.find({}).select('name -_id').exec();
		let video_arr = await Video.find({}).exec();
		if(video_arr[0] == undefined || video_arr[0].video == undefined){
			not_found_flag = true;
		}else{
			video = JSON.parse(video_arr[0].video);
		}
		if(not_found_flag) return res.status(200).json({'error_not_found': 'no record on monogoDB'});
		for(let i = 0; i < userCount; i++){
			let user = {firstName: '', lastName: '', email: '', city: '', country: '', companyName: '', jobTitle: '',
						phoneNumber: '', facebook: '', linkdin: '', password: '$2a$05$UqOjSefrLgyPzNLrBZ/YEeGfSdK.LxFcDIEdZyT/Kzl38Z3tAmtAe',
						comments: '', extraBlob: '2', picture: 'default.png'};
			user.firstName=firstName[i % firstName.length].firstName;
			user.lastName=lastName[i % lastName.length].lastName;
			user.email=email[i % email.length].email;
			user.city=city[i % city.length].city;
			user.country=country[i % country.length].country;
			user.companyName=companyName[i % companyName.length].companyName;
			user.jobTitle=jobTitle[i % jobTitle.length].jobTitle;
			user.phoneNumber=phoneNumber[i % phoneNumber.length].phoneNumber;
			user.facebook=facebook[i % facebook.length].facebook;
			user.linkdin=linkdin[i % linkdin.length].linkdin;
			user.comments=comments[i % comments.length].comments;
			user.picture = avatar[i % avatar.length].name;
			user.extraBlob = '2';

			let user_schema = new User(user);
			let inserted_user_id = '';
			const result = await user_schema.save((err, user) => {
				inserted_user_id = user._id;
				for(let j = 0; j < itemCount; j++){
					let item = {user_id: inserted_user_id, type: '', about: '', interest: '', activity: '', geoCountry: '',
								geoCity: '', fromAmount:1000, toAmount:10001, video: '', details: '', extraBlob: '2', picture: 'default.png'};
					item.type = type[j % type.length];
					item.interest = interest[j % interest.length];
					item.activity = activity[j % activity.length];
					item.about = about[j % about.length].about;
					item.geoCountry = country[j % country.length].country;
					item.geoCity = city[j % city.length].city;
					item.video = video[j % video.length].video;
					item.details = details[j % details.length].details;
					item.picture = item_picture[j % item_picture.length].name;
					let fromNum: number = (1000 + j*2)*10;
					let toNum: number = (2000 + j*4)*10;;
					item.fromAmount = fromNum;
					item.toAmount = toNum;
					let item_schema = new Item(item);
					const item_result = item_schema.save(function(err, item){
					});
				}

			});
		}
		return res.status(200).send({'msg': 'create dummy data successfully'});

	}
}