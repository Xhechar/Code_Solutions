import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {Problem, Category, ProjectStructure, Stack, ContactData, Testimonial } from '../../interfaces/solutions.interfaces';

interface Message {
  id: number;
  sender: string;
  avatarUrl: string;
  text: string;
  time: string;
  isOutgoing: boolean;
  imageUrl?: string;
  isRead?: boolean;
}

interface User {
  id: number;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  title = '';
  groupName = 'Dev Team';
  members: User[] = [];
  messages: Message[] = [];
  currentMessage = '';
  isInTyping = false;
  typingUser: User | null = null;
  showEmojiPicker = false;
  mediaOverlayActive = false;
  selectedImage = '';
  currentDate = new Date();

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
      image: 'https://randomuser.me/api/portraits/men/32.jpgg'
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.startTypingAnimation();
    this.initMembers();
    this.initMessages();
    this.loadDummyData();
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

  private initMembers(): void {
    this.members = [
      { id: 1, name: 'Alex Johnson', avatarUrl: '/api/placeholder/40/40', isOnline: true },
      { id: 2, name: 'Sarah Parker', avatarUrl: '/api/placeholder/40/40', isOnline: true },
      { id: 3, name: 'Mike Chen', avatarUrl: '/api/placeholder/40/40', isOnline: true },
      { id: 4, name: 'Emma Williams', avatarUrl: '/api/placeholder/40/40', isOnline: false },
      { id: 5, name: 'Jason Smith', avatarUrl: '/api/placeholder/40/40', isOnline: false }
    ];
  }

  private initMessages(): void {
    const todayDate = new Date();
    
    this.messages = [
      {
        id: 1,
        sender: 'Alex Johnson',
        avatarUrl: '/api/placeholder/40/40',
        text: 'Hey team! I\'ve just uploaded the new designs for the homepage 🎨',
        time: '10:24 AM',
        isOutgoing: false
      },
      {
        id: 2,
        sender: 'Alex Johnson',
        avatarUrl: '/api/placeholder/40/40',
        text: 'What do you all think?',
        time: '10:25 AM',
        isOutgoing: false,
        imageUrl: '/api/placeholder/300/200'
      },
      {
        id: 3,
        sender: 'You',
        avatarUrl: '',
        text: 'Looks amazing! I love the color scheme 😍',
        time: '10:30 AM',
        isOutgoing: true,
        isRead: true
      },
      {
        id: 4,
        sender: 'Sarah Parker',
        avatarUrl: '/api/placeholder/40/40',
        text: 'Thanks! I was thinking we could implement this next week. What\'s everyone\'s schedule like?',
        time: '10:32 AM',
        isOutgoing: false
      },
      {
        id: 5,
        sender: 'You',
        avatarUrl: '',
        text: 'I\'m free all week. Can we start on Monday? 📅',
        time: '10:35 AM',
        isOutgoing: true,
        isRead: true
      },
      {
        id: 6,
        sender: 'Mike Chen',
        avatarUrl: '/api/placeholder/40/40',
        text: 'Here\'s another angle:',
        time: '10:40 AM',
        isOutgoing: false,
        imageUrl: '/api/placeholder/300/200'
      }
    ];
  }

  sendMessage(): void {
    if (!this.currentMessage.trim()) return;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    const newMessage: Message = {
      id: this.messages.length + 1,
      sender: 'You',
      avatarUrl: '',
      text: this.currentMessage.trim(),
      time: timeString,
      isOutgoing: true,
      isRead: false
    };
    
    this.messages.push(newMessage);
    this.currentMessage = '';
    
    // Simulate response
    this.simulateResponse();
  }

  simulateResponse(): void {
    this.isInTyping = true;
    const randomUserIndex = Math.floor(Math.random() * 3);
    this.typingUser = this.members[randomUserIndex];

    setTimeout(() => {
      this.isInTyping = false;

      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;

      const responses = [
        "Great idea! Let me think about it.",
        "I agree with your approach.",
        "Could you provide more details?",
        "Thanks for sharing that! 👍",
        "Let's discuss this further in our next meeting."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const responseMessage: Message = {
        id: this.messages.length + 1,
        sender: this.typingUser!.name,
        avatarUrl: this.typingUser!.avatarUrl,
        text: randomResponse,
        time: timeString,
        isOutgoing: false
      };

      this.messages.push(responseMessage);
    }, 2000);
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
    this.router.navigate(['/problems', problemId]);
  }

  viewProjectStructure(projectId: string): void {
    this.router.navigate(['/project-structures', projectId]);
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

  loadDummyData(): void {
    // Categories Data
    this.categories = [
      { CategoryId: 'cat1', Name: 'Runtime', Description: 'Runtime errors that occur during execution' },
      { CategoryId: 'cat2', Name: 'Database', Description: 'Database connection and query errors' },
      { CategoryId: 'cat3', Name: 'API', Description: 'REST API and endpoint errors' },
      { CategoryId: 'cat4', Name: 'Syntax', Description: 'Code syntax and formatting errors' }
    ];

    // Stacks Data
    this.stacks = [
      { StackId: 'stack1', Name: 'JavaScript', Description: 'JavaScript language', Version: 'ES6+' },
      { StackId: 'stack2', Name: 'React', Description: 'React framework', Version: '18.0' },
      { StackId: 'stack3', Name: 'Angular', Description: 'Angular framework', Version: '15.0' },
      { StackId: 'stack4', Name: 'Node.js', Description: 'Node.js runtime', Version: '16.x' },
      { StackId: 'stack5', Name: 'Python', Description: 'Python language', Version: '3.9' }
    ];

    // Problems Data
    this.problems = [
      {
        ProblemId: 'prob1',
        Title: 'TypeError: Cannot read property of undefined',
        Description: 'Getting a TypeError when trying to access a property of an object that is undefined during React component rendering.',
        ErrorCode: "TypeError: Cannot read property 'length' of undefined at Component.render",
        Context: 'React component that displays a list of items',
        Environment: 'Chrome 90, React 17',
        Tags: 'React,Frontend,TypeError',
        Reproducibility: true,
        Logs: 'Full error stack trace...',
        PriorityLevel: 2,
        DateCreated: new Date('2024-11-05'),
        StackId: 'stack2',
        CategoryId: 'cat1',
        IsApproved: true,
        UserId: 'user1'
      },
      {
        ProblemId: 'prob2',
        Title: 'Database Connection Refused Error',
        Description: 'PostgreSQL connection is being refused when trying to connect from Node.js application.',
        ErrorCode: "Error: Connection refused at Database.connect (postgres://localhost:5432)",
        Context: 'Node.js backend API startup',
        Environment: 'Node.js 16, PostgreSQL 13',
        Tags: 'PostgreSQL,Backend,Connection',
        Reproducibility: true,
        PriorityLevel: 1,
        DateCreated: new Date('2024-11-10'),
        StackId: 'stack4',
        CategoryId: 'cat2',
        IsApproved: true,
        UserId: 'user2'
      },
      {
        ProblemId: 'prob3',
        Title: 'API Endpoint 404 Not Found',
        Description: 'Getting 404 errors when trying to access a REST API endpoint that should exist.',
        ErrorCode: "404 Not Found: API endpoint /api/users not found",
        Context: 'Frontend making AJAX calls to backend',
        Environment: 'Production server',
        Tags: 'API,REST,HTTP',
        Reproducibility: true,
        PriorityLevel: 2,
        DateCreated: new Date('2024-11-15'),
        StackId: 'stack1',
        CategoryId: 'cat3',
        IsApproved: true,
        UserId: 'user3'
      },
      {
        ProblemId: 'prob4',
        Title: 'Syntax Error in Python Import Statement',
        Description: 'Getting a syntax error when trying to import a module in Python.',
        ErrorCode: "SyntaxError: invalid syntax at line 5, from module import Class as Cls",
        Context: 'Python module initialization',
        Environment: 'Python 3.9',
        Tags: 'Python,Import,Syntax',
        Reproducibility: true,
        PriorityLevel: 3,
        DateCreated: new Date('2024-11-20'),
        StackId: 'stack5',
        CategoryId: 'cat4',
        IsApproved: true,
        UserId: 'user1'
      },
      {
        ProblemId: 'prob5',
        Title: 'React Hooks Rules Violation',
        Description: 'Getting a warning about React Hooks rules being violated - hooks must be called in the same order.',
        ErrorCode: "Warning: React Hook useEffect has a conditional dependency",
        Context: 'React functional component with hooks',
        Environment: 'React 17',
        Tags: 'React,Hooks,ESLint',
        Reproducibility: true,
        PriorityLevel: 3,
        DateCreated: new Date('2024-11-25'),
        StackId: 'stack2',
        CategoryId: 'cat4',
        IsApproved: true,
        UserId: 'user2'
      },
      {
        ProblemId: 'prob6',
        Title: 'Angular Change Detection Error',
        Description: 'Angular application throws ExpressionChangedAfterItHasBeenCheckedError during development.',
        ErrorCode: "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked",
        Context: 'Angular component lifecycle',
        Environment: 'Angular 15, Chrome',
        Tags: 'Angular,ChangeDetection,DevMode',
        Reproducibility: true,
        PriorityLevel: 2,
        DateCreated: new Date('2024-12-01'),
        StackId: 'stack3',
        CategoryId: 'cat1',
        IsApproved: true,
        UserId: 'user3'
      },
      {
        ProblemId: 'prob7',
        Title: 'MongoDB Connection Timeout',
        Description: 'Node.js application fails to connect to MongoDB with a timeout error after deployment.',
        ErrorCode: "MongoTimeoutError: Server selection timed out after 30000ms",
        Context: 'Node.js API server startup in production',
        Environment: 'Node.js 16, MongoDB 5.0',
        Tags: 'MongoDB,Connection,Timeout,Node.js',
        Reproducibility: true,
        PriorityLevel: 1,
        DateCreated: new Date('2024-12-05'),
        StackId: 'stack4',
        CategoryId: 'cat2',
        IsApproved: true,
        UserId: 'user1'
      },
      {
        ProblemId: 'prob8',
        Title: 'CORS Policy Blocked Request',
        Description: 'Browser blocks API requests due to CORS policy when frontend tries to access backend API.',
        ErrorCode: "Access to fetch at 'https://api.example.com' from origin 'https://app.example.com' has been blocked by CORS policy",
        Context: 'Frontend application making API calls',
        Environment: 'Chrome, Firefox',
        Tags: 'CORS,API,Security,Frontend',
        Reproducibility: true,
        PriorityLevel: 2,
        DateCreated: new Date('2024-12-10'),
        StackId: 'stack1',
        CategoryId: 'cat3',
        IsApproved: true,
        UserId: 'user2'
      },
      {
        ProblemId: 'prob9',
        Title: 'Memory Leak in React Application',
        Description: 'React application gradually consumes more memory leading to performance degradation.',
        ErrorCode: "Warning: Can't perform a React state update on an unmounted component",
        Context: 'React components with subscriptions or timers',
        Environment: 'React 17, Chrome',
        Tags: 'React,MemoryLeak,Performance,useEffect',
        Reproducibility: true,
        PriorityLevel: 2,
        DateCreated: new Date('2024-12-15'),
        StackId: 'stack2',
        CategoryId: 'cat1',
        IsApproved: true,
        UserId: 'user3'
      },
      {
        ProblemId: 'prob10',
        Title: 'Python Dependency Version Conflict',
        Description: 'Python application crashes due to incompatible dependency versions.',
        ErrorCode: "ImportError: cannot import name 'utils' from 'package'",
        Context: 'Python application startup',
        Environment: 'Python 3.9, pip',
        Tags: 'Python,Dependencies,Versioning',
        Reproducibility: true,
        PriorityLevel: 2,
        DateCreated: new Date('2024-12-20'),
        StackId: 'stack5',
        CategoryId: 'cat4',
        IsApproved: true,
        UserId: 'user1'
      },
      {
        ProblemId: 'prob11',
        Title: 'JWT Authentication Token Expired',
        Description: 'Users are being logged out unexpectedly due to JWT token expiration issues.',
        ErrorCode: "Error: jwt expired at TokenExpiredError",
        Context: 'User authentication flow',
        Environment: 'Node.js backend, React frontend',
        Tags: 'Authentication,JWT,Security',
        Reproducibility: true,
        PriorityLevel: 1,
        DateCreated: new Date('2025-01-05'),
        StackId: 'stack4',
        CategoryId: 'cat3',
        IsApproved: true,
        UserId: 'user2'
      },
      {
        ProblemId: 'prob12',
        Title: 'Angular Route Navigation Failed',
        Description: 'Angular application fails to navigate between routes with cryptic error messages.',
        ErrorCode: "Error: Navigation triggered outside Angular zone, did you forget to use NgZone.run()?",
        Context: 'Angular router navigation',
        Environment: 'Angular 15',
        Tags: 'Angular,Routing,Zone.js',
        Reproducibility: true,
        PriorityLevel: 2,
        DateCreated: new Date('2025-01-10'),
        StackId: 'stack3',
        CategoryId: 'cat1',
        IsApproved: true,
        UserId: 'user3'
      }
    ];

    // Project Structures Data
    this.projectStructures = [
      {
        ProjectId: 'proj1',
        Title: 'React Authentication Boilerplate',
        Description: 'Complete authentication system using React, Redux, and JWT with protected routes and refreshing tokens',
        StackId: 'stack2',
        DateCreated: new Date('2024-10-15'),
        LastUpdated: new Date('2025-01-10'),
        PSG: [
          {
            PSGId: 'psg1',
            Title: 'Setting up JWT Authentication',
            ProjectId: 'proj1',
            TextInstructions: 'Detailed steps for JWT implementation...',
            RelatedProblemIds: ['prob11']
          },
          {
            PSGId: 'psg2',
            Title: 'Protected Routes Implementation',
            ProjectId: 'proj1',
            TextInstructions: 'How to set up protected routes in React...',
            RelatedProblemIds: ['prob1', 'prob9']
          }
        ]
      },
      {
        ProjectId: 'proj2',
        Title: 'MERN Stack E-commerce Platform',
        Description: 'Full-featured e-commerce platform with MongoDB, Express, React, and Node.js including payment processing',
        StackId: 'stack4',
        DateCreated: new Date('2024-11-20'),
        LastUpdated: new Date('2025-02-05'),
        PSG: [
          {
            PSGId: 'psg3',
            Title: 'MongoDB Schema Design',
            ProjectId: 'proj2',
            TextInstructions: 'Optimal schema design for e-commerce...',
            RelatedProblemIds: ['prob2', 'prob7']
          },
          {
            PSGId: 'psg4',
            Title: 'API Integration with Frontend',
            ProjectId: 'proj2',
            TextInstructions: 'Connecting React frontend with Node.js API...',
            RelatedProblemIds: ['prob3', 'prob8']
          },
          {
            PSGId: 'psg5',
            Title: 'Payment Gateway Implementation',
            ProjectId: 'proj2',
            TextInstructions: 'Setting up Stripe payment processing...',
            RelatedProblemIds: ['prob3']
          }
        ]
      },
      {
        ProjectId: 'proj3',
        Title: 'Angular Enterprise Dashboard',
        Description: 'Comprehensive dashboard application with Angular Material, NgRx state management, and real-time data',
        StackId: 'stack3',
        DateCreated: new Date('2024-12-10'),
        LastUpdated: new Date('2025-03-01'),
        PSG: [
          {
            PSGId: 'psg6',
            Title: 'NgRx Store Implementation',
            ProjectId: 'proj3',
            TextInstructions: 'State management patterns with NgRx...',
            RelatedProblemIds: ['prob6']
          },
          {
            PSGId: 'psg7',
            Title: 'Angular Material Components',
            ProjectId: 'proj3',
            TextInstructions: 'Using Material Design components effectively...',
            RelatedProblemIds: ['prob12']
          }
        ]
      },
      {
        ProjectId: 'proj4',
        Title: 'Python Data Processing Pipeline',
        Description: 'Efficient data processing system using Python, Pandas, and PostgreSQL for ETL operations',
        StackId: 'stack5',
        DateCreated: new Date('2025-01-05'),
        LastUpdated: new Date('2025-02-20'),
        PSG: [
          {
            PSGId: 'psg8',
            Title: 'ETL Process Implementation',
            ProjectId: 'proj4',
            TextInstructions: 'Building an Extract, Transform, Load pipeline...',
            RelatedProblemIds: ['prob4', 'prob10']
          },
          {
            PSGId: 'psg9',
            Title: 'Database Integration with Pandas',
            ProjectId: 'proj4',
            TextInstructions: 'Efficient data transfer between Pandas and PostgreSQL...',
            RelatedProblemIds: ['prob2', 'prob10']
          }
        ]
      }
    ];
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
