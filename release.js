var os = require('os');
var path = require('path');
var async = require('async');
var rmdir = require('rimraf');
var Getopt = require('node-getopt');
var randomstring = require('randomstring');

var git = require('./lib/git.js');
var pkg = require('./lib/version.js');
var notes = require('./lib/release-notes.js');

// Clean up after ourselves. We can happily just blitz the entire repository
// since we no longer need it.

function cleanup(repo) {
    rmdir(repo, function(err) {
        if (err) {
            console.log('Error removing temporary repository %s', repo);
        }
    });
}

// The minimum we need from the user is a remote URL for the repository being
// cloned and release to (or the help flag, but then we're just bailing and
// displaying the usage). The working directory used is generated using a
// random, prefixed directory name but can be overridden using the relevant
// flag.

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
var repo = os.tmpdir() + path.sep + 'rbrelease_' + randomstring.generate(8);

if (!options.remote) {
    getopt.showHelp();
    process.exit(1);
}

if (options.tmpdir) {
    repo = options.tmpdir;
}

// Since there is nothing to clean up until we've successfully done the clone.
// The remaining steps are done using `async.waterfall` so we pass values down
// the chain and know that the cloned repository will be cleaned up regardless
// of if the release completed successfully or not.

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
