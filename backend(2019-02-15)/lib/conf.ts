export const Conf = {
    // Remote monogodb url
    mongoURL: 'mongodb://localhost:27017/emetdb',
    // mongoURL: 'mongodb://webbjames:coronajames_1117@ds149034.mlab.com:49034/emet-mean',

    // Dummy json data url and base type array
    avatarDummyURL: 'uploads/avatar/dummy/',
    itemPictureDummyURL: 'uploads/item/dummy/',
    jsonDummyURL: 'uploads/dummydata/',
    interestArr:  ['To Invest', 'To Be Sold', 'Merge', 'Investment', 'Buying'],
    typeArr: ['Company', 'Investor', 'Entrepreneur'],
    activityArr: ['Cars', 'Hi-Tech', 'Agricalture', 'Finance'],

    // SecretKey for google captcha
    captchaSecretKey: '	6LddVooUAAAAAN03aojwIx_lzcscRtX09c-Dxzgv',

    // Mail info for forgot password
    nodeHost: "https://emet100.herokuapp.com",
    mailUserName: "webbjames1117@gmail.com",
    mailPassword: "coronajames_117",
    mailUser: "webbjames1117@gmail.com",
    mailPort: 465,

    // Request limit number
    requestMaxNum: 1000,

    // Maximum request number for signup
    requestMaxSignupNum: 3
};