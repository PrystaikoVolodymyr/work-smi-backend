const { decodeIdToken } = require('../service/firebase.service');

module.exports = {
    ROLE_ADMIN: 'admin',
    ROLE_CANDIDATE: 'candidate',
    ROLE_RECRUITER: 'recruiter',
    auth(roles) {
        return async (req, res, next) => {
            const token = req.get('authorization');

            if (token) {
                decodeIdToken(token.slice(7))
                    .then(async userData => {
                            req.user = userData;
                            console.log(userData)
                            if (userData.role === 'admin' || roles.includes(userData.role)) {
                                return next();
                            }
                        next(new Error('Not authorized for this operation'));
                    })
                    .catch(err => next(err))
            } else {
                next(new Error('No token provided'));
            }
        }
    }
}