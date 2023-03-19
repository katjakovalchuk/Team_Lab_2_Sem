"""
Classes for users
"""
from api.constructor import Presentation


class User:
    """
    A basic user class

    Attributes:
        username (str): The user's username
        password_hash (str): The user's hashed password
        presentations (list[Presentation]): The user's presentations

    Methods:
        add_presentation(presentation: Presentation):
            Add a presentation to the user's list of presentations
    """

    def __init__(
        self,
        username: str,
        password_hash: str,
        presentations: list[Presentation] | None = None,
    ) -> None:
        self.username = username
        self.password_hash = password_hash
        if presentations is None:
            presentations = []
        self.presentations = presentations

    def add_presentation(self, presentation: Presentation) -> None:
        """
        Add a presentation to the user's list of presentations

        Parameters:
            presentation (Presentation): The presentation to add
        """
        self.presentations.append(presentation)

    def get_presentation(self, presentation_name: str) -> Presentation:
        """
        Get the presentation with the given name

        Parameters:
            presentation_name (str): The name of the presentation

        Returns:
            Presentation: The presentation with the given name
        """
        for presentation in self.presentations:
            if presentation.name == presentation_name:
                return presentation
        raise ValueError(f"Presentation with name {presentation_name} not found")
