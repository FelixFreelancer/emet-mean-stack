import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/crmRoutes";
import * as mongoose from "mongoose";
import { Conf } from './conf';
import * as cors from 'cors';
import * as path from 'path';
import * as csurf from 'csurf';
const cookieParser = require('cookie-parser');
import * as expressSanitizer from 'express-sanitizer';
import * as validator from 'express-validator';
class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();
    public mongoUrl: string = Conf.mongoURL;  

    constructor() {
        this.app = express();
        this.config();   
        this.preventXSS();     
        this.preventCSRF();
        this.routePrv.routes(this.app);     
        this.mongoSetup();
    }

    private config(): void{
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(express.static('uploads'));
        this.app.use(express.static(path.join(__dirname, '/../public')));
    }
    private preventXSS() : void{
        this.app.use(expressSanitizer());
        this.app.use(validator());
        this.app.use(function(req, res, next) {
            for (let item in req.body) {
                if(item === 'password') continue;
                if((typeof req.body[item]).toLowerCase() != "string") continue;
                req.sanitize(String(item)).escape();
            }
            next();
        });
    }
    private preventCSRF(): void{
        this.app.use(cookieParser());
        const csrfMiddleware = csurf({
                cookie: true
        });
        this.app.use((req, res, next) => {
           if(req.originalUrl !== '/api/signin'){
             this.app.use(csrfMiddleware);
             next();
           }else{
            next();
           }
        });
        
    }
  
    private mongoSetup(): void{
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });    
    }

}

export default new App().app;