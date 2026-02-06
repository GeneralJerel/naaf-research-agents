# Skill: Postgres + Redis

## Goal
Use Postgres for durable data and Redis for fast session or cache storage.

## Checklist
- Store structured data in Postgres (users, sessions, notes).
- Cache transient or fast-changing values in Redis.
- Use a single source of truth per data object.

## Suggested Tables
- `sessions` (id, user_id, started_at, summary)
- `messages` (id, session_id, role, content, created_at)

## Caching Patterns
- Cache "last summary" or "context window" per session.
- Expire caches in minutes, not hours, for demos.
