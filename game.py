from constants import SITE_NAME

class Game:
    def __init__(self, key, name, imgUrl):
        self.key = key
        self.__name = name
        self.imgUrl = imgUrl

    def title(self):
        return SITE_NAME if self.key == "home" else f'{SITE_NAME}: {self.name}'


NO_GAME = Game(
    "home",
    "",
    ""
)

# Maybe those should be protected?
CHALLENGERS = Game(
    "challengers",
    "Challengers!",
    "https://cf.geekdo-images.com/GtLESZ4ZjqikK12bjBTmig__itemrep/img/cQv55tLYndS_f0MX8EzBRW0aVhc=/fit-in/246x300/filters:strip_icc()/pic7040521.jpg"
)
LEGENDARY = Game(
    "legendary",
    "Legendary",
    "https://cf.geekdo-images.com/ZrRidumkzu62HuwKdgQpHA__itemrep/img/UnyZksyoMMyDktHj5nWWKh-N4Qc=/fit-in/246x300/filters:strip_icc()/pic1430769.jpg"
)

ALL_GAMES = [
    CHALLENGERS,
    LEGENDARY,
]