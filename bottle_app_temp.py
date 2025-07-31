################## Game: Legendary      ##################
import copy, random

# Legendary Assets

coreTitle = "Jeu de base"
coreMasterminds = [
    "Dr. Doom",
    "Loki",
    "Magneto",
    "Red Skull",
]
coreSchemes = [
    "Midtown Bank Robbery",
    "Negative Zone Prison Breakout",
    "Portals to the Dark Dimension",
    "Replace Earth's Leaders with Killbots",
    "Secret Invasion of the Skrull Shapeshifters",
    "Super Hero Civil War",
    "The Legacy Virus",
    "Unleash the Power of the Cosmic Cube",
]
coreVillains = [
    "Brotherhood",
    "Enemies of Asgard",
    "Hydra",
    "Masters of Evil",
    "Radiation",
    "Skrulls",
    "Spider-Foes",
]
coreHenchmen = [
    "Doombot Legion",
    "Hand Ninjas",
    "Savage Land Mutates",
    "Sentinel",
]
coreHeroes = [
    "Black Widow",
    "Captain America",
    "Cyclops",
    "Deadpool",
    "Emma Frost",
    "Gambit",
    "Hawkeye",
    "Hulk",
    "Iron Man",
    "Nick Fury",
    "Rogue",
    "Spider-Man",
    "Storm",
    "Thor",
    "Wolverine",
]

rokTitle = "Realm of Kings"
rokMasterminds = [
    "Emperor Vulcan of the Shi'ar",
    "Epic Emperor Vulcan",
    "Epic Maximus the Mad",
    "Maximus the Mad",
]
rokSchemes = [
    "Devolve with Xerogen Crystals",
    "Ruin the Perfect Wedding",
    "Tornado of Terrigen Mists",
    "War of Kings",
]
rokVillains = [
    "Inhuman Rebellion",
    "Shi'ar Imperial Elite",
]
rokHenchmen = []
rokHeroes = [
    "Black Bolt",
    "Crystal",
    "Gorgon",
    "Karnak",
    "Medusa",
]

darkTitle = "Dark City"
darkMasterminds = [
    "Apocalypse",
    "Kingpin",
    "Mephisto",
    "Mr. Sinister",
    "Stryfe",
]
darkSchemes = [
    "Capture Baby Hope",
    "Detonate the Helicarrier",
    "Massive Earthquake Generator",
    "Organized Crime Wave",
    "Save Humanity",
    "Steal the Weaponized Plutonium",
    "Transform Citizens into Demons",
    "X-Cutioner's song",
]
darkVillains = [
    "Emissaries of Evil",
    "Four Horsemen",
    "Marauders",
    "MLF",
    "Streets of New York",
    "Underworld",
]
darkHenchmen = [
    "Maggia Goons",
    "Phalanx",
]
darkHeroes = [
    "Angel",
    "Bishop",
    "Blade",
    "Cable",
    "Colossus",
    "Daredevil",
    "Domino",
    "Elektra",
    "Forge",
    "Ghost Rider",
    "Iceman",
    "Iron Fist",
    "Jean Grey",
    "Nightcrawler",
    "Professor X",
    "Punisher",
    "Wolverine X-Force",
]

coreRokTitle = coreTitle + " + " + rokTitle
coreRokMasterminds = coreMasterminds + rokMasterminds
coreRokSchemes = coreSchemes + rokSchemes
coreRokVillains = coreVillains + rokVillains
coreRokHenchmen = coreHenchmen + rokHenchmen
coreRokHeroes = coreHeroes + rokHeroes

coreDarkTitle = "WIP: " + coreTitle + " + " + darkTitle
coreDarkMasterminds = coreMasterminds + darkMasterminds
coreDarkSchemes = coreSchemes + darkSchemes
coreDarkVillains = coreVillains + darkVillains
coreDarkHenchmen = coreHenchmen + darkHenchmen
coreDarkHeroes = coreHeroes + darkHeroes

coreDarkRokTitle = "WIP: " + coreTitle + " + " + darkTitle + " + " + rokTitle
coreDarkRokMasterminds = coreMasterminds + darkMasterminds + rokMasterminds
coreDarkRokSchemes = coreSchemes + darkSchemes + rokSchemes
coreDarkRokVillains = coreVillains + darkVillains + rokVillains
coreDarkRokHenchmen = coreHenchmen + darkHenchmen + rokHenchmen
coreDarkRokHeroes = coreHeroes + darkHeroes + rokHeroes

# Legendary routes


@route("/legendary")
def routeLegendaryHome():
    return load(pageLegendaryHome(), LEGENDARY)


@route("/legendary/<nbPlayers>")
def routeLegendaryNbPlayersHome(nbPlayers):
    return load(pageLegendaryNbPlayersHome(nbPlayers))


### Legendary: Pick mastermind and scheme pages


@route("/legendary/core/mastermind-and-scheme/<nbPlayers>")
def routeLegendaryCoreMastermindAndScheme(nbPlayers):
    return load(
        pageLegendaryPickMastermindAndScheme(
            nbPlayers, coreTitle, coreMasterminds, coreSchemes, "core"
        )
    )


@route("/legendary/core-dark/mastermind-and-scheme/<nbPlayers>")
def routeLegendaryCoreDarkMastermindAndScheme(nbPlayers):
    return load(
        pageLegendaryPickMastermindAndScheme(
            nbPlayers, coreDarkTitle, coreDarkMasterminds, coreDarkSchemes, "core-dark"
        )
    )


@route("/legendary/core-dark-rok/mastermind-and-scheme/<nbPlayers>")
def routeLegendaryCoreDarkRokMastermindAndScheme(nbPlayers):
    return load(
        pageLegendaryPickMastermindAndScheme(
            nbPlayers,
            coreDarkRokTitle,
            coreDarkRokMasterminds,
            coreDarkRokSchemes,
            "core-dark-rok",
        )
    )


@route("/legendary/core-rok/mastermind-and-scheme/<nbPlayers>")
def routeLegendaryCoreRokMastermindAndScheme(nbPlayers):
    return load(
        pageLegendaryPickMastermindAndScheme(
            nbPlayers, coreRokTitle, coreRokMasterminds, coreRokSchemes, "core-rok"
        )
    )


### Legendary: Pick all pages


@route("/legendary/core/all/<nbPlayers>/<mastermindIndex>/<schemeIndex>")
def routeLegendaryCoreAll(nbPlayers, mastermindIndex, schemeIndex):
    return load(
        pageLegendaryPickAll(
            nbPlayers,
            coreMasterminds[int(mastermindIndex)],
            coreSchemes[int(schemeIndex)],
            coreTitle,
            coreVillains,
            coreHenchmen,
            coreHeroes,
        )
    )


@route("/legendary/core-dark/all/<nbPlayers>/<mastermindIndex>/<schemeIndex>")
def routeLegendaryCoreDarkAll(nbPlayers, mastermindIndex, schemeIndex):
    return load(
        pageLegendaryPickAll(
            nbPlayers,
            coreDarkMasterminds[int(mastermindIndex)],
            coreDarkSchemes[int(schemeIndex)],
            coreDarkTitle,
            coreDarkVillains,
            coreDarkHenchmen,
            coreDarkHeroes,
        )
    )


@route("/legendary/core-dark-rok/all/<nbPlayers>/<mastermindIndex>/<schemeIndex>")
def routeLegendaryCoreDarkRokAll(nbPlayers, mastermindIndex, schemeIndex):
    return load(
        pageLegendaryPickAll(
            nbPlayers,
            coreDarkRokMasterminds[int(mastermindIndex)],
            coreDarkRokSchemes[int(schemeIndex)],
            coreDarkRokTitle,
            coreDarkRokVillains,
            coreDarkRokHenchmen,
            coreDarkRokHeroes,
        )
    )


@route("/legendary/core-rok/all/<nbPlayers>/<mastermindIndex>/<schemeIndex>")
def routeLegendaryCoreRokAll(nbPlayers, mastermindIndex, schemeIndex):
    return load(
        pageLegendaryPickAll(
            nbPlayers,
            coreRokMasterminds[int(mastermindIndex)],
            coreRokSchemes[int(schemeIndex)],
            coreRokTitle,
            coreRokVillains,
            coreRokHenchmen,
            coreRokHeroes,
        )
    )


# Legendary page : home


def pageLegendaryHome():
    lines = [
        "<p></p>",
        '<p><h4><font face="Verdana" size="10">',
        "Choisis ton jeu et le nombre de joueur·ses :",
        "</h4></p>",
        '<table border="0" cellpadding="20">',
        "<tr>",
        '<th><font face="Verdana" size="10">',
        "Legendary",
        "</th>",
        '<td><font face="Verdana" size="10">',
        '<a href="/legendary/2p">',
        "2p",
        "</a>",
        "</td>",
        '<td><font face="Verdana" size="10">',
        '<a href="/legendary/3p">',
        "3p",
        "</a>",
        "</td>",
        '<td><font face="Verdana" size="10">',
        '<a href="/legendary/4p">',
        "4p",
        "</a>",
        "</td>",
        '<td><font face="Verdana" size="10">',
        '<a href="/legendary/5p">',
        "5p",
        "</a>",
        "</td>",
        "</tr>",
        "</table>",
    ]
    return "".join(lines)


def pageLegendaryNbPlayersHome(nbPlayers):
    lines = [
        "<p></p>",
        '<p><h4><font face="Verdana" size="10">',
        "Legendary - " + nbPlayers + " - Choisis avec ou sans extensions :",
        "</h4></p>",
        '<table border="0" cellpadding="20">',
        "<tr>",
        '<td><font face="Verdana" size="10">',
        '<a href="/legendary/core/mastermind-and-scheme/' + nbPlayers + '">',
        coreTitle,
        "</a>",
        "</td>",
        "</tr>",
        "<tr>",
        '<td><font face="Verdana" size="10">',
        '<a href="/legendary/core-dark/mastermind-and-scheme/' + nbPlayers + '">',
        coreDarkTitle,
        "</a>",
        "</td>",
        "</tr>",
        "<tr>",
        '<td><font face="Verdana" size="10">',
        '<a href="/legendary/core-dark-rok/mastermind-and-scheme/' + nbPlayers + '">',
        coreDarkRokTitle,
        "</a>",
        "</td>",
        "</tr>",
        "<tr>",
        '<td><font face="Verdana" size="10">',
        '<a href="/legendary/core-rok/mastermind-and-scheme/' + nbPlayers + '">',
        coreRokTitle,
        "</a>",
        "</td>",
        "</tr>",
        "</table>",
    ]
    return "".join(lines)


# Legendary page : pick mastermind and scheme

pickedMastermind = ""
pickedScheme = ""


def pageLegendaryPickMastermindAndScheme(
    nbPlayers, title, masterminds, schemes, subpath
):

    # Pick Mastermind and Scheme

    pickedMastermind = random.choice(masterminds)
    pickedScheme = random.choice(schemes)
    print("Picked: ", pickedMastermind, pickedScheme)

    # Display table

    lines = [
        "<p></p>",
        '<p><h4><font face="Verdana" size="10">',
        "&emsp;&emsp;&emsp;Legendary - " + nbPlayers + " - " + title,
        "</h4></p>",
        '<table border="1" cellpadding="20">',
        "<tr>",
        '<th align="right"><font face="Verdana" size="10">',
        "Mastermind",
        "</th>",
        '<td><font face="Verdana" size="10">',
        pickedMastermind,
        "</td>",
        "</tr>",
        '<tr style="background-color:#eab676;">',
        '<th align="right"><font face="Verdana" size="10">',
        "Scheme",
        "</th>",
        '<td><font face="Verdana" size="10">',
        pickedScheme,
        "</td>",
        "</tr>",
        "</table>",
        "<p></p>",
        '<p><h4><font face="Verdana" size="10">',
        "&emsp;&emsp;&emsp;Tirage satisfaisant ? ",
        '<a href="/legendary/'
        + subpath
        + "/all/"
        + nbPlayers
        + "/"
        + str(masterminds.index(pickedMastermind))
        + "/"
        + str(schemes.index(pickedScheme))
        + '">',
        "Passer à la suite",
        "</a>" "</h4></p>",
        '<div style="position: absolute; bottom: 20px;">',
        "&emsp;&emsp;Rafraîchir pour changer le tirage",
        "</div>",
    ]
    return "".join(lines)


# Legendary page : pick all


def pageLegendaryPickAll(
    nbPlayers, pickedMastermind, pickedScheme, title, villains, henchmen, heroes
):

    # Setup default number of villains, henchmen, bystanders, heroes, twists

    if nbPlayers == "2p":
        nbVillains, nbHenchmen, nbBystanders, nbHeroes = 2, 1, 2, 5
    elif nbPlayers == "3p":
        nbVillains, nbHenchmen, nbBystanders, nbHeroes = 3, 1, 8, 5
    elif nbPlayers == "4p":
        nbVillains, nbHenchmen, nbBystanders, nbHeroes = 3, 2, 8, 5
    else:
        nbVillains, nbHenchmen, nbBystanders, nbHeroes = 4, 2, 12, 6

    nbTwists = 8

    # Update according to Mastermind

    forcedVillain = ""
    forcedHenchman = ""
    xerogenHenchman = ""
    weddingHeroes = ""

    if pickedMastermind == coreMasterminds[0]:  # Dr. Doom
        forcedHenchman = coreHenchmen[0]  # Doombot Legion
    elif pickedMastermind == coreMasterminds[1]:  # Loki
        forcedVillain = coreVillains[1]  # Enemies of Asgard
    elif pickedMastermind == coreMasterminds[2]:  # Magneto
        forcedVillain = coreVillains[0]  # Brotherhood
    elif pickedMastermind == coreMasterminds[3]:  # Red Skull
        forcedVillain = coreVillains[2]  # Hydra
    elif pickedMastermind in (rokMasterminds[0], rokMasterminds[1]):  # Emperor Vulcan
        forcedVillain = rokVillains[1]  # Shi'ar Imperial Elite
    elif pickedMastermind in (rokMasterminds[2], rokMasterminds[3]):  # Maximus the Mad
        forcedVillain = rokVillains[0]  # Inhuman Rebellion
    else:
        pass

    # Update according to Scheme

    if pickedScheme == coreSchemes[0]:  # Midtown Bank Robbery
        nbBystanders = 12
    elif pickedScheme == coreSchemes[1]:  # Negative Zone Prison Breakout
        nbHenchmen += 1
    elif pickedScheme == coreSchemes[2]:  # Portals to the Dark Dimension
        nbTwists = 7
    elif pickedScheme == coreSchemes[3]:  # Replace Earth's Leaders with Killbots
        nbTwists = 5
        nbBystanders = 18
    elif pickedScheme == coreSchemes[4]:  # Secret Invasion of the Skrull Shapeshifters
        nbHeroes += 1
    elif pickedScheme == coreSchemes[5]:  # Super Hero Civil War
        if nbPlayers == "2p":
            nbHeroes = 4
        elif nbPlayers in ["4p", "5p"]:
            nbTwists = 5
        else:
            pass
    elif pickedScheme in (
        coreSchemes[6],
        coreSchemes[7],
    ):  # The Legacy Virus, Unleash the Power of the Cosmic Cube
        pass
    elif pickedScheme == rokSchemes[0]:  # Devolve with Xerogen Crystals
        nbTwists = int(nbPlayers[0]) + 3
        nbHenchmen += 1
        xerogenHenchman = "yes"
    elif pickedScheme == rokSchemes[1]:  # Ruin the Perfect Wedding
        nbTwists = 11
        nbHeroes += 2
        weddingHeroes = "yes"
    elif pickedScheme == rokSchemes[2]:  # Tornado of Terrigen Mists
        nbTwists = 10
    elif pickedScheme == rokSchemes[3]:  # War of Kings
        nbTwists = 11
    else:
        pass

    # Now everthing is setup
    # nbVillains, nbHenchmen, nbBystanders, nbHeroes, nbTwists, nbBystanders, forcedVillain, forcedHenchman

    print(
        "Setup:",
        nbVillains,
        nbHenchmen,
        nbBystanders,
        nbHeroes,
        nbTwists,
        nbBystanders,
        forcedVillain,
        forcedHenchman,
    )

    # Force villain

    if forcedVillain != "":
        copyVillains = copy.deepcopy(villains)
        copyVillains.remove(forcedVillain)
        print("Villains:", copyVillains, nbVillains)
        randomVillains = random.sample(copyVillains, nbVillains - 1)
        randomVillains.append(forcedVillain.upper())
        pickedVillains = "<br>".join(randomVillains)
    else:
        print("Villains:", villains, nbVillains)
        pickedVillains = "<br>".join(random.sample(villains, nbVillains))

    # Force henchmen

    if (forcedHenchman != "") and (xerogenHenchman != ""):
        copyHenchmen = copy.deepcopy(henchmen)
        copyHenchmen.remove(forcedHenchman)
        xerogenHenchman = random.choice(copyHenchmen)
        copyHenchmen.remove(xerogenHenchman)
        randomHenchmen = random.sample(copyHenchmen, nbHenchmen - 2)
        randomHenchmen.append(forcedHenchman.upper())
        randomHenchmen.append("Xerogen Experiment : " + xerogenHenchman)
        pickedHenchmen = "<br>".join(randomHenchmen)
    elif (forcedHenchman != "") and (xerogenHenchman == ""):
        copyHenchmen = copy.deepcopy(henchmen)
        copyHenchmen.remove(forcedHenchman)
        randomHenchmen = random.sample(copyHenchmen, nbHenchmen - 1)
        randomHenchmen.append(forcedHenchman.upper())
        pickedHenchmen = "<br>".join(randomHenchmen)
    elif (forcedHenchman == "") and (xerogenHenchman != ""):
        xerogenHenchman = random.choice(henchmen)
        copyHenchmen = copy.deepcopy(henchmen)
        copyHenchmen.remove(xerogenHenchman)
        randomHenchmen = random.sample(copyHenchmen, nbHenchmen - 1)
        randomHenchmen.append("Xerogen Experiment : " + xerogenHenchman)
        pickedHenchmen = "<br>".join(randomHenchmen)
    else:
        pickedHenchmen = "<br>".join(random.sample(henchmen, nbHenchmen))

    # Pick heroes

    if weddingHeroes != "":
        randomHeroes = random.sample(heroes, nbHeroes)
        randomHeroes[-1] = "Wedding Hero : " + randomHeroes[-1]
        randomHeroes[-2] = "Wedding Hero : " + randomHeroes[-2]
        pickedHeroes = "<br>".join(randomHeroes)
    else:
        pickedHeroes = "<br>".join(random.sample(heroes, nbHeroes))

    # Display all in a table

    lines = [
        "<p></p>",
        '<p><h4><font face="Verdana" size="10">',
        "&emsp;&emsp;&emsp;Legendary - " + nbPlayers + " - " + title,
        "</h4></p>",
        '<table border="1" cellpadding="20">',
        "<tr>",
        '<th align="right"><font face="Verdana" size="10">',
        "Mastermind",
        "</th>",
        '<td><font face="Verdana" size="10">',
        pickedMastermind,
        "</td>",
        "</tr>",
        '<tr style="background-color:#eab676;">',
        '<th align="right"><font face="Verdana" size="10">',
        "Scheme",
        "</th>",
        '<td><font face="Verdana" size="10">',
        pickedScheme,
        "</td>",
        "</tr>",
        "<tr>",
        '<th align="right"><font face="Verdana" size="10">',
        "Villains",
        "</th>",
        '<td><font face="Verdana" size="10">',
        pickedVillains,
        "</td>",
        "</tr>",
        '<tr style="background-color:#eab676;">',
        '<th align="right"><font face="Verdana" size="10">',
        "Henchmen",
        "</th>",
        '<td><font face="Verdana" size="10">',
        pickedHenchmen,
        "</td>",
        "</tr>",
        "<tr>",
        '<th align="right"><font face="Verdana" size="10">',
        "Heroes",
        "</th>",
        '<td><font face="Verdana" size="10">',
        pickedHeroes,
        "</td>",
        "</tr>",
        '<tr style="background-color:#eab676;">',
        '<th align="right"><font face="Verdana" size="10">',
        "Bystanders",
        "</th>",
        '<td><font face="Verdana" size="10">',
        str(nbBystanders),
        "</td>",
        "</tr>",
        "<tr>",
        '<th align="right"><font face="Verdana" size="10">',
        "Scheme Twists",
        "</th>",
        '<td><font face="Verdana" size="10">',
        str(nbTwists),
        "</td>",
        "</tr>",
        "</table>",
    ]
    return "".join(lines)
