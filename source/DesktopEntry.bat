@echo off
chcp 65001 >nul
title Running - Discord BOT
node desktop-entry.js

title Stopped - Discord BOT
FOR /F %%i IN (exitdata.txt) DO (
    echo Data readed: %%i
    if %%i==restart (
        title Restarting - Discord BOT
        echo none >exitdata.txt
        cls
        CALL DesktopEntry.bat
        echo Batch file executed
    ) else (
        title Closed - Discord BOT
        echo Press any key to exit
        pause >nul
    )
)