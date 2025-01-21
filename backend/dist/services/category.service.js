"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
class CategoryService {
    prisma = new client_1.PrismaClient({
        log: ["error"]
    });
    async createCategory(category) {
        let categoryExists = await this.prisma.category.findUnique({
            where: {
                Name: category.Name
            }
        });
        if (categoryExists) {
            return {
                success: false,
                message: "Category already exists"
            };
        }
        let create = await this.prisma.category.create({
            data: {
                CategoryId: (0, uuid_1.v4)(),
                Name: category.Name,
                Description: category.Description
            }
        });
        if (create == null) {
            return {
                'success': false,
                'message': "Unable to create category."
            };
        }
        else {
            return {
                'success': true,
                'message': "Category created successfully."
            };
        }
    }
    async updateCategory(CategoryId, category) {
        let categoryExists = await this.prisma.category.findUnique({
            where: {
                CategoryId
            }
        });
        if (!categoryExists) {
            return {
                success: false,
                message: "Category does not exist"
            };
        }
        let update = await this.prisma.category.update({
            where: {
                CategoryId
            },
            data: {
                Name: category.Name,
                Description: category.Description
            }
        });
        if (update == null) {
            return {
                'success': false,
                'message': "Unable to update category."
            };
        }
        else {
            return {
                'success': true,
                'message': "Category updated successfully."
            };
        }
    }
    async deleteCategory(CategoryId) {
        let categoryExists = await this.prisma.category.findUnique({
            where: {
                CategoryId
            }
        });
        if (!categoryExists) {
            return {
                success: false,
                message: "Category does not exist"
            };
        }
        let deleteCategory = await this.prisma.category.delete({
            where: {
                CategoryId
            }
        });
        if (deleteCategory == null) {
            return {
                'success': false,
                'message': "Unable to delete category."
            };
        }
        else {
            return {
                'success': true,
                'message': "Category deleted successfully."
            };
        }
    }
    async getAllCategories() {
        let categories = await this.prisma.category.findMany();
        if (categories == null) {
            return {
                'success': false,
                'message': "Unable to retrieve categories."
            };
        }
        else {
            return {
                'success': true,
                'categories': categories
            };
        }
    }
    async getSingleCategory(CategoryId) {
        let category = await this.prisma.category.findUnique({
            where: {
                CategoryId
            }
        });
        if (category == null) {
            return {
                'success': false,
                'message': "Category does not exist."
            };
        }
        else {
            return {
                'success': true,
                'message': 'category retrieved successfully',
                'category': category
            };
        }
    }
}
exports.CategoryService = CategoryService;
