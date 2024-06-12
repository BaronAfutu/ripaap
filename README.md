# RIPAAP

RIPAAP (Reference Interval for Pediatric and Adult African Populations) is a web platform designed to provide accurate chemical and haematological reference intervals tailored specifically to African populations. By aggregating contemporary research, RIPAAP aims to improve diagnostic precision for healthcare professionals across Africa.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
  - [Using Development Server](#using-development-server)
  - [Using Production Server](#using-production-server)
- [Usage](#usage)
- [Author](#author)
- [Contributions](#contributions)
- [Bugs](#bugs)

## Introduction

### Purpose of the Project
RIPAAP is designed to provide accurate, region-specific reference intervals for chemical and haematological tests for the African population, addressing the inaccuracies caused by using outdated European data.

### Roles and Timeline
Developed as a full-stack project over six months, using the MERN stack.

### Target Audience
Hospitals, medical professionals, and researchers in Africa.

### Personal Inspiration
To create a user-friendly, reliable platform that medical professionals can trust for accurate diagnostics.

## Features
- **Search and Filter Functionality**: Easily find relevant reference intervals by test, country, age group, and gender.
- **Responsive Design**: Accessible and usable on all devices.
- **Data Visualization**: Clear charts and graphs for easy data interpretation.

## Installation

### Prerequisites
- Node.js
- MongoDB
- Git

### Clone the Repository
```bash
git clone https://github.com/BaronAfutu/ripaap.git
```

### Install Dependencies
```bash
cd ripaap
npm install
```

## Configuration
Create a `.env` file and configure the following environment variables:
- `MONGO_URI=your_mongodb_uri`
- `PORT=your_port`
- `JWT_SECRET=your_jwt_secret`

## Running the Application

### Using Development Server
```bash
npm run dev
```

### Using Production Server
1. Build the project:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm start
   ```

## Usage
Visit the website at [RIPAAP](https://www.ripaap.com) to access and utilize the reference intervals for accurate diagnostics.

## Author
Baron Afutu - [GitHub](https://github.com/BaronAfutu) / [LinkedIn](https://www.linkedin.com/in/baronafutu)

## Contributions
Contributions are welcome. Fork the repository, make changes, and submit a pull request.

## Bugs
No known bugs at this time. Please report any issues you find.
