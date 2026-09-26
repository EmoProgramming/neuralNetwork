async function loadNavigation() {
    const response = await fetch("../html/nav.html");
    const html = await response.text();

    document.getElementById("navigation").innerHTML = html;
}

loadNavigation();