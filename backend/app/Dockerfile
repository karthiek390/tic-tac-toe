FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ /app/backend/

# 👇 Add PYTHONPATH
ENV PYTHONPATH=/app/backend

WORKDIR /app/backend/app

EXPOSE 5000

CMD ["python", "-m", "flask", "--app", "main", "run", "--host=0.0.0.0", "--reload"]