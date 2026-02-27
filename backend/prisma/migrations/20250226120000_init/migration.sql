-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('instagram', 'tiktok', 'youtube', 'whatsapp');

-- CreateTable
CREATE TABLE "selections" (
    "id" SERIAL NOT NULL,
    "section" VARCHAR(50) NOT NULL,
    "video_id" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "selections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "href" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yt_cache" (
    "cache_key" VARCHAR(100) NOT NULL,
    "data" JSONB NOT NULL,
    "fetched_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "yt_cache_pkey" PRIMARY KEY ("cache_key")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "selections_section_video_id_key" ON "selections"("section", "video_id");

-- CreateIndex
CREATE INDEX "selections_section_idx" ON "selections"("section");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- CreateIndex
CREATE INDEX "yt_cache_expires_at_idx" ON "yt_cache"("expires_at");
