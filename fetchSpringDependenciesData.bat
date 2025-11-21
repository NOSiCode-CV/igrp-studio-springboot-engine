@echo off

set URL=https://start.spring.io/dependencies?bootVersion=3.5.8
set FILE_NAME=public/spring_dependencies/spring-dependencies.json

curl -s %URL% -o %FILE_NAME%

if %errorlevel%==0 (
    echo Data saved to %FILE_NAME%
) else (
    echo Error fetching or saving data
)