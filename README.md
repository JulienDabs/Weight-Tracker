
# Better Me - Weight Management App

## Project Overview
Better Me is a weight management app designed to predict the number of weeks needed to reach your goal weight. It calculates the ideal weight based on various factors, including height, age, sex, activity level, and calorie intake. The app will be developed using a microservices architecture, with a frontend in React and a backend using NestJS and PostgreSQL.

---

## Features
### Version 1
- User Registration and Authentication
- Input forms for height, age, weight, activity level, etc.
- Calculation of ideal weight and duration to reach goals
- Display results and track weight history

### Version 2
- Integration with a meal suggestion API to offer meal plans with calorie information

---

## Project Structure
The project is broken down into four sprints over 8 weeks, with a total estimated time of 87 hours.

### Sprints
#### Sprint 1 (Week 1-2) - User Service
- Set up User Service in NestJS
- Configure Prisma and create user schema
- Implement User API Endpoints (Create, Read, Update, Delete)
- Develop User Form in React for registration and data fetching
- Basic authentication setup (if time permits)

#### Sprint 2 (Week 3-4) - Weight Service
- Set up Weight Service in NestJS
- Define Weight Schema in Prisma and establish relationships
- Implement Weight API Endpoints (Create, Read, Update, Delete)
- Develop calculation logic for weight management
- Build Weight Input Form in React and integrate API

#### Sprint 3 (Week 5-6) - API Integration and Optimization
- Integrate meal suggestion API
- Optimize UI and ensure smooth API interactions
- Perform end-to-end testing

#### Sprint 4 (Week 7-8) - Testing and Deployment
- Write additional tests to increase coverage
- Set up CI/CD for automated testing and deployment
- Deploy the app to a hosting platform

---

## Technologies Used
- **Frontend**: React
- **Backend**: NestJS, Prisma, PostgreSQL
- **Architecture**: Microservices

---

## Future Enhancements
- More detailed meal planning features
- Additional user analytics and progress tracking
- Community support and motivation features

---

## Getting Started
### Prerequisites
- Node.js
- PostgreSQL
- Docker (optional, for containerization)

### Installation
1. Clone the repository
2. Install dependencies for the frontend and backend
3. Set up the database and run migrations
4. Start the development server

---

## Contributing
Contributions are welcome! Please fork the repository and create a pull request for any enhancements or bug fixes.

---

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

---

## Contact
For any inquiries or support, please contact the developer at [email address].

