-- Simple User and Account Management System
-- Create schema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'bankapp')
BEGIN
    EXEC('CREATE SCHEMA bankapp')
END
GO

-- Create Users table
CREATE TABLE bankapp.Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    FullName NVARCHAR(100),
    IsActive BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE()
);

-- Create Accounts table
CREATE TABLE bankapp.Accounts (
    AccountId INT IDENTITY(1,1) PRIMARY KEY,
    AccountNumber NVARCHAR(20) NOT NULL UNIQUE,
    AccountType NVARCHAR(20) NOT NULL,
    Balance DECIMAL(18,2) DEFAULT 0,
    UserId INT NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES bankapp.Users(UserId)
);

-- Create simple roles table
CREATE TABLE bankapp.Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);

-- Create user roles table
CREATE TABLE bankapp.UserRoles (
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES bankapp.Users(UserId),
    FOREIGN KEY (RoleId) REFERENCES bankapp.Roles(RoleId)
);

-- Insert basic roles
INSERT INTO bankapp.Roles (RoleName) VALUES 
('Admin'),
('User'),
('Customer');

PRINT 'Simple User and Account Management System database created successfully in bankapp schema';
