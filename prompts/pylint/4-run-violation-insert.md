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
    container:
      image: vonwig/sqlite:latest
      command:
        - "{{database}}"
        - ".read /thread/insert.sql"
---

# volumes

```sh
docker run -it --rm -v thread:/thread \
           vonwig/bb:latest \
           '{}' \
           '(println (slurp "/thread/insert.sql"))'
```

```
docker run -it --rm -v thread:/thread \
           vonwig/sqlite:latest \
           /thread/db.sqlite \
           ".schema RANGES"
```

```
docker run -it --rm -v thread:/thread \
           vonwig/sqlite:latest \
           /thread/db.sqlite \
           ".schema VIOLATIONS"
```

```
docker run -it --rm -v thread:/thread \
           vonwig/sqlite:latest \
           /thread/db.sqlite \
           ".open /thread/insert.sql"
```

```
docker run -it --rm -v thread:/thread \
           vonwig/sqlite:latest \
           /thread/db.sqlite \
           "SELECT * FROM VIOLATIONS INNER JOIN RANGES ON VIOLATIONS.RANGE = RANGES.ID WHERE RANGES.PATH = 'src/app.py'"
```

```
docker run -it --rm -v thread:/thread \
           vonwig/sqlite:latest \
           /thread/db.sqlite \
           "SELECT * FROM RANGES WHERE RANGES.PATH = 'src/app.py'"
```


# prompt user

Run the sqlite command with the path to the database set to `/thread/db.sqlite`.

