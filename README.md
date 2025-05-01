# Code Solutions

Code Solutions is a web application designed to help users browse coding problems and find solutions with ease. Users can contribute by creating solutions for unsolved problems, submitting new problems/errors, and awaiting admin approval. Admins have the ability to manage problems, solutions, and enforce best coding practices by defining project structures.

## Features

- **Browse Problems and Solutions**: Easily search and explore coding problems and their solutions.
- **User Contributions**: 
  - Submit solutions for unsolved problems.
  - Create new problems/errors for review.
- **Admin Management**:
  - Approve or reject user-submitted problems and solutions.
  - Create and manage problems and solutions.
  - Define and enforce project structures to promote best coding practices.

## Tech Stack

### Backend
- **Node.js**: Server-side runtime environment.
- **Express.js**: Web framework for building RESTful APIs.

### Frontend
- **Angular**: Framework for building dynamic and responsive user interfaces.

### Database
- **MongoDB**: NoSQL database for storing problems, solutions, and user data.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Angular CLI (v12 or higher)
- MongoDB (running locally or on a cloud service)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   ng serve
   ```
4. Open your browser and navigate to `http://localhost:4200`.

## Live Demo

Check out the live demo of the application [here](#).

## Project Structure

### Backend
```
backend/
src/
├── controllers/
├── services/
├── routes/
├── middlewares/
├── interfaces/
└── server.ts
```

### Frontend
```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   └── app.module.ts
│   ├── assets/
│   └── environments/
└── angular.json
```

## Contributing

We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push them to your fork.
4. Submit a pull request for review.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, feel free to reach out:
- **Email**: felixokoth078@gmail.com