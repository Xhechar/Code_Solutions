import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
  styleUrl: './landing.component.css'
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
  
  emojiCategories = ['😀', '🐱', '🍎', '⚽', '🏠', '🚗'];
  activeEmojiCategory = '😀';
  emojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥'];

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

  ngOnInit() {
    this.startTypingAnimation();
    this.initMembers();
    this.initMessages();
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
}
