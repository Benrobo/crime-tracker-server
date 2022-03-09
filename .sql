
-- database creation

1. CREATE DATABASE "crime-tracker";

-- Tables Creations

1. CREATE TABLE "users"(
    id TEXT NOT NULL unique primary key,
    "userId" TEXT NOT NULL unique,
    "userName" TEXT NOT NULL,
    "mail" TEXT NOT NULL unique,
    "phoneNumber" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "userRank" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "userStatus" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "joined" TEXT NOT NULL -- Date from moment
);

2. CREATE TABLE "cases"(
    id TEXT NOT NULL,
    "caseName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "created_at" TEXT NOT NULL
);

CREATE TABLE "suspects"(
    id TEXT NOT NULL unique primary key,
    "userId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "suspectName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "suspectImg" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "created_at" TEXT NOT NULL
);

4. CREATE TABLE "evidence"(
    id TEXT NOT NULL unique primary key,
    "userId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "suspectName" TEXT NOT NULL,
    "suspectId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "created_at" TEXT NOT NULL
);