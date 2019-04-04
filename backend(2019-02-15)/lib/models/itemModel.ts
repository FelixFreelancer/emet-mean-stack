import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ItemSchema = new Schema({
    id: {
        type: String,
        default: ''
    },
    user_id: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    about: {
        type: String,
        default: ''
    },
    interest: {
        type: String,
        default: ''
    },
    activity: {
        type: String,
        default: ''
    },
    geoCountry: {
        type: String,
        default: ''
    },
    geoCity: {
        type: String,
        default: ''
    },
    fromAmount: {
        type: Number,
        default: 0
    },
    toAmount: {
        type: Number,
        default: 0
    },
    picture: {
        type: String,
        default: 'default.jpg'
    },
    pictureContentType: {
        type: String,
        default: ''
    },
    video: {
        type: String,
        default: ''
    },
    details: {
        type: String,
        default: ''
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    publishDateSort: {
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
        default: '1'   // 1: picture from gridfs, 2: picture from general fs
    },
    extraStr: {
        type: String,
        default: ''
    },
});