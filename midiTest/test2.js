const midi = require('midi');

// Set up a new output.

async function sendMessages (output, val) {
    output.sendMessage([180,20,val]);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const output = new midi.Output();
output.openVirtualPort("Test Input");
await sleep(2000);

console.log(output.getPortCount());

for (let i = 0 ; i < output.getPortCount(); i++)
{
    console.log(output.getPortName(i));
}

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    
    if (key.name == '1') sendMessages (output, 11);
    if (key.name == '2') sendMessages (output, 12);
    if (key.name == '3') sendMessages (output, 13);
    if (key.name == '4') sendMessages (output, 14);

    console.log(`You pressed the "${str}" key`);
    console.log();
    console.log(key);
    console.log();
  }
});
console.log('Press any key...');

output.closePort();

