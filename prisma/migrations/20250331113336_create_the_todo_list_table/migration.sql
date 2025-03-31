-- CreateTable
CREATE TABLE "todo_list_table" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "todo_list_table_pkey" PRIMARY KEY ("id")
);
