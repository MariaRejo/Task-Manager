# Task Manager — Full Stack Project (Spring Boot + React)

A complete CRUD application built to demonstrate exactly the stack most
Full Stack Developer job descriptions ask for: **Java, Spring Boot, REST
APIs, a database, and a React front end.**

## What it does
- Create, view, edit, delete tasks
- Each task has a title, description, due date, and status (Pending /
  In Progress / Completed)
- Filter tasks by status
- Search tasks by title
- Form validation (title required) with clean error handling from the API

## Architecture

```
Browser (React)  <-- axios / REST/JSON -->  Spring Boot REST API  <-- JPA/Hibernate -->  H2 Database
```

- **Controller layer** (`TaskController`) — exposes REST endpoints
- **Service layer** (`TaskService`) — business logic, kept separate from the controller
- **Repository layer** (`TaskRepository`) — Spring Data JPA, no manual SQL needed
- **Model** (`Task`, `TaskStatus`) — the entity mapped to the `tasks` table
- **Global exception handler** — returns clean JSON errors instead of stack traces

This layered structure (Controller → Service → Repository) is the standard
pattern interviewers expect you to explain, so it's worth being able to
draw this diagram on a whiteboard.

## API Endpoints

| Method | Endpoint                          | Description              |
|--------|------------------------------------|---------------------------|
| GET    | `/api/tasks`                       | Get all tasks             |
| GET    | `/api/tasks?status=PENDING`        | Filter by status          |
| GET    | `/api/tasks?search=report`         | Search by title           |
| GET    | `/api/tasks/{id}`                  | Get one task               |
| POST   | `/api/tasks`                       | Create a task              |
| PUT    | `/api/tasks/{id}`                  | Update a task              |
| DELETE | `/api/tasks/{id}`                  | Delete a task              |

## How to run it

### Backend (Spring Boot)
Requires Java 17+ and Maven.
```bash
cd backend
mvn spring-boot:run
```
- API runs at `http://localhost:8080`
- Uses an in-memory H2 database (no setup needed) — data resets on restart
- View the database directly at `http://localhost:8080/h2-console`
  (JDBC URL: `jdbc:h2:mem:taskdb`, user: `sa`, blank password)
- To switch to MySQL, un-comment the MySQL block in
  `src/main/resources/application.properties` and comment out the H2 block

### Frontend (React)
Requires Node.js.
```bash
cd frontend
npm install
npm start
```
- Opens at `http://localhost:3000` and talks to the backend at `:8080`

Run both at the same time (two terminals) to use the full app.

## Suggested next steps (to make it even stronger)
- Add user login (Spring Security + JWT) — a very common interview follow-up
- Swap H2 for MySQL/PostgreSQL and deploy both apps (Render/Railway for
  backend, Vercel/Netlify for frontend)
- Add unit tests for `TaskService` with JUnit + Mockito
- Add pagination to `GET /api/tasks` for larger datasets

## How to talk about this in an interview
Be ready to explain, in your own words:
1. **Why layered architecture?** Separation of concerns — Controller
   handles HTTP, Service handles logic, Repository handles data. Easier
   to test and change one layer without breaking others.
2. **How does a request flow end-to-end?** Browser → React component calls
   axios → HTTP request hits `TaskController` → delegates to `TaskService`
   → `TaskRepository` (Spring Data JPA) queries the database → response
   flows back up as JSON → React updates state → UI re-renders.
3. **What does `@RestController`, `@Service`, `@Repository`,
   `@Autowired` actually do?** They're Spring stereotype annotations that
   let Spring's IoC container auto-detect and wire these classes together
   (dependency injection) instead of you `new`-ing them manually.
4. **Why did you choose H2 for development?** Fast, zero-config, in-memory
   — good for local dev/demo; swappable for MySQL/Postgres in production
   by changing only `application.properties`, since JPA abstracts the SQL.
