FROM python:latest

COPY ./api /app/src
# COPY ../pyproject.toml /app
# COPY ../pdm.lock /app
# COPY ../requirements.txt /app

# RUN pip3 install -r requirements.txt
RUN pip install fastapi fastapi-restful uvicorn

EXPOSE 80

# To load environemt, do docker run --env file ./.env ...
CMD ["uvicorn", "api/main:app", "--host=0.0.0.0", "--reload"]
