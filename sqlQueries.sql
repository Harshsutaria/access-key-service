-- access_key_management schema
create table access_key_management (
    "accessKey" varchar primary key not null,
    "userId" varchar not null,
    "adminId" varchar not null,
    "rateLimit" varchar not null,
    "expirationTime" varchar not null,
    "createdAt" varchar,
    "updatedAt" varchar not null,
    "status" varchar not null
);
