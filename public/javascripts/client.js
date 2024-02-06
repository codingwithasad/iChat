var socket = io();
var messages = document.querySelector('.container2');
var form = document.getElementById('formMsgs');
var input = document.getElementById('inputMsg');

const name = prompt("Enter name to join the chat");
socket.emit('new-user-joined', name);

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', function (msg) {
    var item = document.createElement('div');
    item.innerText = msg.message;
    // item.setAttribute('data-aos', 'zoom-in-up'); 
    // Check if the sender is the current user or not
    if (msg.sender === socket.id) {
        item.classList.add('right');
    } else {
        item.classList.add('left');
    }

    messages.appendChild(item);

    // Initialize AOS on the newly added item
    AOS.init({ target: item });

    // Scroll to the bottom of the messages container
    messages.scrollTop = messages.scrollHeight;
});

var isScrolling = false;

// Listen for scroll events
messages.addEventListener('scroll', function() {
    isScrolling = true;

    // Disable AOS during scrolling
    AOS.init({
        disable: isScrolling
    });

    // Clear the timeout to re-enable AOS after scrolling stops
    clearTimeout(scrollTimeout);
    var scrollTimeout = setTimeout(function() {
        isScrolling = false;
        AOS.init();
    }, 66); // Adjust this timeout value as needed
});



// Listen for the 'user joined' event and display a welcome message
socket.on('user joined', function (message) {
    // const main = document.querySelector('.system-message');
    var main = document.createElement('div');
    main.classList.add('system-message');
    var joinMessage = document.createElement('p');
    joinMessage.innerText = message;
    main.appendChild(joinMessage);
    messages.appendChild(main);
    // Scroll to the bottom of the messages container
    messages.scrollTop = messages.scrollHeight;
});