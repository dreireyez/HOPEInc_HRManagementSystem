# Database Schema Notes

## Core Tables

- employee: stores employee information
- job: stores job definitions
- department: stores departments
- jobHistory: tracks employee job assignments

## Auth & Access Control

- user: system users
- module: system modules
- rights: permissions per module
- user_module: module-level access
- UserModule_Rights: specific rights per user

## Relationships

- employee → jobHistory (1:N)
- job → jobHistory (1:N)
- department → jobHistory (1:N)
- module → rights (1:N)
- user → user_module (1:N)
- user → UserModule_Rights (1:N)
- rights → UserModule_Rights (1:N)