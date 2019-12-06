--
-- File generated with SQLiteStudio v3.2.1 on Sat Dec 7 10:07:03 2019
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: gig
DROP TABLE IF EXISTS gig;

CREATE TABLE gig (
    id      INTEGER      NOT NULL
                         PRIMARY KEY AUTOINCREMENT,
    name    VARCHAR (64) NOT NULL
                         UNIQUE,
    gigdate DATE (8) 
);

INSERT INTO gig (id, name, gigdate) VALUES (1, 'Melbourne', '27-11-19');

-- Table: gigsong
DROP TABLE IF EXISTS gigsong;

CREATE TABLE gigsong (
    id             INTEGER NOT NULL
                           PRIMARY KEY AUTOINCREMENT,
    refgig         INTEGER NOT NULL
                           REFERENCES gig (id),
    refsong        INTEGER NOT NULL
                           REFERENCES song (id),
    sequencenumber INTEGER NOT NULL
);

INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (1, 1, 1, 1);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (2, 1, 2, 2);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (3, 1, 3, 3);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (4, 1, 4, 4);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (5, 1, 5, 5);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (6, 1, 6, 6);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (7, 1, 7, 7);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (8, 1, 8, 8);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (9, 1, 9, 9);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (10, 1, 10, 10);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (11, 1, 11, 11);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (12, 1, 12, 12);

-- Table: instrument
DROP TABLE IF EXISTS instrument;

CREATE TABLE instrument (
    id          INTEGER      NOT NULL
                             PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR (32) NOT NULL
                             UNIQUE,
    midichannel INTEGER      NOT NULL
);

INSERT INTO instrument (id, name, midichannel) VALUES (1, 'BiasFX Mobile', 6);
INSERT INTO instrument (id, name, midichannel) VALUES (2, 'BiasFx2', 4);
INSERT INTO instrument (id, name, midichannel) VALUES (3, 'Sample Tank', 1);
INSERT INTO instrument (id, name, midichannel) VALUES (4, 'Alchemy', 2);

-- Table: instrumentbank
DROP TABLE IF EXISTS instrumentbank;

CREATE TABLE instrumentbank (
    id            INTEGER      NOT NULL
                               PRIMARY KEY AUTOINCREMENT,
    name          VARCHAR (64) NOT NULL,
    refinstrument INTEGER      NOT NULL
                               REFERENCES instrument (id) 
);

INSERT INTO instrumentbank (id, name, refinstrument) VALUES (1, 'User', 3);
INSERT INTO instrumentbank (id, name, refinstrument) VALUES (2, 'User', 4);
INSERT INTO instrumentbank (id, name, refinstrument) VALUES (3, 'VGmates Sounds', 1);
INSERT INTO instrumentbank (id, name, refinstrument) VALUES (4, 'VGmates Sounds', 2);

-- Table: preset
DROP TABLE IF EXISTS preset;

CREATE TABLE preset (
    id                INTEGER      NOT NULL
                                   PRIMARY KEY AUTOINCREMENT,
    name              VARCHAR (64) NOT NULL,
    refinstrumentbank INTEGER      NOT NULL
                                   REFERENCES instrumentbank (id),
    midipc            INTEGER      NOT NULL
);

INSERT INTO preset (id, name, refinstrumentbank, midipc) VALUES (1, 'Empty', 1, 0);
INSERT INTO preset (id, name, refinstrumentbank, midipc) VALUES (2, 'Empty', 2, 0);
INSERT INTO preset (id, name, refinstrumentbank, midipc) VALUES (3, 'Empty', 3, 0);
INSERT INTO preset (id, name, refinstrumentbank, midipc) VALUES (4, 'Empty', 4, 0);

-- Table: song
DROP TABLE IF EXISTS song;

CREATE TABLE song (
    id    INTEGER      NOT NULL
                       PRIMARY KEY AUTOINCREMENT,
    name  VARCHAR (64) NOT NULL
                       UNIQUE,
    tempo INTEGER
);

INSERT INTO song (id, name, tempo) VALUES (1, 'The Star', NULL);
INSERT INTO song (id, name, tempo) VALUES (2, 'Down the River', NULL);
INSERT INTO song (id, name, tempo) VALUES (3, 'Started All Anew', NULL);
INSERT INTO song (id, name, tempo) VALUES (4, 'The Bird', NULL);
INSERT INTO song (id, name, tempo) VALUES (5, 'The Way Back Home', NULL);
INSERT INTO song (id, name, tempo) VALUES (6, 'Stranger', NULL);
INSERT INTO song (id, name, tempo) VALUES (7, 'Faun', NULL);
INSERT INTO song (id, name, tempo) VALUES (8, 'Matushka', NULL);
INSERT INTO song (id, name, tempo) VALUES (9, 'After The Rain', NULL);
INSERT INTO song (id, name, tempo) VALUES (10, 'Kvadratny Walk', NULL);
INSERT INTO song (id, name, tempo) VALUES (11, 'Old Country Dance', NULL);
INSERT INTO song (id, name, tempo) VALUES (12, 'Lost In The Sky', NULL);
INSERT INTO song (id, name, tempo) VALUES (13, 'Marina', NULL);

-- Table: songprogram
DROP TABLE IF EXISTS songprogram;

CREATE TABLE songprogram (
    id        INTEGER      NOT NULL
                           PRIMARY KEY AUTOINCREMENT,
    name      VARCHAR (32) NOT NULL,
    midipedal INTEGER      NOT NULL,
    refsong   INTEGER      REFERENCES song (id) 
                           NOT NULL
);


-- Table: songprogrampreset
DROP TABLE IF EXISTS songprogrampreset;

CREATE TABLE songprogrampreset (
    id             INTEGER NOT NULL
                           PRIMARY KEY AUTOINCREMENT,
    refpreset      INTEGER DEFAULT 0
                           NOT NULL
                           REFERENCES preset (id),
    volume         INTEGER DEFAULT 0
                           NOT NULL,
    pan            INTEGER DEFAULT 64
                           NOT NULL,
    muteflag       INTEGER DEFAULT 0
                           NOT NULL,
    reverbflag     INTEGER DEFAULT (0),
    delayflag      INTEGER DEFAULT (0),
    modeflag       INTEGER DEFAULT (0),
    refsongprogram INTEGER NOT NULL
                           REFERENCES songprogram (id) 
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
