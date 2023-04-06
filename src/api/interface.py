"""And API interface for the constructor of presentations."""
from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi_restful.cbv import cbv
from fastapi_restful.inferring_router import InferringRouter
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound

from api.constructor import Presentation, Slide
from api.database import (Presentation_db, SessionLocal, Slide_db,
                          SlideObject_db)

# from api.users import User

app = FastAPI()
db = SessionLocal()
router = InferringRouter()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_presentation_by_name(db, presentation_name: str) -> Presentation_db:
    """Get the presentation with the given name.

    Args:
        db (Session): The database session
        presentation_name (str): The name of the presentation

    Returns:
        Presentation_db: The presentation with the given name

    Raises:
        HTTPException: If the presentation does not exist
    """
    presentation_db = db.query(Presentation_db).get(presentation_name)
    if presentation_db is None:
        raise HTTPException(status_code=404, detail="Presentation not found")
    return presentation_db


def get_slide_by_id(db, slide_id: int, presentation_name: str) -> Slide_db:
    """Get the slide with the given id.

    Args:
        db (Session): The database session
        slide_id (int): The id of the slide
        presentation_name (str): The name of the presentation

    Returns:
        Slide_db: The slide with the given id

    Raises:
        HTTPException: If the slide does not exist
    """
    presentation = get_presentation_by_name(db, presentation_name)
    try:
        slide = presentation.slides[slide_id]
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Slide not found")
    return slide


@router.post("/{username}/{presentation_name}")
def create_presentation(db, presentation_name: str):
    """Create a new presentation.

    Args:
        db (Session): The database session
        presentation_name (str): The name of the presentation

    Returns:
        Response: If the presentation was created successfully
    """
    presentation = Presentation(presentation_name)
    presentation.add_slide()
    new_presentation = Presentation_db(
        presentation_name=presentation, style=presentation.style
    )
    db.add(new_presentation)
    db.flush()  # synchronize the state of the Session
    return Response(status_code=status.HTTP_200_OK)


@router.get("/{username}/presentations")
def get_presentations(username: str) -> list[str]:
    """Get presentation names of a user.

    Args:
        username (str): The username of a user

    Returns:
        list[str]: a list of presentation names
    """
    # Temporarily ignore the existence of users. All presentations are
    # accessible for all users.
    return [
        presentation.presentation_name for presentation in db.query(Presentation_db)
    ]


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
        return self.presentation.to_dict()

    @router.post("/{username}/{presentation_name}/add_slide")
    def add_slide(self) -> dict[str, int]:
        """Add a new slide to the presentation.

        Returns:
            dict[str, int]: A dictionary with the key "slide_id" and the value
        """
        with self.presentation.presentation as presentation:
            slide_id = presentation.add_slide()
        return {"slide_id": slide_id}

    @router.delete("/{username}/{presentation_name}/remove_slide")
    def remove_slide(self, slide_id: int):
        """Remove the slide with the given id.

        Args:
            slide_id (int): The id of the slide

        Returns:
            Response: If the slide was removed successfully
        """
        with self.presentation.presentation as presentation:
            presentation.delete_slide(slide_id)
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
        with self.presentation.presentation as presentation:
            slide_id = slide["slide_id"]
            slide_obj = presentation.get_slide(slide_id)
            if slide_obj is None:
                raise HTTPException(status_code=404, detail="Slide not found")
            slide_obj.update_slide(slide)
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
        with self.slide as slide:
            object_id = slide.add_object(object_type, value)
        return {"object_id": object_id}

    @router.delete("/{username}/{presentation_name}/{slide_id}/remove_object")
    def remove_object(self, object_id: int):
        """Remove the object with the given id.

        Args:
            object_id (int): The id of the object

        Returns:
            Response: If the object was removed successfully
        """
        with self.slide as slide:
            slide.delete_object(object_id)
        return Response(status_code=status.HTTP_200_OK)

    @router.put("/{username}/{presentation_name}/{slide_id}/update_object")
    def update_object(self, updated_values: dict):
        """Update the object with the given id.

        Args:
            updated_values (dict): A dictionary with the updated values

        Returns:
            Response: If the object was updated successfully
        """
        with self.slide as slide:
            slide.update_object(updated_values)
        return Response(status_code=status.HTTP_200_OK)


app.include_router(router)