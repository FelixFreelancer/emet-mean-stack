import * as mongoose from 'mongoose';
import { ItemSchema } from '../models/itemModel';
import { UserSchema } from '../models/userModel';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as multer from 'multer';
const dateTime = require('node-datetime');

const Item = mongoose.model('Item', ItemSchema);
const User = mongoose.model('User', UserSchema);

const itemImageStore = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/item');
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + '.' + file.originalname);
	}
});

const itemImageUpload = multer({ storage: itemImageStore }).single('file');

export class ItemController {
	public addItem(req: Request, res: Response) {
		let itemData = req.body;
		let item = new Item(itemData);
		item.save((error, registeredUser) => {
			if (error) {
				console.log(error);
			} else {
				res.status(200).send({ msg: 'Added Successfully' });
			}
		});
	}

	public uploadPicture(req: Request, res: Response) {
		itemImageUpload(req, res, function(err) {
			if (err) {
				return res.status(501).json({ error: err });
			}
			const realFileName = req['file'].filename;
			return res.json({ fileName: realFileName });
		});
	}

	public getItemsForSearch(req: Request, res: Response) {
		const perPage = 6;
		const page = req.params.page || 1;
		const searchText = req.body.searchText;
		const matchCondition = {
			$or: [
				{ type: { $regex: searchText, $options: 'i' } },
				{ geoCountry: { $regex: searchText, $options: 'i' } },
				{ details: { $regex: searchText, $options: 'i' } },
				{ about: { $regex: searchText, $options: 'i' } },
				{ activity: { $regex: searchText, $options: 'i' } },
				{ interest: { $regex: searchText, $options: 'i' } }
			]
		};
		Item.find(matchCondition)
			.sort({ updateDate: -1 })
			.skip(perPage * page - perPage)
			.limit(perPage)
			.exec((err, items) => {
				if (err) {
					res.send(err);
				} else {
					Item.find(matchCondition).exec(function(err, count) {
						if (err) {
							return res.json({ error: 'cant calculate the items count' });
						}
						for (let i = 0; i < items.length; i++) {
							items[i].id = items[i]._id;
						}
						return res.send({
							item: items,
							current: page,
							pages: Math.ceil(count.length / perPage)
						});
					});
				}
			});
	}

	public getItemsByPage(req: Request, res: Response) {
		const perPage = 8;
		const page = req.params.page || 1;
		let user_id_condition =
			req.body.send_user_id == '' || req.body.send_user_id == undefined ? {} : { user_id: req.body.send_user_id };
		let match = {
			fromAmount: {
				$gte: req.body.fromAmount
			},
			toAmount: {
				$lte: req.body.toAmount
			}
		};
		if (req.body.send_user_id != '' && req.body.send_user_id != undefined) {
			match['user_id'] = {
				$eq: req.body.send_user_id
			};
		}
		if (req.body.type != 'All') {
			match['type'] = {
				$in: req.body.type.split(',')
			};
		}
		if (req.body.interest != 'All') {
			match['interest'] = {
				$in: req.body.interest.split(',')
			};
		}
		if (req.body.activity != 'All') {
			match['activity'] = {
				$in: req.body.activity.split(',')
			};
		}
		if (req.body.geoCountry != 'All') {
			match['geoCountry'] = {
				$in: req.body.geoCountry.split(',')
			};
		}
		Item.aggregate()
			.match(match)
			.sort({ updateDate: -1 })
			.skip(perPage * page - perPage)
			.limit(perPage)
			.exec(function(err, items) {
				Item.aggregate().match(match).exec(function(err, count) {
					if (err) {
						return res.json({ error: 'cant calculate the items count' });
					}
					return res.send({
						item: items,
						current: page,
						pages: Math.ceil(count.length / perPage)
					});
				});
			});
	}

	public removeItems(req: Request, res: Response) {
		let ids = req.params.ids;
		ids = JSON.parse(ids);
		Item.deleteMany({ _id: { $in: ids } }, (err) => {
			if (err) {
				res.send(err);
			} else {
				return res.json({ msg: 'deleted successfully' });
			}
		});
	}

	public getItemById(req: Request, res: Response) {
		Item.findById(req.params.id, (err, item) => {
			if (err) console.log(err);
			else {
				if (res.headersSent) {
					res.end(item);
				} else {
					res.json(item);
				}
			}
		});
	}

	public getDisplayItemById(req: Request, res: Response) {
		Item.findById(req.params.id, (err, item) => {
			if (err) console.log(err);
			else {
				const user_id = item.user_id;
				User.findById(user_id, (err, user) => {
					if (err) {
						return res.json({ item: item });
					} else {
						return res.json({ item: item, user: user });
					}
				});
			}
		});
	}

	public updateItem(req: Request, res: Response) {
		Item.findById({ _id: req.params.id }, (err, item) => {
			item.type = req.body.type;
			item.about = req.body.about;
			item.interest = req.body.interest;
			item.activity = req.body.activity;
			item.geoCountry = req.body.geoCountry;
			item.geoCity = req.body.geoCity;
			item.fromAmount = req.body.fromAmount;
			item.toAmount = req.body.toAmount;
			item.video = req.body.video;
			item.details = req.body.details;
			item.picture = req.body.picture;
			item.extraBlob = '1';

			const dt = dateTime.create();
			const formatUpdateDate = dt.format('Y-m-d H:M:S');
			item.updateDate = formatUpdateDate;

			item
				.save()
				.then((item) => {
					res.json('Update done');
				})
				.catch((err) => {
					res.status(400).send('Update failed');
				});
		});
	}
}
