// eslint-disable-next-line import/no-extraneous-dependencies
const hat = require('hat');
const socket = require('../index');

const aliceId = hat();
const bobId = hat();

const socketAlice = socket(aliceId, bobId);
const socketBob = socket(bobId, aliceId);

const testQuestion = 'What is the meaning of life?';
const testAnswer = 'A movie.';

// error handlers
socketAlice.on('error', (error) => {
  console.error(error);
});
socketBob.on('error', (error) => {
  console.error(error);
});

// message handlers
socketAlice.on('message', (message) => {
  console.log(`Alice received answer: ${message}`);
  socketAlice.closeP()
    .then(() => {
      console.log("Alice's socket has closed");
      return socketBob.closeP();
    })
    .then(() => {
      console.log("Bob's socket has closed");
    })
    .catch((error) => {
      console.error(error);
    });
});
socketBob.on('message', (message) => {
  console.log(`Bob received question:; ${message}`);
  socketBob.send(testAnswer);
});

socketAlice.connectP()
  .then(() => {
    console.log("Alice's socket is ready");
    return socketBob.connectP();
  })
  .then(() => {
    console.log("Bob's socket is ready");
    socketAlice.send(testQuestion);
  })
  .catch((error) => {
    console.error(error);
  });
