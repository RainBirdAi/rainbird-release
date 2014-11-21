var os = require('os');
var path = require('path');
var async = require('async');
var rmdir = require('rimraf');
var Getopt = require('node-getopt');
var randomstring = require('randomstring');

var git = require('./lib/git.js');
var pkg = require('./lib/version.js');
var notes = require('./lib/release-notes.js');

function cleanup(repo) {
    rmdir(repo, function(err) {
        if (err) {
            console.log('Error removing temporary repository %s', repo);
        }
    });
}

getopt = new Getopt([
    ['', 'remote=URL',
        '[Required] The URL of the git repository to release to'],
    ['', 'tmpdir=PATH',
        '[Optional] The temporary directory to clone the repository to'],
    ['h', 'help', 'display this help text.']
]);

getopt.setHelp("Usage: rbrelease [options]\n[[OPTIONS]]");
getopt.bindHelp();

var version = '0.0.0';
var options = getopt.parseSystem().options;
var repo = os.tmpdir() + path.sep + randomstring.generate(8);

if (!options.remote) {
    getopt.showHelp();
    process.exit(1);
}

if (options.tmpdir) {
    repo = options.tmpdir;
}

git.clone(options.remote, repo , function(err) {
    if (err) {
        console.log(err);
    } else {
        async.waterfall(
            [
                function(callback) {
                    pkg.getDefaultVersion(repo, callback);
                },
                function(defaultVersion, callback) {
                    pkg.getVersion(defaultVersion, callback);
                },
                function(releaseVersion, callback) {
                    version = releaseVersion;
                    pkg.setVersion(repo, version, callback);
                },
                function(callback) {
                    notes.update(repo, callback);
                },
                function(callback) {
                    git.release(repo, version, callback);
                }
            ], function (err) {
                cleanup(repo);

                if (err) {
                    console.log(err);
                } else {
                    console.log('Released %s to production branch.', version);
                }

            }
        );
    }
});
