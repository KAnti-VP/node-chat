const socket = io();

    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const chat = document.getElementById('chat');
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const loginDiv = document.getElementById('login');
    const chatContainerDiv = document.getElementById('chatContainer');

    let currentUsername = null;

    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        socket.emit('set username', username);
    });

    socket.on('user set', (username) => {
        currentUsername = username;
        loginDiv.style.display = "none";
        chatContainerDiv.style.display = "block";
    });

    socket.on('user exists', (msg) => {
        alert(msg);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
      }
    });

    socket.on('chat message', (msg) => {
        const item = document.createElement('li');
        item.textContent = msg.user + ': ' + msg.message;
        chat.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
