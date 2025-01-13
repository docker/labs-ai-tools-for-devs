if(process.argv.length > 2) {
    // get the first command line argument
    var cmdArgument = process.argv[2];

    // evaluate JS string
    try {
        var result = eval(cmdArgument);
    } catch(e) {
        console.error('Error: ' + e.message);
    }
} else {
    console.error('No JavaScript string provided to evaluate!');
}

