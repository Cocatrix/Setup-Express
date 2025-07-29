from textwrap import dedent
from typing import List

from game import Game
from strings import (
    SITE_DESC,
    SITE_NAME,
)


def _render_page(
    body_string: str, title: str, styles: List[str], scripts: List[str]
) -> str:
    """
    Builds full HTML page, injecting `body_string`
    and loading JS/CSS files named `key`.
    """
    icon_path = "/static/images/favicon.ico"
    styles_html = "\n".join(
        f'<link rel="stylesheet" href="/static/css/{file}.css">' for file in styles
    )
    scripts_html = "\n".join(
        f'   <script type="module" src="/static/scripts/{file}.js"></script>'
        for file in scripts
    )
    html_head = f"""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="{SITE_DESC}">
        <link rel="icon" type="image/x-icon" href="{icon_path}">
        <title>{title}</title>
        {styles_html}

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@400;500&family=Cinzel:wght@700&display=swap"
            rel="stylesheet"
        />
    </head>
    <body>
    """

    html_foot = f"""
    {scripts_html}
    </body>
    </html>
    """

    return dedent(html_head + body_string + html_foot).strip()


def render_root_page(body_string: str):
    return _render_page(body_string, SITE_NAME, ["base", "root"], ["root"])


def render_game_page(body_string: str, game: Game):
    return _render_page(
        body_string,
        f"{SITE_NAME}: {game.name}",
        ["base", "game", game.key],
        ["game_engine", "pauseable_timer", game.key],
    )
