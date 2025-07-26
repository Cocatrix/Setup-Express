from strings import NO_BOX_SELECTED, SITE_NAME


def _tile(box):
    return f"""
    <div class="box-tile" data-value="{box.key}"">
        <img src="{box.cover_image_path}" alt="{box.full_name}">
        <p>{box.box_name}</p>
    </div>
    """


def page_game(game, boxes):
    """
    Return root HTML sidebar (a column with all boxes)
    and a `result` fillable div.
    """

    tiles = "\n".join(_tile(box) for box in boxes)

    return f"""
    <div class="app-layout">

      <aside class="sidebar">
        <h2>{SITE_NAME} :<br> {game.name}</h2>
        <div class="boxes-container">
          {tiles}
        </div>
      </aside>

      <main class="main-content">

        <div id="result">
          <p class="empty-note">{NO_BOX_SELECTED}</p>
        </div>
      </main>

    </div>
    """
