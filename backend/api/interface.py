"""
And API interface for the constructor of presentations
"""
from api.constructor import Presentation
from api.users import User
from fastapi import Depends, FastAPI
from fastapi_restful.cbv import cbv
from fastapi_restful.inferring_router import InferringRouter

app = FastAPI()
router = InferringRouter()

USERS = {
    "user1": User(
        username="user1",
        password_hash="password1",
        presentations=[Presentation(name="presentation1")],
    ),
    "user2": User(username="user2", password_hash="password2"),
}


def get_presentation_by_name(username: str, presentation_name: str) -> Presentation:
    """
    Get the presentation with the given name

    Parameters:
        username (str): The username of a user
        presentation_name (str): The name of the presentation

    Returns:
        Presentation: The presentation with the given name
    """
    user = USERS[username]
    return user.get_presentation(presentation_name)


@cbv(router)
class PresentationAPI:
    """
    An API for the constructor of presentations

    Parameters for all methods:
        username (str): The username of a user
        presentation_name (str): The name of the presentation
    """

    presentation: Presentation = Depends(get_presentation_by_name)

    @router.get("/{username}/exists/{presentation_name}")
    def presentation_exists(self) -> None:
        """
        Check if the presentation with the given name exists
        """
        # TODO

    @router.get("/{username}/{presentation_name}")
    def get_presentation(self) -> dict[str, str]:
        """
        Get the presentation with the given id
        """
        return {"style": self.presentation.style, "name": self.presentation.name}

    @router.post("/{username}/{presentation_name}")
    def create_presentation(self) -> None:
        """
        Create a new presentation
        """
        # TODO: create a new presentation with the given name, using the constructor.py

    @router.post("/{username}/{presentation_name}/slide_exists")
    def slide_exists(self, slide_id: int) -> None:
        """
        Check if the slide with the given id exists

        Parameters:
            slide_id (int): The id of the slide
        """
        # TODO

    @router.post("/{username}/{presentation_name}/add_slide")
    def add_slide(self) -> None:
        """
        Add a new slide to the presentation
        """
        # TODO: add a new slide to the presentation with the given name

    @router.post("/{username}/{presentation_name}/add_subslide")
    def add_subslide(self, slide_id: int) -> None:
        """
        Add a new subslide to the presentation

        Parameters:
            slide_id (int), Query: id of the slide beneath which the subslide is be added
        """
        # TODO

    @router.get("/{username}/{presentation_name}/{slide_id}")
    def get_slide(self, slide_id: int) -> None:
        """
        Get the slide with the given id in json format

        Parameters:
            slide_id (int): The id of the slide
        """
        # TODO: get the json of the slide with the given id

    @router.delete("/{username}/{presentation_name}/remove_slide")
    def remove_slide(self, slide_id: int) -> None:
        """
        Remove the slide with the given id

        Parameters:
            slide_id (int), Query: The id of the slide
        """
        # TODO

    @router.post("/{username}/{presentation_name}/{slide_id}/add_text")
    def add_text(self, slide_id: int, text: str) -> None:
        """
        Add text to the slide with the given id

        Parameters:
            slide_id (int): The id of the slide
            text (str), Query: The text to add
        """
        # TODO

    @router.post("/{username}/{presentation_name}/{slide_id}/add_code")
    def add_code(self, slide_id: int, code: str) -> None:
        """
        Add code to the slide with the given id

        Parameters:
            slide_id (int): The id of the slide
            code (str), Query: The code to add
        """
        # TODO

    @router.post("/{username}/{presentation_name}/{slide_id}/add_image")
    def add_image(self, slide_id: int, path: str) -> None:
        """
        Add an image to the slide with the given id

        Parameters:
            slide_id (int): The id of the slide
            path (str), Query: The path to the image
        """
        # TODO

    @router.post("/{username}/{presentation_name}/{slide_id}/add_video")
    def add_video(self, slide_id: int, path: str) -> None:
        """
        Add a video to the slide with the given id

        Parameters:
            slide_id (int): The id of the slide
            path (str), Query: The path to the video
        """
        # TODO

    @router.delete("/{username}/{presentation_name}/{slide_id}/remove_element")
    def remove_element(self, slide_id: int, element_id: int) -> None:
        """
        Remove the element with the given id from the slide with the given id

        Parameters:
            slide_id (int): The id of the slide
            element_id (int), Query: The id of the element
        """
        # TODO

    # TODO: All the other necessary methods
