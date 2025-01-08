# Installation Guide

This guide explains the required packages for Authentication, Throttling, Caching, and GraphQL in a **NestJS** project.

## 🔐 Authentication

```bash
npm i @nestjs/mongoose mongoose @nestjs/config
npm i class-validator class-transformer
npm i bcryptjs
npm i --save-dev @types/bcryptjs
npm install bcrypt
npm i @nestjs/passport passport passport-local passport-jwt @nestjs/jwt
npm i --save-dev @types/passport-jwt @types/passport-local
npm i cookie-parser
npm i --save-dev @types/cookie-parser
```

## 🚦 Throttler Module

Install throttling to protect the API from excessive requests:

```bash
npm i --save @nestjs/throttler
```

## 🗄️ Cache Module

Install caching with Redis integration:

```bash
npm install @nestjs/cache-manager cache-manager
npm i --save-dev @types/cache-manager
npm i cache-manager-redis-store
```

## 🚀 GraphQL Support

Set up GraphQL with Apollo Server:

```bash
npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql
```
```

## Metrix  Prometheus & Grafana

```bash
npm install @willsoto/nestjs-prometheus prom-client
```
```

## Upload MinIO/S3

```bash
npm i --save-dev @types/multer
npm install @nestjs/platform-express @nestjs/common minio
npm i aws-sdk
```
```


### How to Use:
Copy and paste this markdown block into your **README.md** file to guide developers in setting up required dependencies.

CANT USE GRAPHQL WITH CacheModule AND ThrottlerGuard

## 🚀 WEBSOCKETS
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```
```

## 🚀 BULL (SMS + MAIL)
```bash
npm install --save @nestjs/bull bull bullmq nodemailer @nestjs-modules/mailer twilio
npm install --save-dev @types/bull

```
```