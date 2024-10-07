// Récupérer le chemin actuel
const currentPath = window.location.pathname;
// Extraire le nom du fichier (ex: "home.html", "explore.html", etc.)
const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);

if (currentPage == "home.html") {
    document.getElementById('menu_home').style.fontWeight = '600';
    document.getElementById('menu_home').style.backgroundColor = blue_white;
    document.getElementById('menu_home').style.opacity    = 1.0;
    document.getElementById('menu_explore').style.opacity = 0.7;
    document.getElementById('menu_faq').style.opacity     = 0.7;
    document.getElementById('menu_contact').style.opacity = 0.7;
    document.getElementById('menu_explore').addEventListener('mouseover', function() {this.style.backgroundColor = blue_white;});
    document.getElementById('menu_explore').addEventListener('mouseout', function() {this.style.backgroundColor  = null;});
    document.getElementById('menu_faq').addEventListener('mouseover', function() {this.style.backgroundColor     = blue_white;});
    document.getElementById('menu_faq').addEventListener('mouseout', function() {this.style.backgroundColor      = null;});
    document.getElementById('menu_contact').addEventListener('mouseover', function() {this.style.backgroundColor = blue_white;});
    document.getElementById('menu_contact').addEventListener('mouseout', function() {this.style.backgroundColor  = null;});
} else if (currentPage == "explore.html") {
    document.getElementById('menu_explore').style.fontWeight = '600';
    document.getElementById('menu_explore').style.backgroundColor = blue_white;
    document.getElementById('menu_explore').style.opacity = 1.0;
    document.getElementById('menu_home').style.opacity    = 0.7;
    document.getElementById('menu_faq').style.opacity     = 0.7;
    document.getElementById('menu_contact').style.opacity = 0.7;
    document.getElementById('menu_home').addEventListener('mouseover', function() {this.style.backgroundColor    = blue_white;});
    document.getElementById('menu_home').addEventListener('mouseout', function() {this.style.backgroundColor     = null;});
    document.getElementById('menu_faq').addEventListener('mouseover', function() {this.style.backgroundColor     = blue_white;});
    document.getElementById('menu_faq').addEventListener('mouseout', function() {this.style.backgroundColor      = null;});
    document.getElementById('menu_contact').addEventListener('mouseover', function() {this.style.backgroundColor = blue_white;});
    document.getElementById('menu_contact').addEventListener('mouseout', function() {this.style.backgroundColor  = null;});
} else if (currentPage == "faq.html") {
    document.getElementById('menu_faq').style.fontWeight = '600';
    document.getElementById('menu_faq').style.backgroundColor = blue_white;
    document.getElementById('menu_faq').style.opacity = 1.0;
    document.getElementById('menu_home').style.opacity    = 0.7;
    document.getElementById('menu_explore').style.opacity = 0.7;
    document.getElementById('menu_contact').style.opacity = 0.7;
    document.getElementById('menu_home').addEventListener('mouseover', function() {this.style.backgroundColor    = blue_white;});
    document.getElementById('menu_home').addEventListener('mouseout', function() {this.style.backgroundColor     = null;});
    document.getElementById('menu_explore').addEventListener('mouseover', function() {this.style.backgroundColor = blue_white;});
    document.getElementById('menu_explore').addEventListener('mouseout', function() {this.style.backgroundColor  = null;});
    document.getElementById('menu_contact').addEventListener('mouseover', function() {this.style.backgroundColor = blue_white;});
    document.getElementById('menu_contact').addEventListener('mouseout', function() {this.style.backgroundColor  = null;});
} else if (currentPage == "contact.html") {
    document.getElementById('menu_contact').style.fontWeight = '600';
    document.getElementById('menu_contact').style.backgroundColor = blue_white;
    document.getElementById('menu_contact').style.opacity = 1.0;
    document.getElementById('menu_home').style.opacity    = 0.7;
    document.getElementById('menu_explore').style.opacity = 0.7;
    document.getElementById('menu_faq').style.opacity     = 0.7;
    document.getElementById('menu_home').addEventListener('mouseover', function() {this.style.backgroundColor    = blue_white;});
    document.getElementById('menu_home').addEventListener('mouseout', function() {this.style.backgroundColor     = null;});
    document.getElementById('menu_faq').addEventListener('mouseover', function() {this.style.backgroundColor     = blue_white;});
    document.getElementById('menu_faq').addEventListener('mouseout', function() {this.style.backgroundColor      = null;});
    document.getElementById('menu_explore').addEventListener('mouseover', function() {this.style.backgroundColor = blue_white;});
    document.getElementById('menu_explore').addEventListener('mouseout', function() {this.style.backgroundColor  = null;});
};




// Obtient l'année actuelle
const currentYear = new Date().getFullYear();

// Trouve l'élément avec l'id "year" et met à jour son contenu
document.getElementById('year').textContent = currentYear;


document.getElementById('menu_header').addEventListener('mouseover', function() {
    document.getElementById("menu_title_jet").textContent      = "J";
    document.getElementById("menu_title_emitting").textContent = "E";
    document.getElementById("menu_title_disk").textContent     = "D";

    document.getElementById("menu_title_jet").style.lineHeight      = 1.0;
    document.getElementById("menu_title_emitting").style.lineHeight = 1.0;
    document.getElementById("menu_title_disk").style.lineHeight     = 1.0;
});

document.getElementById('menu_header').addEventListener('mouseout', function() {
    document.getElementById("menu_title_jet").textContent      = "Jet";
    document.getElementById("menu_title_emitting").textContent = "Emitting";
    document.getElementById("menu_title_disk").textContent     = "Disk";

    document.getElementById("menu_title_jet").style.lineHeight      = 1.3;
    document.getElementById("menu_title_emitting").style.lineHeight = 1.3;
    document.getElementById("menu_title_disk").style.lineHeight     = 1.3;
});