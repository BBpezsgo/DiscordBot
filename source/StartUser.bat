@echo off

Rem Set encoding to display unicode characters from batch
chcp 65001 >nul

Rem Start the script
title Running - Discord BOT
echo Execute node script...
node desktop-entry.js visible user

title Stopped - Discord BOT
timeout 1 /nobreak >nul

Rem Read exitdata.txt file
FOR /F %%i IN (exitdata.txt) DO (
    echo Data readed: %%i
    if %%i==restart (
        title Restarting - Discord BOT
        echo none >exitdata.txt
        cls
        timeout 1 /nobreak >nul
        CALL StartUser.bat
        echo Batch file executed
    ) else (
        title Closed - Discord BOT
        echo Press any key to exit
        pause >nul
    )
)