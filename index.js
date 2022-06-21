const express = require('express');
const app  = express();
const port = 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/assets/:name', (req, res) => {
    res.sendFile(__dirname + `/assets/${req.params.name}`);
});
app.get('/css/styles.css', (req, res) => {
    res.sendFile(__dirname + '/css/styles.css');
});
app.get('/html/:filename', (req, res) => {
    res.sendFile(__dirname + '/html/' + req.params.filename);
});
app.get('/pdfs/:filename', (req, res) => {
    res.sendFile(__dirname + '/pdfs/' + req.params.filename);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
