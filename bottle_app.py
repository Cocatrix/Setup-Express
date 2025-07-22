import logging

from bottle import ( # type: ignore
    default_app,
    route,
    static_file,
)

from page_root import page_root
from render_page import render_root_page

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(name)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
application = default_app()

@route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='/home/cocatrix/mysite/static')

@route('/')
def route_root():
    return render_root_page(page_root())
