var fs = require('fs');
var path = require('path');
var async = require('async');
var readline = require('readline');

// The default version number is pulled from `package.json` which we assume is
// in the format `major.minor.build`. If it's not in this format then all we
// can do is choke and die. By default the build number is bumped by 1, but this
// can be overridden by the user.

function getDefaultVersion(repo, callback) {
    fs.readFile(repo + path.sep + 'package.json', function (err, data) {
        if (err) { callback(err); }

        var nextVersion;
        var currentVersion = JSON.parse(data).version;
        var build = currentVersion.replace(/[0-9]+\.[0-9]+\./, '');

        if (isNaN(build)) {
            callback('Invalid version number: %s' + currentVersion);
        }

        build++;
        nextVersion = currentVersion.replace(/[0-9]+$/, build);
        callback(null, nextVersion);
    });
}

// The user then gets a chance to override the derived default version number,
// which is then checked to ensure it's in the correct format.

function getVersion(defaultVersion, callback) {

    var prompt = 'Version number [' + defaultVersion + '] ';

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    async.forever(
        function (next) {
            rl.question(prompt, function(answer) {
                if (answer === '') {
                    next(defaultVersion);
                } else if (/[0-9]+\.[0-9]+\.[0-9]+/.test(answer)) {
                    next(answer);
                } else {
                    console.log('Invalid version number: %s', answer);
                    next();
                }
            });
        },
        function (version) {
            rl.close();
            callback(null, version);
        }
    );
}

// Finally the version number is written back to the `package.json` file. This
// is done as a simple replace of the version string rather than writing out
// the whole package.json object read in when determining the default version
// number in order to avoid changing the order/layout of the rest of the file.

function setVersion(repo, version, callback) {
    var regex = /"version":\s*"[0-9]+\.[0-9]+\.[0-9]+"/;
    var replace = '"version": "' + version + '"';
    var file = repo + path.sep + 'package.json';

    fs.readFile(file, 'utf8', function(err, data) {
        if (err) { callback(err); }
        var result = data.replace(regex, replace);

        fs.writeFile(file, result, 'utf8', function(err) {
            callback(err);
        });
    });
}

module.exports.getDefaultVersion = getDefaultVersion;
module.exports.getVersion = getVersion;
module.exports.setVersion = setVersion;