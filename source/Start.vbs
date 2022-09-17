Set oShell = CreateObject("Wscript.Shell") 
Dim strArgs
strArgs = "cmd /c StartInvisible.bat"
oShell.Run strArgs, 0, false