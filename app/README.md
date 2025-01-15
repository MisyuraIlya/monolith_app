# Installation Guide

This guide outlines the required packages for setting up **Authentication**, **Throttling**, **Caching**, **GraphQL**, and other features in a **NestJS** project.

---

## 🔐 Authentication
Install the necessary packages for authentication using JWT, Passport, and cookies:

```bash
npm install @nestjs/mongoose mongoose @nestjs/config
npm install class-validator class-transformer
npm install bcryptjs
npm install --save-dev @types/bcryptjs
npm install bcrypt
npm install @nestjs/passport passport passport-local passport-jwt @nestjs/jwt
npm install --save-dev @types/passport-jwt @types/passport-local
npm install cookie-parser
npm install --save-dev @types/cookie-parser
```

---

## 🚦 Throttler Module
Protect your API from excessive requests by installing the Throttler module:

```bash
npm install --save @nestjs/throttler
```

---

## 🗄️ Cache Module
Enable caching with Redis integration:

```bash
npm install @nestjs/cache-manager cache-manager
npm install --save-dev @types/cache-manager
npm install cache-manager-redis-store
```

---

## 🚀 GraphQL Support
Set up GraphQL with Apollo Server:

```bash
npm install @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

⚠️ **Note:** You cannot use `CacheModule` and `ThrottlerGuard` with GraphQL due to incompatibility issues.

---

## 📊 Metrics with Prometheus & Grafana
Integrate Prometheus metrics into your project:

```bash
npm install @willsoto/nestjs-prometheus prom-client
```

---

## 📤 File Upload with MinIO/S3
Set up file uploads with support for MinIO and S3:

```bash
npm install --save-dev @types/multer
npm install @nestjs/platform-express @nestjs/common minio
npm install aws-sdk
```

---

## 📡 WebSockets
Enable WebSocket support with Socket.IO:

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

---

## 📬 Background Jobs with Bull (SMS + Mail)
Set up job queues for SMS and email handling:

```bash
npm install --save @nestjs/bull bull bullmq nodemailer @nestjs-modules/mailer twilio
npm install --save-dev @types/bull
```

---

## 🔍 ElasticSearch
Integrate ElasticSearch into your project:

```bash
npm install @nestjs/elasticsearch @elastic/elasticsearch
```

---

## 🏢 Multi-Tenancy
Implement multi-tenancy in your application:

1. Add `TenantGuard` and extend `AuthService` to handle tenant-specific logic.
2. Include a `TenantModule` and a `BooksModule` dedicated to multi-tenant operations.
3. Create services with two providers to separate tenant-specific logic.
4. Add middleware to fetch the `tenantId` from incoming requests.
5. Include utility functions for encryption and decryption.
6. Structure the design so that each customer has their own database and shared codebase.

---

### How to Use:
Copy and paste this markdown block into your **README.md** file to guide developers in setting up required dependencies for your **NestJS** project.
