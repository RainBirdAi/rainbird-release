// Thing wrapper around command line git. Possibly not the most elegant solution
// but the packages out there currently don't have the functionality we needed.

var exec = require('child_process').exec;

// Clone the given repository to the provided path. If path already exists it
// must be an empty directory. Any Errors are just pushed back to the callback.

function clone(repo, path, callback) {
    var command = 'git clone ' + repo + ' ' + path;
    exec(command, function(error) {
        callback(error);
    });
}

// Check if the file specified by path has been modified in the given git
// repository. The callback will be called with `true` if the file has been
// modified and not committed to the repository.

function checkModified(repo, path, callback) {
    var command = 'cd ' + repo + ' && git status --porcelain ' + path;

    exec(command, function(error, stdout) {
        if (!error && /^ M/.test(stdout)) {
            callback(null, true);
        } else {
            callback(error, false);
        }

    });
}

// Release the master branch to the production branch. Any changes to the
// master branch (i.e. the updated version number and release notes) are first
// committed. The production branch is tagged and the whole lot pushed back to
// origin.

function release(path, version, callback) {
    var command = 'cd ' + path + ' && git add --all . && ' +
        'git commit . -m ' +
        '"Update release notes for ' + version + ' release" && ' +
        'git checkout production && git merge master &&' +
        'git tag -a ' + version + ' -m "Version ' + version + ' release" &&' +
        'git push origin master && git push origin production && ' +
        'git push origin --tags';

    exec(command, callback);
}

module.exports.clone = clone;
module.exports.checkModified = checkModified;
module.exports.release = release;

// ## License
//
// Copyright (c) 2014, RainBird Technologies <follow@rainbird.ai>
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED 'AS IS' AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.