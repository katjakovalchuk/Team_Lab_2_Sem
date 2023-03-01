FROM python3.10

COPY ./src /app/src
COPY ./static /app/static
COPY requirements.txt /app

WORKDIR /app

RUN pip3 install -r requirements.txt

EXPOSE 80

# To load environemt, do docker run --env file ./.env ...
CMD ["uvicorn", "main:app", "--host=0.0.0.0", "--reload"]
