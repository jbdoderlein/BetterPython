# BetterPython
WIP : A small but efficient, intuitive and responsive Python IDE right in your browser! Ships Micro Python, interpreter by your browser (so it works offline!), compiled with pyscript. 

## TODO
### Write a good README
Take exampel from BetterOCaml, with gifs, screenshot and usecases

### Test on real programm (=debug)
Make test on real world program = teaching material, see if the editor is capable

### Change icon and name from BetterOCaml

### Change XtermJS look to better match BetterEditor design

Need to integrate termjs plugins (for autosizing) + see if we can integrate matplotlib inside

### Make script to build from the sources the libs in the repo

Track all libs used and write how to update each files

### Update PWA + serviceWorker settings

Need to make mini-coi work with existing service worker to cache all fiels needed to the editor

### Clean up JS to remove every useless functions

## BetterPython + BetterPythonLight ?

The choice of interpreter is important.

### MicroPython
- lightweight
- fast to load + to execute
- no package = no matplotlib
- work without worker if needed

### Pyoide
- real cpython implementation
- can import package = can use matplotlib
- heavy to load
- package are heavy
- need worker to work
- import package is slow

2 solutions : choose one of the interpreter or make 2 versions

Need advice and feedbacks to decide