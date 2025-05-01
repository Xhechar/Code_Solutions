import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Title, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category, Problem, ProjectStructure, PSG, Solution, Stack, SuccessType, User } from '../../interfaces/solutions.interfaces';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectStructureService } from '../../services/project-structure.service';
import { NotificationsService } from '../../services/modifiers/notifications.service';

@Component({
  selector: 'app-single-project-structure',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './single-project-structure.component.html',
  styleUrl: './single-project-structure.component.css'
})
export class SingleProjectStructureComponent {
  projectId: string = '';
  projectStructure: ProjectStructure | null = null;
  loading: boolean = true;
  error: boolean = false;
  activeGuideIndex: number = 0;
  showImageViewer: boolean = false;
  selectedImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pss: ProjectStructureService,
    private titleService: Title,
    private sanitizer: DomSanitizer,
    private ns: NotificationsService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('ProjectId');      
      if (id) {
        this.projectId = id;
        this.loadProjectStructure();
      } else {
        this.navigateBack();
      }
    });
  }

  navigateBack(): void {
    history.back();
  }

  loadProjectStructure(): void {
    this.loading = true;
    this.error = false;

    this.pss.getSingleProjectStructure(this.projectId)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.projectStructure = response.project as ProjectStructure;
            this.titleService.setTitle(`${this.projectStructure.Title} - Project Structure`);
            this.loading = false;

            if (response.project?.PSG && response.project.PSG.length > 0) {
              this.activeGuideIndex = 0;
            }
            this.ns.showAlert(SuccessType.Success, response.message as string);
          } else {
            this.ns.showAlert(SuccessType.Warning, response.error as string);
            this.loading = false;
            this.error = true;
          }
        },
        error: (err) => {
          this.ns.showAlert(SuccessType.Error, err.error.error as string);
          this.loading = false;
          this.error = true;
        }
      });
  }

  setActiveGuide(index: number): void {
    this.activeGuideIndex = index;
  }

  formatInstructions(text: string): SafeHtml {
    if (!text) return '';
    
    let formatted = text
      // Headers
      .replace(/^# (.*$)/gm, '<h2>$1</h2>')
      .replace(/^## (.*$)/gm, '<h3>$1</h3>')
      .replace(/^### (.*$)/gm, '<h4>$1</h4>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```([^`]*?)```/gm, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]*?)`/g, '<code>$1</code>')
      // Lists
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br>');
    
    // Replace list items with proper UL lists
    if (formatted.includes('<li>')) {
      formatted = formatted.replace(/<li>.*?(<br>|$)/g, (match) => {
        return '<ul>' + match + '</ul>';
      });
      formatted = formatted.replace(/<\/ul><br><ul>/g, '');
    }
    
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }

  getGuideImages(pictorialGuide: string | undefined): string[] {
    if (!pictorialGuide) return [];
    return pictorialGuide.split(',').map(img => img.trim());
  }

  openImageViewer(image: string): void {
    this.selectedImage = image;
    this.showImageViewer = true;
    document.body.style.overflow = 'hidden';
  }

  closeImageViewer(): void {
    this.showImageViewer = false;
    document.body.style.overflow = '';
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  downloadProject(): void {
    if (!this.projectStructure) return;
    
    // Create a downloadable content from project structure
    const content = {
      title: this.projectStructure.Title,
      description: this.projectStructure.Description,
      stack: this.projectStructure.Stack?.Name,
      guides: this.projectStructure.PSG?.map(guide => ({
        title: guide.Title,
        instructions: guide.TextInstructions
      }))
    };
    
    // Create and trigger download
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.projectStructure.Title.replace(/\s+/g, '-').toLowerCase()}-guide.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  downloadProjectAsPDF(): void {
    if (!this.projectStructure) return;

    // Create content for the PDF
    const content = `
      Title: ${this.projectStructure.Title}
      Description: ${this.projectStructure.Description}
      Stack: ${this.projectStructure.Stack?.Name}
      Guides:
      ${this.projectStructure.PSG?.map(guide => `
        - Title: ${guide.Title}
          Instructions: ${guide.TextInstructions}
      `).join('\n')}
    `;

    // Convert content to a Blob
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    // Create and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.projectStructure.Title.replace(/\s+/g, '-').toLowerCase()}-guide.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
