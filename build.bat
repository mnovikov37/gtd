@echo off

set "output=index"
set "list=__build.lst"
set "tmp=tmp.txt"

for %%e in ( js css ) do (
  echo /** start build */ > %output%.%%e
)
call :build .\
del %tmp%
echo build completed
goto :eof

:build
  for /f "delims=" %%l in ( %1%list% ) do (
    for %%e in ( js css ) do (
      echo %%l|findstr /E "%%e">%tmp%
      for /f "delims=" %%p in ( %tmp% ) do (
        echo /** ------------------------------------------------------------ */>>%output%.%%e
        echo /** %1%%p */>>%output%.%%e
        echo /** ------------------------------------------------------------ */>>%output%.%%e
        type %1%%p>>%output%.%%e
        echo OK: %1%%p
      )
    )
    echo %%l|findstr "\\">%tmp%
    for /f "delims=" %%p in ( %tmp% ) do (
      call :build %1%%p
    )
  )
exit /b