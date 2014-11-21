var path = require('path');
var editor = require('editor');

var git = require('./git.js');

// Let the user edit the release notes in the editor of their choice (via the
// EDITOR variable on unix systems). If no changes are made to the release notes
// then bail.

function update(repo, callback) {
    var releaseNotes = 'release-notes.md';
    editor(repo + path.sep + releaseNotes, function(code, sig) {
        if (code === 0 && sig === null) {
            git.checkModified(repo, releaseNotes, function (err, modified) {
                if (!err && !modified) {
                    callback('No release notes, aborting...');
                } else {
                    callback(err);
                }
            });
        }
    });
}

module.exports.update = update;