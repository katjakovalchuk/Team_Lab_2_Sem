FROM python:latest

WORKDIR /app

COPY ./src/api src/api
COPY ./pdm.lock pdm.lock
COPY ./pyproject.toml pyproject.toml
COPY ./README.md README.md

RUN pip install pdm
RUN pdm install

EXPOSE 8000

CMD ["pdm", "run", "uvicorn", "api.interface:app", "--host=0.0.0.0", "--reload"]
