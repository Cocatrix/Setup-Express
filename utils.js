
function mapStringsToHTMLTable(sets) {
    var html = "<table>";
    for(var i in sets){
        html += "<tr>";
        html += "<td>" + sets[i] + "</td>";
        html += "</tr>";
    }
    html += "</table>";
    return html
}