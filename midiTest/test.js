
var easymidi = require('easymidi');
var outputs = easymidi.getOutputs();
var inputs = easymidi.getInputs();

console.log(outputs)
console.log(inputs)

var output = new easymidi.Output('Network Session 1',true);
//var output = new easymidi.Output('MIDI Loupe');
// output.send('noteon', {
//   note: 64,
//   velocity: 127,
//   channel: 3
// });

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
async function sendMessages () {
    for (let i = 0 ; i < 1000; i++)
    {
        output.send('cc', {
            controller: 3,
            value: 20,
            channel: 4
        });
        // console.log(i)
        await sleep(2000);
    }
}

sendMessages();

output.close();