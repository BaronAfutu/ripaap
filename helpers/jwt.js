var { expressjwt: jwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.SECRET||'this_is_@_temp.secret';
    return jwt({
        secret,
        algorithms: ['HS256'],
    }).unless({
        path: [
            {url: /\/api\/v1\/parts(.*)/, methods: ['GET','OPTIONS']},
            {url: /\/api\/shops(.*)/, methods: ['GET','OPTIONS']},
            {url: /\/api\/categories(.*)/, methods: ['GET','OPTIONS']},
            {url: /\/api\/info(.*)/, methods: ['GET','OPTIONS']},
            '/api/users/login',
            '/api/users/signup',
            '/api/users/join-waitlist',
            '/'
        ]
    })
}

module.exports = authJwt;