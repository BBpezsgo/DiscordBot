Set oShell = CreateObject("Wscript.Shell") 
Dim strArgs
strArgs = "cmd /c StartInvisibleUser.bat"
oShell.Run strArgs, 0, false