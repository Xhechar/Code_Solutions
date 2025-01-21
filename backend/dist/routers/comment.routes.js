"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = require("express");
const comment_controller_1 = require("../controllers/comment.controller");
exports.commentRouter = (0, express_1.Router)();
const commentController = new comment_controller_1.CommentController();
