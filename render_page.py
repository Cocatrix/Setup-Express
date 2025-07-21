from textwrap import dedent

from strings import (
    SITE_DESC,
    SITE_NAME,
)

def _render_page(body_string: str, title: str, key: str) -> str:
    """
    Builds full HTML page, injecting `body_string`
    and loading JS/CSS files named `key`.
    """
    icon_path = '/static/images/favicon.ico'

    html_head = f'''
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="{SITE_DESC}">
        <link rel="icon" type="image/x-icon" href="{icon_path}">
        <title>{title}</title>
        <link rel="stylesheet" href="/static/css/base.css">
        <link rel="stylesheet" href="/static/css/{key}.css">
    </head>
    <body>
    '''
    
    html_foot = f'''
        <script src="/static/scripts/utils.js"></script>
        <script src="/static/scripts/{key}.js"></script>
    </body>
    </html>
    '''

    return dedent(html_head + body_string + html_foot).strip()

def render_root_page(body_string):
    return _render_page(body_string, SITE_NAME, "root")
