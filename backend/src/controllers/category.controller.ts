import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

const categoryService = new CategoryService();

export class CategoryController{
  async createCategory(req: Request, res: Response) {
    try {

      res.status(201).json(await categoryService.createCategory(req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      })
    }
  }
  async updateCategory(req: Request, res: Response) {
    try {

      res.status(201).json(await categoryService.updateCategory(req.params.CategoryId, req.body));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      })
    }
  }
  async deleteCategory(req: Request, res: Response) {
    try {
      
      res.status(201).json(await categoryService.deleteCategory(req.params.CategoryId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      })
    }
  }
  async getAllCategories(req: Request, res: Response) {
    try {

      res.status(201).json(await categoryService.getAllCategories());
      
    } catch (error) {
      res.status(501).json({
        'error': error
      })
    }
  }
  async getSingleCategory(req: Request, res: Response) {
    try {
      
      res.status(201).json(await categoryService.getSingleCategory(req.params.categoryId));
      
    } catch (error) {
      res.status(501).json({
        'error': error
      })
    }
  }
  
}