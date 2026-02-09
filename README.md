# Read Aggregation Platform (GraphQL)

A production-style, read-heavy aggregation service built using **Node.js, TypeScript, Apollo Server, PostgreSQL, and Redis**.

This project represents the read layer of a distributed backend architecture and complements a transactional write system (Booking Platform).

It is designed to demonstrate modern API design, schema-first GraphQL thinking, performance optimization, and real-world system tradeoffs.

---

## Project Objective

Build a read-optimized GraphQL gateway that:

- Aggregates data from multiple backend domains (User, Booking, Payment, Availability)
- Prevents N+1 query problems
- Implements request-level batching using DataLoader
- Applies cache-aside strategy using Redis
- Enforces schema-driven API contracts
- Demonstrates production-aware backend practices

This is **not a CRUD project** — it is an aggregation layer.

---

## Why This Project Exists

In real systems (Booking.com, Uber, Agoda):

- Writes are handled by transactional REST services
- Reads are handled by aggregation layers or BFFs
- Traffic is predominantly read-heavy
- Client flexibility matters

This project represents that **read-optimized layer**.

---

## High-Level Architecture

Client  
↓  
GraphQL Gateway (This Project)  
↓  
- Booking Read Model  
- Payment Read Model  
- Availability Snapshot  
↓  
Redis Cache Layer  

- No writes
- No business mutations
- No async orchestration
- Focused purely on query aggregation

---

## Tech Stack

- Node.js
- TypeScript (strict mode)
- Apollo Server (GraphQL)
- PostgreSQL (read models)
- Redis (caching + rate limiting)
- DataLoader (batching)
- Docker
- OpenTelemetry (observability)

---
