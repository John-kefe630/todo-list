const app = require('./app');
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV === 'production') {
  console.error("CRITICAL ERROR: Failed to connect to core configuration service!");
  process.exit(1);
}
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
