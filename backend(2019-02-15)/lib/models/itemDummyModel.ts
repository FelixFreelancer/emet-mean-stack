import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const PictureSchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    data: {
        type: Buffer,
        default: ''
    },
    contentType: {
        type: String,
        default: ''
    }
});

export const VideoSchema = new Schema({
    video: {
        type: String,
        default: ''
    }
});

export const DetailsSchema = new Schema({
    details: {
        type: String,
        default: ''
    }
});


export const AboutSchema = new Schema({
    about: {
        type: String,
        default: ''
    }
});
