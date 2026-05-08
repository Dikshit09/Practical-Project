import jwt from 'jsonwebtoken';

// ✅ 1. Base token verify function
const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'You are not authorized to access'
        });
    }

    // Token verify karo
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid'
            });
        }
        req.user = user;
        next();
    });
};

// ✅ 2. Normal user verify (pehle token check, phir ID match)
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: 'You are not authenticated'
            });
        }
    });
};

// ✅ 3. Admin verify (pehle token check, phir role check)
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized'
            });
        }
    });
};

export default verifyToken;