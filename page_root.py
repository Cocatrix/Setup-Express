from strings import SITE_NAME
from game import (
    ALL_GAMES,
    Game,
)

def _render_game_tile(game: Game):
    return f'''
    <a class="game-tile" href="/{game.key}">
        <img src="{game.cover_image_path}" alt="{game.name}">
    </a>
    '''

def page_root():
    """
    Return root HTML body (a grid with all games' images).
    """
    tiles = "\n".join(_render_game_tile(game) for game in ALL_GAMES)

    return f'''
    <h1>{SITE_NAME}</h1>
    <div class="grid">
        {tiles}
    </div>
    '''
