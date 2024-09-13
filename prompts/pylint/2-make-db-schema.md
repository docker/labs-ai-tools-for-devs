---
tools:
  - name: sqlite
  - name: delete_folder
---

# prompt user

delete the /thread/db.sqlite 
 
Write a SQL schema for a table named RANGES with columns ID, PATH, START_LINE, END_LINE, START_COLUMN, and 
END_COLUMN. The ID is going to be a unique string.

Write a SQL schema for a table named VIOLATIONS which references RANGES with fk `RANGE_ID`, and columns
ID, MESSAGE, TYPE, and VIOLATION_ID. The ID is the primary key, and auto increments.

Run the sqlite command with the database set to `/thread/db.sqlite` and send the SQL generated above.

