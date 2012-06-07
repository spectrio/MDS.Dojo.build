NANO
----

Use Node.js to run the nano file utilities to copy only the necessary files from
your dojo build into a samller (nano) deploy directory which is more convenient
for copying to servers or using over FTP.

Tests
-----

To run the tests, go to a command line, navigate to the nano directory and type:
```bash
node test
```

Copying Directories
-------------------

You should have a Node.js module with exports.struct equal to an object that
represents the directory structure you wish to copy. You then can pass that
module path into the command as an argument:
```bash
node ../VLS5/vls-nano
```

Versioning
----------
If you have a file that contains a version in the form of vNN (v1, v13, etc) this
can be auto-versioned by adding a third, true parameter:
```bash
node ../VLS5/vls-nano true
```
