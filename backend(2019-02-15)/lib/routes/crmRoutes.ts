import {Request, Response, NextFunction} from "express";
import { UserController } from "../controllers/userController";
import { ItemController } from "../controllers/itemController";
import { SettingController } from "../controllers/settingController";
import { InMemory } from "../controllers/inMemory";
import * as path from 'path';
import * as jwt from 'jsonwebtoken';

export class Routes { 
    
    public userController: UserController = new UserController();
    public itemController: ItemController = new ItemController();
    public settingController: SettingController = new SettingController();
    public inMemory: InMemory = new InMemory();

    public checkToken(req: Request, res: Response){
        if(!req.headers.authorization){
            return res.status(401).end();
        }
        let token=req.headers.authorization.split(' ')[1];
        if(token === 'null'){
            return res.status(401).end();
        }
        let payload=jwt.verify(token,'secretKey');
        return payload;
    }
    verifyToken = (req: Request, res: Response, next) => {
        let payload = this.checkToken(req, res);
        if(!payload){
            return res.status(401).end()
        }
        else{
            next();
        }
    }

    verifyAdminToken = (req: Request, res: Response, next) => {
        let payload = this.checkToken(req, res);
        if(!payload){
            return res.status(401).end()
        }
        else if(payload.role != 1){
            return res.status(401).end()
        }
        else{
            next();
        }
    }
    verifyUserIDMatch = (req: Request, res: Response, next) => {
        let payload = this.checkToken(req, res);
        if(!payload){
            return res.status(401).end();
        }else if(payload.role == 1){
            next();
        }else{
            if(payload.user_id != req.params.id)
            {
                return res.status(401).end();
            }
            else{
                next();
            }
        }
    }
    verifyItemIDMatch = (req: Request, res: Response, next) => {
        let payload = this.checkToken(req, res);
        if(!payload){
            return res.status(401).end();
        }
        if(payload.role == 1){
            next();
        }else{
            if(payload.item_ids != undefined && payload.item_ids.indexOf(req.params.id) === -1 )
            {
                return res.status(401).end();
            }
            else{
                next();
            }
        }
    }

    public routes(app): void {   
      

        app.route('/').get((req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '/../../public/index.html'));
        });
        


        ////////////////////////////////////////////////
        ///////    Routes Definition for User    ///////
        ////////////////////////////////////////////////
        
        app.route('/api/signup').post(this.inMemory.checkIfRegisteredSameIP, this.userController.signUP);

        app.route('/api/signin').post(this.inMemory.requestCounter, this.userController.signIn);

        app.route('/api/forgot').post((req,res) => this.userController.forgot(req, res));

        app.route('/api/reset').post(this.userController.reset);

        app.route('/api/validCaptchaUrl/:token').get(this.userController.validCaptchaUrl);

        app.route('/api/getUsers/:page').post([this.verifyAdminToken, this.inMemory.requestCounter], this.userController.getUsersByPage);

        app.route('/api/addUser').post([this.verifyAdminToken, this.inMemory.requestCounter], this.userController.addUser);

        app.route('/api/getUserByID/:id').get([this.verifyUserIDMatch, this.inMemory.requestCounter], this.userController.getUserByID);

        app.route('/api/getUserForSearch/:page').post(this.inMemory.requestCounter, this.userController.getUserForSearch);

        app.route('/api/updateUser/:id').post([this.verifyUserIDMatch, this.inMemory.requestCounter], this.userController.updateUser);

        app.route('/api/updateUserbyRegular/:id').post([this.verifyUserIDMatch, this.inMemory.requestCounter], this.userController.updateUserbyRegular);

        app.route('/api/removeUser/:id').delete([this.verifyAdminToken, this.inMemory.requestCounter], this.userController.removeUser);

        app.route('/api/uploadPicture').post(this.userController.uploadPicture);

        app.route('/api/uploadPictureToMongoose').post(this.userController.uploadPictureToMonogoose);

        app.route('/api/displayPicture/:filename').get(this.userController.displayPicture);

        ////////////////////////////////////////////////
        ///////    Routes Definition for Item    ///////
        ////////////////////////////////////////////////

        app.route('/api/addItem').post([this.verifyToken, this.inMemory.requestCounter], this.itemController.addItem);

        app.route('/api/uploadItemPicture').post(this.itemController.uploadPicture);

        app.route('/api/getItemsForSearch/:page').post(this.inMemory.requestCounter, this.itemController.getItemsForSearch);

        app.route('/api/getItems/:page').post(this.inMemory.requestCounter, this.itemController.getItemsByPage);

        app.route('/api/getItemById/:id').get([this.verifyItemIDMatch, this.inMemory.requestCounter], this.itemController.getItemById);
        
        app.route('/api/getDisplayItemById/:id').get(this.inMemory.requestCounter, this.itemController.getDisplayItemById);

        app.route('/api/removeItems/:ids').delete([this.verifyItemIDMatch, this.inMemory.requestCounter], this.itemController.removeItems);

        app.route('/api/updateItem/:id').post([this.verifyItemIDMatch, this.inMemory.requestCounter], this.itemController.updateItem);


        ////////////////////////////////////////////////
        /////    Routes Definition for Setting    //////
        ////////////////////////////////////////////////

        app.route('/api/loadFromLocalToDb').get(this.verifyAdminToken, this.settingController.loadFromLocalToDb);

        app.route('/api/createDummyData/:userCount/:itemCount').get(this.verifyAdminToken, this.settingController.createDummyData);

        app.route('/api/displayPictureFromFS/:filename').get(this.settingController.displayPictureFromFS);

        app.route('/api/displayAvatarFromFS/:filename').get(this.settingController.displayAvatarFromFS);



    }
}