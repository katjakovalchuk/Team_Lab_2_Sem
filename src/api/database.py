import os
from contextlib import contextmanager

import sqlalchemy as sa
from sqlalchemy import Integer, String, create_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

from api.constructor import Object, Presentation, Slide

uname = os.getenv("POSTGRES_USER")
passwd = os.getenv("POSTGRES_PASSWORD")
database = os.getenv("POSTGRES_DB")
server = os.getenv("POSTGRES_SERVER")
port = os.getenv("POSTGRES_PORT")

engine = create_engine(f"postgresql://{uname}:{passwd}@{server}:{port}/{database}")

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
    owner = sa.Column(Integer, sa.ForeignKey("slide.slide_id"))

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
    content = relationship(SlideObject_db)
    owner = sa.Column(sa.String, sa.ForeignKey("presentation.presentation_name"))

    @property
    @contextmanager
    def slide(self):
        slide = Slide(self.slide_id, self.owner, self.background)
        slide.content = self.content
        slide.attributes = self.attributes
        slide.max_id = self.max_id
        yield slide
        self.slide_id = slide.slide_id
        self.background = slide.background
        self.content = slide.content
        self.attributes = slide.attributes
        self.max_id = slide.max_id
        self.owner = slide.owner


class Presentation_db(Base):
    """
    The presentation ORM
    """

    __tablename__ = "presentation"

    presentation_name = sa.Column(sa.String, primary_key=True)
    style = sa.Column(String, nullable=False)
    plugins = sa.Column(sa.ARRAY(String), nullable=False)
    slides = relationship(Slide_db)
    unused_id_max = sa.Column(Integer, nullable=False)

    @property
    @contextmanager
    def presentation(self):
        presentation = Presentation(self.presentation_name, self.style, self.plugins)
        presentation.slides = {}
        for slide in self.slides:
            presentation.slides[slide.slide_id] = slide.slide
        presentation.unused_id_max = self.unused_id_max
        yield presentation
        self.presentation_name = presentation.name
        self.style = presentation.style
        self.plugins = presentation.plugins
        self.slides = presentation.slides
        self.unused_id_max = presentation.unused_id_max


def presentation_to_db(presentation: Presentation) -> Presentation_db:
    """Convert the presentation to a database object.

    Args:
        presentation (Presentation): the presentation to convert

    Returns:
        Presentation_db: the presentation as a database object
    """
    presentation_db = Presentation_db()
    presentation_db.presentation_name = presentation.name
    presentation_db.style = presentation.style
    presentation_db.plugins = presentation.plugins
    for slide in presentation.slides.values():
        slide_db = slide_to_db(slide)
        presentation_db.slides.append(slide_db)
    presentation_db.unused_id_max = presentation.unused_id_max
    return presentation_db


def slide_to_db(slide: Slide) -> Slide_db:
    slide_db = Slide_db()
    slide_db.slide_id = slide.slide_id
    slide_db.background = slide.background
    slide_db.attributes = slide.attributes
    slide_db.max_id = slide.max_id
    slide_db.owner = slide.owner
    for object in slide.content:
        object_db = SlideObject_db()
        object_db.object_name = object.name
        object_db.type = object.type
        object_db.content = object.content
        object_db.attributes = object.attributes
        slide_db.content.append(object_db)
    return slide_db


SessionLocal = sessionmaker(bind=engine)

Base.metadata.create_all(engine)
