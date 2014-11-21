# Rainbird Release

[ ![Codeship Status for RainBirdAi/rainbird-release](https://codeship.com/projects/dd2f7800-53ae-0132-06f4-42f33c882bfd/status?branch=master)](https://codeship.com/projects/48991)

A tool used to handle releasing from `master` to the `production` branch in git.
The tool assumes a node.js style `package.json` and a file called
`release-notes.md` in the root of the repository.

Once run `rbrelease` will prompt for the version of the release, then open an
editor to allow editing of the release notes. These changes are checked into
`master`, merged into `production` and the `production` branch tagged with the
version number. All changes are then pushed to `origin`.

# Installation

```bash
npm install -g rainbird-release
```

## Usage

```bash
Usage: rbrelease [options]
      --remote=URL   [Required] The URL of the git repository to release to
      --tmpdir=PATH  [Optional] The temporary directory to clone the repository to
  -h, --help         display this help text.
```

# License

Copyright (c) 2014, RainBird Technologies <follow@rainbird.ai>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.