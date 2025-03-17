import { Component, OnInit } from '@angular/core';
import { Badge, Problem, Solution, Comment } from '../../interfaces/solutions.interfaces';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-single-problem',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './single-problem.component.html',
  styleUrl: './single-problem.component.css'
})
export class SingleProblemComponent implements OnInit {
  problem!: Problem;
  relatedProblems!: Problem[];
  newComment: string = '';
  priorityDots: number[] = [1, 2, 3, 4, 5];
  isFavorited: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // In a real application, you would fetch the problem from a service
    // using the route parameter
    const problemId = this.route.snapshot.paramMap.get('id');
    this.problem = this.getDummyProblem();
    this.relatedProblems = this.getDummyRelatedProblems();
  }

  getDummyProblem(): Problem {
    return {
      ProblemId: 'p001',
      Title: 'React setState not updating state immediately',
      Description: 'I\'m having an issue where calling setState() in React doesn\'t update the state immediately. When I log the state right after calling setState(), it still shows the old value. How can I ensure my state updates correctly?',
      ErrorCode: 'Cannot read property \'map\' of undefined',
      Context: 'My component needs to update state based on user input and then perform operations on the updated state.',
      Environment: 'React 17.0.2, Node 14.17.0, npm 6.14.13',
      Tags: 'React,JavaScript,State Management,Frontend',
      Reproducibility: true,
      Logs: 'TypeError: Cannot read property \'map\' of undefined\n    at Component.render (Component.js:25)\n    at processChild (react-dom.development.js:14167)\n    at updateFunctionComponent (react-dom.development.js:17350)',
      PriorityLevel: 3,
      DateCreated: new Date('2025-01-15'),
      StackId: 's001',
      Stack: {
        StackId: 's001',
        Name: 'React',
        Description: 'A JavaScript library for building user interfaces',
        Version: '17.0.2'
      },
      CategoryId: 'c001',
      IsApproved: true,
      Category: {
        CategoryId: 'c001',
        Name: 'Frontend',
        Description: 'Issues related to frontend development'
      },
      Solutions: [
        {
          SolutionId: 'sol001',
          Description: 'React\'s setState is asynchronous. This is why logging the state immediately after calling setState doesn\'t show the updated value.',
          Steps: '1. Use the callback form of setState to ensure you\'re working with the most up-to-date state.\n2. Use the second parameter of setState which is a callback function that will be executed after the state has been updated.\n3. If you need to perform operations based on the updated state, do them inside this callback.',
          CodeSamples: '// Instead of this:\nthis.setState({ count: this.state.count + 1 });\nconsole.log(this.state.count); // This will show the old value\n\n// Do this:\nthis.setState({ count: this.state.count + 1 }, () => {\n  console.log(this.state.count); // This will show the updated value\n});\n\n// Or use the functional form for updating state based on previous state:\nthis.setState(prevState => ({\n  count: prevState.count + 1\n}));',
          CreatedAt: new Date('2025-01-16'),
          UpdatedAt: new Date('2025-01-16'),
          ProblemId: 'p001',
          UserId: 'u002',
          User: {
            UserId: 'u002',
            FullName: 'Jane Developer',
            Username: 'janeDev',
            Email: 'jane@example.com',
            Password: 'hashed_password',
            ProfileImage: 'https://www.pinterest.com/pin/109775309662890568/',
            IsDeleted: false,
            Notified: true,
            IsWelcomed: true,
            DateCreated: new Date('2024-05-10'),
            Badge: Badge.Expert,
            PreviousBadge: Badge.Intermediate,
            ProblemsCount: 45,
            Role: 'user',
            IsSolver: true
          },
          editing: false
        },
        {
          SolutionId: 'sol002',
          Description: 'Another approach is to use the useEffect hook to react to state changes in functional components.',
          Steps: '1. Define your state using useState.\n2. Use useEffect to perform operations when the state changes.\n3. Include the state variable in the dependency array of useEffect.',
          CodeSamples: 'import { useState, useEffect } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    // This will run after count is updated\n    console.log(\'Count updated:\', count);\n    \n    // Perform operations based on the updated count\n    document.title = `Count: ${count}`;\n  }, [count]); // Only re-run when count changes\n  \n  const increment = () => setCount(count + 1);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={increment}>Increment</button>\n    </div>\n  );\n}',
          ImagePath: 'assets/images/solutions/react-useeffect.png',
          VideoLink: 'https://youtube.com/embed/abc123',
          CreatedAt: new Date('2025-01-17'),
          UpdatedAt: new Date('2025-01-17'),
          ProblemId: 'p001',
          UserId: 'u001',
          User: {
            UserId: 'u001',
            FullName: 'Code Solutions Team',
            Username: 'admin',
            Email: 'admin@codesolutions.com',
            Password: 'hashed_admin_password',
            ProfileImage: 'https://www.pinterest.com/pin/109775309662890568/',
            IsDeleted: false,
            Notified: true,
            IsWelcomed: true,
            DateCreated: new Date('2024-01-01'),
            Badge: Badge.Admin,
            PreviousBadge: Badge.Expert,
            ProblemsCount: 120,
            Role: 'admin',
            IsSolver: true
          },
          editing: false
        }
      ],
      Comments: [
        {
          CommentId: 'c001',
          Content: 'I was having the same problem. Thanks for posting this question!',
          DatePosted: new Date('2025-01-16'),
          UserId: 'u003',
          User: {
            UserId: 'u003',
            FullName: 'Sam Smith',
            Username: 'samcoder',
            Email: 'sam@example.com',
            Password: 'hashed_password',
            ProfileImage: 'https://www.pinterest.com/pin/109775309662890568/',
            IsDeleted: false,
            Notified: true,
            IsWelcomed: true,
            DateCreated: new Date('2024-06-12'),
            Badge: Badge.Beginner,
            PreviousBadge: Badge.Beginner,
            ProblemsCount: 5,
            Role: 'user',
            IsSolver: false
          },
          ProblemId: 'p001'
        },
        {
          CommentId: 'c002',
          Content: 'The solution worked perfectly for me! I was struggling with this for hours.',
          DatePosted: new Date('2025-01-17'),
          UserId: 'u004',
          User: {
            UserId: 'u004',
            FullName: 'Alex Johnson',
            Username: 'alexj',
            Email: 'alex@example.com',
            Password: 'hashed_password',
            ProfileImage: 'https://www.pinterest.com/pin/109775309662890568/',
            IsDeleted: false,
            Notified: true,
            IsWelcomed: true,
            DateCreated: new Date('2024-09-01'),
            Badge: Badge.Intermediate,
            PreviousBadge: Badge.Beginner,
            ProblemsCount: 12,
            Role: 'user',
            IsSolver: true
          },
          ProblemId: 'p001'
        }
      ],
      UserId: 'u005',
      User: {
        UserId: 'u005',
        FullName: 'Chris Taylor',
        Username: 'christay',
        Email: 'chris@example.com',
        Password: 'hashed_password',
        ProfileImage: 'https://www.pinterest.com/pin/109775309662890568/',
        IsDeleted: false,
        Notified: true,
        IsWelcomed: true,
        DateCreated: new Date('2024-07-05'),
        Badge: Badge.Intermediate,
        PreviousBadge: Badge.Beginner,
        ProblemsCount: 8,
        Role: 'user',
        IsSolver: false
      },
      expanded: false
    };
  }

  getDummyRelatedProblems(): Problem[] {
    return [
      {
        ProblemId: 'p002',
        Title: 'React useEffect hook firing twice',
        Description: 'I noticed that my useEffect hook is firing twice on component mount. This is causing my API calls to be executed twice, which is not ideal.',
        DateCreated: new Date('2025-01-10'),
        StackId: 's001',
        Stack: {
          StackId: 's001',
          Name: 'React',
          Description: 'A JavaScript library for building user interfaces',
          Version: '17.0.2'
        },
        CategoryId: 'c001',
        IsApproved: true,
        Reproducibility: true,
        UserId: 'u002',
        expanded: false
      },
      {
        ProblemId: 'p003',
        Title: 'Optimizing React renders with memo',
        Description: 'I have a complex component that renders many times unnecessarily. How can I optimize it to prevent unnecessary renders?',
        DateCreated: new Date('2025-01-05'),
        StackId: 's001',
        Stack: {
          StackId: 's001',
          Name: 'React',
          Description: 'A JavaScript library for building user interfaces',
          Version: '17.0.2'
        },
        CategoryId: 'c001',
        IsApproved: true,
        Reproducibility: true,
        UserId: 'u001',
        expanded: false
      },
      {
        ProblemId: 'p004',
        Title: 'React Context API vs Redux for state management',
        Description: 'I\'m trying to decide between using React Context API or Redux for state management in my application. What are the pros and cons of each?',
        DateCreated: new Date('2025-01-12'),
        StackId: 's001',
        Stack: {
          StackId: 's001',
          Name: 'React',
          Description: 'A JavaScript library for building user interfaces',
          Version: '17.0.2'
        },
        CategoryId: 'c001',
        IsApproved: true,
        Reproducibility: false,
        UserId: 'u003',
        expanded: false
      }
    ];
  }

  // Helper functions for the view
  toggleFavorite(): void {
    this.isFavorited = !this.isFavorited;
    // In a real app, call a service to save the favorite state
  }

  shareProblem(): void {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  }

  getBadgeName(badge: Badge): string {
    return Badge[badge];
  }

  getTags(tagsString: string): string[] {
    return tagsString ? tagsString.split(',') : [];
  }

  getExcerpt(text: string, maxChars: number = 100): string {
    if (!text) return '';
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars) + '...';
  }

  formatSteps(steps: string): string {
    if (!steps) return '';
    const list = steps.split('\n').map(step => `<li>${step}</li>`).join('');
    return `<ol>${list}</ol>`;
  }

  formatCode(code: string): string {
    if (!code) return '';
    // Basic syntax highlighting could be implemented here
    return code;
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    if (!url) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openAddSolutionModal(): void {
    // Implement modal functionality
    console.log('Opening add solution modal');
  }

  openImageModal(imageUrl: string): void {
    // Implement image modal functionality
    console.log('Opening image modal for:', imageUrl);
  }

  submitComment(): void {
    if (!this.newComment?.trim()) return;

    // In a real app, call a service to save the comment
    const newComment: Comment = {
      CommentId: `c${((this.problem.Comments as Comment[])).length + 1}`,
      Content: this.newComment,
      DatePosted: new Date(),
      UserId: 'u999', // Current user ID
      ProblemId: this.problem.ProblemId,
      User: {
        UserId: 'u999',
        FullName: 'Current User',
        Username: 'currentuser',
        Email: 'current@example.com',
        Password: 'hashed_password',
        ProfileImage: 'https://www.pinterest.com/pin/109775309662890568/',
        IsDeleted: false,
        Notified: true,
        IsWelcomed: true,
        DateCreated: new Date('2024-01-01'),
        Badge: Badge.Intermediate,
        PreviousBadge: Badge.Beginner,
        ProblemsCount: 15,
        Role: 'user',
        IsSolver: true
      }
    };

    ((this.problem.Comments) as Comment[]).push(newComment);
    this.newComment = '';
  }

  voteSolution(solution: Solution, type: 'up' | 'down'): void {
    // In a real app, call a service to save the vote
    console.log(`Voting ${type} for solution:`, solution.SolutionId);
    // This would typically update a votes property on the solution
  }

  hasVoted(solution: Solution, type: 'up' | 'down'): boolean {
    // In a real app, check if the current user has voted
    return false;
  }

  getVoteCount(solution: Solution, type: 'up' | 'down'): number {
    // In a real app, get the vote count from the solution
    return type === 'up' ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 3);
  }
}
