@ECHO OFF
rmdir /Q /S lib & .\node_modules\.bin\babel.cmd --watch --presets es2015,stage-0 -d lib\ src\