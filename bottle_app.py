import logging

from bottle import (  # type: ignore
    default_app,
    route,
    static_file,
)

from game import (
    AEONSEND,
    AEONSEND_BOXES,
    CHALLENGERS,
    CHALLENGERS_BOXES,
    LEGENDARY,
    LEGENDARY_BOXES,
)
from page_game import page_game
from page_root import page_root
from render_page import (
    render_root_page,
    render_game_page,
)

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(name)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
application = default_app()


@route("/static/<filepath:path>")
def server_static(filepath):
    return static_file(filepath, root="/home/setupexpress/Setup-Express/static")


@route("/")
def route_root():
    return render_root_page(page_root())


@route("/challengers")
def route_challengers():
    return render_game_page(page_game(CHALLENGERS, CHALLENGERS_BOXES), CHALLENGERS)


@route("/aeonsend")
def route_aeonsend():
    return render_game_page(page_game(AEONSEND, AEONSEND_BOXES), AEONSEND)


@route("/legendary")
def route_legendary():
    return render_game_page(page_game(LEGENDARY, LEGENDARY_BOXES), LEGENDARY)
