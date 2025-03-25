"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("../services/category.service");
const body_input_validators_1 = require("../validators/body.input.validators");
const categoryService = new category_service_1.CategoryService();
class CategoryController {
    async createCategory(req, res) {
        try {
            let { error } = body_input_validators_1.CategorySchema.validate(req.body);
            if (error) {
                res.status(401).json({
                    'error': error.message
                });
            }
            ;
            res.status(201).json(await categoryService.createCategory(req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async updateCategory(req, res) {
        try {
            let { error } = body_input_validators_1.CategorySchema.validate(req.body);
            if (error) {
                res.status(401).json({
                    'error': error.message
                });
            }
            ;
            res.status(201).json(await categoryService.updateCategory(req.params.CategoryId, req.body));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async deleteCategory(req, res) {
        try {
            res.status(201).json(await categoryService.deleteCategory(req.params.CategoryId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getAllCategories(req, res) {
        try {
            res.status(201).json(await categoryService.getAllCategories());
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
    async getSingleCategory(req, res) {
        try {
            res.status(201).json(await categoryService.getSingleCategory(req.params.categoryId));
        }
        catch (error) {
            res.status(501).json({
                'error': error
            });
        }
    }
}
exports.CategoryController = CategoryController;
