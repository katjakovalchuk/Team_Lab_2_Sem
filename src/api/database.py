import os

import sqlalchemy as sa
from sqlalchemy import Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from contextlib import contextmanager

from api.constructor import Object, Presentation, Slide

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

    @property
    @contextmanager
    def object(self):
        object = Object(self.object_name, self.type, self.content)
        object.attributes = self.attributes
        yield object
        self.type = object.type
        self.content = object.content
        self.attributes = object.attributes


class Slide_db(Base):
    """
    The slide ORM
    """

    __tablename__ = "slide"

    slide_id = sa.Column(Integer, primary_key=True)
    attributes = sa.Column(String, nullable=True)
    background = sa.Column(String, nullable=False)
    max_id = sa.Column(Integer, nullable=True)
    content = relationship("SlideObject_db")

    @property
    @contextmanager
    def slide(self):
        slide = Slide(self.slide_id, self.background)
        slide.content = self.content
        slide.attributes = self.attributes
        slide.max_id = self.max_id
        yield slide
        self.slide_id = slide.slide_id
        self.background = slide.background
        self.content = slide.content

class Presentation_db(Base):
    """
    The presentation ORM
    """

    __tablename__ = "presentation"

    presentation_name = sa.Column(sa.String, primary_key=True)
    style = sa.Column(String, nullable=False)
    plugins = sa.Column(sa.Set, nullable=None)
    slides = relationship("Slide_db")
    unused_id_max = sa.Column(Integer, nullable=False)

    @property
    @contextmanager
    def presentation(self):
        presentation = Presentation(self.presentation_name, self.style, self.plugins)
        presentation.slides = self.slides
        presentation.unused_id_max = self.unused_id_max
        yield presentation
        self.presentation_name = presentation.presentation_name
        self.style = presentation.style
        self.plugins = presentation.plugins
        self.slides = presentation.slides
        self.unused_id_max = presentation.unused_id_max


SessionLocal = sessionmaker(bind=engine)

Base.metadata.create_all(engine)
