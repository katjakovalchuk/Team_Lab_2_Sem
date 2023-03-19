"""
And API interface for the constructor of presentations
"""
from constructor import Presentation, Slide
from users import User
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
U1P1S1_ID = USERS["user1"].get_presentation("presentation1").add_slide()
print(f"{U1P1S1_ID = }")


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


def get_slide_by_id(username: str, presentation_name: str, slide_id: int) -> Slide:
    """
    Get the slide with the given id

    Parameters:
        username (str): The username of a user
        presentation_name (str): The name of the presentation
        slide_id (int): The id of the slide

    Returns:
        Slide: The slide with the given id
    """
    user = USERS[username]
    presentation = user.get_presentation(presentation_name)
    return presentation.get_slide(slide_id)


@router.post("/{username}/{presentation_name}")
def create_presentation(username: str, presentation_name: str) -> None:
    """
    Create a new presentation
    """
    presentation = Presentation(presentation_name)
    USERS[username].add_presentation(presentation)


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
        if self.get_presentation(self.presentation.name):
            return True
        return "Presentation with provuded name doesn't exist."

    @router.get("/{username}/{presentation_name}")
    def get_presentation(self) -> dict[str, str]:
        """
        Get the presentation with the given id
        """
        return {"style": self.presentation.style, "name": self.presentation.name}

    @router.post("/{username}/{presentation_name}/add_slide")
    def add_slide(self) -> int:
        """
        Add a new slide to the presentation

        Returns:
            int: The id of the new slide
        """
        return self.presentation.add_slide()

    # TODO: All the other necessary methods


@cbv(router)
class SlideAPI:
    """
    An API for the constructor of slides

    Parameters for all methods:
        username (str): The username of a user
        presentation_name (str): The name of the presentation
        slide_id (int): The id of the slide
    """

    slide: Slide = Depends(get_slide_by_id)

    @router.post("/{username}/{presentation_name}/slide_exists")
    def slide_exists(self) -> None:
        """
        Check if the slide with the given id exists
        """
        # TODO

    @router.post("/{username}/{presentation_name}/add_subslide")
    def add_subslide(self) -> None:
        """
        Add a new subslide to the presentation
        """
        # TODO

    @router.get("/{username}/{presentation_name}/{slide_id}")
    def get_slide(self) -> dict[str, str]:
        """
        Get the slide with the given id in json format
        """
        # TODO: get the json of the slide with the given id

    @router.delete("/{username}/{presentation_name}/remove_slide")
    def remove_slide(self) -> None:
        """
        Remove the slide with the given id
        """
        # TODO

    @router.post("/{username}/{presentation_name}/{slide_id}/add_text")
    def add_text(self, text: str) -> None:
        """
        Add text to the slide with the given id

        Parameters:
            text (str), Query: The text to add
        """
        # TODO

    @router.post("/{username}/{presentation_name}/{slide_id}/add_code")
    def add_code(self, code: str) -> None:
        """
        Add code to the slide with the given id

        Parameters:
            code (str), Query: The code to add
        """
        # TODO

    @router.post("/{username}/{presentation_name}/{slide_id}/add_image")
    def add_image(self, path: str) -> None:
        """
        Add an image to the slide with the given id

        Parameters:
            path (str), Query: The path to the image
        """
        # TODO

    @router.post("/{username}/{presentation_name}/{slide_id}/add_video")
    def add_video(self, path: str) -> None:
        """
        Add a video to the slide with the given id

        Parameters:
            path (str), Query: The path to the video
        """
        # TODO

    @router.delete("/{username}/{presentation_name}/{slide_id}/remove_element")
    def remove_element(self, element_id: int) -> None:
        """
        Remove the element with the given id from the slide with the given id

        Parameters:
            element_id (int), Query: The id of the element
        """
        # TODO


app.include_router(router)
