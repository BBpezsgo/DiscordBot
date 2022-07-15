@echo off

Rem Set encoding to display unicode characters from batch
chcp 65001 >nul

Rem Start the script
title Running [Invisible] - Discord BOT
node desktop.js invisible user

title Stopped [Invisible] - Discord BOT
timeout 1 /nobreak >nul

Rem Read exitdata.txt file
FOR /F %%i IN (exitdata.txt) DO (
    echo Data readed: %%i
    if %%i==restart (
        title Restarting [Invisible] - Discord BOT
        echo none >exitdata.txt
        cls
        timeout 1 /nobreak >nul
        CALL StartInvisibleUser.bat
        echo Batch file executed
    ) else (
        title Closed [Invisible] - Discord BOT
        echo Press any key to exit
        
    )
)