const express = require('express');
const path = require('path');

const app = express();
//inicia o express

const server = require('http').createServer(app);
//define o protocolo http
const io = require('socket.io')(server);
//define o protocolo do socket.io

app.use(express.static(path.join(__dirname, 'public')));
//pasta onde ficara os arquivos publicos
app.set('views', path.join(__dirname, 'public'));
//utilizar views como html
app.engine('html', require('ejs').renderFile);
//define o uso do html
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});
//executar o index.html

let messages = [];

io.on('connection', socket => {
    console.log(`Socket ${socket.id} conectado ao chat`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(3000);