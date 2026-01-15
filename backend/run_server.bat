@echo off
cd /d D:\securemind\backend
python -m uvicorn app:app --port 8000 --host 127.0.0.1
pause
