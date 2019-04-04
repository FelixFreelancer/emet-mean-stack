import {Request, Response, NextFunction} from "express";
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
const dateTime = require('node-datetime');
import { Conf } from '../conf';
import * as mongoose from 'mongoose';

import { UserSchema } from '../models/userModel';
const User = mongoose.model('User', UserSchema);

export class InMemory {
    request_data = [];
    request_register_data = [];
    lastCleaned_data = [];
    requestCounter = (req: Request, res: Response, next) => {
        let user_id = '';
        let bearer = req.headers.authorization;
        if(bearer != undefined && bearer != '' && bearer.split(' ')[1] != 'null'){
            let token=req.headers.authorization.split(' ')[1];
            let payload = jwt.verify(token,'secretKey');
            user_id = payload.user_id;
        }else{
            user_id = req.connection.remoteAddress;
        }
        
        const dt = dateTime.create();
		const formatUpdateDate = dt.format('Y-m-d H:M:S');
        this.request_data.push({id: user_id, type: req.originalUrl, datetime: formatUpdateDate});
        this.cleanMapIfNeeded();
        
        let current_request_count = this.request_data.filter(obj => obj.id == user_id).length;
        if(current_request_count > Conf.requestMaxNum){
           return res.status(401).end('Out of the Maximum request count');
        }
        next();
    }


    cleanMapIfNeeded = () => {
        const dt = dateTime.create();
        const currentTime = dt.format('Y-m-d H:M:S');
        const currentGetTime = new Date(currentTime).getTime();
        let d_c = new Date();
        let d = new Date();
        d.setDate(d.getDate() - 1);
        let yesterdayDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0 ).getTime();
        if(this.lastCleaned_data.length > 0 && this.lastCleaned_data[this.lastCleaned_data.length - 1] == yesterdayDate){
            yesterdayDate = new Date(d_c.getFullYear(), d_c.getMonth(), d_c.getDate(), 0, 0, 0, 0).getTime();

        }
        if(yesterdayDate +  24 * 60 * 60 * 1000 <= currentGetTime && this.request_data.length > 1){
            this.request_data = [];
            this.lastCleaned_data.push(yesterdayDate);
        }
    }

    checkIfRegisteredSameIP = (req: Request, res: Response, next) => {
        const currentIP = req.connection.remoteAddress;
        this.request_register_data.push({ip_address: currentIP, api: '/signup'});
        let current_request_count = this.request_register_data.filter(obj => obj.ip_address == currentIP).length;
        if(current_request_count > Conf.requestMaxSignupNum){
           return res.status(401).end('Out of the Maximum signup request count');
        }
        next();
    }
}