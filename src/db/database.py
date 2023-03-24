import os

import sqlalchemy as sa
from sqlalchemy import String, Integer, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

uname = os.getenv("POSTGRESS_DB_USERNAME")
passwd = os.getenv("POSTGRESS_DB_PASSWORD")

engine = create_engine(
    f"postgresql:/{uname}:{passwd}@localhost:5432/userdatabase"
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
    slide_name = sa.Column(sa.String, nullable=False)


class Slide_db(Base):
    """
    The slide ORM
    """

    __tablename__ = 'slide'

    presentation_name= sa.Column(sa.String, nullable=False)
    slide_name = sa.Column(sa.String, nullable=False)
    slide_id = sa.Column(Integer, nullable=False)
    attributes = sa.Column(String, nullable=True)
    background = sa.Column(String, nullable=False)
    max_id = sa.Column(Integer, nullable=True)


class Presentation_db(Base):
    """
    The presentation ORM
    """

    __tablename__ = 'presentation'

    presentation_name= sa.Column(sa.String, nullable=False)
    style = sa.Column(String, nullable=False)



SessionLocal = sessionmaker(bind=engine)

Base.metadata.create_all(engine)

# db.query(SlideObject).filter(SlideObject.slide_id == 1).all()