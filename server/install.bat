@echo off

:loop
color 0a
echo ---------------------------------------------------------------------------
echo WEB��������˰�װ����
echo ---------------------------------------------------------------------------
echo --1=��װ
echo --2=ж��
echo --0=�˳�:
echo ---------------------------------------------------------------------------
:select
set /P action=��ѡ��:
if /i '%action%'=='1' goto install
if /i '%action%'=='2' goto uninstall
if /i '%action%'=='0' goto end
if /i '%action%'=='' goto errorinput
echo ������������������:&&goto select
:errorinput
echo ������������������:&&goto select
:install
echo ---------------------------------------------------------------------------
cls
echo �������ڰ�װ��,���Ժ�....
node install.js
echo �����Ѱ�װ�ɹ�!:&&goto loop
echo 
echo 
:uninstall 
echo ---------------------------------------------------------------------------
cls
echo ��������ж����,���Ժ�....
node uninstall.js
echo ������ж�سɹ�!:&&goto loop
:end
pause
exit