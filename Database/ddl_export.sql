--
-- File generated with SQLiteStudio v3.2.1 on Sat Dec 7 13:08:20 2019
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
INSERT INTO gig (id, name, gigdate) VALUES (2, 'Illawara Fest', '16-01-2020');

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
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (13, 2, 6, 3);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (14, 2, 4, 2);
INSERT INTO gigsong (id, refgig, refsong, sequencenumber) VALUES (15, 2, 2, 1);

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
    midipc            INTEGER      NOT NULL,
    IsDefault         INTEGER      DEFAULT (0) 
);

INSERT INTO preset (id, name, refinstrumentbank, midipc, IsDefault) VALUES (1, 'Empty', 1, 0, 1);
INSERT INTO preset (id, name, refinstrumentbank, midipc, IsDefault) VALUES (2, 'Empty', 2, 0, 1);
INSERT INTO preset (id, name, refinstrumentbank, midipc, IsDefault) VALUES (3, 'Empty', 3, 0, 1);
INSERT INTO preset (id, name, refinstrumentbank, midipc, IsDefault) VALUES (4, 'Empty', 4, 0, 1);

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

INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (1, 'A', 1, 1);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (2, 'B', 2, 1);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (3, 'C', 3, 1);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (4, 'D', 4, 1);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (6, 'A', 1, 2);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (7, 'B', 1, 2);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (8, 'C', 1, 2);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (9, 'D', 1, 2);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (10, 'A', 1, 3);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (11, 'B', 1, 3);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (12, 'C', 1, 3);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (13, 'D', 1, 3);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (14, 'A', 1, 4);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (15, 'B', 1, 4);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (16, 'C', 1, 4);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (17, 'D', 1, 4);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (18, 'A', 1, 6);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (19, 'B', 1, 6);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (20, 'C', 1, 6);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (21, 'D', 1, 6);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (22, 'A', 1, 7);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (23, 'B', 1, 7);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (24, 'C', 1, 7);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (25, 'D', 1, 7);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (26, 'A', 1, 8);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (27, 'B', 1, 8);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (28, 'C', 1, 8);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (29, 'D', 1, 8);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (30, 'A', 1, 9);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (31, 'B', 1, 9);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (32, 'C', 1, 9);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (33, 'D', 1, 9);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (34, 'A', 1, 10);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (35, 'B', 1, 10);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (36, 'C', 1, 10);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (37, 'D', 1, 10);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (38, 'A', 1, 11);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (39, 'B', 1, 11);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (40, 'C', 1, 11);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (41, 'D', 1, 11);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (42, 'A', 1, 12);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (43, 'B', 1, 12);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (44, 'C', 1, 12);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (45, 'D', 1, 12);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (46, 'A', 1, 13);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (47, 'B', 1, 13);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (48, 'C', 1, 13);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (49, 'D', 1, 13);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (50, 'A', 1, 5);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (51, 'B', 1, 5);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (52, 'C', 1, 5);
INSERT INTO songprogram (id, name, midipedal, refsong) VALUES (53, 'D', 1, 5);

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

INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (1, 1, 0, 64, 0, 0, 0, 0, 1);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (2, 2, 0, 64, 0, 0, 0, 0, 1);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (3, 3, 0, 64, 0, 0, 0, 0, 1);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (4, 4, 0, 64, 0, 0, 0, 0, 1);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (5, 1, 0, 64, 0, 0, 0, 0, 2);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (6, 2, 0, 64, 0, 0, 0, 0, 2);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (7, 3, 0, 64, 0, 0, 0, 0, 2);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (8, 4, 0, 64, 0, 0, 0, 0, 2);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (9, 1, 0, 64, 0, 0, 0, 0, 3);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (10, 2, 0, 64, 0, 0, 0, 0, 3);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (11, 3, 0, 64, 0, 0, 0, 0, 3);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (12, 4, 0, 64, 0, 0, 0, 0, 3);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (13, 1, 0, 64, 0, 0, 0, 0, 4);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (14, 2, 0, 64, 0, 0, 0, 0, 4);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (15, 3, 0, 64, 0, 0, 0, 0, 4);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (16, 4, 0, 64, 0, 0, 0, 0, 4);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (17, 1, 0, 64, 0, 0, 0, 0, 6);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (18, 2, 0, 64, 0, 0, 0, 0, 6);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (19, 3, 0, 64, 0, 0, 0, 0, 6);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (20, 4, 0, 64, 0, 0, 0, 0, 6);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (21, 1, 0, 64, 0, 0, 0, 0, 7);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (22, 2, 0, 64, 0, 0, 0, 0, 7);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (23, 3, 0, 64, 0, 0, 0, 0, 7);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (24, 4, 0, 64, 0, 0, 0, 0, 7);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (25, 1, 0, 64, 0, 0, 0, 0, 8);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (26, 2, 0, 64, 0, 0, 0, 0, 8);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (27, 3, 0, 64, 0, 0, 0, 0, 8);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (28, 4, 0, 64, 0, 0, 0, 0, 8);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (29, 1, 0, 64, 0, 0, 0, 0, 9);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (30, 2, 0, 64, 0, 0, 0, 0, 9);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (31, 3, 0, 64, 0, 0, 0, 0, 9);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (32, 4, 0, 64, 0, 0, 0, 0, 9);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (33, 1, 0, 64, 0, 0, 0, 0, 10);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (34, 2, 0, 64, 0, 0, 0, 0, 10);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (35, 3, 0, 64, 0, 0, 0, 0, 10);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (36, 4, 0, 64, 0, 0, 0, 0, 10);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (37, 1, 0, 64, 0, 0, 0, 0, 11);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (38, 2, 0, 64, 0, 0, 0, 0, 11);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (39, 3, 0, 64, 0, 0, 0, 0, 11);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (40, 4, 0, 64, 0, 0, 0, 0, 11);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (41, 1, 0, 64, 0, 0, 0, 0, 12);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (42, 2, 0, 64, 0, 0, 0, 0, 12);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (43, 3, 0, 64, 0, 0, 0, 0, 12);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (44, 4, 0, 64, 0, 0, 0, 0, 12);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (45, 1, 0, 64, 0, 0, 0, 0, 13);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (46, 2, 0, 64, 0, 0, 0, 0, 13);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (47, 3, 0, 64, 0, 0, 0, 0, 13);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (48, 4, 0, 64, 0, 0, 0, 0, 13);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (49, 1, 0, 64, 0, 0, 0, 0, 14);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (50, 2, 0, 64, 0, 0, 0, 0, 14);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (51, 3, 0, 64, 0, 0, 0, 0, 14);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (52, 4, 0, 64, 0, 0, 0, 0, 14);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (53, 1, 0, 64, 0, 0, 0, 0, 15);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (54, 2, 0, 64, 0, 0, 0, 0, 15);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (55, 3, 0, 64, 0, 0, 0, 0, 15);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (56, 4, 0, 64, 0, 0, 0, 0, 15);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (57, 1, 0, 64, 0, 0, 0, 0, 16);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (58, 2, 0, 64, 0, 0, 0, 0, 16);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (59, 3, 0, 64, 0, 0, 0, 0, 16);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (60, 4, 0, 64, 0, 0, 0, 0, 16);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (61, 1, 0, 64, 0, 0, 0, 0, 17);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (62, 2, 0, 64, 0, 0, 0, 0, 17);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (63, 3, 0, 64, 0, 0, 0, 0, 17);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (64, 4, 0, 64, 0, 0, 0, 0, 17);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (65, 1, 0, 64, 0, 0, 0, 0, 18);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (66, 2, 0, 64, 0, 0, 0, 0, 18);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (67, 3, 0, 64, 0, 0, 0, 0, 18);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (68, 4, 0, 64, 0, 0, 0, 0, 18);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (69, 1, 0, 64, 0, 0, 0, 0, 19);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (70, 2, 0, 64, 0, 0, 0, 0, 19);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (71, 3, 0, 64, 0, 0, 0, 0, 19);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (72, 4, 0, 64, 0, 0, 0, 0, 19);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (73, 1, 0, 64, 0, 0, 0, 0, 20);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (74, 2, 0, 64, 0, 0, 0, 0, 20);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (75, 3, 0, 64, 0, 0, 0, 0, 20);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (76, 4, 0, 64, 0, 0, 0, 0, 20);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (77, 1, 0, 64, 0, 0, 0, 0, 21);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (78, 2, 0, 64, 0, 0, 0, 0, 21);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (79, 3, 0, 64, 0, 0, 0, 0, 21);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (80, 4, 0, 64, 0, 0, 0, 0, 21);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (81, 1, 0, 64, 0, 0, 0, 0, 22);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (82, 2, 0, 64, 0, 0, 0, 0, 22);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (83, 3, 0, 64, 0, 0, 0, 0, 22);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (84, 4, 0, 64, 0, 0, 0, 0, 22);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (85, 1, 0, 64, 0, 0, 0, 0, 23);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (86, 2, 0, 64, 0, 0, 0, 0, 23);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (87, 3, 0, 64, 0, 0, 0, 0, 23);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (88, 4, 0, 64, 0, 0, 0, 0, 23);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (89, 1, 0, 64, 0, 0, 0, 0, 24);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (90, 2, 0, 64, 0, 0, 0, 0, 24);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (91, 3, 0, 64, 0, 0, 0, 0, 24);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (92, 4, 0, 64, 0, 0, 0, 0, 24);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (93, 1, 0, 64, 0, 0, 0, 0, 25);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (94, 2, 0, 64, 0, 0, 0, 0, 25);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (95, 3, 0, 64, 0, 0, 0, 0, 25);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (96, 4, 0, 64, 0, 0, 0, 0, 25);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (97, 1, 0, 64, 0, 0, 0, 0, 26);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (98, 2, 0, 64, 0, 0, 0, 0, 26);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (99, 3, 0, 64, 0, 0, 0, 0, 26);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (100, 4, 0, 64, 0, 0, 0, 0, 26);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (101, 1, 0, 64, 0, 0, 0, 0, 27);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (102, 2, 0, 64, 0, 0, 0, 0, 27);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (103, 3, 0, 64, 0, 0, 0, 0, 27);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (104, 4, 0, 64, 0, 0, 0, 0, 27);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (105, 1, 0, 64, 0, 0, 0, 0, 28);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (106, 2, 0, 64, 0, 0, 0, 0, 28);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (107, 3, 0, 64, 0, 0, 0, 0, 28);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (108, 4, 0, 64, 0, 0, 0, 0, 28);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (109, 1, 0, 64, 0, 0, 0, 0, 29);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (110, 2, 0, 64, 0, 0, 0, 0, 29);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (111, 3, 0, 64, 0, 0, 0, 0, 29);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (112, 4, 0, 64, 0, 0, 0, 0, 29);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (113, 1, 0, 64, 0, 0, 0, 0, 30);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (114, 2, 0, 64, 0, 0, 0, 0, 30);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (115, 3, 0, 64, 0, 0, 0, 0, 30);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (116, 4, 0, 64, 0, 0, 0, 0, 30);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (117, 1, 0, 64, 0, 0, 0, 0, 31);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (118, 2, 0, 64, 0, 0, 0, 0, 31);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (119, 3, 0, 64, 0, 0, 0, 0, 31);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (120, 4, 0, 64, 0, 0, 0, 0, 31);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (121, 1, 0, 64, 0, 0, 0, 0, 32);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (122, 2, 0, 64, 0, 0, 0, 0, 32);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (123, 3, 0, 64, 0, 0, 0, 0, 32);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (124, 4, 0, 64, 0, 0, 0, 0, 32);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (125, 1, 0, 64, 0, 0, 0, 0, 33);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (126, 2, 0, 64, 0, 0, 0, 0, 33);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (127, 3, 0, 64, 0, 0, 0, 0, 33);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (128, 4, 0, 64, 0, 0, 0, 0, 33);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (129, 1, 0, 64, 0, 0, 0, 0, 34);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (130, 2, 0, 64, 0, 0, 0, 0, 34);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (131, 3, 0, 64, 0, 0, 0, 0, 34);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (132, 4, 0, 64, 0, 0, 0, 0, 34);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (133, 1, 0, 64, 0, 0, 0, 0, 35);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (134, 2, 0, 64, 0, 0, 0, 0, 35);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (135, 3, 0, 64, 0, 0, 0, 0, 35);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (136, 4, 0, 64, 0, 0, 0, 0, 35);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (137, 1, 0, 64, 0, 0, 0, 0, 36);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (138, 2, 0, 64, 0, 0, 0, 0, 36);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (139, 3, 0, 64, 0, 0, 0, 0, 36);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (140, 4, 0, 64, 0, 0, 0, 0, 36);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (141, 1, 0, 64, 0, 0, 0, 0, 37);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (142, 2, 0, 64, 0, 0, 0, 0, 37);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (143, 3, 0, 64, 0, 0, 0, 0, 37);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (144, 4, 0, 64, 0, 0, 0, 0, 37);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (145, 1, 0, 64, 0, 0, 0, 0, 38);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (146, 2, 0, 64, 0, 0, 0, 0, 38);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (147, 3, 0, 64, 0, 0, 0, 0, 38);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (148, 4, 0, 64, 0, 0, 0, 0, 38);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (149, 1, 0, 64, 0, 0, 0, 0, 39);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (150, 2, 0, 64, 0, 0, 0, 0, 39);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (151, 3, 0, 64, 0, 0, 0, 0, 39);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (152, 4, 0, 64, 0, 0, 0, 0, 39);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (153, 1, 0, 64, 0, 0, 0, 0, 40);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (154, 2, 0, 64, 0, 0, 0, 0, 40);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (155, 3, 0, 64, 0, 0, 0, 0, 40);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (156, 4, 0, 64, 0, 0, 0, 0, 40);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (157, 1, 0, 64, 0, 0, 0, 0, 41);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (158, 2, 0, 64, 0, 0, 0, 0, 41);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (159, 3, 0, 64, 0, 0, 0, 0, 41);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (160, 4, 0, 64, 0, 0, 0, 0, 41);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (161, 1, 0, 64, 0, 0, 0, 0, 42);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (162, 2, 0, 64, 0, 0, 0, 0, 42);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (163, 3, 0, 64, 0, 0, 0, 0, 42);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (164, 4, 0, 64, 0, 0, 0, 0, 42);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (165, 1, 0, 64, 0, 0, 0, 0, 43);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (166, 2, 0, 64, 0, 0, 0, 0, 43);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (167, 3, 0, 64, 0, 0, 0, 0, 43);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (168, 4, 0, 64, 0, 0, 0, 0, 43);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (169, 1, 0, 64, 0, 0, 0, 0, 44);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (170, 2, 0, 64, 0, 0, 0, 0, 44);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (171, 3, 0, 64, 0, 0, 0, 0, 44);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (172, 4, 0, 64, 0, 0, 0, 0, 44);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (173, 1, 0, 64, 0, 0, 0, 0, 45);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (174, 2, 0, 64, 0, 0, 0, 0, 45);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (175, 3, 0, 64, 0, 0, 0, 0, 45);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (176, 4, 0, 64, 0, 0, 0, 0, 45);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (177, 1, 0, 64, 0, 0, 0, 0, 46);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (178, 2, 0, 64, 0, 0, 0, 0, 46);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (179, 3, 0, 64, 0, 0, 0, 0, 46);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (180, 4, 0, 64, 0, 0, 0, 0, 46);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (181, 1, 0, 64, 0, 0, 0, 0, 47);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (182, 2, 0, 64, 0, 0, 0, 0, 47);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (183, 3, 0, 64, 0, 0, 0, 0, 47);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (184, 4, 0, 64, 0, 0, 0, 0, 47);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (185, 1, 0, 64, 0, 0, 0, 0, 48);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (186, 2, 0, 64, 0, 0, 0, 0, 48);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (187, 3, 0, 64, 0, 0, 0, 0, 48);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (188, 4, 0, 64, 0, 0, 0, 0, 48);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (189, 1, 0, 64, 0, 0, 0, 0, 49);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (190, 2, 0, 64, 0, 0, 0, 0, 49);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (191, 3, 0, 64, 0, 0, 0, 0, 49);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (192, 4, 0, 64, 0, 0, 0, 0, 49);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (193, 1, 0, 64, 0, 0, 0, 0, 50);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (194, 2, 0, 64, 0, 0, 0, 0, 50);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (195, 3, 0, 64, 0, 0, 0, 0, 50);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (196, 4, 0, 64, 0, 0, 0, 0, 50);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (197, 1, 0, 64, 0, 0, 0, 0, 51);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (198, 2, 0, 64, 0, 0, 0, 0, 51);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (199, 3, 0, 64, 0, 0, 0, 0, 51);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (200, 4, 0, 64, 0, 0, 0, 0, 51);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (201, 1, 0, 64, 0, 0, 0, 0, 52);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (202, 2, 0, 64, 0, 0, 0, 0, 52);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (203, 3, 0, 64, 0, 0, 0, 0, 52);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (204, 4, 0, 64, 0, 0, 0, 0, 52);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (205, 1, 0, 64, 0, 0, 0, 0, 53);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (206, 2, 0, 64, 0, 0, 0, 0, 53);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (207, 3, 0, 64, 0, 0, 0, 0, 53);
INSERT INTO songprogrampreset (id, refpreset, volume, pan, muteflag, reverbflag, delayflag, modeflag, refsongprogram) VALUES (208, 4, 0, 64, 0, 0, 0, 0, 53);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
