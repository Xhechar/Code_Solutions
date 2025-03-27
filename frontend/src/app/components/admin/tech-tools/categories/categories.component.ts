import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { Category, Problem, SuccessType } from '../../../../interfaces/solutions.interfaces';
import { NotificationsService } from '../../../../services/modifiers/notifications.service';
import { NotificationsComponent } from "../../../notifications/notifications.component";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit, AfterViewInit {
  @ViewChildren('categoryCard') categoryCards!: QueryList<ElementRef>;

  categories: Category[] = [];
  category: Category = {
    Name: '',
    Description: '',
    CategoryId: ''
  };
  
  isModalOpen = false;
  isEditMode = false;
  
  totalCategories = 0;
  totalProblems = 0;
  isClosing: boolean = false;

  constructor(private categoryService: CategoryService, private ns: NotificationsService) {}

  ngOnInit() {
    this.loadCategories();
  }

  ngAfterViewInit() {
    this.categoryCards.forEach((el, index) => {
      el.nativeElement.style.setProperty('--index', index);
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.categories as Category[];
          this.totalCategories = this.categories.length;
          this.totalProblems = ((((response.categories as Category[])[0]).Problems as Problem[]).length) as number | 0;
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  openModal(categoryToEdit?: Category) {
    if (categoryToEdit) {
      this.isEditMode = true;
      this.category = { ...categoryToEdit };
    } else {
      this.isEditMode = false;
      this.category = {
        CategoryId: '',
        Name: '',
        Description: ''
      };
    }
    this.isModalOpen = true;
  }

  closeOnOverlay(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  createCategory() {
    let { CategoryId, Problems, ...rest } = this.category;
    this.categoryService.createCategory(rest as Category).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showAlert(SuccessType.Success, 'Category created successfully');
          this.closeModal();
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    })
  }

  updateCategory() {
    let { CategoryId, Problems, ...rest } = this.category;
    this.categoryService.updateCategory(this.category.CategoryId, rest as Category).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showAlert(SuccessType.Success, response.message as string);
          this.closeModal();
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    })
  }

  deleteCategory(categoryId: string) {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showAlert(SuccessType.Success, response.message as string);
          this.closeModal();
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  closeModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    modalOverlay?.classList.add('closing');
    
    setTimeout(() => {
      this.isModalOpen = false;
      modalOverlay?.classList.remove('closing');
      this.isEditMode = false;
      this.category = {
        CategoryId: '',
        Name: '',
        Description: ''
      };
      this.isClosing = false;
      this.loadCategories();
    }, 200);
  }
}