"""A constructor of presentations."""
from __future__ import annotations


class Presentation:
    """A class for presentations construction.

    Attributes:
        name (str): name of the presentation
        slides (dict): dict of slides
        style (str): style of the presentation
        plugins (set): list of plugins
        unused_id_max (int): the maximum id that has not been used
    """

    def __init__(
        self, name: str, owner: str, style: str = "moon", plugins: list | None = None
    ) -> None:
        self.name = f"{owner}_{name}"
        self.owner = owner
        self.slides: dict[str, Slide] = {}
        self.style = style
        if plugins is None:
            plugins = []
        self.plugins: list[str] = plugins
        self.unused_id_max = 0

    def get_new_id(self) -> int:
        """Get a new id for a slide.

        Returns:
            id (int): the new id
        """
        self.unused_id_max += 1
        return self.unused_id_max - 1

    def add_slide(self) -> int:
        """Add a slide to the presentation.

        Returns:
            slide_id (int): id of the new slide
        """
        new_id = self.get_new_id()
        self.slides[self.get_slide_full_id(new_id)] = Slide(new_id, self.name)
        return new_id

    def get_slide(self, slide_id: int) -> Slide | None:
        """Get the slide with the given id.

        Args:
            slide_id (int): id of the slide

        Returns:
            Slide: the slide with the given id
            None: if the slide does not exist
        """
        full_id = self.get_slide_full_id(slide_id)
        if full_id not in self.slides:
            return None
        return self.slides[full_id]

    def get_slide_full_id(self, slide_id: int) -> str:
        """Get the full id of a slide.

        Args:
            slide_id (int): id of the slide

        Returns:
            str: the full id of the slide
        """
        return f"{self.name}_{slide_id}"

    def swap_slides(self, slide1: int, slide2: int) -> None:
        """Swap two slides.

        Args:
            slide1 (int): id of the first slide
            slide2 (int): id of the second slide
        """
        full_id1 = self.get_slide_full_id(slide1)
        full_id2 = self.get_slide_full_id(slide2)
        if full_id1 not in self.slides or full_id2 not in self.slides:
            return
        self.slides[full_id1], self.slides[full_id2] = (
            self.slides[full_id2],
            self.slides[full_id1],
        )

    def delete_slide(self, slide_id: int) -> None:
        """Delete a slide.

        Args:
            slide_id (int): id of the slide
        """
        full_id = self.get_slide_full_id(slide_id)
        if full_id not in self.slides:
            return
        del self.slides[full_id]

    def save(self) -> str:
        """
        Save the presentation to a html file
        """
        html = (
            "<!DOCTYPE html>\n"
            "<html>\n"
            "<head>\n"
            f"<link rel='stylesheet' href='dist/theme/{self.style}.css'>\n"
            "</head>\n"
            "<body>\n"
            "<div class='reveal'>\n"
            "<div class='slides'>\n"
        )
        for slide in self.slides.values():
            html += f"\n{slide.to_html()}\n"
        html += "</div>\n" "</div>\n" "<script src='dist/reveal.js'></script>\n"
        html += "</body>\n" "</html>\n"
        return html

    def add_plugin(self, plugin: str) -> None:
        """Add a plugin to the presentation.

        Args:
            plugin (str): name of the plugin
        """
        if plugin not in self.plugins:
            self.plugins.append(plugin)

    def remove_plugin(self, plugin: str) -> None:
        """Remove a plugin from the presentation.

        Args:
            plugin (str): name of the plugin
        """
        if plugin in self.plugins:
            self.plugins.remove(plugin)

    def set_style(self, style: str) -> None:
        """Set the style of the presentation.

        Args:
            style (str): name of the style
        """
        self.style = style

    def to_dict(self) -> dict:
        """Convert the presentation to a dict.

        Returns:
            dict: the presentation as a dict
        """
        return {
            "name": self.name.split("_")[-1],
            "slides": [v.to_dict() for v in self.slides.values()],
            "style": self.style,
            "plugins": self.plugins,
            "owner": self.owner,
            "unused_id_max": self.unused_id_max,
        }


class Slide:
    """A class for slides construction.

    Attributes:
        content (dict): list of elements
        attributes (str): str of slide attributes
        background (str): background color or path of the slide
        slide_id (int): id of the slide
        max_id (int): the maximum element id that has not been used
        owner (str): owner of the slide

    Methods:
        get_new_id: get an id for a new element
        set_background: set the background of the slide
        add_attribute: add an attribute to the slide
        add_object: add an object to the slide
        remove_object: remove an object from the slide
        to_dict: convert the slide to a dict
    """

    background_type = "color"

    def __init__(
        self, slide_id: int, owner: str, background_color: str = "#2e3440"
    ) -> None:
        self.content: list[Object] = []
        self.attributes = ""
        self.background = background_color
        self.max_id = 0
        self.owner = owner
        self.slide_id = f"{owner}_{slide_id}"

    def get_new_id(self) -> int:
        """Get a new id for an element.

        Returns:
            id (int): the new id
        """
        self.max_id += 1
        return self.max_id - 1

    def set_background(
        self, bg_type: str, bg_color: str | None = None, path: str | None = None
    ) -> None:
        """Set the background of the slide.

        Args:
            bg_type (str): type of the background(color, image, video, iframe)
            bg_color (str): color of the background
            path (str): path to the background(image or video or iframe)
        """
        if bg_type == "color":
            self.background = bg_color
        else:
            self.background = path

    def update_slide(self, slide: dict) -> None:
        """Update the slide, using the given dict with values.

        Args:
            slide (dict): a dictionary with slide attributes
        """
        for key, value in slide.items():
            if key == "background_type":
                self.background_type = value
            elif key == "background":
                self.background = value
            elif key == "attributes":
                self.attributes = value
            elif key == "content":
                for obj in value:
                    if self.get_object(obj["object_id"]) is None:
                        object = Object(obj["object_id"], obj["type"], self.slide_id)
                        object.update(obj)
                        self.content.append(object)
                    else:
                        object = self.get_object(obj["object_id"])
                        if object is not None:
                            object.update(obj)

    def add_attribute(self, attribute: str, value: str | None = None) -> None:
        """Add an attribute to the slide.

        Args:
            attribute (str): name of the attribute
            value (str): value of the attribute
        """
        if value is None:
            self.attributes += f" {attribute}"
        else:
            self.attributes += f' {attribute}="{value}"'

    def add_object(self, obj_type: str, value: str = "") -> int:
        """Add an object to the slide.

        Args:
            obj_type (str): type of the object(text, image, video, iframe)
            value (str): value of the object
                (for text - text, for image, video, iframe - path)

        Returns:
            int: id of the new object
        """
        new_id = self.get_new_id()
        self.content.append(Object(new_id, obj_type, self.slide_id, value))
        return new_id

    def get_object_full_id(self, obj_id: int) -> str:
        """Get the full id of the object.

        Args:
            obj_id (int): id of the object

        Returns:
            str: full id of the object
        """
        return f"{self.slide_id}_{obj_id}"

    def update_object(self, updated_values: dict) -> None:
        """Update an object.

        Args:
            updated_values (dict): dict with the updated values
        """
        obj_id = updated_values["object_id"]
        obj = self.get_object(obj_id)
        if obj is not None:
            obj.update(updated_values)

    def get_object(self, obj_id: int) -> Object | None:
        """Get an object.

        Args:
            obj_id (int): id of the object

        Returns:
            Object: the object
        """
        full_id = self.get_object_full_id(obj_id)
        for obj in self.content:
            if obj.object_id == full_id:
                return obj
        return None

    def remove_object(self, obj_id: int) -> None:
        """Remove an object from the slide.

        Args:
            obj_id (int): id of the object
        """
        full_id = self.get_object_full_id(obj_id)
        self.content = [obj for obj in self.content if obj.object_id != full_id]

    def to_html(self):
        """
        Convert each slide to html
        """
        attrs = ""
        if self.background_type == "color":
            attrs += f" data-background-color='{self.background}'"
        else:
            attrs += f" data-background-path='{self.background}'"
        if self.attributes:
            attrs += f" {self.attributes}"
        content_html = "\n".join(item.to_html() for item in self.content)
        html = f"""
        <section
        {attrs}
        {'data-markdown' if self.content[0].obj_type == 'markdown' else ''}
        >
        {content_html}
        </section>
        """
        return html

    def to_dict(self) -> dict:
        """Convert the slide to a dict.

        Returns:
            dict: a dict representation of the slide
        """
        return {
            "content": [obj.to_dict() for obj in self.content],
            "attributes": self.attributes,
            "background": self.background,
            "slide_id": int(self.slide_id.split("_")[-1]),
            "max_id": self.max_id,
        }


class Object:
    """An object of a slide.

    Attributes:
        object_id (str): id of the object. Consists of owner name and int id
        obj_type (str): type of the object(text, code, image, video, iframe)
        owner (str): owner of the object
        attributes (str): str of attributes
        value (str): value of the object
            (for text, code - text, for image, video, iframe - path)

    Methods:
        add_attribute: add an attribute to the object
        set_value: set the value of the object(text or path)
        set_data_id: set the auto animate id of the object
        to_dict: convert the object to a dict
    """

    def __init__(
        self, object_id: int, obj_type: str, owner: str, value: str = ""
    ) -> None:
        self.obj_type = obj_type
        self.attributes = ""
        self.value = value
        self.owner = owner
        self.object_id = f"{owner}_{object_id}"

    def add_attribute(self, attribute: str, value: str | None = None) -> None:
        """Add an attribute to the object.

        Args:
            attribute (str): name of the attribute
            value (str): value of the attribute
        """
        if value is None:
            self.attributes += f" {attribute}"
        else:
            self.attributes += f' {attribute}="{value}"'

    def set_value(self, value: str) -> None:
        """Set the value of the object.

        For text, code - text
        For image, video, iframe - path

        Args:
            value (str): value of the object
        """
        self.value = value

    def set_data_id(self, data_id: int) -> None:
        """Set the auto animate id of the object.

        Args:
            data_id (int): id of the object
        """
        self.add_attribute("data-auto-animate-id", str(data_id))

    def to_dict(self) -> dict:
        """Convert the object to dict.

        Returns:
            dict: a dict representation of the object
        """
        return {
            "type": self.obj_type,
            "object_id": int(self.object_id.split("_")[-1]),
            "attributes": self.attributes,
            "value": self.value,
        }

    def update(self, updated_values: dict) -> None:
        """Update the object.

        Args:
            updated_values (dict): dict with the updated values
        """
        for key, value in updated_values.items():
            if key == "object_id" or key == "obj_id":
                continue
            if key == "obj_type" or key == "type" or key == "object_type":
                self.obj_type = value
            elif key == "attributes":
                self.attributes = value
            elif key == "value" or key == "content":
                self.value = value

    def to_html(self) -> str:
        """
        Render object into html
        """
        if self.obj_type == "text":
            return f"<span {self.attributes}>{self.value}</span>"

        if self.obj_type == "code":
            return f"""<pre key={self.object_id}>
                    <code
                        data-line-numbers="1"
                        data-trim
                        {self.attributes}
                        data-noescape>
                        {self.value}
                    </code>
                </pre>"""

        if self.obj_type == "img":
            return f"""<img
                {self.attributes}
                src={self.value} />"""

        if self.obj_type == "iframe":
            return f"""<iframe
                {self.attributes}
                allowFullScreen
                src={self.value} />"""
        return self.value
