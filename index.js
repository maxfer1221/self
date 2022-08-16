const express = require('express');
const app  = express();
const port = 8080;

app.use(express.static(__dirname));

app.get('/self', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/self/assets/:name', (req, res) => {
    res.sendFile(__dirname + `/assets/${req.params.name}`);
});
app.get('/self/css/styles.css', (req, res) => {
    res.sendFile(__dirname + '/css/styles.css');
});
app.get('/self/html/:filename', (req, res) => {
    res.sendFile(__dirname + '/html/' + req.params.filename);
});
app.get('/self/pdfs/:filename', (req, res) => {
    res.sendFile(__dirname + '/pdfs/' + req.params.filename);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
