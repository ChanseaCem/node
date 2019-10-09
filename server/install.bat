@echo off

:loop
color 0a
echo ---------------------------------------------------------------------------
echo WEB分屏服务端安装程序
echo ---------------------------------------------------------------------------
echo --1=安装
echo --2=卸载
echo --0=退出:
echo ---------------------------------------------------------------------------
:select
set /P action=请选择:
if /i '%action%'=='1' goto install
if /i '%action%'=='2' goto uninstall
if /i '%action%'=='0' goto end
if /i '%action%'=='' goto errorinput
echo 输入有误，请重新输入:&&goto select
:errorinput
echo 输入有误，请重新输入:&&goto select
:install
echo ---------------------------------------------------------------------------
cls
echo 服务正在安装中,请稍候....
node install.js
echo 服务已安装成功!:&&goto loop
echo 
echo 
:uninstall 
echo ---------------------------------------------------------------------------
cls
echo 服务正在卸载中,请稍候....
node uninstall.js
echo 服务已卸载成功!:&&goto loop
:end
pause
exit