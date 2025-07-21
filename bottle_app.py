from bottle import ( # type: ignore
    default_app,
    route,
    static_file,
)

application = default_app()

@route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='/home/cocatrix/mysite/static')

@route('/')
def route_root():
    pass
