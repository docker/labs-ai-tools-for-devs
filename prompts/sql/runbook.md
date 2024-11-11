
# SQLite

## sqlite list tables

With sqlite, how do I figure out what tables are present?
How do I run sqlite with a file and a sql command?

```
docker run --rm -v $PWD:/workdir --workdir /workdir vonwig/sqlite:latest ./Chinook.db ".tables"
```

```
Album          Employee       InvoiceLine    PlaylistTrack
Artist         Genre          MediaType      Track        
Customer       Invoice        Playlist     

[Process exited 0]
```

## sqlite get db schema for table

How do I get the schema for a table in sqlite?

```
docker run --rm -v $PWD:/workdir --workdir /workdir vonwig/sqlite:latest ./Chinook.db ".schema Album"
```

```
CREATE TABLE [Album]
(
    [AlbumId] INTEGER  NOT NULL,
    [Title] NVARCHAR(160)  NOT NULL,
    [ArtistId] INTEGER  NOT NULL,
    CONSTRAINT [PK_Album] PRIMARY KEY  ([AlbumId]),
    FOREIGN KEY ([ArtistId]) REFERENCES [Artist] ([ArtistId]) 
                ON DELETE NO ACTION ON UPDATE NO ACTION
);
CREATE INDEX [IFK_AlbumArtistId] ON [Album] ([ArtistId]);
```

## sqlite execute query

```
docker run --rm -v $PWD:/workdir --workdir /workdir vonwig/sqlite:latest ./Chinook.db "SELECT * FROM Album LIMIT 5"
```


