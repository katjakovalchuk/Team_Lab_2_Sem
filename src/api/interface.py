"""And API interface for the constructor of presentations."""
from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi_restful.cbv import cbv
from fastapi_restful.inferring_router import InferringRouter
from sqlalchemy.exc import NoResultFound

from api.constructor import Presentation
from api.database import (Presentation_db, SessionLocal, Slide_db,
                          SlideObject_db, create_slide_db_from_slide,
                          presentation_to_db)

# TODO: user

app = FastAPI()
# db = SessionLocal()
router = InferringRouter()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_presentation_by_name(username: str, presentation_name: str) -> Presentation_db:
    """Get the presentation with the given name.

    Args:
        username (str): The username of a user
        presentation_name (str): The name of the presentation

    Returns:
        Presentation_db: The presentation with the given name

    Raises:
        HTTPException: If the presentation does not exist
    """
    if presentation_name not in get_presentations(username):
        raise HTTPException(status_code=404, detail="Presentation not found")
    with SessionLocal() as db, db.begin():
        presentation_db = (
            db.query(Presentation_db)
            .filter_by(owner=username)
            .filter_by(presentation_name=f"{username}_{presentation_name}")
            .first()
        )
        if presentation_db is None:
            raise HTTPException(status_code=404, detail="Presentation not found")
        return presentation_db


def get_slide_by_id(username: str, presentation_name: str, slide_id: int) -> Slide_db:
    """Get the slide with the given id.

    Args:
        username (str): The username of a user
        slide_id (int): The id of the slide
        presentation_name (str): The name of the presentation

    Returns:
        Slide_db: The slide with the given id

    Raises:
        HTTPException: If the slide does not exist
    """
    presentation = get_presentation_by_name(username, presentation_name)
    try:
        slide = next(
            slide
            for slide in presentation.slides
            if slide.slide_id == f"{username}_{presentation_name}_{slide_id}"
        )
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Slide not found")
    return slide


def get_presentations(username: str) -> list[str]:
    """Get presentation names of a user.

    Args:
        username (str): The username of a user

    Returns:
        list[str]: a list of presentation names
    """
    with SessionLocal() as db, db.begin():
        return [
            presentation.presentation_name.split("_")[-1]
            for presentation in db.query(Presentation_db).filter_by(owner=username)
        ]


@router.post("/{username}/{presentation_name}")
def create_presentation(username: str, presentation_name: str):
    """Create a new presentation.

    Args:
        username (str): The username of a user
        presentation_name (str): The name of the presentation

    Returns:
        Response: If the presentation was created successfully

    Raises:
        HTTPException: If the presentation already exists
    """
    if presentation_name in get_presentations(username):
        raise HTTPException(status_code=409, detail="Presentation already exists")
    presentation = Presentation(presentation_name, username)
    presentation.add_slide()
    with SessionLocal() as db, db.begin():
        new_presentation = presentation_to_db(presentation)
        db.add(new_presentation)

    return Response(status_code=status.HTTP_200_OK)


@router.get("/{username}/presentations")
def presentations(username: str) -> list[str]:
    """Get presentation names of a user.

    Args:
        username (str): The username of a user

    Returns:
        list[str]: a list of presentation names
    """
    return get_presentations(username)


@cbv(router)
class PresentationAPI:
    """An API for the constructor of presentations.

    Args for all methods:
        username (str): The username of a user
        presentation_name (str): The name of the presentation
    """

    presentation: Presentation_db = Depends(get_presentation_by_name)

    @router.get("/{username}/exists/{presentation_name}")
    def presentation_exists(self) -> dict[str, bool]:
        """Check if the presentation with the given name exists.

        Returns:
            dict[str, bool]: A dictionary with the key "exists" and the value
        """
        return {"exists": bool(self.presentation)}

    @router.get("/{username}/{presentation_name}")
    def get_presentation(self) -> dict:
        """Get the presentation with the given id.

        Returns:
            dict: The presentation in json format
        """
        with self.presentation.presentation as presentation:
            return presentation.to_dict()

    @router.post("/{username}/{presentation_name}/add_slide")
    def add_slide(self) -> dict[str, int]:
        """Add a new slide to the presentation.

        Returns:
            dict[str, int]: A dictionary with the key "slide_id" and the value
        """
        with SessionLocal() as db, db.begin():
            with self.presentation.presentation as presentation:
                slide_id = presentation.add_slide()
                print(presentation.to_dict())
            db.add(self.presentation)
        return {"slide_id": slide_id}

    @router.delete("/{username}/{presentation_name}/remove_slide")
    def remove_slide(self, slide_id: int):
        """Remove the slide with the given id.

        Args:
            slide_id (int): The id of the slide

        Returns:
            Response: If the slide was removed successfully
        """
        with SessionLocal() as db, db.begin():
            db_slide = get_slide_by_id(
                self.presentation.owner,
                self.presentation.presentation_name.split("_")[-1],
                slide_id,
            )
            with self.presentation.presentation as presentation:
                presentation.delete_slide(slide_id)
            db.delete(db_slide)
        return Response(status_code=status.HTTP_200_OK)

    @router.put("/{username}/{presentation_name}/update_slide")
    def update_slide(self, slide: dict):
        """Update the slide with the given id.

        Args:
            slide (dict): The new slide

        Returns:
            Response: If the slide was updated successfully

        Raises:
            HTTPException: If the slide does not exist
        """
        with SessionLocal() as db, db.begin():
            with self.presentation.presentation as presentation:
                slide_obj = presentation.slides[
                    f"{self.presentation.presentation_name}_{slide['slide_id']}"
                ]
                if slide_obj is None:
                    raise HTTPException(status_code=404, detail="Slide not found")
                slide_obj.update_slide(slide)
            db_slide = get_slide_by_id(
                self.presentation.owner,
                self.presentation.presentation_name.split("_")[-1],
                slide["slide_id"],
            )
            db.add(db_slide)
        return Response(status_code=status.HTTP_200_OK)


@cbv(router)
class SlideAPI:
    """An API for the constructor of slides.

    Args for all methods:
        username (str): The username of a user
        presentation_name (str): The name of the presentation
        slide_id (int): The id of the slide
    """

    slide: Slide_db = Depends(get_slide_by_id)

    @router.post("/{username}/{presentation_name}/slide_exists")
    def slide_exists(self) -> dict[str, bool]:
        """Check if the slide with the given id exists.

        Returns:
            dict[str, bool]: A dictionary with the key "exists" and the value
        """
        return {"exists": bool(self.slide)}

    @router.get("/{username}/{presentation_name}/{slide_id}")
    def get_slide(self) -> dict:
        """Get the slide with the given id in json format.

        Returns:
            dict: The slide with the given id in json format
        """
        with self.slide as slide:
            return slide.to_dict()

    @router.post("/{username}/{presentation_name}/{slide_id}/add_object")
    def add_object(self, object_type: str, value: str | None = None) -> dict[str, int]:
        """Add a new object to the slide with the given id.

        Args:
            object_type (str): The type of the object
            value (str, optional): The value of the object. Defaults to None.

        Returns:
            dict[str, int]: A dictionary with the key "object_id" and the value
        """
        with SessionLocal() as db, db.begin():
            with self.slide as slide:
                object_id = slide.add_object(object_type, value)
            new_object = self.slide.objects[-1]
            db.add(new_object)
        return {"object_id": object_id}

    @router.delete("/{username}/{presentation_name}/{slide_id}/remove_object")
    def remove_object(self, object_id: int):
        """Remove the object with the given id.

        Args:
            object_id (int): The id of the object

        Returns:
            Response: If the object was removed successfully
        """
        with SessionLocal() as db, db.begin():
            with self.slide as slide:
                slide.delete_object(object_id)
            db_object = (
                db.query(SlideObject_db)
                .filter(
                    SlideObject_db.object_id == f"{self.slide.slide_id}_{object_id}"
                )
                .first()
            )
            db.delete(db_object)

    @router.put("/{username}/{presentation_name}/{slide_id}/update_object")
    def update_object(self, updated_values: dict):
        """Update the object with the given id.

        Args:
            updated_values (dict): A dictionary with the updated values

        Returns:
            Response: If the object was updated successfully
        """
        with SessionLocal() as db, db.begin():
            with self.slide as slide:
                slide.update_object(updated_values)
            db_object = (
                db.query(SlideObject_db)
                .filter(
                    SlideObject_db.object_id
                    == f"{self.slide.slide_id}_{updated_values['object_id']}"
                )
                .first()
            )
            db.add(db_object)
        return Response(status_code=status.HTTP_200_OK)


app.include_router(router)
