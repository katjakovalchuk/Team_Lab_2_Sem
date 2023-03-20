"""
A constructor of presentations
"""


class Presentation:
    """
    A class for presentations construction

    Attributes:
        name (str): name of the presentation
        slides (dict): dict of slides
        style (str): style of the presentation
        plugins (set): set of plugins
        unused_id_max (int): the maximum id that has not been used

    Methods:
        get_new_id: get an id for a new slide
        add_slide: add a slide to the presentation
        add_subslide: add a subslide beneath a slide
        swap_slides: swap two slides
        delete_slide: delete a slide
        save: save the presentation to a html file
        add_plugin: add a plugin to the presentation
        remove_plugin: remove a plugin from the presentation
        set_style: set the style of the presentation
    """

    def __init__(self, name: str, style: str = "moon", plugins: set = set()) -> None:
        self.name = name
        self.slides = {}
        self.subslides = {}
        self.style = style
        self.plugins = plugins
        self.unused_id_max = 0

    def get_new_id(self) -> int:
        """
        Get a new id for a slide
        """
        self.unused_id_max += 1
        return self.unused_id_max - 1

    def add_slide(self) -> int:
        """
        Add a slide to the presentation

        Returns:
            slide_id (int): id of the new slide
        """
        new_id = self.get_new_id()
        self.slides[new_id] = Slide(new_id)
        return new_id

    def get_slide(self, slide_id: int) -> "Slide":
        """
        Get the slide with the given id

        Parameters:
            slide_id (int): id of the slide
        """
        if slide_id not in self.slides:
            raise ValueError(f"Slide with id {slide_id} does not exist")
        return self.slides[slide_id]

    def add_subslide(self, slide_id: int) -> None:
        """
        Add a subslide beneath a slide

        Parameters:
            slide (int): id of the slide
        """
        if slide_id not in self.slides:
            raise ValueError(f"Slide with id {slide_id} does not exist")
        new_id=self.get_new_id()
        if slide_id not in self.subslides:
            self.subslides[slide_id] = {}
        self.subslides[slide_id][new_id]=Slide(new_id)

    def swap_slides(self, slide1: int, slide2: int) -> None:
        """
        Swap two slides

        Parameters:
            slide1 (int): id of the first slide
            slide2 (int): id of the second slide
        """        
        if slide1 not in self.slides:
            raise ValueError(f"Slide with id {slide1} does not exist")
        if slide2 not in self.slides:
            raise ValueError(f"Slide with id {slide2} does not exist")

    def delete_slide(self, slide_id: int) -> None:
        """
        Delete a slide

        Parameters:
            slide_id (int): id of the slide
        """
        if slide_id in self.slides:
            del self.slides[slide_id]
        else:
            raise ValueError(f"Slide with id {slide_id} does not exist")

    def save(self) -> None:
        """
        Save the presentation to a html file
        """
        # TODO: for now just use the generic style(copy from the existing presentation)

    def add_plugin(self, plugin: str) -> None:
        """
        Add a plugin to the presentation

        Parameters:
            plugin (str): name of the plugin
        """
        self.plugins.add(plugin)

    def remove_plugin(self, plugin: str) -> None:
        """
        Remove a plugin from the presentation

        Parameters:
            plugin (str): name of the plugin
        """
        self.plugins.discard(plugin)

    def set_style(self, style: str) -> None:
        """
        Set the style of the presentation

        Parameters:
            style (str): name of the style
        """
        self.style = style


class Slide:
    """
    A class for slides construction

    Attributes:
        content (list): list of elements
        attributes (list): list of slid attributes
        background_color (str): background color of the slide
        slide_id (int): id of the slide
        max_id (int): the maximum element id that has not been used

    Methods:
        get_new_id: get an id for a new element
        set_background: set the background of the slide
        add_attribute: add an attribute to the slide
        add_object: add an object to the slide
        remove_object: remove an object from the slide
        to_dict: convert the slide to a dict
    """

    background_type = "color"

    def __init__(self, slide_id: int, background_color: str = "111111") -> None:
        self.content = []
        self.attributes = []
        self.background = background_color
        self.slide_id = slide_id
        self.max_id = 0

    def get_new_id(self) -> int:
        """
        Get a new id for an element
        """
        self.max_id += 1
        return self.max_id - 1

    def set_background(
        self, bg_type: str, bg_color: str | None = None, path: str | None = None
    ) -> None:
        """
        Set the background of the slide

        Parameters:
            bg_type (str): type of the background(color, image, video, iframe)
            bg_color (str): color of the background
            path (str): path to the background(image or video or iframe)
        """
        if bg_type == "color":
            self.background = bg_color
        else:
            self.background = path

    def add_attribute(self, attribute: str, value: str | None = None) -> None:
        """
        Add an attribute to the slide

        Parameters:
            attribute (str): name of the attribute
        """
        if value is None:
            self.attributes.append(attribute)
        self.attributes.append((attribute, value))

    def add_object(self, obj_type: str, value: str | None = None) -> None:
        """
        Add an object to the slide

        Parameters:
            obj_type (str): type of the object(text, image, video, iframe)
            value (str): value of the object
                (for text - text, for image, video, iframe - path)
        """
        new_id = self.get_new_id()
        self.content.append(Object(new_id, obj_type, value))

    def remove_object(self, obj_id: int) -> None:
        """
        Remove an object from the slide

        Parameters:
            obj_id (int): id of the object
        """
        ind = 0
        for key, objects in enumerate(self.content):
            if objects.object_id == obj_id:
                ind = key
                break
        del self.content[ind]

    def to_dict(self) -> dict:
        """
        Convert the slide to a dict

        Returns:
            dict: a dict representation of the slide
        """
        slide_dict = {}
        slide_dict["content"] = self.content
        slide_dict["attributes"] = self.attributes
        slide_dict["background"] = self.background
        slide_dict["slide_id"] = self.slide_id
        slide_dict["max_id"] = self.max_id
        return slide_dict


class Object:
    """
    An object of a slide

    Attributes:
        object_id (int): id of the object
        obj_type (str): type of the object(text, code, image, video, iframe)
        attributes (list): list of attributes
        value (str): value of the object
            (for text, code - text, for image, video, iframe - path)

    Methods:
        add_attribute: add an attribute to the object
        set_value: set the value of the object(text or path)
        set_data_id: set the auto animate id of the object
        to_dict: convert the object to a dict
    """

    def __init__(self, object_id: int, obj_type: str, value: str | None = None) -> None:
        self.obj_type = obj_type
        self.attributes = []
        self.value = value
        self.object_id = object_id

    def add_attribute(self, attribute: str, value: str | None = None) -> None:
        """
        Add an attribute to the object

        Parameters:
            attribute (str): name of the attribute
            value (str): value of the attribute
        """
        if value is None:
            self.attributes.append(attribute)
        self.attributes.append((attribute, value))

    def set_value(self, value: str) -> None:
        """
        Set the value of the object
        For text, code - text
        For image, video, iframe - path

        Parameters:
            value (str): value of the object
        """
        self.value = value

    def set_data_id(self, data_id: int) -> None:
        """
        Set the auto animate id of the object

        Parameters:
            id (int): id of the object
        """
        self.add_attribute("data-auto-animate-id", str(data_id))

    def to_dict(self) -> dict:
        """
        Convert the object to dict

        Returns:
            dict: a dict representation of the object
        """
        object_dict = {}
        object_dict["obj_type"] = self.obj_type
        object_dict["object_id"] = self.object_id
        object_dict["attributes"] = self.attributes
        object_dict["value"] = self.value
        return object_dict
