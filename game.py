from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List


class CoverImageMixin(ABC):
    @property
    def cover_image_path(self) -> str:
        return f"/static/images/{self.image_name}.webp"

    @property
    @abstractmethod
    def image_name(self) -> str: ...


@dataclass(frozen=True)
class Game(CoverImageMixin):
    key: str
    name: str

    @property
    def image_name(self) -> str:
        return f"{self.key}_core"


@dataclass(frozen=True)
class Box(CoverImageMixin):
    box_suffix: str
    game: Game
    box_name: str
    key: str = field(init=False)

    def __post_init__(self):
        object.__setattr__(self, "key", f"{self.game.key}_{self.box_suffix}")

    @property
    def image_name(self) -> str:
        return self.key

    @property
    def full_name(self) -> str:
        return f"{self.game.name} {self.box_name}"


@dataclass(frozen=True)
class OriginalBox(Box):
    def __init__(self, game: Game):
        super().__init__(box_suffix="core", game=game, box_name=game.name)

    @property
    def full_name(self) -> str:
        return self.box_name


# --- Global variables

AEONSEND = Game("aeonsend", "Aeon's End")
CHALLENGERS = Game("challengers", "Challengers!")
LEGENDARY = Game("legendary", "Legendary")
ALL_GAMES: List[Game] = [
    AEONSEND,
]

AEONSEND_BOXES: List[Box] = [
    OriginalBox(AEONSEND),
    Box("depths", AEONSEND, "Les Profondeurs"),
    Box("nameless", AEONSEND, "Les Sans-nom"),
    Box("war_eternal", AEONSEND, "Guerre Éternelle"),
    Box("void", AEONSEND, "Le Vide"),
    Box("outer_dark", AEONSEND, "Ténèbres d'Ailleurs"),
    Box("outcasts", AEONSEND, "Les Parias"),
]

CHALLENGERS_BOXES: List[Box] = [
    OriginalBox(CHALLENGERS),
    Box("beach", CHALLENGERS, "Beach Cup"),
    Box("rumble", CHALLENGERS, "Rumble"),
]

LEGENDARY_BOXES: List[Box] = [
    OriginalBox(LEGENDARY),
    Box("dark_city", LEGENDARY, "Dark City"),
    Box("realm_of_kings", LEGENDARY, "Realm of Kings"),
    Box(
        "marvel_studios_guardians_of_the_galaxy",
        LEGENDARY,
        "Marvel Studios' Guardians of the Galaxy",
    ),
]
