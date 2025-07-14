from game import Game

# Page loader

def load(bodyString, game: Game):
    iconPath = '/static/images/favicon.ico'

    return f'''
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="utf-8">
        <link rel="icon" type="image/x-icon" href="{iconPath}">
        <title>{game.title()}</title>
        <link rel="stylesheet" href="/static/css/base.css">
        <link rel="stylesheet" href="/static/css/{game.key}.css">
    </head>
    <body>
        {bodyString}
        <script src="/static/scripts/utils.js"></script>
        <script src="/static/scripts/{game.key}.js"></script>
    </body>
    </html>
    '''