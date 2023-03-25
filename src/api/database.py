import os

import sqlalchemy as sa
from sqlalchemy import Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

uname = os.getenv("POSTGRES_USER")
passwd = os.getenv("POSTGRES_PASSWORD")
database = os.getenv("POSTGRES_DB")
server = os.getenv("POSTGRES_SERVER")
port = os.getenv("POSTGRES_PORT")

engine = create_engine(
    f"postgresql://{uname}:{passwd}@{server}:{port}/{database}"
)

Base = declarative_base()


class SlideObject_db(Base):
    """
    The slide object ORM
    """

    __tablename__ = "slide_object"

    type = sa.Column(String, nullable=False)
    content = sa.Column(String, nullable=True)
    attributes = sa.Column(String, nullable=True)
    object_name = sa.Column(sa.String, primary_key=True)


class Slide_db(Base):
    """
    The slide ORM
    """

    __tablename__ = "slide"

    slide_name = sa.Column(sa.String, primary_key=True)
    slide_id = sa.Column(Integer, nullable=False)
    attributes = sa.Column(String, nullable=True)
    background = sa.Column(String, nullable=False)
    max_id = sa.Column(Integer, nullable=True)


class Presentation_db(Base):
    """
    The presentation ORM
    """

    __tablename__ = "presentation"

    presentation_name = sa.Column(sa.String, primary_key=True)
    style = sa.Column(String, nullable=False)


SessionLocal = sessionmaker(bind=engine)

Base.metadata.create_all(engine)
