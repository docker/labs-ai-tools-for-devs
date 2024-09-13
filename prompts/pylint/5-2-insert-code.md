---
tools:
  - name: sqlite
  - name: run-javascript-sandbox
---

# prompt user

We are using database `/thread/db.sqlite`.

0. Use JS sandbox to delete folder `/thread/code_insert` and create it again

1. Drop and re-create the `CODE` table with the following schema:
```
(ID,RANGE_ID,CODE_AT_RANGE)
```

where RANGE_ID is a foreign key to the `RANGES` table.
ID should just be a regular autoincrementing primary key
CODE_AT_RANGE is text.

2. Prepare a script similar to the following:
```
.mode csv
.headers on
.once /thread/code_insert/all_ranges.csv
<Query>
``` 
where query selects everything from the RANGES table where END_LINE is not null. Use the javascript sandbox with fs to write this script to `/thread/code_insert/query_ranges.sql`.

3. Execute the script against the DB: `.read /thread/code_insert/query_ranges.sql`

4. Now that we have `/thread/code_insert/all_ranges.csv`,

we get something like
```csv
ID,PATH,START_LINE,END_LINE,START_COLUMN,END_COLUMN
1234-abcd-1234,wsgi_skylines.py,11,104,0,61
```

So, write a JS script to 
- Read the CSV file manually (no modules) and iterate over the rows
- Read the contents at PATH with fs and slice out the content between `START_LINE` and `END_LINE`
- Write a line of SQL to populate the row in the `CODE` table. This INSERT statement should then be appended to `/thread/code_insert/insert_code.sql`.

The RANGE_ID should be the first value in the CSV row
The CODE_AT_RANGE is the sliced content at PATH

Example `/thread/code_insert/insert_code.sql` file:

```sql
INSERT INTO CODE (RANGE_ID, CODE_AT_RANGE) ('1234-abcd-1234', "<Contents of wsgi_skylines from line 11 to 104>")
```

