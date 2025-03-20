@echo off

set API_URL=https://start.spring.io/dependencies?bootVersion=3.4.3
set FILE_PATH=spring-dependencies.json

curl -s %API_URL% -o %FILE_PATH%

if %errorlevel%==0 (
    echo Data saved to %FILE_PATH%
) else (
    echo Error fetching or saving data
)
