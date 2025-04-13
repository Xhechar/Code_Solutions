import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Title, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category, Problem, ProjectStructure, PSG, Solution, Stack, SuccessType, User } from '../../interfaces/solutions.interfaces';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationsService } from '../../services/modifiers/notifications.service';
import { ProjectStructureService } from '../../services/project-structure.service';

@Component({
  selector: 'app-single-project-structure',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './single-project-structure.component.html',
  styleUrl: './single-project-structure.component.css'
})
export class SingleProjectStructureComponent {
  // projectId: string = '';
  // projectStructure: ProjectStructure | null = null;
  // loading: boolean = true;
  // error: boolean = false;
  // activeGuideIndex: number = 0;
  // showImageViewer: boolean = false;
  // selectedImage: string = '';

  // constructor(
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private pss: ProjectStructureService,
  //   private titleService: Title,
  //   private sanitizer: DomSanitizer,
  //   private ns: NotificationsService
  // ) { }

  // ngOnInit(): void {
  //   this.route.paramMap.subscribe(params => {
  //     const id = params.get('ProjectId');
  //     if (id) {
  //       this.projectId = id;
  //       this.loadProjectStructure();
  //     } else {
  //       this.router.navigate(['/project-structures']);
  //     }
  //   });
  // }

  // loadProjectStructure(): void {
  //   this.loading = true;
  //   this.error = false;

  //   // Replace with your actual API endpoint
  //   this.pss.getSingleProjectStructure(this.projectId)
  //     .subscribe({
  //       next: (response) => {
  //         if (response.success) {
  //           this.projectStructure = response.projectStructure as ProjectStructure;
  //           this.titleService.setTitle(`${this.projectStructure.Title} - Project Structure`);
  //           this.loading = false;

  //           if (response.projectStructure?.PSG && response.projectStructure.PSG.length > 0) {
  //             this.activeGuideIndex = 0;
  //           }
  //           this.ns.showAlert(SuccessType.Success, response.message as string);
  //         } else {
  //           this.ns.showAlert(SuccessType.Warning, response.error as string);
  //           this.loading = false;
  //           this.error = true;
  //         }
  //       },
  //       error: (err) => {
  //         this.ns.showAlert(SuccessType.Error, err.error.error as string);
  //         this.loading = false;
  //         this.error = true;
  //       }
  //     });
  // }

  // setActiveGuide(index: number): void {
  //   this.activeGuideIndex = index;
  // }

  // formatInstructions(text: string): SafeHtml {
  //   if (!text) return '';
    
  //   // Convert markdown-like formatting to HTML
  //   // This is a simple implementation - consider using a markdown library for more complex needs
  //   let formatted = text
  //     // Headers
  //     .replace(/^# (.*$)/gm, '<h2>$1</h2>')
  //     .replace(/^## (.*$)/gm, '<h3>$1</h3>')
  //     .replace(/^### (.*$)/gm, '<h4>$1</h4>')
  //     // Bold
  //     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  //     // Italic
  //     .replace(/\*(.*?)\*/g, '<em>$1</em>')
  //     // Code blocks
  //     .replace(/```([^`]*?)```/gm, '<pre><code>$1</code></pre>')
  //     // Inline code
  //     .replace(/`([^`]*?)`/g, '<code>$1</code>')
  //     // Lists
  //     .replace(/^\- (.*$)/gm, '<li>$1</li>')
  //     // Links
  //     .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
  //     // Line breaks
  //     .replace(/\n/g, '<br>');
    
  //   // Replace list items with proper UL lists
  //   if (formatted.includes('<li>')) {
  //     formatted = formatted.replace(/<li>.*?(<br>|$)/g, (match) => {
  //       return '<ul>' + match + '</ul>';
  //     });
  //     formatted = formatted.replace(/<\/ul><br><ul>/g, '');
  //   }
    
  //   return this.sanitizer.bypassSecurityTrustHtml(formatted);
  // }

  // getGuideImages(pictorialGuide: string | undefined): string[] {
  //   if (!pictorialGuide) return [];
  //   return pictorialGuide.split(',').map(img => img.trim());
  // }

  // openImageViewer(image: string): void {
  //   this.selectedImage = image;
  //   this.showImageViewer = true;
  //   document.body.style.overflow = 'hidden'; // Prevent background scrolling
  // }

  // closeImageViewer(): void {
  //   this.showImageViewer = false;
  //   document.body.style.overflow = ''; // Restore scrolling
  // }

  // truncateText(text: string, maxLength: number): string {
  //   if (!text) return '';
  //   if (text.length <= maxLength) return text;
  //   return text.substring(0, maxLength) + '...';
  // }

  // downloadProject(): void {
  //   if (!this.projectStructure) return;
    
  //   // Create a downloadable content from project structure
  //   const content = {
  //     title: this.projectStructure.Title,
  //     description: this.projectStructure.Description,
  //     stack: this.projectStructure.Stack?.Name,
  //     guides: this.projectStructure.PSG?.map(guide => ({
  //       title: guide.Title,
  //       instructions: guide.TextInstructions
  //     }))
  //   };
    
  //   // Create and trigger download
  //   const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `${this.projectStructure.Title.replace(/\s+/g, '-').toLowerCase()}-guide.json`;
  //   document.body.appendChild(a);
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  //   document.body.removeChild(a);
  // }

  projectId: string = '';
  projectStructure: ProjectStructure | null = null;
  loading: boolean = true;
  error: boolean = false;
  activeGuideIndex: number = 0;
  showImageViewer: boolean = false;
  selectedImage: string = '';

  // Dummy data for testing
  dummyUser: User = {
    UserId: "u-123",
    FullName: "John Developer",
    Username: "johndeveloper",
    Email: "john@example.com",
    Password: "***", // This should never contain real passwords
    ProfileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    IsDeleted: false,
    Notified: true,
    IsWelcomed: true,
    DateCreated: new Date(2023, 5, 15),
    Badge: "Gold" as any, // Assuming Badge is an enum that exists in your type definitions
    PreviousBadge: "Silver" as any,
    ProblemsCount: 15,
    Role: "Developer",
    IsSolver: true
  };

  dummyStack: Stack = {
    StackId: "s-123",
    Name: "MERN Stack",
    Description: "MongoDB, Express, React, Node.js stack for full-stack JavaScript development",
    Version: "v6.0"
  };

  dummyCategory: Category = {
    CategoryId: "c-123",
    Name: "Backend Development",
    Description: "Server-side application logic and database operations"
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private titleService: Title,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('ProjectId');
      if (id) {
        this.projectId = id;
        // Load dummy data instead of making an API call
        this.loadDummyData();
      } else {
        this.router.navigate(['/project-structures']);
      }
    });
  }

  loadProjectStructure(): void {
    this.loading = true;
    this.error = false;

    // Replace with your actual API endpoint
    this.http.get<ProjectStructure>(`/api/project-structures/${this.projectId}`)
      .subscribe({
        next: (data) => {
          this.projectStructure = data;
          this.titleService.setTitle(`${data.Title} - Project Structure`);
          this.loading = false;
          
          // Set first guide as active if available
          if (data.PSG && data.PSG.length > 0) {
            this.activeGuideIndex = 0;
          }
        },
        error: (err) => {
          console.error('Error fetching project structure:', err);
          this.loading = false;
          this.error = true;
        }
      });
  }

  loadDummyData(): void {
    // Simulate loading delay
    setTimeout(() => {
      // Create dummy problems
      const dummyProblems: Problem[] = [
        {
          ProblemId: "p-123",
          Title: "MongoDB Connection Issues",
          Description: "Unable to connect to MongoDB Atlas cluster due to network configurations or incorrect connection string.",
          ErrorCode: "MongoNetworkError",
          Context: "Backend service startup",
          Environment: "Development, Production",
          Tags: "mongodb,database,connection,atlas",
          Reproducibility: true,
          Logs: "Error: MongoNetworkError: connection 5 to cluster0-shard-00-00.mongodb.net:27017 closed\n at Connection.<anonymous> (/app/node_modules/mongodb/lib/core/connection.js:352:9)",
          PriorityLevel: 4,
          DateCreated: new Date(2024, 1, 15),
          StackId: this.dummyStack.StackId,
          Stack: this.dummyStack,
          CategoryId: this.dummyCategory.CategoryId,
          IsApproved: true,
          Category: this.dummyCategory,
          UserId: this.dummyUser.UserId,
          User: this.dummyUser
        },
        {
          ProblemId: "p-124",
          Title: "JWT Authentication Failure",
          Description: "Users are experiencing authentication failures when the JWT token is being validated on protected routes.",
          ErrorCode: "JsonWebTokenError",
          Context: "User authentication process",
          Environment: "Production",
          Tags: "authentication,jwt,security,token",
          Reproducibility: true,
          PriorityLevel: 5,
          DateCreated: new Date(2024, 2, 20),
          StackId: this.dummyStack.StackId,
          Stack: this.dummyStack,
          CategoryId: this.dummyCategory.CategoryId,
          IsApproved: true,
          Category: this.dummyCategory,
          UserId: this.dummyUser.UserId,
          User: this.dummyUser
        }
      ];

      // Create dummy solutions
      const dummySolutions: Solution[] = [
        {
          SolutionId: "sol-123",
          Description: "Configure MongoDB Atlas network settings to allow connections from your application servers.",
          Steps: "1. Log into your MongoDB Atlas account\n2. Navigate to Network Access under Security\n3. Add your current IP address or use 0.0.0.0/0 for allowing connections from anywhere\n4. Ensure your connection string is correctly formatted with proper credentials\n5. Test connection using MongoDB Compass",
          CodeSamples: "const mongoose = require('mongoose');\n\nmongoose.connect(process.env.MONGODB_URI, {\n  useNewUrlParser: true,\n  useUnifiedTopology: true,\n  serverSelectionTimeoutMS: 5000\n})\n.then(() => console.log('Connected to MongoDB'))\n.catch(err => console.error('MongoDB connection error:', err));",
          CreatedAt: new Date(2024, 1, 16),
          UpdatedAt: new Date(2024, 1, 16),
          ProblemId: "p-123",
          Problem: dummyProblems[0],
          UserId: this.dummyUser.UserId,
          User: this.dummyUser
        },
        {
          SolutionId: "sol-124",
          Description: "Fix JWT token validation by ensuring proper secret key configuration and token expiration handling.",
          Steps: "1. Check that the secret key is consistent across all environments\n2. Implement proper error handling for expired tokens\n3. Add refresh token functionality\n4. Ensure proper token storage on client side",
          CodeSamples: "// Server-side verification\nconst jwt = require('jsonwebtoken');\n\nconst verifyToken = (req, res, next) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  \n  if (!token) {\n    return res.status(401).json({ message: 'No token provided' });\n  }\n  \n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded;\n    next();\n  } catch (error) {\n    if (error.name === 'TokenExpiredError') {\n      return res.status(401).json({ message: 'Token expired' });\n    }\n    return res.status(403).json({ message: 'Invalid token' });\n  }\n};",
          VideoLink: "https://example.com/jwt-auth-solution",
          CreatedAt: new Date(2024, 2, 25),
          UpdatedAt: new Date(2024, 3, 5),
          ProblemId: "p-124",
          Problem: dummyProblems[1],
          UserId: this.dummyUser.UserId,
          User: this.dummyUser
        }
      ];

      // Create dummy project structure guides
      const dummyGuides: PSG[] = [
        {
          PSGId: "psg-123",
          Title: "Setting Up MongoDB Atlas",
          ProjectId: this.projectId,
          TextInstructions: "# Setting Up MongoDB Atlas\n\nMongoDB Atlas is a fully-managed cloud database developed by the same people that build MongoDB. Atlas handles all the complexity of deploying, managing, and healing your deployments on the cloud service provider of your choice.\n\n## Prerequisites\n- A MongoDB Atlas account\n- Basic understanding of NoSQL databases\n\n## Steps\n\n1. **Create an Atlas Account**\n   - Go to the [MongoDB Atlas website](https://www.mongodb.com/cloud/atlas)\n   - Click on \"Try Free\" and complete the registration process\n\n2. **Create a New Cluster**\n   - After logging in, click on \"Build a Cluster\"\n   - Select your preferred cloud provider (AWS, Google Cloud, or Azure)\n   - Choose the region closest to your users\n   - Select \"M0 Sandbox\" for the free tier\n   - Click \"Create Cluster\"\n\n3. **Configure Network Access**\n   - While your cluster is being created, click on \"Network Access\" in the sidebar\n   - Click \"Add IP Address\"\n   - For development, you can allow access from anywhere by entering `0.0.0.0/0`\n   - For production, restrict to specific IP addresses\n\n4. **Create a Database User**\n   - Click on \"Database Access\" in the sidebar\n   - Click \"Add New Database User\"\n   - Enter a username and a secure password\n   - Assign appropriate permissions (typically \"Read and Write to any database\")\n   - Click \"Add User\"\n\n5. **Get Your Connection String**\n   - Once your cluster is ready, click \"Connect\"\n   - Select \"Connect your application\"\n   - Choose your driver and version\n   - Copy the connection string\n   - Replace `<password>` with your database user's password\n\n6. **Use the Connection String in Your Application**\n   ```javascript\n   const mongoose = require('mongoose');\n   \n   mongoose.connect('mongodb+srv://username:<password>@clustername.mongodb.net/database?retryWrites=true&w=majority', {\n     useNewUrlParser: true,\n     useUnifiedTopology: true\n   });\n   ```\n\n## Testing Your Connection\nTo test your connection, you can add some simple logging:\n\n```javascript\nmongoose.connection.on('connected', () => {\n  console.log('Connected to MongoDB Atlas');\n});\n\nmongoose.connection.on('error', (err) => {\n  console.error('MongoDB connection error:', err);\n});\n```",
          PictorialGuide: "https://example.com/images/mongo-atlas-1.jpg,https://example.com/images/mongo-atlas-2.jpg,https://example.com/images/mongo-atlas-3.jpg",
          RelatedProblems: [dummyProblems[0]],
          RelatedSolutions: [dummySolutions[0]],
          RelatedProblemIds: undefined
        },
        {
          PSGId: "psg-124",
          Title: "Implementing JWT Authentication",
          ProjectId: this.projectId,
          TextInstructions: "# Implementing JWT Authentication\n\nJSON Web Tokens (JWT) provide a way to securely transmit information between parties as a JSON object. This guide will walk you through implementing JWT-based authentication in your MERN stack application.\n\n## Prerequisites\n- Node.js and Express API setup\n- MongoDB database connection\n- User model defined\n\n## Steps\n\n1. **Install Required Packages**\n   ```bash\n   npm install jsonwebtoken bcryptjs\n   ```\n\n2. **Create User Model with Password Hashing**\n   ```javascript\n   const mongoose = require('mongoose');\n   const bcrypt = require('bcryptjs');\n   \n   const userSchema = new mongoose.Schema({\n     username: { type: String, required: true, unique: true },\n     email: { type: String, required: true, unique: true },\n     password: { type: String, required: true },\n     // Add other fields as needed\n   });\n   \n   // Hash password before saving\n   userSchema.pre('save', async function(next) {\n     if (!this.isModified('password')) return next();\n     \n     try {\n       const salt = await bcrypt.genSalt(10);\n       this.password = await bcrypt.hash(this.password, salt);\n       next();\n     } catch (error) {\n       next(error);\n     }\n   });\n   \n   // Method to compare passwords\n   userSchema.methods.comparePassword = async function(candidatePassword) {\n     return bcrypt.compare(candidatePassword, this.password);\n   };\n   \n   module.exports = mongoose.model('User', userSchema);\n   ```\n\n3. **Create JWT Authentication Middleware**\n   ```javascript\n   const jwt = require('jsonwebtoken');\n   \n   exports.protect = async (req, res, next) => {\n     let token;\n     \n     // Check for token in headers\n     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {\n       token = req.headers.authorization.split(' ')[1];\n     }\n     \n     if (!token) {\n       return res.status(401).json({ message: 'Not authorized to access this route' });\n     }\n     \n     try {\n       // Verify token\n       const decoded = jwt.verify(token, process.env.JWT_SECRET);\n       \n       // Attach user to request object\n       req.user = decoded;\n       next();\n     } catch (error) {\n       return res.status(401).json({ message: 'Not authorized to access this route' });\n     }\n   };\n   ```\n\n4. **Implement Login and Register Routes**\n   ```javascript\n   const User = require('../models/User');\n   const jwt = require('jsonwebtoken');\n   \n   // Generate JWT Token\n   const generateToken = (id) => {\n     return jwt.sign({ id }, process.env.JWT_SECRET, {\n       expiresIn: '30d',\n     });\n   };\n   \n   // Register User\n   exports.register = async (req, res) => {\n     try {\n       const { username, email, password } = req.body;\n       \n       // Check if user exists\n       const userExists = await User.findOne({ email });\n       if (userExists) {\n         return res.status(400).json({ message: 'User already exists' });\n       }\n       \n       // Create user\n       const user = await User.create({\n         username,\n         email,\n         password,\n       });\n       \n       // Generate token\n       const token = generateToken(user._id);\n       \n       res.status(201).json({\n         _id: user._id,\n         username: user.username,\n         email: user.email,\n         token,\n       });\n     } catch (error) {\n       res.status(500).json({ message: 'Server error', error: error.message });\n     }\n   };\n   \n   // Login User\n   exports.login = async (req, res) => {\n     try {\n       const { email, password } = req.body;\n       \n       // Find user\n       const user = await User.findOne({ email });\n       if (!user) {\n         return res.status(401).json({ message: 'Invalid credentials' });\n       }\n       \n       // Check password\n       const isMatch = await user.comparePassword(password);\n       if (!isMatch) {\n         return res.status(401).json({ message: 'Invalid credentials' });\n       }\n       \n       // Generate token\n       const token = generateToken(user._id);\n       \n       res.json({\n         _id: user._id,\n         username: user.username,\n         email: user.email,\n         token,\n       });\n     } catch (error) {\n       res.status(500).json({ message: 'Server error', error: error.message });\n     }\n   };\n   ```\n\n5. **Protect Routes with Authentication Middleware**\n   ```javascript\n   const express = require('express');\n   const router = express.Router();\n   const { protect } = require('../middleware/auth');\n   const { getProfile } = require('../controllers/user');\n   \n   // Protected route\n   router.get('/profile', protect, getProfile);\n   \n   module.exports = router;\n   ```\n\n6. **Frontend Implementation**\n   Store the token in localStorage or using a state management solution like Redux or Context API. Add the token to the Authorization header for API requests:\n   \n   ```javascript\n   // API request with JWT token\n   const fetchUserProfile = async () => {\n     try {\n       const token = localStorage.getItem('token');\n       \n       const response = await fetch('/api/user/profile', {\n         headers: {\n           'Authorization': `Bearer ${token}`\n         }\n       });\n       \n       if (!response.ok) {\n         throw new Error('Not authorized');\n       }\n       \n       const data = await response.json();\n       // Process user profile data\n     } catch (error) {\n       console.error('Error fetching profile:', error);\n       // Handle authentication errors, redirect to login, etc.\n     }\n   };\n   ```\n\n## Common Issues\n- Token expiration handling\n- Secure storage of tokens\n- Refreshing tokens\n- CORS issues with Authorization headers",
          PictorialGuide: "https://example.com/images/jwt-auth-1.jpg,https://example.com/images/jwt-auth-2.jpg",
          RelatedProblems: [dummyProblems[1]],
          RelatedSolutions: [dummySolutions[1]],
          RelatedProblemIds: undefined
        },
        {
          PSGId: "psg-125",
          Title: "Setting Up React Frontend",
          ProjectId: this.projectId,
          TextInstructions: "# Setting Up React Frontend\n\nThis guide will walk you through setting up a React frontend for your MERN stack application.\n\n## Prerequisites\n- Node.js installed\n- Basic understanding of React\n\n## Steps\n\n1. **Create a New React Application**\n   ```bash\n   npx create-react-app client\n   cd client\n   ```\n\n2. **Install Required Dependencies**\n   ```bash\n   npm install axios react-router-dom redux react-redux redux-thunk redux-devtools-extension\n   ```\n\n3. **Set Up Project Structure**\n   Create the following folders in your `src` directory:\n   - `components`: For React components\n   - `pages`: For page components\n   - `redux`: For Redux store, actions, and reducers\n   - `utils`: For utility functions\n   - `services`: For API service files\n\n4. **Configure Proxy for Development**\n   Add the following to your `package.json` to proxy API requests to your backend:\n   ```json\n   \"proxy\": \"http://localhost:5000\"\n   ```\n\n5. **Set Up React Router**\n   Update your `App.js` file:\n   ```jsx\n   import React from 'react';\n   import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';\n   import Home from './pages/Home';\n   import Login from './pages/Login';\n   import Register from './pages/Register';\n   import Dashboard from './pages/Dashboard';\n   import PrivateRoute from './components/routing/PrivateRoute';\n   \n   function App() {\n     return (\n       <Router>\n         <Switch>\n           <Route exact path=\"/\" component={Home} />\n           <Route exact path=\"/login\" component={Login} />\n           <Route exact path=\"/register\" component={Register} />\n           <PrivateRoute exact path=\"/dashboard\" component={Dashboard} />\n         </Switch>\n       </Router>\n     );\n   }\n   \n   export default App;\n   ```\n\n6. **Create a Private Route Component**\n   ```jsx\n   // components/routing/PrivateRoute.js\n   import React from 'react';\n   import { Route, Redirect } from 'react-router-dom';\n   \n   const PrivateRoute = ({ component: Component, ...rest }) => {\n     const isAuthenticated = localStorage.getItem('token') ? true : false;\n     \n     return (\n       <Route\n         {...rest}\n         render={props =>\n           isAuthenticated ? (\n             <Component {...props} />\n           ) : (\n             <Redirect to=\"/login\" />\n           )\n         }\n       />\n     );\n   };\n   \n   export default PrivateRoute;\n   ```\n\n7. **Set Up Redux Store**\n   ```jsx\n   // redux/store.js\n   import { createStore, applyMiddleware } from 'redux';\n   import { composeWithDevTools } from 'redux-devtools-extension';\n   import thunk from 'redux-thunk';\n   import rootReducer from './reducers';\n   \n   const initialState = {};\n   \n   const middleware = [thunk];\n   \n   const store = createStore(\n     rootReducer,\n     initialState,\n     composeWithDevTools(applyMiddleware(...middleware))\n   );\n   \n   export default store;\n   ```\n\n8. **Create API Service**\n   ```javascript\n   // services/api.js\n   import axios from 'axios';\n   \n   const api = axios.create({\n     baseURL: '/api',\n     headers: {\n       'Content-Type': 'application/json'\n     }\n   });\n   \n   // Add a request interceptor to include the auth token in headers\n   api.interceptors.request.use(\n     config => {\n       const token = localStorage.getItem('token');\n       if (token) {\n         config.headers['Authorization'] = `Bearer ${token}`;\n       }\n       return config;\n     },\n     error => {\n       return Promise.reject(error);\n     }\n   );\n   \n   export default api;\n   ```\n\n9. **Start the Development Server**\n   ```bash\n   npm start\n   ```\n\nWith these steps completed, you should have a basic React frontend set up with routing, authentication, and Redux for state management.",
          PictorialGuide: "https://example.com/images/react-setup-1.jpg,https://example.com/images/react-setup-2.jpg,https://example.com/images/react-setup-3.jpg",
          RelatedProblemIds: undefined
        }
      ];

      // Create dummy project structure
      this.projectStructure = {
        ProjectId: this.projectId,
        Title: "Full Stack MERN Application Structure",
        Description: "A comprehensive guide to setting up a modern MERN (MongoDB, Express, React, Node.js) stack application with authentication, database integration, and best practices for development and deployment.",
        StackId: this.dummyStack.StackId,
        Stack: this.dummyStack,
        DateCreated: new Date(2024, 0, 10),
        LastUpdated: new Date(2024, 3, 5),
        PSG: dummyGuides
      };

      this.titleService.setTitle(`${this.projectStructure.Title} - Project Structure`);
      this.loading = false;
      this.activeGuideIndex = 0;
    }, 1000); // Simulate 1-second loading delay
  }

  setActiveGuide(index: number): void {
    this.activeGuideIndex = index;
  }

  formatInstructions(text: string): SafeHtml {
    if (!text) return '';
    
    // Convert markdown-like formatting to HTML
    // This is a simple implementation - consider using a markdown library for more complex needs
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
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeImageViewer(): void {
    this.showImageViewer = false;
    document.body.style.overflow = ''; // Restore scrolling
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
}
