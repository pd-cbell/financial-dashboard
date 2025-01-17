# Financial Dashboard & Stock Simulator Demo Setup

## Overview

This repository provides all necessary files to set up and run the **Financial Dashboard** and **Stock Simulator** demo applications. These tools simulate real-time transaction monitoring, failure trends, and stock trading workflows.

### Features
- **Real-time transaction monitoring** with charts.
- **Dynamic stock transactions** with simulated success/failure rates.
- **Configurable API endpoints** for custom integrations.

---

## Prerequisites

Ensure you have the following installed:
- **[Node.js](https://nodejs.org/)** (Required for running the local server)
- **[Git](https://git-scm.com/)** (To clone the repository)
- A modern web browser (Chrome, Firefox, Edge, or Safari)

---

## Installation

### 1. Clone the Repository
```sh
git clone https://github.com/pd-cbell/financial-dashboard.git
cd financial-dashboard
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Run the Dashboard (Port 3000)
```sh
cd server
node server.js
```

### 4. Run the WebApp (Port 3001)
```sh
cd webapp
node server.js
```

### 5. Open the Applications in a Browser
- **Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Stock Simulator:** [http://localhost:3001](http://localhost:3001)

---

## File Structure

```
financial-dashboard/
│── server/
│   ├── public/
│   │   ├── css/
│   │   ├── images/
│   │   ├── js/
│   │   │   ├── charts.js
│   │   │   ├── dashboard.js
│   │   │   ├── outage-simulator.js
│   │   ├── index.html
│── webapp/
│   ├── public/
│   │   ├── fake-login.html
│   │   ├── index.html
│   │   ├── script.js
│   │   ├── styles.css
```

---

## Configuring the Web App

The **Stock Simulator** makes a `GET` request to an external API hosted on **Heroku**. Each SC **must** modify this endpoint before using the simulator.

1. Open **`config.js`** and locate the API configuration:
   ```js
   const API_ENDPOINT = "https://your-heroku-app.herokuapp.com/api/transactions";
   ```
2. Replace the placeholder URL with your actual API endpoint.
3. Ensure the external API is accessible and returns valid JSON responses.

---

## Running the Demo

### 1️⃣ Open the Financial Dashboard
- Open [http://localhost:3000](http://localhost:3000)
- The dashboard will display key transaction metrics and charts.

### 2️⃣ Interact with the Stock Simulator
- Navigate to [http://localhost:3001](http://localhost:3001)
- Select a stock (AAPL, GOOGL, AMZN, TSLA)
- Enter quantity and price per share
- Click **"Submit Transaction"** to simulate a trade
- Transactions have an **80% success rate** with random failure reasons

### 3️⃣ View Transaction Volume & Failure Trends
- **Real-time data simulation** updates charts every minute
- **24-hour transaction trends** display hourly volume changes
- **Failure trends** show failed transactions dynamically

---

## Setting Up Node.js

1. **Download and Install Node.js**
   - Visit [Node.js official website](https://nodejs.org/) and download the latest LTS version.
   - Follow the installation instructions for your OS.

2. **Verify Node.js Installation**
   ```sh
   node -v
   npm -v
   ```
   This should return the installed Node.js and npm versions.

3. **Install Project Dependencies**
   ```sh
   npm install
   ```

4. **Start the Servers**
   - Run the **Dashboard Server** (`port 3000`):
     ```sh
     cd server
     node server.js
     ```
   - Run the **WebApp Server** (`port 3001`):
     ```sh
     cd webapp
     node server.js
     ```

---

## Customization

### Modify Transaction Data
- Open `dashboard.js` and adjust the simulation logic:
  ```js
  const newFailed = Math.floor(newVolume * 0.005); // Adjust failure rate
  ```

### Change Styling
- Edit `styles.css` to customize dashboard appearance.

### Add New Stocks
- Modify `script.js` to add more stock options:
  ```html
  <option value="MSFT">Microsoft (MSFT)</option>
  ```

---

## Troubleshooting

### Charts Not Displaying?
- Ensure `Chart.js` is loaded in `index.html`:
  ```html
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  ```
- Check the browser console for errors.

### Stock Transactions Not Working?
- Verify `script.js` is linked correctly in `index.html`.
- Ensure the **API endpoint is correct** in `config.js`.

### Live Data Not Updating?
- Ensure `dashboard.js` and `charts.js` are running correctly.

---

## Contribution

Want to improve this dashboard? Feel free to submit pull requests or suggest new features.

---

## License

This project is open-source under the **MIT License**.

