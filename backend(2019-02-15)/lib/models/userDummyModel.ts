import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const AvatarSchema = new Schema({
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

export const FirstNameSchema = new Schema({
    firstName: {
        type: String,
        default: ''
    }
});

export const LastNameSchema = new Schema({
    lastName: {
        type: String,
        default: ''
    }
});


export const CitySchema = new Schema({
    city: {
        type: String,
        default: ''
    }
});

export const CountrySchema = new Schema({
    country: {
        type: String,
        default: ''
    }
});

export const CompanyNameSchema = new Schema({
    companyName: {
        type: String,
        default: ''
    }
});

export const JobTitleSchema = new Schema({
    jobTitle: {
        type: String,
        default: ''
    }
});

export const PhoneNumberSchema = new Schema({
    phoneNumber: {
        type: String,
        default: ''
    }
});

export const FacebookSchema = new Schema({
    facebook: {
        type: String,
        default: ''
    }
});

export const LinkdinSchema = new Schema({
    linkdin: {
        type: String,
        default: ''
    }
});

export const EmailSchema = new Schema({
    email: {
        type: String,
        default: ''
    }
});

export const CommentsSchema = new Schema({
    comments: {
        type: String,
        default: ''
    }
});