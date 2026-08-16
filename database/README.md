# Placement Portal PostgreSQL Database Setup

This directory contains the complete database scripts for the Placement Portal.

## Files
- [schema.sql](file:///c:/Users/kusha/Downloads/VT2.0%20TEST/database/schema.sql): DDL script creating all ENUMs, 6 tables, foreign keys, constraints, and performance indexes.
- [seed.sql](file:///c:/Users/kusha/Downloads/VT2.0%20TEST/database/seed.sql): DML script containing mock data to populate and test the database.

---

## How to Execute

### Option 1: Using `psql` Terminal Command Line
```bash
# 1. Create the database
psql -U postgres -c "CREATE DATABASE placement_portal;"

# 2. Run the Schema Script
psql -U postgres -d placement_portal -f database/schema.sql

# 3. Run the Seed Data Script (Optional for testing)
psql -U postgres -d placement_portal -f database/seed.sql
```

### Option 2: Using pgAdmin / DBeaver / Graphical GUI Client
1. Open pgAdmin / DBeaver and connect to your PostgreSQL server.
2. Right-click **Databases** -> **Create** -> **Database**, name it `placement_portal`.
3. Open the **Query Tool** for `placement_portal`.
4. Open [schema.sql](file:///c:/Users/kusha/Downloads/VT2.0%20TEST/database/schema.sql) content, paste it into the Query Tool, and click **Execute (F5)**.
5. Open [seed.sql](file:///c:/Users/kusha/Downloads/VT2.0%20TEST/database/seed.sql) content, paste it, and click **Execute (F5)**.

---

## Database Architecture Overview

```
[users] (id, name, email, password, role)
   │
   ├─── 1:1 ───> [students] (student_id, user_id, branch, semester, cgpa, skills, resume, phone)
   │                  │
   │                  └─── 1:N ───> [applications] <─── N:1 ─── [jobs]
   │                                  (app_id, status)            ▲
   └─── 1:1 ───> [companies] ─────────────────────────────────────┘
                      (company_id, user_id, company_name, hr_name, ...)
```
