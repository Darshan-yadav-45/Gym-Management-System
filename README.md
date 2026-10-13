# FitFlow

Personalized Gym & Home Fitness Platform built using:

* React.js (Frontend)
* Java 25 LTS (Backend)
* Spring Boot 3.x
* Spring Security + JWT
* Spring Data JPA
* Hibernate
* PostgreSQL

## Features
- **User Authentication**: Secure JWT-based registration and login system with encrypted passwords.
- **Fitness Onboarding**: 10-step animated interactive profile creation and workout preference settings.
- **Personalized Workouts**: Dynamically generates fitness plans based on user's equipment, experience, and goals.
- **Home Workout Fallback**: Offers 15-minute bodyweight home routines when a gym session is missed.
- **Trainer Management**: Assigns members to trainers and facilitates appointment booking without double-booking conflicts.
- **Progress & Tracking**: Logs water intake, bodyweight progress, and daily attendance.
- **Beautiful UI**: Modern, responsive, premium-looking design utilizing Framer Motion for smooth transitions.

## Architecture
The system employs a multi-tiered architecture:
1. **Frontend**: React.js with Vite, styled using Tailwind CSS and animated with Framer Motion.
2. **Backend**: Java Spring Boot providing robust RESTful APIs.
3. **Database Layer**: PostgreSQL managed via Spring Data JPA and Hibernate ORM.

## Database Structure
Core entities:
- `fit_users`, `fitness_profiles`
- `workout_plans`, `exercises`, `workout_exercises`, `training_sessions`
- `trainers`, `appointments`, `attendance`, `progress_records`, `water_logs`
- `membership_plans`, `memberships`, `payments`, `notifications`

## API Endpoints (Core)
- `POST /api/auth/register` - Register a new member
- `POST /api/auth/login` - Authenticate and receive JWT
- `POST /api/onboarding` - Submit initial fitness profile data
- `GET /api/workouts/home-alternative` - Get fallback home workout
- `POST /api/water` - Log daily water intake
- `POST /api/ai/assistant` - Basic AI Assistant fallback

## Installation

### Prerequisites
- Node.js (v18+)
- Java JDK 25+
- Maven 3.8+
- PostgreSQL 14+

### PostgreSQL Setup
1. Create a database named `fitflow`.
2. Update `.env` or system environment variables with your credentials:
   ```env
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key_at_least_256_bits
   ```

### Backend Setup
1. Navigate to the `backend` directory.
2. Run `mvn clean install`.
3. Start the application: `mvn spring-boot:run`.
   - On the first run, Hibernate will automatically generate the required tables (`ddl-auto=update`).
   - `DataSeeder.java` will automatically insert admin, trainer, member test accounts, and basic exercises.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Run `npm install`.
3. Start the development server: `npm run dev`.
4. Open the application at `http://localhost:5173`.

## Environment Variables
Create an `.env` file in the root or `backend` directory to manage sensitive information:
```env
DB_PASSWORD=my_secure_db_password
JWT_SECRET=my_secure_jwt_secret
```

## Running the application
Run the backend on port `8080` and the frontend on port `5173`. They will seamlessly communicate via the configured Axios interceptors.

## Test Accounts
*For development only. Do not use in production.*
- **Admin**: `admin@fitflow.com` / `admin123`
- **Trainer**: `trainer@fitflow.com` / `trainer123`
- **Member**: `member@fitflow.com` / `member123`

## Future Improvements
- Integrate robust third-party AI provider (OpenAI / Anthropic) into the `AiAssistantService`.
- Connect real payment gateways (Stripe / Razorpay) for memberships.
- Expand notification system with WebSockets for real-time alerts.
