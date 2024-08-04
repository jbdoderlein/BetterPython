# BetterPython
[![GitHub license](https://img.shields.io/github/license/jbdoderlein/betterpython?style=flat-square)](https://github.com/jbdoderlein/betterpython/blob/master/LICENSE)
![GitHub repo size](https://img.shields.io/github/repo-size/jbdoderlein/BetterPython?style=flat-square)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square)](https://GitHub.com/jbdoderlein/BetterPython/graphs/commit-activity)
[![Open Source? Yes!](https://badgen.net/badge/Open%20Source%20%3F/Yes%21/blue?icon=github)](https://github.com/Naereen/badges/)
[![Awesome Badges](https://img.shields.io/badge/badges-awesome-green.svg?style=flat-square)](https://github.com/Naereen/badges)
<p style="font-style: italic"> Language : 
  <span>English</span> |
  <a href="https://github.com/jbdoderlein/BetterPython/tree/master/lang/french#betterpython">Français</a>
  </p>

An efficient, intuitive and cross-platform web IDE for the [Python](https://www.python.org/) language, with your code interpreted and running in your browser! (no server is needed!)

## Installation / Usage

The IDE is hosted [here](https://jbdoderlein.github.io/BetterPython), <https://jbdoderlein.github.io/BetterPython>, but you can host your own version by simply copying the files from the `src/` directory on your host (on a folder of your laptop, or a folder of your web-server).

It is a *purely static website*: once your browser downloads the files from the server (about 3 MB), it will run the Python code in its javascript engine, without sending anything to a distant server!
Your data is secure, and this website does not use any third party service cookie :no_good_man: :cookie:.

Without installing any software on your laptop or smartphone, use [this web-based editor](https://jbdoderlein.github.io/BetterPython) to access to a MicroPython REPL and text editor, with syntax highlighting, and multiple-files that you can save to or load from your computer.

## How to use ?

![Usage(credit Marsupilami1)](https://github.com/user-attachments/assets/41ec16e9-9400-4f6f-a331-3bf77f32dd3b)

The editor is made of 3 parts, as seen in this screenshot:
- ** Navbar ** : this is where you can switch between multiple files. You can add, execute, save, load code in the editor and access to settings;;
- ** Editor** : you can type code here and execute with `Ctrl+Enter`. This shortcut execute the current highlighted Python statement/block. To run the entire file you can use `Ctrl+Shift+Enter`.
- ** Output & Console** : this the output of Python, showing values and messages printed to `sdtout`, you can also type command here (after the `>>> ` sign), and type `Enter`.

### :art: Theme

You can choose the theme in the settings, in the top right corner. Your preference should be used the next time you come back on the editor.
There are currently three themes (two dark themes, "default" and "Monokai", and a light one, "MDN").

If you have any suggestion for a new theme, [open an issue](https://github.com/jbdoderlein/BetterPython/issues/new) :+1: !

## :sparkles: Use offline?
### :computer: On a laptop or desktop
- If you visit [the editor](https://jbdoderlein.github.io/BetterPython) webpage using your favorite browser, and if it works fine, you can add the link to your :star: "favorites", and then later on, if you open the direct link, it should work and load back BetterPython... even if your browser is offline!
- This can only work if you don't clean-up or delete the cache of your browser, but it should work even if you turn-off and turn-on again your laptop!

- BetterPython is a *Progressive Web App* (PWA), which can be installed on your laptop and used later on, even if you're offline! After being intalled, the app should appear in your global application menu (it works on Chromium on both Windows and Ubuntu).

> If you can't install it as a PWA, [@Naereen](https://GitHub.com/Naereen) recommends trying [WebCatalog](https://webcatalog.app/), a multi-platform desktop app (for \*NIX, Windows and Mac OS), and you can then use it to "install" [the BetterPython editor](https://jbdoderlein.github.io/BetterPython), along with its integrated Python interpreter (of course), as a "native" desktop app. It then appears in the menu of your system, and it works offline! See [this 1:30min tutorial in video](https://github.com/jbdoderlein/BetterPython/issues/6#issuecomment-780269129)(This is a tutorial for [BetterOCaml](https://github.com/jbdoderlein/BetterOCaml), but it works in the same way.).

### :phone: On a smartphone
- It also works fine on smartphone running any recent OS and browser, :ok_hand: and the app should be "responsive" and you can switch to a vertical layout in the settings if your screen is too narrow.
- Loading the Python toplevel can take a few seconds on a mobile 3G/4G or :snail: slow Wifi networks.
- The *Progressive Web App* can be installed on your smartphone: there should be a small + button near the address bar, or a "Install it" option in the menu. Once you install it, there should be an icon in the home screen (but not in the app menu) that launches the app in full size mode (like a browser, but no address bar). It [works fine](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Developer_guide/Installing#what_browsers_support_installation) on Chrom(e|ium) and Firefox mobile on Android, at least.
- If you think that this is not enough, and that the website should be bundled as a native iOS/Android app, please vote :+1: on [this issue](https://github.com/jbdoderlein/BetterOCaml/issues/14).

## Python Interpreter

BetterPython currently uses MicroPython, which offers high speed and short loading times. 

You can find out more about the differences with CPython on this [page](https://docs.micropython.org/en/latest/genrst/index.html).

It is possible to integrate [Pyodide](https://pyodide.org/en/stable/) into BetterPython, but due to the interpreter's long loading time, this solution has not been retained.

##  About this project

### :hammer_and_wrench: Dependencies
BetterPython is made with these open-source tools:
- [py_script](https://pyscript.net/) : provide Python in web browser with WASM;
- [Materialize](https://materializecss.com/) : CSS and javascript framework;
- [Codemirror](https://codemirror.net/) : javascript code editor.
- [Tree Sitter](https://tree-sitter.github.io/tree-sitter/) : enable Python syntax analysis.

### Contributing?
Pull requests are welcome. For major changes, please [open an issue first](https://github.com/jbdoderlein/BetterPython/issues/new) to discuss what you would like to change.

### :sos: Need help?
If something is wrong or if you encounter any issue when using BetterPython, please [open an issue first](https://github.com/jbdoderlein/BetterPython/issues/new) (you have [to create a GitHub account](https://github.com/join) first).

### :scroll: License
This project is released publicly under the terms of the [MIT](https://opensource.org/license/mit) license.

### Authors
This project was initiated and is maintained by [@jbdoderlein](https://github.com/jbdoderlein/), with help and contributions from a few [other people](https://github.com/jbdoderlein/BetterPython/graphs/contributors).

