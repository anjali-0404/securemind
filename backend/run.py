#!/usr/bin/env python
"""Run the FastAPI server"""
import os
import sys

# Change to backend directory
os.chdir(r'd:\securemind\backend')
sys.path.insert(0, r'd:\securemind\backend')

# Run uvicorn
import uvicorn
uvicorn.run("app:app", host="127.0.0.1", port=8000, log_level="info", reload=False)
