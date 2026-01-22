# Nest.js Deferred Execution Helper

## 🚀 Overview

The goal of this project is to provide a `runLater()` utility that allows developers to offload any method call from a NestJS provider to a background worker. Instead of immediate execution, the call is recorded, serialized, and sent to a message broker.

#### Key Features

- **Method Chaining Support**: Use fluent interfaces (e.g., `EmailService.to().template().send()`)

- **Type-Agnostic Recording**: Uses JavaScript Proxies to capture calls without needing pre-defined schemas for every service.

- **DI Container Integration**: Automatically resolves any provider registered in the NestJS container on the consumer side.

- **Context Passing**: Ability to pass specific data (like id, newName) through the execution context.

### Tech Stack

- **Framework:** NestJS (Fastify adapter)
- **Language:** TypeScript
- **Message Broker:** RabbitMQ
- **Tooling:** Docker, Swagger

---

## 🐳 Docker (Full Setup)

To run the entire system (Apps + Infra) inside Docker:

```bash
docker-compose up --build
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Prerequisites

- Node.js (v18+)
- Docker & Docker Compose

### 2. Installation

Install dependencies:

```bash
npm install
```

### 3. Setup Environment & Infrastructure

Generate local secrets and start Docker containers (Postgres, RabbitMQ, Prometheus):

```bash
# Create dummy secrets files (.secrets/...)
npm run seed:secrets

# Start infrastructure
npm run infra:up
```

### 4. Run Applications

```bash
npm run start:dev
```

---

## 📡 API & Monitoring

Once the application is running, you can access:

- **Swagger API Docs:** [http://localhost:8080](http://localhost:8080) (user: `swagger`, pass: `swagger`)
- **RabbitMQ Dashboard:** [http://localhost:15672](http://localhost:15672) (user: `user`, pass: `password`)

---

## 🏗 Project Structure & Key Files

The core logic is divided into the recording phase (Producer) and the execution phase (Consumer).

1. The Recorder (Producer Side)

- `src/modules/tasks/services/task-recorder.ts`
  The "magic" happens here. It uses nested Proxy objects to intercept property access and function calls, building a serialized "job" object.

- `src/modules/tasks/services/tasks.service.ts`
  Contains the runLater method. It initializes the recorder, executes the user's callback to capture calls, and emits the resulting jobs to RabbitMQ.

2. The Executor (Consumer Side)

- `src/modules/example/controllers/tasks.consumer.ts`
  Listens to the RabbitMQ queue. It uses NestJS ModuleRef to dynamically find providers and `apply()` to execute recorded steps while maintaining the correct this context for method chaining.

💻 Usage Example
You can use the helper anywhere by injecting TasksService:

```ts
@Post('example')
public async example() {
  return await this.tasksService.runLater((runner) => {
    // 1. Simple call
    runner.UserRepository.update(1, { name: 'New name' });

    // 2. Complex Chaining (Fluent API)
    runner.EmailService
      .to('test@example.com')
      .template('welcome')
      .send({ name: 'New name' });
  });
}
```
