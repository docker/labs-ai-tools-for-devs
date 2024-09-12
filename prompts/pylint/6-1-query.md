---
tools:
  - name: sqlite
    description: run the sqlite command
    parameters:
      type: object
      properties:
        database:
          type: string
          description: the path to the database
        sql:
          type: string
          description: the sql statement to run
    container:
      image: vonwig/sqlite:latest
      command:
        - "{{database}}"
        - "{{sql|safe}}"
---

# prompt user

Given this schema:

```sql
CREATE TABLE VIOLATIONS (ID INTEGER PRIMARY KEY AUTOINCREMENT, MESSAGE TEXT, TYPE TEXT, RANGE STRING, FOREIGN KEY (RANGE) REFERENCES RANGES (ID));
CREATE TABLE RANGES (ID STRING PRIMARY KEY, PATH TEXT, START_LINE INT, END_LINE INT, START_COLUMN INT, END_COLUMN INT);
```

Generate a query to list each the violations by just the violation name `black_listed_name.py` in a readble format, and then run the sqlite command on database `/thread/db.sqlite`.