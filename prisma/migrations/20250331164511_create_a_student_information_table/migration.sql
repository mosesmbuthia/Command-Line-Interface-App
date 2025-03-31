-- DropIndex
DROP INDEX "todo_list_table_description_key";

-- DropIndex
DROP INDEX "todo_list_table_title_key";

-- CreateTable
CREATE TABLE "student_info_table" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "student_info_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_info_table_email_key" ON "student_info_table"("email");
