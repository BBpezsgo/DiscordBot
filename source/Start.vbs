Set oShell = CreateObject("Wscript.Shell") 
Dim strArgs
strArgs = "cmd /c Start.bat"
oShell.Run strArgs, 0, false