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

    obj_type = sa.Column(String, nullable=False)
    content = sa.Column(String, nullable=True)
    attributes = sa.Column(String, nullable=True)
    object_name = sa.Column(sa.String, primary_key=True)
    owner = sa.Column(String, sa.ForeignKey("slide.slide_id"))

    @property
    @contextmanager
    def object(self):
        object = Object(
            int(self.object_name.split("_")[-1]), str(self.obj_type), str(self.owner)
        )
        object.value = self.content
        object.attributes = self.attributes
        yield object
        self.content = object.value
        self.attributes = object.attributes
        self.obj_type = object.obj_type


class Slide_db(Base):
    """
    The slide ORM
    """

    __tablename__ = "slide"

    slide_id = sa.Column(String, primary_key=True)
    attributes = sa.Column(String, nullable=True)
    background = sa.Column(String, nullable=False)
    max_id = sa.Column(Integer, nullable=True)
    content = relationship(SlideObject_db, backref="slide", lazy="joined")
    owner = sa.Column(sa.String, sa.ForeignKey("presentation.presentation_name"))

    @property
    @contextmanager
    def slide(self):
        slide = Slide(
            int(self.slide_id.split("_")[-1]), str(self.owner), str(self.background)
        )
        slide.attributes = self.attributes
        slide.max_id = self.max_id
        slide.content = list(self.content)
        yield slide
        slide_to_db(self, slide)


class Presentation_db(Base):
    """
    The presentation ORM
    """

    __tablename__ = "presentation"

    presentation_name = sa.Column(sa.String, primary_key=True)
    style = sa.Column(String, nullable=False)
    plugins = sa.Column(sa.ARRAY(String), nullable=False)
    slides = relationship(Slide_db, backref="presentation", lazy="joined")
    unused_id_max = sa.Column(Integer, nullable=False)
    owner = sa.Column(sa.String, nullable=False)

    @property
    @contextmanager
    def presentation(self):
        presentation = Presentation(
            self.presentation_name.split("_")[-1], str(self.owner), str(self.style)
        )
        presentation.plugins = self.plugins
        presentation.slides = {}
        for slide in self.slides:
            with slide.slide as i:
                presentation.slides[slide.slide_id] = i
        presentation.unused_id_max = self.unused_id_max
        yield presentation
        self.style = presentation.style
        self.plugins = presentation.plugins
        self.unused_id_max = presentation.unused_id_max
        self.slides = []
        for slide in presentation.slides.values():
            slide_db = create_slide_db_from_slide(slide)
            self.slides.append(slide_db)
        self.owner = presentation.owner
        self.presentation_name = presentation.name
        self.commit()


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
    presentation_db.owner = presentation.owner
    presentation_db.slides = []
    for slide in presentation.slides.values():
        slide_db = create_slide_db_from_slide(slide)
        presentation_db.slides.append(slide_db)
    presentation_db.unused_id_max = presentation.unused_id_max
    return presentation_db


def slide_to_db(slide_db: Slide_db, slide: Slide) -> Slide_db:
    slide_db.slide_id = slide.slide_id
    slide_db.background = slide.background
    slide_db.attributes = slide.attributes
    slide_db.max_id = slide.max_id
    slide_db.owner = slide.owner
    slide_db.content = []
    for object in slide.content:
        object_db = SlideObject_db()
        object_db.object_name = object.object_id
        object_db.obj_type = object.obj_type
        object_db.content = object.value
        object_db.attributes = object.attributes
        slide_db.content.append(object_db)
    return slide_db


def create_slide_db_from_slide(slide: Slide) -> Slide_db:
    return slide_to_db(Slide_db(), slide)


Base.metadata.create_all(engine)

SessionLocal = sessionmaker(
    bind=engine,
    expire_on_commit=False,
)
