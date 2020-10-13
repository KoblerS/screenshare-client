$(document).ready(function () {
  connectPeer();
});

let videoElem = document.getElementById('videoElem');

let peer;
let call;
let activeCall = false;

function connectPeer() {
  let randomCode = getRandomArbitrary();
  $('.connectCode').text(randomCode);

  peer = new Peer(randomCode, {
    host: 'splitcast.io',
    port: 443,
    path: 'peerserver',
    secure: true
  });

  peer.on('call', function (callObj) {
    if (activeCall == true)
      return;
    activeCall = true;

    call = callObj;

    call.on('stream', function (stream) {
      videoElem.srcObject = stream;
      console.log(stream);
      $('.videoElem').show();
      $('.row').hide();

      videoElem.onpause = function () {
        closedConnection();
      };
    });
    call.on('error', function () {
      closedConnection();
    });
    call.on('close', function () {
      closedConnection();
    });

    let answer = call.answer();
  });

  peer.on('error', function (error) {
    closedConnection();
  });
  peer.on('disconnect', function (error) {
    closedConnection();
  });

  peer.on('connection', function (dataCon) {
    dataCon.on('data', function (data) {
      if (data == "closed") {
        call.close();
        closedConnection();
      }
    });
    dataCon.on('error', function () {
      closedConnection();
    });
    dataCon.on('close', function () {
      closedConnection();
    });
  });
}

function closedConnection() {
  $('.videoElem').hide();
  $('.row').show();
  peer.destroy();
  peer = null;
  activeCall = false;
  location.reload();
}

function getRandomArbitrary() {
  return Math.floor(Math.random() * (99999 - 11111) + 11111);
}