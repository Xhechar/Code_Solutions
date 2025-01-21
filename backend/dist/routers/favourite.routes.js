"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favouriteRouter = void 0;
const express_1 = require("express");
const favourite_controller_1 = require("../controllers/favourite.controller");
exports.favouriteRouter = (0, express_1.Router)();
const favouriteController = new favourite_controller_1.FavouriteController();
