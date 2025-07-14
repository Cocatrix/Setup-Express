
let baseSets = [
    "🏰 Château",
    "🎈Fête foraine",
    "🪐 Espace",
    "🎬 Studio de film",
    "🦇 Maison hantée",
    "⚓️ Marins",
    ]

let beachSets = [
    "🍄 Forêt enchantée",
    "🧩 Magasin de jouets",
    "🏔 Montagne",
    "🕳 Base secrète",
    "🎓 Université",
    "🌴 Club de plage",
    ]

let rumbleSets = [
    "🤼 WWE",
    "🏙 Urban Rivals",
    "🎶 Artistes",
    "🦕 Dinosaures",
    "⚡️ Pokemon",
    "😆 Fun",
    ]

function getCurrentSets(checkedSets) {
    sets = []
    if (checkedSets.includes("base")) {
        sets.push(...baseSets)
    }
    if (checkedSets.includes("beach")) {
        sets.push(...beachSets)
    }
    if (checkedSets.includes("rumble")) {
        sets.push(...rumbleSets)
    }
    return sets
}

function getFiveSets(currentSets) {
    const fiveSets = [];
    const pickedIndexes = new Set();
    const n = currentSets.length;

    if (currentSets.length < 5) {
        throw new Error("Pas assez d'éléments pour en choisir 5.");
    }

    while (fiveSets.length < 5) {
        let i = Math.floor(Math.random() * n);
        if (!pickedIndexes.has(i)) {
            pickedIndexes.add(i)
            fiveSets.push(currentSets[i])
        }
    }
    return fiveSets
}

function loadFiveSets() {
    const checkboxes = document.querySelectorAll('input[name="options"]:checked');
    const checkedSets = Array.from(checkboxes).map(cb => cb.value);
    const result = checkedSets.length > 0 ? mapStringsToHTMLTable(getFiveSets(getCurrentSets(checkedSets))) : "Aucune option sélectionnée.";
    document.getElementById("result").innerHTML = result;
}




