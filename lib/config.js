var fs = require('fs');
var config = {};

config.get = (path, query) => {
    var obj = JSON.parse(fs.readFileSync(path, 'utf8'));

    if (obj && obj[query]) {
        return obj[query]
    }else{
        console.log("Encountered an error")
    }
};

module.exports = config;