# BetterPython
WIP : A small but efficient, intuitive and responsive Python IDE right in your browser! Ships Micro Python, interpreter by your browser (so it works offline!), compiled with pyscript. 

## TODO
- Write a good README
- Test on real programm (=debug)
- Change icon and name from BetterOCaml
- Change XtermJS look to better match BetterEditor design
- Make script to build from the sources the libs in the repo
- Update PWA settings
- Clean up JS to remove every useless functions

## Use of Web Worker / Python Interpreter
We now use Micro Python but we could use original python interpreter if the toplevel was in a web worker.
To accept the toplevel in web worker, we would need these headers :
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```
But this is not possible on github pages.