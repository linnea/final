-- create database
create database if not exists final character set = "UTF8";

-- use it
use final;

-- create the users table
create table Users (
    id int not null primary key auto_increment,
    FirstName varchar(100) not null,    
    LastName varchar(100) not null,
    displayName varchar(200) not null,
    Email varchar(200) not null,
    PassHash varchar(200) not null
);

create table Memberships(
    id int not null primary key auto_increment,  
    UserID int not null, 
    AccountID int not null,
    FOREIGN KEY (UserID) references Users(id)
);

create table Accounts(
	id int not null primary key auto_increment,
    UserID int not null,
    Description varchar(300),
    Currency int default 1000,
    FOREIGN KEY (UserID) references Users(id)
);
/*
SELECT Users.id FROM Users JOIN Memberships
    ON Users.id = Memberships.UserID;
    
SELECT Users.id FROM Users JOIN Accounts
	ON Users.id = Accounts.UserID;*/
    