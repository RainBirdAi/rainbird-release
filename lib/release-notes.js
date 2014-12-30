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