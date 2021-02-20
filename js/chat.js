(function () {
  var socket = io();
  $('form').submit(function (e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return true;
  });
})();

// (function () {
//   $('form').submit(function (e) {
//     let li = document.createElement('li');
//     e.preventDefault(); // prevents page reloading
//     // socket.emit('chat message', $('#message').val());

//     messages.appendChild(li).append($('#message').val());
//     let span = document.createElement('span');
//     messages.appendChild(span).append('by ' + 'Anonymous' + ': ' + 'just now');

//     $('#message').val('');

//     return false;
//   });

//   // socket.on('received', (data) => {
//   //   let li = document.createElement('li');
//   //   let span = document.createElement('span');
//   //   var messages = document.getElementById('messages');
//   //   messages.appendChild(li).append(data.message);
//   //   messages.appendChild(span).append('by ' + 'anonymous' + ': ' + 'just now');
//   //   console.log('Hello bingo!');
//   // });
// })();
