"""And API interface for the constructor of presentations."""
from fastapi import Depends, FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi_restful.cbv import cbv
from fastapi_restful.inferring_router import InferringRouter
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound

from api.constructor import Presentation, Slide
from api.users import User
from db.database import SessionLocal, Presentation_db, Slide_db

app = FastAPI()
router = InferringRouter()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS = {
    "user1": User(
        username="user1",
        password_hash="password1",
        presentations=[Presentation(name="presentation1")],
    ),
    "user2": User(username="user2", password_hash="password2"),
}
presentation = USERS["user1"].get_presentation("presentation1")
if presentation is not None:
    U1P1S1_ID = presentation.add_slide()
    print(f"{U1P1S1_ID = }")

db = SessionLocal()

"""
#ikok- possible solution, not sure
def get_presentation_by_name(db: Session, presentation_name: str) -> Presentation:
    try:
        return db.query(Presentation_db).filter(Presentation_db.presentation_name == presentation_name).first()
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Presentation not found")

def get_slide_by_id(db: Session, slide_id: int) -> Slide:
    presentation = get_presentation_by_name(username, presentation_name)
    if isinstance(presentation, HTTPException):
        return presentation
    try:
        return db.query(Slide_db).filter(Slide_db.slide_id == slide_id).first()
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Slide not found")

def create_presentation(db: Session, presentation_name: str):
    presentation = Presentation(presentation_name)
    presentation.add_slide()
    new_presentation = Presentation_db(presentation_name=presentation, style=presentation.style)
    db.add(new_presentation)
    db.flush()  #synchronize the state of the Session
    return Response(status_code=status.HTTP_200_OK)
"""

def get_presentation_by_name(username: str, presentation_name: str):
    """Get the presentation with the given name.

    Args:
        username (str): The username of a user
        presentation_name (str): The name of the presentation

    Returns:
        Presentation: The presentation with the given name
        HTTPException: If the presentation does not exist
    """
    if username not in USERS:
        raise HTTPException(status_code=404, detail="User not found")
    user = USERS[username]
    presentation = user.get_presentation(presentation_name)
    if presentation is None:
        raise HTTPException(status_code=404, detail="Presentation not found")
    return presentation


def get_slide_by_id(username: str, presentation_name: str, slide_id: int):
    """Get the slide with the given id.

    Args:
        username (str): The username of a user
        presentation_name (str): The name of the presentation
        slide_id (int): The id of the slide

    Returns:
        Slide: The slide with the given id
        HTTPException: If the slide does not exist
    """
    presentation = get_presentation_by_name(username, presentation_name)
    if isinstance(presentation, HTTPException):
        return presentation
    slide = presentation.get_slide(slide_id)
    if slide is None:
        raise HTTPException(status_code=404, detail="Slide not found")
    return slide


@router.post("/{username}/{presentation_name}")
def create_presentation(username: str, presentation_name: str):
    """Create a new presentation.

    Args:
        username (str): The username of a user
        presentation_name (str): The name of the presentation

    Returns:
        Response: If the presentation was created successfully
        HTTPException: If the presentation already exists
    """
    if username not in USERS:
        raise HTTPException(status_code=404, detail="User not found")
    presentation = Presentation(presentation_name)
    presentation.add_slide()
    USERS[username].add_presentation(presentation)
    return Response(status_code=status.HTTP_200_OK)


@router.get("/{username}/presentations")
def get_presentations(username: str):
    """Get presentation names of a user.

    Args:
        username (str): The username of a user

    Return:
        list[str]: a list of presentation names
    """
    user = USERS[username]
    return [i.name for i in user.presentations]


@cbv(router)
class PresentationAPI:
    """An API for the constructor of presentations.

    Args for all methods:
        username (str): The username of a user
        presentation_name (str): The name of the presentation
    """

    presentation: Presentation = Depends(get_presentation_by_name)

    @router.get("/{username}/exists/{presentation_name}")
    def presentation_exists(self):
        """Check if the presentation with the given name exists.

        Returns:
            dict[str, bool]: A dictionary with the key "exists" and the value
        """
        return {"exists": not isinstance(self.presentation, HTTPException)}

    @router.get("/{username}/{presentation_name}")
    def get_presentation(self):
        """Get the presentation with the given id.

        Returns:
            dict: The presentation in json format
        """
        if isinstance(self.presentation, HTTPException):
            return self.presentation
        return self.presentation.to_dict()

    @router.post("/{username}/{presentation_name}/add_slide")
    def add_slide(self):
        """Add a new slide to the presentation.

        Returns:
            dict[str, int]: A dictionary with the key "slide_id" and the value
            HTTPException: If the presentation does not exist
        """
        if isinstance(self.presentation, HTTPException):
            return self.presentation
        slide_id = self.presentation.add_slide()
        return {"slide_id": slide_id}

    @router.delete("/{username}/{presentation_name}/remove_slide")
    def remove_slide(self, slide_id: int):
        """Remove the slide with the given id.

        Args:
            slide_id (int): The id of the slide

        Returns:
            Response: If the slide was removed successfully
            HTTPException: If the slide does not exist
        """
        if isinstance(self.presentation, HTTPException):
            return self.presentation
        self.presentation.delete_slide(slide_id)
        return Response(status_code=status.HTTP_200_OK)

    @router.put("/{username}/{presentation_name}/update_slide")
    def update_slide(self, slide: dict):
        """Update the slide with the given id.

        Args:
            slide (dict): The new slide

        Returns:
            Response: If the slide was updated successfully
            HTTPException: If the slide does not exist
        """
        if isinstance(self.presentation, HTTPException):
            return self.presentation
        slide_id = slide["slide_id"]
        slide_obj = self.presentation.get_slide(slide_id)
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

    slide: Slide = Depends(get_slide_by_id)

    @router.post("/{username}/{presentation_name}/slide_exists")
    def slide_exists(self):
        """Check if the slide with the given id exists.

        Returns:
            dict[str, bool]: A dictionary with the key "exists" and the value
        """
        return {"exists": not isinstance(self.slide, HTTPException)}

    @router.get("/{username}/{presentation_name}/{slide_id}")
    def get_slide(self):
        """Get the slide with the given id in json format.

        Returns:
            dict[str, str]: The slide with the given id in json format
            HTTPException: If the slide does not exist
        """
        if isinstance(self.slide, HTTPException):
            return self.slide
        return self.slide.to_dict()

    @router.post("/{username}/{presentation_name}/{slide_id}/add_object")
    def add_object(self, object_type: str, value: str | None = None):
        """Add a new object to the slide with the given id.

        Args:
            object_type (str): The type of the object
            value (str, optional): The value of the object. Defaults to None.

        Returns:
            dict[str, int]: A dictionary with the key "object_id" and the value
            HTTPException: If the slide does not exist
        """
        if isinstance(self.slide, HTTPException):
            return self.slide
        object_id = self.slide.add_object(object_type, value)
        return {"object_id": object_id}

    @router.delete("/{username}/{presentation_name}/{slide_id}/remove_object")
    def remove_object(self, object_id: int):
        """Remove the object with the given id.

        Args:
            object_id (int): The id of the object

        Returns:
            Response: If the object was removed successfully
            HTTPException: If the object does not exist
        """
        if isinstance(self.slide, HTTPException):
            return self.slide
        self.slide.remove_object(object_id)
        return Response(status_code=status.HTTP_200_OK)

    @router.put("/{username}/{presentation_name}/{slide_id}/update_object")
    def update_object(self, updated_values: dict):
        """Update the object with the given id.

        Args:
            updated_values (dict): A dictionary with the updated values

        Returns:
            Response: If the object was updated successfully
            HTTPException: If the object does not exist
        """
        if isinstance(self.slide, HTTPException):
            return self.slide
        self.slide.update_object(updated_values)
        return Response(status_code=status.HTTP_200_OK)


app.include_router(router)
