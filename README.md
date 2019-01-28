# poc_mp4_corrupted_chunks

This repo showcases how to extract only uncorrupted parts of mp4 (e.g. all chunks before a junk is detected and/or incomplete chunk is encountered.)

## Example output
```
$ npm start

> mp4@1.0.0 start ..................
> node index.js

# original: Uncorrupted size: 309977, file size: 309977
# extraBytes: Uncorrupted size: 309977, file size: 309988
# fewerBytes: Uncorrupted size: 303775, file size: 309967
```
