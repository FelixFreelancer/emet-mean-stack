import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    id: {
        type: String,
        default: ''
    },
    userName: {
        type: String,
        default: ''
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    companyName: {
        type: String,
        default: ''
    },
    jobTitle: {
        type: String,
        default: ''
    },
    email: {
        type: String            
    },
    password: {
        type: String            
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    active: {
        type: Number,
        default: 0 //0:active 1:active
    },
    facebook: {
        type: String,
        default: ''
    },
    linkdin: {
        type: String,
        default: ''
    },
    memberOfSMB: {
        type: String,
        default: ''
    },
    comments: {
        type: String,
        default: ''
    },
    picture: {
        type: String,
        default: 'default.png'
    },
    pictureContentType: {
        type: String,
        default: ''
    },
    role: {
        type: Number,
        default: 0 // 0: user, 1: admin          
    },
    registerDate: {
        type: Date,
        default: Date.now
    },
    registerDateSort: {
        type: Number,
        default: 0
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    updateDateSort: {
        type: Number,
        default: 0
    },
    extraBlob: {
        type: String,
        default: '1'  // 1: avatar from gridfs, 2: avatar from general fs
    },
    extraStr: {
        type: String,
        default: ''
    },
    resetPasswordToken: {
        type: String,
        default: ''
    },
    resetPasswordExpires: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        default: ''
    }
});