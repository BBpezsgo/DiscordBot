@echo off

Rem Set encoding to display unicode characters from batch
chcp 65001

Rem Start the script
title Running (invisible) - Discord BOT
node desktop.js invisible system

title Stopped  (invisible) - Discord BOT
Rem Read exitdata.txt file
FOR /F %%i IN (exitdata.txt) DO (
    echo Data readed: %%i
    if %%i==restart (
        title Restarting (invisible) - Discord BOT
        echo none >exitdata.txt
        cls
        CALL StartInvisible.bat
        echo Batch file executed
    ) else (
        title Closed  (invisible) - Discord BOT
        echo Press any key to exit
        
    )
)