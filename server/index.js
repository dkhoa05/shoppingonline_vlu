// CLI:
// npm install express body-parser --save

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const adminBuild = path.resolve(__dirname, '../client-admin/build');
const customerBuild = path.resolve(__dirname, '../client-customer/build');

// middlewares
app.use(bodyParser.json({ limit: '10mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// APIs (phải đứng trước static / SPA fallback)
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

// Admin UI (homepage CRA: /admin)
app.use('/admin', express.static(adminBuild));
app.get(/^\/admin(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(adminBuild, 'index.html'));
});

// Customer UI
app.use(express.static(customerBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(customerBuild, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
