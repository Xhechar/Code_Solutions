import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { CategoryInterface } from "../interfaces/methods.interfaces";
import { Category } from "../interfaces/solutions.interfaces";
import { v4 } from "uuid";
import { CategorySchema } from "../validators/body.input.validators";

export class CategoryService implements CategoryInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });

  async createCategory(category: Category): Promise<{ success: boolean; message?: string; error?: string; }> {

    let { error } = CategorySchema.validate(category);

    if (error) {
      return ({
        'success': false,
        'error': error.details[0].message
      });
    };
    
    let categoryExists = await this.prisma.category.findUnique({
      where: {
        Name: category.Name
      }
    });

    if (categoryExists) {
      return {
        success: false,
        message: "Category already exists"
      }
    }

    let create = await this.prisma.category.create({
      data: {
        CategoryId: v4(),
        Name: category.Name,
        Description: category.Description
      }
    });

    if (create == null) {
      return {
        'success': false,
        'message': "Unable to create category."
      }
    } else {
      return {
        'success': true,
        'message': "Category created successfully."
      }
    }
  }
  async updateCategory(CategoryId: string, category: Partial<Category>): Promise<{ success: boolean; message?: string; error?: string; }> {

    let { error } = CategorySchema.validate(category);

    if (error) {
      return ({
        'success': false,
        'error': error.details[0].message
      });
    };
    
    let categoryExists = await this.prisma.category.findUnique({
      where: {
        CategoryId
      }
    });

    if (!categoryExists) {
      return {
        success: false,
        message: "Category does not exist"
      }
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
      }
    } else {
      return {
        'success': true,
       'message': "Category updated successfully."
      }
    }
  }
  async deleteCategory(CategoryId: string): Promise<{ success: boolean; message?: string; error?: string; }> {
    
    let categoryExists = await this.prisma.category.findUnique({
      where: {
        CategoryId
      }
    });

    if (!categoryExists) {
      return {
        success: false,
        message: "Category does not exist"
      }
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
      }
    } else {
      return {
        'success': true,
       'message': "Category deleted successfully."
      }
    }
  }
  async getAllCategories(): Promise<{ success: boolean; message?: string; error?: string; categories?: Category[]; }> {
    
    let categories = await this.prisma.category.findMany();

    if (categories == null) {
      return {
        'success': false,
        'message': "Unable to retrieve categories."
      }
    } else {
      return {
        'success': true,
        'categories': categories
      }
    }
  }
  async getSingleCategory(CategoryId: string): Promise<{ success: boolean; message?: string; error?: string; category?: Category; }> {
    
    let category = await this.prisma.category.findUnique({
      where: {
        CategoryId
      }
    });

    if (category == null) {
      return {
        'success': false,
        'message': "Category does not exist."
      }
    } else {
      return {
        'success': true,
        'message': 'category retrieved successfully',
        'category': category
      }
    }
  }
}