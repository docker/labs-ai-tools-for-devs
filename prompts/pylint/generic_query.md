---
tools:
  - name: sqlite
---

# prompt user

The database is `/thread/db.sqlite`

Tables:
CODE
RANGES
VIOLATIONS

Both violations and code tables share a foreign key reference to RANGES.

Query the shcema of all of these tables.

Answer the following questions:

What is the last violation with a non-null END_LINE in ranges?

What is the code for that violation?
