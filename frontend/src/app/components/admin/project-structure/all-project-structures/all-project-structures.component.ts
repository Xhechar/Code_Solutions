import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Problem, ProjectStructure, PSG, Stack } from '../../../../interfaces/solutions.interfaces';

@Component({
  selector: 'app-all-project-structures',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './all-project-structures.component.html',
  styleUrl: './all-project-structures.component.css',
})
export class AllProjectStructuresComponent implements OnInit {
removeProblem(_t257: string) {
throw new Error('Method not implemented.');
}
filteredProblems(): any {
throw new Error('Method not implemented.');
}
addProblem(arg0: any) {
throw new Error('Method not implemented.');
}
  projectStructures: ProjectStructure[] = [];
  problems: Problem[] = [];
  stacks: Stack[] = [];

  // Selection states
  selectedProjectId: string = '';
  selectedProject: ProjectStructure | null = null;
  selectedPSG: PSG | null = null;

  // Modal states
  showNewProjectModal: boolean = false;
  showPSGFormModal: boolean = false;
  showDeleteConfirmation: boolean = false;

  // Form objects
  newProject: ProjectStructure = this.createEmptyProject();
  psgForm: PSG = this.createEmptyPSG();
  psgToDelete: PSG | null = null;
  editingPSG: boolean = false;

  // Problem selector
  showProblemSelector: boolean = false;
  problemSearchTerm: string = '';
  selectedProblems: string[] = [];

  // Image handling
  previewImages: string[] = [];
  selectedImageIndex: number = 0;
  currentImageIndex: number = 0;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Load dummy data
    this.loadDummyData();
  }

  // Data initialization methods
  loadDummyData(): void {
    // Stacks
    this.stacks = [
      {
        StackId: '1',
        Name: 'React',
        Description: '',
        Version: '',
      },
      {
        StackId: '2',
        Name: 'Angular',
        Description: '',
        Version: '',
      },
      {
        StackId: '3',
        Name: 'Node.js',
        Description: '',
        Version: '',
      },
      {
        StackId: '4',
        Name: 'Python',
        Description: '',
        Version: '',
      },
      {
        StackId: '5',
        Name: 'Java',
        Description: '',
        Version: '',
      },
    ];

    // Problems
    this.problems = [
      {
        ProblemId: '1',
        Title: 'Node.js initial setup error',
        Description: 'Error when running npm install on first setup',
        Reproducibility: true,
        DateCreated: new Date(2024, 2, 15),
        StackId: '3',
        CategoryId: '1',
        IsApproved: true,
        UserId: '1'
      },
      {
        ProblemId: '2',
        Title: 'Angular routing not working correctly',
        Description: 'Routes are not working as expected after update',
        Reproducibility: true,
        DateCreated: new Date(2024, 2, 20),
        StackId: '2',
        CategoryId: '2',
        IsApproved: true,
        UserId: '1',
        expanded: false,
      },
      {
        ProblemId: '3',
        Title: 'React components not rendering',
        Description:
          'Components suddenly stopped rendering after adding new dependencies',
        Reproducibility: true,
        DateCreated: new Date(2024, 3, 5),
        StackId: '1',
        CategoryId: '2',
        IsApproved: true,
        UserId: '2',
        expanded: false,
      },
      {
        ProblemId: '4',
        Title: 'Python virtual environment issues',
        Description: 'Cannot activate virtual environment on Windows',
        Reproducibility: true,
        DateCreated: new Date(2024, 3, 10),
        StackId: '4',
        CategoryId: '3',
        IsApproved: true,
        UserId: '3',
        expanded: false,
      },
      {
        ProblemId: '5',
        Title: 'Java Spring Boot configuration',
        Description:
          'Unable to configure database connection in application.properties',
        Reproducibility: true,
        DateCreated: new Date(2024, 3, 15),
        StackId: '5',
        CategoryId: '4',
        IsApproved: true,
        UserId: '2',
        expanded: false,
      },
    ] as Problem[];

    // Project Structures
    this.projectStructures = [
      {
        ProjectId: '1',
        Title: 'React Project Structure',
        Description:
          'A comprehensive guide for setting up a React project with best practices and folder structure.',
        StackId: '1',
        DateCreated: new Date(2024, 2, 10),
        LastUpdated: new Date(2024, 3, 15),
        PSG: [
          {
            PSGId: '1',
            Title: 'Initial Setup with Create React App',
            ProjectId: '1',
            PictorialGuide: JSON.stringify([
              'https://example.com/images/react-setup-1.png',
              'https://example.com/images/react-setup-2.png',
            ]),
            TextInstructions:
              '# Setting up a new React project\n\n1. Make sure you have Node.js installed (v14 or higher recommended)\n2. Open your terminal and run the following command:\n```bash\nnpx create-react-app my-app\n```\n3. Navigate to your project:\n```bash\ncd my-app\n```\n4. Start the development server:\n```bash\nnpm start\n```\n\nThis will create a new React application with the default project structure.',
            RelatedProblemIds: '1,3',
          },
          {
            PSGId: '2',
            Title: 'Folder Structure Organization',
            ProjectId: '1',
            PictorialGuide: JSON.stringify([
              'https://example.com/images/react-folders-1.png',
              'https://example.com/images/react-folders-2.png',
              'https://example.com/images/react-folders-3.png',
            ]),
            TextInstructions:
              "# Organizing your React project folders\n\nA well-organized folder structure is crucial for a maintainable React application. Here's a recommended structure:\n\n```\nsrc/\n├── assets/          # Static files like images, fonts, etc.\n├── components/      # Reusable UI components\n│   ├── common/      # Truly reusable components\n│   └── specific/    # Components specific to features\n├── hooks/           # Custom React hooks\n├── pages/           # Components that represent pages/routes\n├── services/        # API calls and other services\n├── store/           # State management (Redux/Context)\n├── styles/          # Global styles and theme\n├── utils/           # Utility/helper functions\n└── App.js           # Main App component\n```\n\nCreate these folders in your project to maintain a clean separation of concerns.",
            RelatedProblemIds: '3',
          },
          {
            PSGId: '3',
            Title: 'Setting Up Routing',
            ProjectId: '1',
            PictorialGuide: JSON.stringify([
              'https://example.com/images/react-routing-1.png',
            ]),
            TextInstructions:
              '# Implementing routing in React\n\n1. Install React Router:\n```bash\nnpm install react-router-dom\n```\n\n2. Create a basic router setup in your App.js:\n\n```jsx\nimport { BrowserRouter, Routes, Route } from "react-router-dom";\nimport Home from "./pages/Home";\nimport About from "./pages/About";\nimport NotFound from "./pages/NotFound";\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path="/" element={<Home />} />\n        <Route path="/about" element={<About />} />\n        <Route path="*" element={<NotFound />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}\n\nexport default App;\n```\n\n3. Create the corresponding page components in your pages folder.',
            RelatedProblemIds: '3',
          },
        ],
      },
      {
        ProjectId: '2',
        Title: 'Angular Project Structure',
        Description:
          'A guide for setting up an Angular project with recommended architecture and organization.',
        StackId: '2',
        DateCreated: new Date(2024, 3, 5),
        LastUpdated: new Date(2024, 3, 12),
        PSG: [
          {
            PSGId: '4',
            Title: 'Setting up a new Angular project',
            ProjectId: '2',
            PictorialGuide: JSON.stringify([
              'https://example.com/images/angular-setup-1.png',
              'https://example.com/images/angular-setup-2.png',
            ]),
            TextInstructions:
              '# Creating a new Angular project\n\n1. Make sure you have Node.js and npm installed\n2. Install the Angular CLI globally:\n```bash\nnpm install -g @angular/cli\n```\n3. Create a new Angular project:\n```bash\nng new my-angular-app\n```\n4. Navigate to your project directory:\n```bash\ncd my-angular-app\n```\n5. Start the development server:\n```bash\nng serve\n```\n\nThis will create a new Angular application with the standard project structure.',
            RelatedProblemIds: '2',
          },
          {
            PSGId: '5',
            Title: 'Angular Module Organization',
            ProjectId: '2',
            PictorialGuide: JSON.stringify([
              'https://example.com/images/angular-modules-1.png',
            ]),
            TextInstructions:
              "# Organizing Angular modules\n\nA well-structured Angular application typically consists of these module types:\n\n1. **Core Module**: Contains singleton services, universal components, and other features where there's only one instance per application (e.g., auth service, header component).\n\n2. **Shared Module**: Contains common components, directives, and pipes that are reused across feature modules.\n\n3. **Feature Modules**: Contain all components, services, and routes for a specific feature area.\n\nHere's how to create them:\n\n```bash\n# Generate core module\nng generate module core\n\n# Generate shared module\nng generate module shared\n\n# Generate feature modules\nng generate module features/home\nng generate module features/profile\nng generate module features/dashboard\n```\n\nThis structure helps maintain a clean separation of concerns and improves maintainability.",
            RelatedProblemIds: '2',
          },
        ],
      },
    ];
  }

  createEmptyProject(): ProjectStructure {
    return {
      ProjectId: this.generateId(),
      Title: '',
      Description: '',
      StackId: '',
      DateCreated: new Date(),
      LastUpdated: new Date(),
      PSG: [],
    };
  }

  createEmptyPSG(): PSG {
    return {
      PSGId: this.generateId(),
      Title: '',
      ProjectId: '',
      PictorialGuide: '',
      TextInstructions: '',
      RelatedProblemIds: undefined
    };
  }

  // Helper methods
  generateId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  formatInstructions(text: string): any {
    // In a real app, you would use a Markdown library here
    // For this example, we'll do some basic formatting
    if (!text) return '';

    let formatted = text
      // Headers
      .replace(/# (.*?)(?:\n|$)/g, '<h2>$1</h2>')
      .replace(/## (.*?)(?:\n|$)/g, '<h3>$1</h3>')
      .replace(/### (.*?)(?:\n|$)/g, '<h4>$1</h4>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Lists
      .replace(/^\d+\. (.*?)(?:\n|$)/gm, '<li>$1</li>')
      .replace(/^- (.*?)(?:\n|$)/gm, '<li>$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>');

    return this.sanitizer.bypassSecurityTrustHtml('<p>' + formatted + '</p>');
  }

  getPictorialImages(guide: PSG): string[] {
    if (!guide.PictorialGuide) return [];
    try {
      return JSON.parse(guide.PictorialGuide);
    } catch (e) {
      return [];
    }
  }

  getRelatedProblemsCount(guide: PSG): number {
    if (!guide.RelatedProblemIds) return 0;
    return guide.RelatedProblemIds.split(',').filter((id: string) => id.trim() !== '')
      .length;
  }

  getProblemTitle(problemId: string): string {
    const problem = this.problems.find((p) => p.ProblemId === problemId);
    return problem ? problem.Title : 'Unknown Problem';
  }

  // Statistics methods
  getTotalPSGs(): number {
    return this.projectStructures.reduce((total, project) => {
      return total + (project.PSG ? project.PSG.length : 0);
    }, 0);
  }

  getTotalRelatedProblems(): number {
    let uniqueProblemIds = new Set<string>();

    this.projectStructures.forEach((project) => {
      if (project.PSG) {
        project.PSG.forEach((guide) => {
          if (guide.RelatedProblemIds) {
            guide.RelatedProblemIds.split(',').forEach((id: string) => {
              if (id.trim() !== '') {
                uniqueProblemIds.add(id.trim());
              }
            });
          }
        });
      }
    });

    return uniqueProblemIds.size;
  }

  // Selection methods
  selectProject(): void {
    if (!this.selectedProjectId) {
      this.selectedProject = null;
      this.selectedPSG = null;
      return;
    }

    this.selectedProject =
      this.projectStructures.find(
        (p) => p.ProjectId === this.selectedProjectId
      ) || null;

    this.selectedPSG = null;
  }

  selectPSG(psg: PSG): void {
    this.selectedPSG = psg;
    this.currentImageIndex = 0;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  selectPreviewImage(index: number): void {
    this.selectedImageIndex = index;
  }

  // Project Structure CRUD operations
  openNewProjectStructureForm(): void {
    this.newProject = this.createEmptyProject();
    this.showNewProjectModal = true;
  }

  cancelNewProject(): void {
    this.showNewProjectModal = false;
  }

  createNewProject(): void {
    // Add current date
    this.newProject.DateCreated = new Date();
    this.newProject.LastUpdated = new Date();
    this.newProject.PSG = [];

    // Add to collection
    this.projectStructures.push({ ...this.newProject });

    // Select the new project
    this.selectedProjectId = this.newProject.ProjectId;
    this.selectProject();

    // Close modal
    this.showNewProjectModal = false;
  }

  updateProjectStructure(): void {
    if (!this.selectedProject) return;

    // Update the last updated date
    this.selectedProject.LastUpdated = new Date();

    // Find and update the project in the collection
    const index = this.projectStructures.findIndex(
      (p) => p.ProjectId === this.selectedProject?.ProjectId
    );
    if (index !== -1) {
      this.projectStructures[index] = { ...this.selectedProject };
    }
  }

  // PSG CRUD operations
  openNewPSGForm(): void {
    if (!this.selectedProject) return;

    this.psgForm = this.createEmptyPSG();
    this.psgForm.ProjectId = this.selectedProject.ProjectId;
    this.editingPSG = false;
    this.selectedProblems = [];
    this.previewImages = [];
    this.selectedImageIndex = 0;
    this.showPSGFormModal = true;
  }

  openEditPSGForm(psg: PSG): void {
    this.psgForm = { ...psg };
    this.editingPSG = true;

    // Load related problems
    this.selectedProblems = psg.RelatedProblemIds
      ? psg.RelatedProblemIds.split(',').filter((id: string) => id.trim() !== '')
      : [];

    // Load images
    this.previewImages = this.getPictorialImages(psg);
    this.selectedImageIndex = 0;

    this.showPSGFormModal = true;
  }

  cancelPSGForm(): void {
    this.showPSGFormModal = false;
    this.showProblemSelector = false;
  }

  submitPSGForm(): void {
    // Set related problems
    this.psgForm.RelatedProblemIds = this.selectedProblems.join(',');

    // Set pictorial guides
    if (this.previewImages.length > 0) {
      this.psgForm.PictorialGuide = JSON.stringify(this.previewImages);
    }

    if (this.editingPSG) {
      // Update existing PSG
      if (this.selectedProject && this.selectedProject.PSG) {
        const index = this.selectedProject.PSG.findIndex(
          (p) => p.PSGId === this.psgForm.PSGId
        );
        if (index !== -1) {
          this.selectedProject.PSG[index] = { ...this.psgForm };

          // Update the selected PSG if it's the one being edited
          if (
            this.selectedPSG &&
            this.selectedPSG.PSGId === this.psgForm.PSGId
          ) {
            this.selectedPSG = this.selectedProject.PSG[index];
          }
        }
      }
    } else {
      // Add new PSG
      if (this.selectedProject) {
        if (!this.selectedProject.PSG) {
          this.selectedProject.PSG = [];
        }
        this.selectedProject.PSG.push({ ...this.psgForm });

        // Update the project's last updated date
        this.selectedProject.LastUpdated = new Date();
      }
    }

    // Close modal
    this.showPSGFormModal = false;
    this.showProblemSelector = false;
  }

  confirmDeletePSG(psg: PSG): void {
    this.psgToDelete = psg;
    this.showDeleteConfirmation = true;
  }

  cancelDeletePSG(): void {
    this.psgToDelete = null;
    this.showDeleteConfirmation = false;
  }

  deletePSG(): void {
    if (
      !this.psgToDelete ||
      !this.selectedProject ||
      !this.selectedProject.PSG
    ) {
      this.showDeleteConfirmation = false;
      return;
    }

    // Remove the PSG from the collection
    this.selectedProject.PSG = this.selectedProject.PSG.filter(
      (p) => p.PSGId !== this.psgToDelete?.PSGId
    );

    // Clear selection if the deleted PSG was selected
    if (this.selectedPSG && this.selectedPSG.PSGId === this.psgToDelete.PSGId) {
      this.selectedPSG = null;
    }

    // Update the project's last updated date
    this.selectedProject.LastUpdated = new Date();

    // Close modal
    this.showDeleteConfirmation = false;
    this.psgToDelete = null;
  }

  // File and image handling
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    // In a real app, you would upload these files to a server
    // Here we'll just create URLs for the preview
    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImages.push(e.target.result);
        // Select the first image added if none selected
        if (this.selectedImageIndex === 0 && this.previewImages.length === 1) {
          this.selectedImageIndex = 0;
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear the input
    input.value = '';
  }

  removeImage(index: number): void {
    this.previewImages.splice(index, 1);
    if (this.selectedImageIndex >= this.previewImages.length) {
      this.selectedImageIndex = Math.max(0, this.previewImages.length - 1);
    }
  }

  // Problem selector methods
  toggleProblemSelector(): void {
    this.showProblemSelector = !this.showProblemSelector;
    this.problemSearchTerm = '';
  }
}
