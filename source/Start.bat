@echo off

Rem Set encoding to display unicode characters from batch
chcp 65001 >nul

Rem Start the script
title Running - Discord BOT
node desktop-entry.js visible system

title Stopped - Discord BOT
Rem Read exitdata.txt file
FOR /F %%i IN (exitdata.txt) DO (
    echo Data readed: %%i
    if %%i==restart (
        title Restarting - Discord BOT
        echo none >exitdata.txt
        cls
        CALL Start.bat
        echo Batch file executed
    ) else (
        title Closed - Discord BOT
        echo Press any key to exit
        pause >nul
    )
)