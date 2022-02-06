
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
    "userType" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "userStatus" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "joined" TEXT NOT NULL
);

2. CREATE TABLE "cases"(
    id TEXT NOT NULL unique,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL unique primary key,
    "userName" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "create_at" TEXT NOT NULL
);

3. CREATE TABLE "prediction"(
    id TEXT NOT NULL unique,
    "userId" TEXT NOT NULL unique primary key,
    "caseName" TEXT NOT NULL,
    "caseId" TEXT NOT NULL unique,
    "suspectName" TEXT NOT NULL,
    "suspectImg" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "create_at" TEXT NOT NULL
);

4. CREATE TABLE "evidence"(
    id TEXT NOT NULL unique,
    "userId" TEXT NOT NULL unique primary key,
    "caseId" TEXT NOT NULL unique,
    "evidence" TEXT NOT NULL,
    "suspectName" TEXT NOT NULL,
    "suspectId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "create_at" TEXT NOT NULL
);