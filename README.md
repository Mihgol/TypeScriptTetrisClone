# TypeScriptTetrisClone
Simple Tetris game for TypeScript practice and giggles.  

[Live Demo](https://mihgol.github.io/TypeScriptTetrisClone/)

Requires TypeScript installed, in order to build type:
```
tsc
```

Add tetris.js to your HTML file and create new instance of Tetris.Game,  
with DOM Element as an argument, eg. document.body - to place game  
canvas inside that element.  

```
<script src="tetris.js"></script>
<script>
    new Tetris.Game(document.body);
</script>
```
## Controls:  
<kbd>↑</kbd> or <kbd>X</kbd>    = Rotate Right  
<kbd>↓</kbd>    = Move Down  
<kbd>←</kbd>    = Move Left  
<kbd>→</kbd>    = Move Right  
<kbd>C</kbd>    = Hold / Swap Tetromino  
<kbd>Space</kbd> = Instant Drop  


<img src="demo.gif" width="800" />