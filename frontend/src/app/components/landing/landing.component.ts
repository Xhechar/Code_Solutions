import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Chat, User, Problem, Category, ProjectStructure, Stack, ContactData, Testimonial, SuccessType } from '../../interfaces/solutions.interfaces';
import { ProblemService } from '../../services/problem.service';
import { ProjectStructureService } from '../../services/project-structure.service';
import { StackService } from '../../services/stack.service';
import { CategoryService } from '../../services/category.service';
import { NotificationsService } from '../../services/modifiers/notifications.service';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { NotificationsComponent } from "../notifications/notifications.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NotificationsComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('projectAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('messageInput') private messageInput!: ElementRef;
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  title = '';
  groupName = 'Dev Team';
  members: User[] = [];
  currentUserId: string = '';
  currentMessage = '';
  isInTyping = false;
  typingUser: User | null = null;
  showEmojiPicker = false;
  mediaOverlayActive = false;
  selectedImage = '';
  currentDate = new Date();
  
  // New chat properties
  chats: Chat[] = [];
  hoveredMessage: Chat | null = null;
  updatingMessage: Chat | null = null;
  isEditMode = false;
  showDeleteModal = false;
  messageToDelete: Chat | null = null;

  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;

  // Search and Filter
  searchTerm = '';
  selectedCategory = '';
  selectedStack = '';

  // Data
  problems: Problem[] = [];
  projectStructures: ProjectStructure[] = [];
  categories: Category[] = [];
  stacks: Stack[] = [];
  
  emojiCategories = ['😀', '🐱', '🍎', '⚽', '🏠', '🚗'];
  activeEmojiCategory = '😀';
  emojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥'];

  contactData: ContactData = {
    name: '',
    email: '',
    subject: 'general',
    message: ''
  };

  newsletterEmail: string = '';
  currentYear: number = new Date().getFullYear();
  currentTestimonial: number = 0;
  testimonialDots: number[] = [];

  testimonials: Testimonial[] = [
    {
      name: 'Felix Okoth',
      role: 'Senior Developer',
      message: 'Code Solutions has been a game-changer for our team. The error database saved us countless hours debugging complex issues. The daily challenges keep our skills sharp!',
      image: 'https://res.cloudinary.com/dakyiye2e/image/upload/v1744290285/htth9fj1o0fh70lpamem.jpg'
    }
  ];

  @ViewChild('navLinks') navLinks!: ElementRef;
  @ViewChild('mobileMenuBtn') mobileMenuBtn!: ElementRef;
  @ViewChild('slider') sliderRef!: ElementRef;
  
  private isMovingRight = true;
  private animationPaused = false;
  private animationFrame: number = 0;
  private position = 0;
  private readonly cardWidth = 324;

  isScrolled = false;
  isMobileMenuActive = false;

  currentCode = '';
  isTyping = false;
  isError = false;

  private correctCode = 'solutions.findSolution();';
  private wrongCode = 'solution.findSolution;';
  private typingSpeed = 100;
  private pauseDuration = 1000;

  constructor(
    private router: Router, 
    private cs: CategoryService, 
    private ps: ProblemService, 
    private pss: ProjectStructureService, 
    private ss: StackService, 
    private ns: NotificationsService,
    private chatService: ChatService,
    private us: UserService
  ) {}

  ngOnInit() {
    this.startTypingAnimation();
    this.getCurrentUser();
    this.fetchAllChats();
    this.loadCategories();
    this.loadStacks();
    this.loadProblems();
    this.loadProjectStructures();
    this.calculateTotalPages();
    // Initialize testimonial dots
    this.testimonialDots = Array(this.testimonials.length).fill(0).map((_, i) => i);
    
    // Set up automatic testimonial rotation
    setInterval(() => {
      this.nextTestimonial();
    }, 6000);
    
    // Add animation classes to elements on scroll
    this.setupScrollAnimations();
  }

  private getCurrentUser(): void {
    this.us.getSingleUser().subscribe({
      next: (response) => {
        if(response.success) {
          this.currentUserId = (response.user as User).UserId as string;
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });

  }

  private fetchAllChats(): void {
    this.chatService.getChats().subscribe({
      next: (response) => {
        if(response.success) {
          this.chats = response.chats as Chat[];
          setTimeout(() => this.scrollToBottom(), 100);
        } else {
          this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  showActionIcons(message: Chat): void {
    this.hoveredMessage = message;
  }

  hideActionIcons(): void {
    this.hoveredMessage = null;
  }

  isWithinOneHour(dateCreated: Date): boolean {
    const now = new Date();
    const messageDate = new Date(dateCreated);
    const diffInMs = now.getTime() - messageDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours < 1;
  }

  editMessage(message: Chat): void {
    this.isEditMode = true;
    this.currentMessage = message.Message as string;
    this.messageInput.nativeElement.focus();
    this.messageInput.nativeElement.setSelectionRange(this.currentMessage.length, this.currentMessage.length);
    // Store the message ID for update
    this.hoveredMessage = message;
    this.updatingMessage = message;
  }

  confirmDeleteMessage(message: Chat): void {
    this.messageToDelete = message;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.messageToDelete = null;
  }

  deleteMessage(): void {
    if (this.messageToDelete) {
      this.chatService.deleteChat(this.messageToDelete.ChatId).subscribe({
        next: (response) => {
          if(response.success) {
            // Remove the message from the array
            this.chats = this.chats.filter(m => m.ChatId !== this.messageToDelete?.ChatId);
            this.ns.showAlert(SuccessType.Success, response.message as string);
          } else {
            this.ns.showAlert(SuccessType.Warning, response.error as string);
          }
          this.closeDeleteModal();
        },
        error: (error) => {
          this.ns.showAlert(SuccessType.Error, error.error.error as string);
          this.closeDeleteModal();
        }
      });
    }
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return;
    
    if (this.isEditMode && this.updatingMessage) {
      // Update existing message
      const updatedChat: Chat = {
        ...this.updatingMessage,
        Message: this.currentMessage.trim(),
      };
      
      this.chatService.updateChat(updatedChat.ChatId, updatedChat.Message).subscribe({
        next: (response) => {
          if(response.success) {
            // Update the message in the array
            const index = this.chats.findIndex(m => m.ChatId === updatedChat.ChatId);
            if (index !== -1) {
              this.chats[index] = updatedChat;
            }
            this.ns.showAlert(SuccessType.Success, response.message as string);
          } else {
            this.ns.showAlert(SuccessType.Warning, response.error as string);
          }
          // Reset state
          this.isEditMode = false;
          this.hoveredMessage = null;
          this.currentMessage = '';
        },
        error: (error) => {
          this.ns.showAlert(SuccessType.Error, error.error.error as string);
        }
      });
    } else {
      // Create new message
      const newChat: Chat = {
        UserId: this.currentUserId,
        Message: this.currentMessage.trim(),
        Pinned: false,
        DateCreated: new Date(),
        ChatId: ''
      };
      
      this.chatService.createChat(newChat.Message).subscribe({
        next: (response) => {
          if(response.success) {
            this.ns.showAlert(SuccessType.Success, response.message as string);
            this.fetchAllChats();
            setTimeout(() => this.scrollToBottom(), 100);
          } else {
            this.ns.showAlert(SuccessType.Warning, response.error as string);
          }
          this.currentMessage = '';
        },
        error: (error) => {
          this.ns.showAlert(SuccessType.Error, error.error.error as string);
        }
      });
    }
    this.messageInput.nativeElement.textContent = '';
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  selectEmoji(emoji: string): void {
    this.currentMessage += emoji;
    this.messageInput.nativeElement.focus();
  }

  setActiveEmojiCategory(category: string): void {
    this.activeEmojiCategory = category;
  }

  openImageOverlay(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.mediaOverlayActive = true;
  }

  closeImageOverlay(): void {
    this.mediaOverlayActive = false;
    this.selectedImage = '';
  }

  onDocumentClicks(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const emojiPicker = document.querySelector('.emoji-picker');
    const emojiButton = document.querySelector('#emoji-btn');
    
    if (this.showEmojiPicker && 
        emojiPicker && 
        emojiButton && 
        !emojiPicker.contains(target) && 
        !emojiButton.contains(target)) {
      this.showEmojiPicker = false;
    }
  }

  async startTypingAnimation() {
    while (true) {
      this.isTyping = true;
      this.isError = false;
      await this.typeText(this.correctCode);
      await this.pause(this.pauseDuration);

      await this.deleteText();
      await this.pause(this.pauseDuration);

      this.isTyping = true;
      await this.typeText(this.wrongCode);
      this.isError = true;
      await this.pause(this.pauseDuration);

      await this.deleteText();
      await this.pause(this.pauseDuration);
    }
  }

  private async typeText(text: string) {
    for (let i = 0; i <= text.length; i++) {
      this.currentCode = text.slice(0, i);
      await this.pause(this.typingSpeed);
    }
  }

  private async deleteText() {
    while (this.currentCode.length > 0) {
      this.currentCode = this.currentCode.slice(0, -1);
      await this.pause(this.typingSpeed / 2);
    }
    this.isTyping = false;
  }

  private pause(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      !this.navLinks.nativeElement.contains(event.target) &&
      !this.mobileMenuBtn.nativeElement.contains(event.target)
    ) {
      this.isMobileMenuActive = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuActive = !this.isMobileMenuActive;
  }

  ngAfterViewInit(): void {
    this.startAnimation();
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private moveSlider(): void {
    if (!this.animationPaused) {
      this.position += this.isMovingRight ? -1 : 1;

      const maxScroll = this.cardWidth * (this.sliderRef.nativeElement.children.length / 2);
      if (Math.abs(this.position) >= maxScroll) {
        this.position = 0;
      }

      this.sliderRef.nativeElement.style.transform = `translateX(${this.position}px)`;
    }
    
    this.animationFrame = requestAnimationFrame(() => this.moveSlider());
  }

  private startAnimation(): void {
    this.moveSlider();
  }

  changeDirection(direction: 'left' | 'right'): void {
    this.isMovingRight = direction === 'right';
    
    this.animationPaused = true;
    setTimeout(() => {
      this.animationPaused = false;
    }, 1000);
  }

  get filteredProblems(): Problem[] {
    let filtered = this.problems;
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.Title.toLowerCase().includes(term) || 
        p.Description.toLowerCase().includes(term) ||
        (p.ErrorCode && p.ErrorCode.toLowerCase().includes(term))
      );
    }
    
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.CategoryId === this.selectedCategory);
    }
    
    if (this.selectedStack) {
      filtered = filtered.filter(p => p.StackId === this.selectedStack);
    }
    
    // Calculate pagination
    this.calculateTotalPages(filtered.length);
    
    // Get current page items
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  calculateTotalPages(filteredCount?: number): void {
    const count = filteredCount || this.problems.length;
    this.totalPages = Math.ceil(count / this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewProblem(problemId: string): void {
    this.router.navigate(['/single-problem', problemId]);
  }

  viewProjectStructure(projectId: string): void {
    this.router.navigate(['/single-project-structure', projectId]);
  }

  getCategoryClass(categoryId: string): string {
    const category = this.categories.find(c => c.CategoryId === categoryId);
    if (!category) return 'syntax';
    
    switch (category.Name.toLowerCase()) {
      case 'runtime': return 'runtime';
      case 'database': return 'database';
      case 'api': return 'api';
      default: return 'syntax';
    }
  }

  getCategoryIcon(categoryId: string): string {
    const category = this.categories.find(c => c.CategoryId === categoryId);
    if (!category) return 'bx bx-code-block';
    
    switch (category.Name.toLowerCase()) {
      case 'runtime': return 'bx bx-error';
      case 'database': return 'bx bx-data';
      case 'api': return 'bx bx-server';
      default: return 'bx bx-code-block';
    }
  }

  getStackIcon(stackId: string): string {
    const stack = this.stacks.find(s => s.StackId === stackId);
    if (!stack) return 'bx bx-code-alt';
    
    switch (stack.Name.toLowerCase()) {
      case 'javascript': return 'bx bxl-javascript';
      case 'react': return 'bx bxl-react';
      case 'angular': return 'bx bxl-angular';
      case 'node.js': return 'bx bxl-nodejs';
      case 'python': return 'bx bxl-python';
      case 'java': return 'bx bxl-java';
      case 'php': return 'bx bxl-php';
      default: return 'bx bx-code-alt';
    }
  }

  getTags(tagsString?: string): string[] {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim());
  }

  getStackName(stackId: string): string {
    const stack = this.stacks.find(s => s.StackId === stackId);
    return stack ? stack.Name : 'Unknown';
  }

  getRelatedProblemsCount(project: ProjectStructure): number {
    let count = 0;
    project.PSG?.forEach(psg => {
      if (psg.RelatedProblemIds) {
        if (Array.isArray(psg.RelatedProblemIds)) {
          count += psg.RelatedProblemIds.length;
        } else if (typeof psg.RelatedProblemIds === 'object') {
          count += Object.keys(psg.RelatedProblemIds).length;
        }
      }
    });
    return count;
  }
  
  loadCategories(): void {
    this.cs.getAllCategories().subscribe({
      next: (response) => {
        if(response.success) {
          this.categories = response.categories as Category[];
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  loadStacks(): void {
    this.ss.getAllStacks().subscribe({
      next: (response) => {
        if(response.success) {
          this.stacks = response.stacks as Stack[];
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  loadProblems(): void {
    this.ps.getApprovedProblems().subscribe({
      next: (response) => {
        if(response.success) {
          this.problems = response.problems as Problem[];
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  loadProjectStructures(): void {
    this.pss.getAllProjectStructures().subscribe({
      next: (response) => {
        if(response.success) {
          this.projectStructures = response.projects as ProjectStructure[];
        } else {
          // this.ns.showAlert(SuccessType.Warning, response.error as string);
        }
      },
      error: (error) => {
        this.ns.showAlert(SuccessType.Error, error.error.error as string);
      }
    });
  }

  onSubmit(): void {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', this.contactData);
    
    // Show success message (in a real app)
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    this.contactData = {
      name: '',
      email: '',
      subject: 'general',
      message: ''
    };
  }

  subscribeNewsletter(): void {
    // Here you would typically send the email to your backend
    console.log('Newsletter subscription:', this.newsletterEmail);
    
    // Show success message (in a real app)
    alert('Thank you for subscribing to our newsletter!');
    
    // Reset form
    this.newsletterEmail = '';
  }

  nextTestimonial(): void {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
    this.updateTestimonialDisplay();
  }

  prevTestimonial(): void {
    this.currentTestimonial = (this.currentTestimonial - 1 + this.testimonials.length) % this.testimonials.length;
    this.updateTestimonialDisplay();
  }

  goToTestimonial(index: number): void {
    this.currentTestimonial = index;
    this.updateTestimonialDisplay();
  }

  updateTestimonialDisplay(): void {
    const slider = document.querySelector('.testimonials-slider') as HTMLElement;
    if (slider) {
      const slideWidth = slider.clientWidth;
      slider.style.transform = `translateX(-${this.currentTestimonial * slideWidth}px)`;
    }
  }

  setupScrollAnimations(): void {
    // This would be better implemented with IntersectionObserver API
    // For simplicity, we're using a basic scroll event
    window.addEventListener('scroll', () => {
      const elements = document.querySelectorAll('.info-card, .contact-form-container, .testimonial-card, .footer-about, .footer-links, .footer-newsletter');
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        if (rect.top <= windowHeight * 0.85) {
          el.classList.add('show');
        }
      });
    });
    
    // Trigger once on load
    setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 300);
  }
}