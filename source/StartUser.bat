@echo off

Rem Set encoding to display unicode characters from batch
chcp 65001

Rem Start the script
title Running - Discord BOT
node desktop.js visible user

title Stopped - Discord BOT
Rem Read exitdata.txt file
FOR /F %%i IN (exitdata.txt) DO (
    echo Data readed: %%i
    if %%i==restart (
        title Restarting - Discord BOT
        echo none >exitdata.txt
        cls
        CALL StartUser.bat
        echo Batch file executed
    ) else (
        title Closed - Discord BOT
        echo Press any key to exit
        pause >nul
    )
)