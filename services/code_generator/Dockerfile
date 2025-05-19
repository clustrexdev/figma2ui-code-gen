FROM python:3.11.1

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

COPY . /app/

CMD [ "uvicorn", "main:app", "--port", "5000", "--reload" ]