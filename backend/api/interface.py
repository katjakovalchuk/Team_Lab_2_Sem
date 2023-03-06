"""
And API interface for the constructor of presentations
"""
from fastapi import FastAPI
from fastapi_restful.cbv import cbv
from fastapi_restful.inferring_router import InferringRouter

# TODO: All the other necessary imports


app = FastAPI()
router = InferringRouter()


@cbv(router)
class PresentationAPI:
    """
    An API for the constructor of presentations
    """

    @router.get("/{username}/exists/{name}")
    def presentation_exists(self, username: str, name: str) -> None:
        """
        Check if the presentation with the given name exists

        Parameters:
            username (str): The username
            name (str): The name of the presentation
        """
        # TODO

    @router.get("/{username}/{name}")
    def get_presentation(self, username: str, name: str) -> None:
        """
        Get the presentation with the given id

        Parameters:
            username (str): The username
            name (str): The name of the presentation
        """
        # TODO: get the presentation saved with the given name

    @router.post("/{username}/{name}")
    def create_presentation(self, username: str, name: str) -> None:
        """
        Create a new presentation

        Parameters:
            username (str): The username
            name (str): The name of the presentation
        """
        # TODO: create a new presentation with the given name, using the constructor.py

    @router.post("/{username}/{name}/slide_exists")
    def slide_exists(self, username: str, name: str, slide_id: int) -> None:
        """
        Check if the slide with the given id exists

        Parameters:
            username (str): The username
            name (str): The name of the presentation
            slide_id (int): The id of the slide
        """
        # TODO

    @router.post("/{username}/{name}/add_slide")
    def add_slide(self, username: str, name: str) -> None:
        """
        Add a new slide to the presentation

        Parameters:
            username (str): The username
            name (str): The name of the presentation
        """
        # TODO: add a new slide to the presentation with the given name

    @router.post("/{username}/{name}/add_subslide")
    def add_subslide(self, username: str, name: str, slide_id: int) -> None:
        """
        Add a new subslide to the presentation

        Parameters:
            username (str): The username
            name (str): The name of the presentation
            slide_id (int), Query: The id of the slide, beneath which the subslide will be added
        """
        # TODO

    @router.get("/{username}/{name}/{slide_id}")
    def get_slide(self, username: str, name: str, slide_id: int) -> None:
        """
        Get the slide with the given id in json format

        Parameters:
            username (str): The username
            name (str): The name of the presentation
            slide_id (int): The id of the slide
        """
        # TODO: get the json of the slide with the given id

    @router.post("/{username}/{name}/remove_slide")
    def remove_slide(self, username: str, name: str, slide_id: int) -> None:
        """
        Remove the slide with the given id

        Parameters:
            username (str): The username
            name (str): The name of the presentation
            slide_id (int), Query: The id of the slide
        """
        # TODO

    @router.post("/{username}/{name}/{slide_id}/add_text")
    def add_text(self, username: str, name: str, slide_id: int, text: str) -> None:
        """
        Add text to the slide with the given id

        Parameters:
            username (str): The username
            name (str): The name of the presentation
            slide_id (int): The id of the slide
            text (str), Query: The text to add
        """
        # TODO

    @router.post("/{username}/{name}/{slide_id}/add_code")
    def add_code(self, username: str, name: str, slide_id: int, code: str) -> None:
        """
        Add code to the slide with the given id

        Parameters:
            username (str): The username
            name (str): The name of the presentation
            slide_id (int): The id of the slide
            code (str), Query: The code to add
        """
        # TODO

    @router.post("/{username}/{name}/{slide_id}/add_image")
    def add_image(self, username: str, name: str, slide_id: int, path: str) -> None:
        """
        Add an image to the slide with the given id

        Parameters:
            username (str): The username
            name (str): The name of the presentation
            slide_id (int): The id of the slide
            path (str), Query: The path to the image
        """
        # TODO

    @router.post("/{username}/{name}/{slide_id}/add_video")
    def add_video(self, username: str, name: str, slide_id: int, path: str) -> None:
        """
        Add a video to the slide with the given id

        Parameters:
            username (str): The username
            name (str): The name of the presentation
            slide_id (int): The id of the slide
            path (str), Query: The path to the video
        """
        # TODO

    @router.post("/{username}/{name}/{slide_id}/remove_element")
    def remove_element(
        self, username: str, name: str, slide_id: int, element_id: int
    ) -> None:
        """
        Remove the element with the given id from the slide with the given id

        Parameters:
            username (str): The username
            name (str): The name of the presentation
            slide_id (int): The id of the slide
            element_id (int), Query: The id of the element
        """
        # TODO

    # TODO: All the other necessary methods
