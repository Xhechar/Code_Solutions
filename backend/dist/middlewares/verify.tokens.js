"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.verifyAdmin = exports.getIdFromToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    let token = req.signedCookies.token;
    if (!token) {
        res.status(401).json({
            'success': false,
            'error': 'You are not allowed to access this service. Login.'
        });
    }
    try {
        jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (error, data) => {
            if (error) {
                if (error.name === 'JsonWebTokenError') {
                    res.status(401).json({
                        'success': false,
                        'error': 'Invalid token provided.'
                    });
                }
                else if (error.name === 'TokenExpiredError') {
                    res.status(401).json({
                        'success': false,
                        'error': 'Token expired. Login again.'
                    });
                }
                else {
                    res.status(500).json({
                        'success': false,
                        'error': 'An error occurred while verifying the token.'
                    });
                }
            }
            else {
                req.info = data;
                next();
            }
        });
    }
    catch (error) {
        res.status(403).json({
            'success': false,
            'error': 'Invalid token provided.'
        });
    }
};
exports.verifyToken = verifyToken;
const getIdFromToken = (req) => {
    let data = req.info;
    if (!data) {
        return '';
    }
    if (!data.UserId) {
        return '';
    }
    return data.UserId;
};
exports.getIdFromToken = getIdFromToken;
const verifyAdmin = (req, res, next) => {
    let data = req.info;
    if (!data) {
        res.status(401).json({
            'success': false,
            'error': 'You are not allowed to access this service. Login.'
        });
    }
    if (data.Role !== 'admin') {
        res.status(401).json({
            'success': false,
            'error': 'You do not have the necessary permissions to access this service.'
        });
    }
    else {
        next();
    }
};
exports.verifyAdmin = verifyAdmin;
const verifyUser = (req, res, next) => {
    let data = req.info;
    if (!data) {
        res.status(401).json({
            'success': false,
            'error': 'You are not allowed to access this service. Login.'
        });
    }
    next();
};
exports.verifyUser = verifyUser;
