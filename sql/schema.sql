-- create database
create database if not exists final character set = "UTF8";

-- use it
use final;

-- create the users table
create table Users (
    id int not null primary key auto_increment,
    FirstName varchar(100) not null,    
    LastName varchar(100) not null,
    Email varchar(200) not null,
    PassSalt varchar(50) not null,
    PassHash varchar(50) not null
);

create table Memberships(
    id int not null primary key auto_increment,  
    UserID int not null,
    AccountID int not null,
    Email varchar(200) not null,
    Description varchar(300),
    Currency int not null default 1000
);

SELECT Users.id FROM Users JOIN Memberships
    ON Users.id = Memberships.UserID;