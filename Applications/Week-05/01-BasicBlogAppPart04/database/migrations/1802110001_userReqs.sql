ALTER TABLE "users"
  ALTER COLUMN "password" SET DATA TYPE character(60),
  ADD UNIQUE ("username"),
  ADD UNIQUE ("email");