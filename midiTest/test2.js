const midi = require('midi');

// Set up a new output.

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sendMessages () {
    const output = new midi.Output();
    
    output.openVirtualPort("Test Input");
    await sleep(2000);

    console.log(output.getPortCount());

    for (let i = 0 ; i < output.getPortCount(); i++)
    {
        console.log(output.getPortName(i));
    }
    
    // Get the name of a specified output port.
    //let names = output.getPortName(0);
    
    // Open the first available output port.
    //output.openVirtualPort("Test Input");

    //output.openPort(0);

    

    for (let i = 0 ; i < 50; i++)
    {


        output.sendMessage([180,20,11]);
        await sleep(500);
        output.sendMessage([180,20,12]);
        await sleep(500);
        output.sendMessage([180,20,13]);
        await sleep(500);
        output.sendMessage([180,20,14]);
        await sleep(500);
        output.sendMessage([180,20,15]);
        await sleep(500);
        output.sendMessage([180,20,20]);
        await sleep(500);
        console.log(i)
        await sleep(2000);
    }
    output.closePort();
} 

sendMessages()

// Send a MIDI message.


// Close the port when done.
