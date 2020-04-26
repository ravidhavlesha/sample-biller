# Sample Biller System

A sample biller system implementation for finding outstanding customer bills and marking them paid with return receipt. 
This system is built with **NodeJS**, **MongoDB** and is hosted on **Vercel**.

## Getting Started

### Software Requirements

-   NodeJS **8+**
-   NPM **3.5+**
-   MongoDB **4+**

### How to install?
1. Clone the project from github.
```bash
git clone https://github.com/ravidhavlesha/sample-biller.git ./sample-biller
```
2. Install dependencies.
```bash
cd sample-biller
npm install
```
3. Setup environment variables. 
- You will find a file named `.env.example` in root directory of this project.
- Create a new file by copying `.env.example` file and renaming it to `.env`.

 ```bash
cp .env.example .env
```
- Update the newly created `.env` file with your values.

### Running the server locally.
```bash
npm run dev
```
### Running the server as production.
```bash
npm run start
```

### Running Eslint.
```bash
npm run lint
```