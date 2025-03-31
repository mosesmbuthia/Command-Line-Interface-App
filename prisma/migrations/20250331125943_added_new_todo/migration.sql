/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `todo_list_table` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[description]` on the table `todo_list_table` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "todo_list_table_title_key" ON "todo_list_table"("title");

-- CreateIndex
CREATE UNIQUE INDEX "todo_list_table_description_key" ON "todo_list_table"("description");
