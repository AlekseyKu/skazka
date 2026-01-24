FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY bot ./bot
COPY core ./core
COPY db ./db
COPY config.py main.py ./
COPY audio_files ./audio_files

CMD ["python", "main.py"]
