////////////////////////////////////
////////////////////////////////////
////////// INITIALISATION //////////
////////////////////////////////////
////////////////////////////////////


///////////////////////////
////////// BOX-1 //////////
///////////////////////////

// Initialisation de l'objet contenant les paramètres séléctionnés par l'utilisateur
var userInput = {
    parameterSpace: {ep: "0.10", alpham: "1.0", chim: "1.0", pm: "1.0", alphap : "0.0"},
    family        : "SM",
    slice         : "xi-mu"
};

// Initialisation des points (ep,alpham,chim,pm,alphap) de l'espace des paramètres (récupéré lors du fetch)
var parameterSpace = null;

// Initialisation des solutions associés aux points (ep,alpham,chim,pm,alphap) de l'espace des paramètres
var solutions = null;

// Hauteur maximale du SVG
const maxHeight = 345;//Math.max(document.getElementById("content-parameter-space-settings").offsetHeight, document.getElementById("content-solution-parameters").offsetHeight);

// Initialisation de l'objet contenant les propriétés du svg associé au scatterplot
var svgScatterPlot = {
    svg       : null,
    dimensions: {height: 1.0*maxHeight, width: 1.1*maxHeight}
};

// Initialisation de l'objet contenant les propriétés du scatterplot
var scatterPlot = {
    plot      : null,
    dimensions: {height: 0.75*svgScatterPlot.dimensions.height, width: 0.75*svgScatterPlot.dimensions.height, margin: 20},
    points    : {points: null, coordinates: {x: null, y: null, z: null}},
    axes      : {axes: null, limits: {xmin: null, xmax: null, ymin: null, ymax: null}, scales: {x: null, y: null}},
    grid      : null
};

// Initialisation de l'objet contenant les propriétés de la colorbar
var colorbar = {
    colorbar     : null,
    dimensions   : {height: scatterPlot.dimensions.height, width: 20, marginLeft: 10, marginRight: 10},
    colormap     : d3.interpolateInferno,
    colorGradient: "color-gradient"
};

// Dimensions totales du plot
const totalPlotWidth  = scatterPlot.dimensions.width + colorbar.dimensions.width + colorbar.dimensions.marginLeft + colorbar.dimensions.marginRight - scatterPlot.dimensions.margin; // - quand c'est à gauche
const totalPlotHeight = scatterPlot.dimensions.height + scatterPlot.dimensions.margin;

const offsetsScatterPlot = {
    height: (svgScatterPlot.dimensions.height-totalPlotHeight)/2,
    width : (svgScatterPlot.dimensions.width-totalPlotWidth)/2
};

// Initialisation des paramètres de la solution survolée
var solutionValues = {
    ep: "―",
    alphap: "―",
    alpham: "―",
    chim: "―",
    pm: "―",
    xi: "―",
    mu: "―",
    p: "―",
    q: "―",
    delta: "―",
    ms: "―",
    alphav: "―",
    kappabp: "―",
    lambdabp: "―",
    omega: "―",
    E: "―",
    xsm: "―",
    xa: "―"
};

// Initialisation des paramètres de la solution sélectionnée
var solutionValuesSelected = {
    ep: null,
    alphap: null,
    alpham: null,
    chim: null,
    pm: null,
    xi: null,
    mu: null,
    p: null,
    q: null,
    delta: null,
    ms: null,
    alphav: null,
    kappabp: null,
    lambdabp: null,
    omega: null,
    E: null,
    xsm: null,
    xa: null
};

//ID de l'élément HTML
const solutionValuesID  = ["ep-value","alpham-value","chim-value","pm-value","alphap-value","xi-value","mu-value","p-value","q-value","delta-value","ms-value","alphav-value","kappabp-value","lambdabp-value","omega-value","E-value","xsm-value","xa-value"];
//Header du fichier .dat
const solutionHeaders   = ["ep","alpha_m","chi_m","Pm","alpha_t","xi","mu","p","q","delta","ms","alpha_v","kappa","lambda","Omega*","E","x_SM","x_A"];
//Précision de chaque paramètres
const solutionPrecision = [2,1,1,1,1,4,4,2,2,2,2,2,4,1,2,1,1,1];


///////////////////////////
////////// BOX-2 //////////
///////////////////////////

const nbPoints = 3000;


var profiles = {
    rho: {},
    P  : {},
    T  : {},
    uz : {},
    ur : {}
};


Object.keys(profiles).forEach((key, index) => {

    // Initialisation de l'objet contenant les propriétés du svg associé au profil
    profiles[key].svgProfile = {
        svg   : null,
        dimensions : {height: 250, width : 250}
    };

    // Initialisation de l'objet contenant les propriétés du profil
    profiles[key].profile = {
        coordinates: {x: null, y: null},
        plot       : null,
        line       : null,
        tooltip    : {tooltip: null, dimensions: {height: 30, width: 70}, coordinates: {x: null, y: null}},
        axes       : {axes: null, limits: {xmin: 0.0, xmax: 20.0, ymin: 0.0, ymax: 1.0}, scales: {x: null, y: null}},
        grid       : null,
        dimensions : {height: 0.70*profiles[key].svgProfile.dimensions.height, width: 0.70*profiles[key].svgProfile.dimensions.height}
    };

    // Initialisation des données (x,y) du profil
    profiles[key].profile.coordinates.x = Array.from({length: nbPoints}, (_, index) => index / (nbPoints-1) * profiles[key].profile.axes.limits.xmax);
    profiles[key].profile.coordinates.y = new Array(nbPoints).fill(0.0);

    // Dimensions totales du plot
    const ticktextWidth = 20;

    const totalProfileWidth  = profiles[key].profile.dimensions.width  - ticktextWidth; // - quand c'est à gauche
    const totalProfileHeight = profiles[key].profile.dimensions.height + ticktextWidth;

    profiles[key].offsetsProfile = {
        height: (profiles[key].svgProfile.dimensions.height-totalProfileHeight)/2,
        width : (profiles[key].svgProfile.dimensions.width-totalProfileWidth)/2
    };
});



//////////////////////////////////////
//////////////////////////////////////
////////// DOM MANIPULATION //////////
//////////////////////////////////////
//////////////////////////////////////


///////////////////////////
////////// BOX-1 //////////
///////////////////////////

// Initialisation des couleurs des boutons super-SM et super-A
document.getElementById('button-sm').style.backgroundColor = black;
document.getElementById('button-sm').style.color           = white;
document.getElementById('button-a').style.backgroundColor  = blue_white;
document.getElementById('button-a').style.color            = black;
document.getElementById('button-sm').addEventListener('mouseout', function() {this.style.backgroundColor  = black;});
document.getElementById('button-sm').addEventListener('mouseover', function() {this.style.backgroundColor = light_black;});
document.getElementById('button-a').addEventListener('mouseout', function() {this.style.backgroundColor   = blue_white;});
document.getElementById('button-a').addEventListener('mouseover', function() {this.style.backgroundColor  = blue_gray;});




// Initialisation des couleurs couleur des boutons xi(mu) et lambda(kappa)
document.getElementById('button-xi-mu').style.backgroundColor        = black;
document.getElementById('button-xi-mu').style.color                  = white;
document.getElementById('button-lambda-kappa').style.backgroundColor = blue_white;
document.getElementById('button-lambda-kappa').style.color           = black;
document.getElementById('button-xi-mu').addEventListener('mouseout', function() {this.style.backgroundColor         = black;});
document.getElementById('button-xi-mu').addEventListener('mouseover', function() {this.style.backgroundColor        = light_black;});
document.getElementById('button-lambda-kappa').addEventListener('mouseout', function() {this.style.backgroundColor  = blue_white;});
document.getElementById('button-lambda-kappa').addEventListener('mouseover', function() {this.style.backgroundColor = blue_gray;});

// Initialisation des textes des sliders
document.getElementById("ep-value-slider").textContent     = userInput.parameterSpace.ep;
document.getElementById("alpham-value-slider").textContent = userInput.parameterSpace.alpham;
document.getElementById("chim-value-slider").textContent   = userInput.parameterSpace.chim;
document.getElementById("pm-value-slider").textContent     = userInput.parameterSpace.pm;
document.getElementById("alphap-value-slider").textContent = userInput.parameterSpace.alphap;

// Initialisation des valeurs des sliders
document.getElementById("slider-ep").value     = userInput.parameterSpace.ep;
document.getElementById("slider-alpham").value = userInput.parameterSpace.alpham;
document.getElementById("slider-chim").value   = userInput.parameterSpace.chim;
document.getElementById("slider-pm").value     = userInput.parameterSpace.pm;
document.getElementById("slider-alphap").value = userInput.parameterSpace.alphap;

// Label des axes
document.getElementById('parameter_space_label_x2').style.display = 'none';
document.getElementById('parameter_space_label_y2').style.display = 'none';
document.getElementById('parameter_space_label_z2').style.display = 'none';

// Affichage de la solution sélectionnée
Object.keys(solutionValues).forEach((key, index) => { document.getElementById(solutionValuesID[index]).textContent = solutionValues[key] });


console.log(solutionValuesSelected);





(async () => {

    // Récupération des points de l'espace des paramètres
    parameterSpace = await fetch_parameter_space();

    // Récupération des solutions associés aux points de l'espace des paramètres
    solutions = await fetch_solutions(userInput.parameterSpace, userInput.family);



    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////
    ////////// INITIALISATION AFTER FETCHING //////////
    ///////////////////////////////////////////////////
    ///////////////////////////////////////////////////

    ///////////////////////////
    ////////// BOX-1 //////////
    ///////////////////////////

    // Initialisation des coordonnées des points du plot et des limites des axes
    if (userInput.slice == "xi-mu") {
        scatterPlot.points.coordinates.x = solutions["mu"];
        scatterPlot.points.coordinates.y = solutions["xi"];
        scatterPlot.points.coordinates.z = solutions["p"];
        scatterPlot.axes.limits.xmin = -5;
        scatterPlot.axes.limits.xmax = 3;
        scatterPlot.axes.limits.ymin = -6;
        scatterPlot.axes.limits.ymax = 3;
    } else if (userInput.slice == "lambda-kappa") {
        scatterPlot.points.coordinates.x = solutions["kappa"];
        scatterPlot.points.coordinates.y = solutions["lambda"];
        scatterPlot.points.coordinates.z = solutions["Omega*"];
        scatterPlot.axes.limits.xmin = -5;
        scatterPlot.axes.limits.xmax = 3;
        scatterPlot.axes.limits.ymin = -1;
        scatterPlot.axes.limits.ymax = 5;
    }



    //////////////////////////////////////
    //////////////////////////////////////
    ////////// DOM MANIPULATION //////////
    //////////////////////////////////////
    //////////////////////////////////////

    ///////////////////////////
    ////////// BOX-1 //////////
    ///////////////////////////

    // Valeurs min des sliders
    document.getElementById("slider-ep").min     = Math.min(...parameterSpace.ep.map(parseFloat));
    document.getElementById("slider-alpham").min = Math.min(...parameterSpace.alpham.map(parseFloat));
    document.getElementById("slider-chim").min   = Math.min(...parameterSpace.chim.map(parseFloat));
    document.getElementById("slider-pm").min     = Math.min(...parameterSpace.pm.map(parseFloat));
    document.getElementById("slider-alphap").min = Math.min(...parameterSpace.alphap.map(parseFloat));

    // Valeurs max des sliders
    document.getElementById("slider-ep").max     = Math.max(...parameterSpace.ep.map(parseFloat));
    document.getElementById("slider-alpham").max = Math.max(...parameterSpace.alpham.map(parseFloat));
    document.getElementById("slider-chim").max   = Math.max(...parameterSpace.chim.map(parseFloat));
    document.getElementById("slider-pm").max     = Math.max(...parameterSpace.pm.map(parseFloat));
    document.getElementById("slider-alphap").max = Math.max(...parameterSpace.alphap.map(parseFloat));

    //// Slider 1D profile centré
    //const carouselContainer = document.querySelector('.carousel-container');
    //const centerPosition = (carouselContainer.scrollWidth - carouselContainer.clientWidth) / 2;
    //carouselContainer.scrollLeft = centerPosition;



    ///////////////////////////////////////
    ///////////////////////////////////////
    ////////// PLOT DES ÉLÉMENTS //////////
    ///////////////////////////////////////
    ///////////////////////////////////////

    // Sélectionne l'élément "#plot" du DOM et y ajoute l'élément SVG pour pouvoir ajouter les éléments du plot
    svgScatterPlot.svg = svg_create("#parameter_space_scatterplot", svgScatterPlot.dimensions);

    // Plot des axes x, y et de la grille sur le SVG
    [scatterPlot.plot, scatterPlot.axes.scales.x, scatterPlot.axes.scales.y, scatterPlot.grid, scatterPlot.axes.axes] = axes_create(svgScatterPlot.svg, scatterPlot.dimensions, offsetsScatterPlot, scatterPlot.axes.limits);

    // Plot des points sur le SVG
    scatterPlot.points.points = points_plot(scatterPlot.plot, scatterPlot.axes.scales, scatterPlot.points.coordinates, colorbar.colormap, solutions, solutionValues, solutionValuesSelected, solutionValuesID, solutionHeaders, solutionPrecision, userInput.parameterSpace, userInput.family, solutionValuesSelected);

    // Plot de la colorbar sur le SVG
    colorbar.colorbar = colorbar_create(scatterPlot.plot, scatterPlot.dimensions, colorbar.dimensions, colorbar.colormap, colorbar.colorGradient, scatterPlot.points.coordinates);
})();










Object.keys(profiles).forEach((key, index) => {

    // Sélectionne l'élément "#profile_rho" du DOM et y ajoute l'élément SVG pour pouvoir ajouter les éléments du plot
    profiles[key].svgProfile.svg = svg_create("#profile_" + key, profiles[key].svgProfile.dimensions);

    // Plot des axes x, y et de la grille sur le SVG
    [profiles[key].profile.plot, profiles[key].profile.axes.scales.x, profiles[key].profile.axes.scales.y, profiles[key].profile.grid, profiles[key].profile.axes.axes] = axes_create(profiles[key].svgProfile.svg, profiles[key].profile.dimensions, profiles[key].offsetsProfile, profiles[key].profile.axes.limits);

    // Plot de la courbe sur le SVG
    profiles[key].profile.line = line_plot(profiles[key].profile.plot, profiles[key].profile.axes.scales, profiles[key].profile.coordinates);

    // Plot du tooltip sur le SVG
    profiles[key].profile.tooltip.tooltip = tooltip_plot(profiles[key].profile.plot, profiles[key].profile.tooltip.dimensions, profiles[key].profile.axes.scales, profiles[key].profile.coordinates, profiles[key].profile.tooltip.coordinates, profiles[key].profile.dimensions);

});












///////////////////////////////
///////////////////////////////
////////// FONCTIONS //////////
///////////////////////////////
///////////////////////////////

/////////////////////////////////////
////////// FONCTIONS FETCH //////////
/////////////////////////////////////

async function fetch_data(url) {
    // fonction retournant un objet contenant les données d'un fichier texte constitué de colonnes de floats, avec un header pour spécifier la signification de chaque colonne

    // Récupération des solutions
    const dataRaw  = await fetch(url);
    const dataText = await dataRaw.text();

    // Récupération des lignes et des headers
    const lines   = dataText.split('\n');
    const headers = lines[0].trim().split(/\s+/);

    // Initialisation de l'objet pour stocker les solutions
    const data = {};

    // Création d'une entrée pour chaque header dans l'objet columns
    headers.forEach(header => { data[header] = []; });

    // Parcours des lignes restantes pour extraire les données
    for (let i = 1; i < lines.length; i++) {
        // Division de la ligne en valeurs individuelles
        const values = lines[i].trim().split(/\s+/);
        
        // Ajout de chaque valeur à la colonne correspondante
        headers.forEach((header, index) => { data[header].push(parseFloat(values[index])); });
    }

    return data;
};

async function fetch_parameter_space() {
    /*
     * Fonction asynchrone permettant d'obtenir un objet contenant les points de l'espace des
     * paramètres.
     * 
     * Cette fonction récupère les listes des paramètres constituant l'espace des paramètres des
     * solutions MHD via un fetch. Elle crée un objet contenant l'ensemble de l'espace des paramètres et
     * le retourne.
     * 
     * Returns parameterSpace {Promise<Object>} - Objet contenant l'espace des paramètres :
     *                                            ep     {string[]} - Liste des valeurs de "ep".
     *                                            alpham {string[]} - Liste des valeurs de "alpham".
     *                                            chim   {string[]} - Liste des valeurs de "chim".
     *                                            pm     {string[]} - Liste des valeurs de "pm".
     *                                            alphap {string[]} - Liste des valeurs de "alphap".
     *
     * Throws {Error} - En cas d'échec lors du chargement des données, une erreur est loggée dans la console.
     */
    try {

        // Fetch des listes contenant l'espace des paramètres (dans le futur cette fonction ira fetch un fichier contenant les const suivantes.)
        const ep     = ["0.01", "0.10", "0.50"];
        const alpham = ["1.0"];
        const chim   = ["1.0"];
        const pm     = ["1.0"];
        const alphap = ["0.0", "1.0", "2.0", "3.0", "4.0", "5.0", "6.0", "7.0", "8.0", "9.0", "10.0"];

        // Initialisation de l'objet contenant l'espace des paramètres
        const parameterSpace = {
            ep,
            alpham,
            chim,
            pm,
            alphap
        };

        // Retourne l'espace des paramètres
        return parameterSpace;

    } catch (error) { console.error('Erreur lors du chargement du fichier:', error); }
};

async function fetch_solutions(parameterSpaceInput, familyInput) {
    /*
     * Fonction asynchrone permettant d'obtenir un objet contenant les solutions des points
     * (ep,alpham,chim,pm,alphap) de l'espace des paramètres.
     * 
     * Cette fonction génère une URL basée sur les paramètres fournis, récupère un fichier de données à
     * partir de cette URL, et traite le fichier pour extraire les solutions des points
     * (ep,alpham,chim,pm,alphap) de l'espace des paramètres.
     * 
     * params * parameterSpaceInput {Object} - Objet contenant l'espace des paramètres :
     *                                       ep     {string[]} - Liste des valeurs de "ep".
     *                                       alpham {string[]} - Liste des valeurs de "alpham".
     *                                       chim   {string[]} - Liste des valeurs de "chim".
     *                                       pm     {string[]} - Liste des valeurs de "pm".
     *                                       alphap {string[]} - Liste des valeurs de "alphap".
     * 
     *        * userInput.family {string} - Famille des solutions à laquelle appartient l'espace des
     *                                 paramètres.
     *
     * returns * solutions {Promise<Object>} - Une promesse qui résout avec un objet contenant les
     *                                         solutions pour chaque paramètre, où chaque clé est un
     *                                         nom de colonne (header) et la valeur est un tableau de
     *                                         données numériques pour cette colonne.
     * 
     * throws {Error} - En cas d'erreur lors du chargement ou du traitement du fichier de données, une erreur est loggée dans la console.
     */

    try {

        // Déstructuration de l'objet pour obtenir les variables
        const {ep: ep, alpham: alpham, chim: chim, pm: pm, alphap: alphap} = parameterSpaceInput;
        
        // Initialisation de l'url contenant les solutions de l'espace des paramètres
        const parameterSpacePath = familyInput + "_" + ep + "_" + alpham + "_" + chim + "_" + pm + "_" + alphap + "_" + "-2.0_-2.0_-2.0_-2.0";
        const parameterSpaceUrl = "https://raw.githubusercontent.com/nathanzimniak/maes_data/main/MHD_solutions/" + parameterSpacePath + "/" + parameterSpacePath + ".dat";

        // Récupération des solutions
        const solutions = await fetch_data(parameterSpaceUrl)

        return solutions;

    } catch (error) { console.error('Erreur lors du chargement du fichier:', error); }
};

async function fetch_solution(parameterSpaceInput, familyInput, solutionValuesSelected) {

    // Déstructuration des objets pour obtenir les variables
    const {ep: ep, alpham: alpham, chim: chim, pm: pm, alphap: alphap} = parameterSpaceInput;
    const {xi: xi, mu: mu, p: p} = solutionValuesSelected;

    const parameterSpacePath = familyInput + "_" + ep + "_" + alpham + "_" + chim + "_" + pm + "_" + alphap + "_" + "-2.0_-2.0_-2.0_-2.0";
    const solutionPath = parameterSpacePath + "_" + xi + "_" + mu + "_" + p;

    // Initialisation de l'url de l'image
    const imageUrl = "https://github.com/nathanzimniak/maes_data/blob/main/MHD_solutions/" + parameterSpacePath + "/" + solutionPath + ".png?raw=true";
    const imageUrl1 = "https://github.com/nathanzimniak/maes_data/blob/main/MHD_solutions/A_0.10_1.0_1.0_1.0_0.0_-2.0_-2.0_-2.0_-2.0/A_0.10_1.0_1.0_1.0_0.0_-2.0_-2.0_-2.0_-2.0_0.0056_0.6836_3.30.png?raw=true";
    //const imageUrl2 = "./assets/img/A_0.10_1.0_1.0_1.0_0.0_-2.0_-2.0_-2.0_-2.0_0.0056_0.6836_3.30.png";

    // Initialisation de l'url de la solution
    const solutionUrl = "https://raw.githubusercontent.com/nathanzimniak/maes_data/main/MHD_solutions/" + parameterSpacePath + "/" + solutionPath + ".dat";
    const solutionUrl1 = "https://raw.githubusercontent.com/nathanzimniak/maes_data/main/MHD_solutions/A_0.10_1.0_1.0_1.0_0.0_-2.0_-2.0_-2.0_-2.0/A_0.10_1.0_1.0_1.0_0.0_-2.0_-2.0_-2.0_-2.0_0.0056_0.6836_3.30.dat";

    // Récupération des profils de la solution
    const solution = await fetch_data(solutionUrl1);

    return [imageUrl1, solution];
};

////////////////////////////////////
////////// FONCTIONS PLOT //////////
////////////////////////////////////

function svg_create(svgDivID, svgDimensions) {
    //
    // Création d'un élément SVG.
    //
    // @param {string}         svgDivID      - Identifiant de la div contenant le SVG à créer
    // @param {object, floats} svgDimensions - Dimensions du SVG à créer
    //
    // @returns {d3js object} svg - Élément SVG
    //

    // Déstructuration de l'objet pour obtenir les variables
    const {height: svgHeight, width: svgWidth} = svgDimensions;

    // Initialisation de l'élément SVG
    const svg = d3.select(svgDivID)
                .append("svg")
                .attr("height", svgHeight)
                .attr("width", svgWidth);

    // Retour de l'élément SVG
    return svg;
};

function axes_create(svg, plotDimensions, offsets, axisLimits) {
    //
    // Création d'un plot contenant des axes et une grille dans un élément SVG.
    //
    // @param {d3.selection}  svg             - Élément SVG
    // @param {object, floats} plotDimensions - Dimensions du plot à créer
    // @param {object, floats} offsets        - Dimensions de l'offset
    // @param {object, floats} axisLimits     - Limites des axes
    //
    // @returns {d3js object} plot   - Plot
    // @returns {d3js object} xScale - Échelle de l'axe x
    // @returns {d3js object} yScale - Échelle de l'axe y
    // @returns {d3js object} axis   - Axes du plot
    // @returns {d3js object} grid   - Grille du plot
    //

    // Déstructuration des objets pour obtenir les variables
    const {height: plotHeight, width: plotWidth} = plotDimensions;
    const {height: offsetHeight, width: offsetWidth} = offsets;
    const {xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax} = axisLimits;

    // Ajout du plot dans le SVG et le centre
    const plot = svg.append("g")
                    .attr("transform", "translate(" + offsetWidth + "," + offsetHeight + ")");

    // Ajout des axes
    const xScale = d3.scaleLinear()
               .domain([xmin, xmax])
               .range([0, plotWidth]);

    const yScale = d3.scaleLinear()
               .domain([ymin, ymax])
               .range([plotHeight, 0]);

    const axis = plot.append("g")
                     .attr("class", "axis");

    axis.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + plotHeight + ")")
        .call(d3.axisBottom(xScale))
        .style("pointer-events", "none")
        .style("opacity", 1.0);
    axis.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0," + 0 + ")")
        .call(d3.axisLeft(yScale))
        .style("pointer-events", "none")
        .style("opacity", 1.0);

    // Retrait des ticks intermédiaires
    axis.selectAll(".x.axis text")
        .filter(function(d, i) { return i % 2 !== 0; })
        .remove();
    axis.selectAll(".y.axis text")
        .filter(function(d, i) { return i % 2 !== 0; })
        .remove();

    // Change la taille des ticks labels
    axis.selectAll(".x.axis text")
        .style("font-size", "12px")
        .style("pointer-events", "none");
    axis.selectAll(".y.axis text")
        .style("font-size", "12px")
        .style("pointer-events", "none");

    // Enlève le texte des axes opposés
    axis.selectAll(".x.axis.top text")
        .style("display", "none");
    axis.selectAll(".y.axis.right text")
        .style("display", "none");

    // Ajout d'une grille
    const grid = plot.append("g")
                     .attr("class", "grid");

    grid.append("g")
        .attr("class", "grid")
        .style("opacity", 0.07)
        .attr("transform", "translate(0," + plotHeight + ")")
        .call(d3.axisBottom(xScale).tickSize(-plotHeight).tickFormat(""))
        .style("pointer-events", "none");
    grid.append("g")
        .attr("class", "grid")
        .style("opacity", 0.07)
        .call(d3.axisLeft(yScale).tickSize(-plotWidth).tickFormat(""))
        .style("pointer-events", "none");

    return [plot, xScale, yScale, axis, grid];
};

function points_plot(plot, axisScales, pointCoordinates, colormap, solutions, solutionValues, solutionValuesSelected, solutionValuesID, solutionHeaders, solutionPrecision, parameterSpaceInput, familyInput) {
    // axisScales objet contenant les échelles des axes xscale, yscale
    // pointCoordinates objet contenant les coordonnées x,y,z

    const {x: xScale, y: yScale} = axisScales;
    let {x: x, y: y, z: z}       = pointCoordinates;

    x = x.map(Math.log10);
    y = y.map(Math.log10);

    // Initialisation de l'échelle de couleur des points
    const colorScale = d3.scaleSequential(colormap)
                       .domain([d3.min(z), d3.max(z)]);

    // Plot les points
    const circles = plot.selectAll("circle")
                        .data(x)
                        .enter()
                        .append("circle")
                        .attr("r", 5)
                        .attr("cx", function(d, i) { return xScale(x[i]); })
                        .attr("cy", function(d, i) { return yScale(y[i]); })
                        .style("fill", function(d, i) { return colorScale(z[i]); })
                        .each(function(d, i) {
                            // Survol du curseur sur un point
                            this.addEventListener("mouseover", function() {
                            
                                // Update le texte des paramètres de la solution avec les paramètres de la solution survolée
                                d3.select(this).style("cursor", "pointer");
                            
                                Object.keys(solutionValues).forEach((key, index) => {
                                    solutionValues[key] = solutions[solutionHeaders[index]][i]; //exemple : solutionValues["ep"] = data[solutionHeaders[0]][i];
                                    document.getElementById(solutionValuesID[index]).textContent = parseFloat(solutionValues[key]).toFixed(solutionPrecision[index]); //exemple : document.getElementById(solutionValuesID[0]).textContent = parseFloat(solutionValues["ep"]).toFixed(solutionPrecision[0]);
                                });
                            
                                // Agrandit le point survolé
                                d3.select(this)
                                  .attr("r", 7);
                            });
                        
                            // Arrêt du survol du curseur
                            this.addEventListener("mouseout", function() {
                            
                                //Si le point sélectionné est survolé, ne rien faire
                                if (solutionValuesSelected["xi"] == solutions["xi"][i] && solutionValuesSelected["mu"] == solutions["mu"][i] && solutionValuesSelected["p"] == solutions["p"][i]) { return };

                                //Si aucun point n'est sélectionné, chaque point n'étant plus survolé diminue + il n'y a aucun paramètre affiché lorsque aucun point n'est survolé
                                //Si un point est sélectionné, il ne diminue pas lors d'un survol et garder ses paramètres affichés lorsque aucun point n'est survolé
                                if (solutionValuesSelected["xi"] == null && solutionValuesSelected["mu"] == null && solutionValuesSelected["p"] == null) {
                                
                                    // Reset le texte des paramètres de la solution
                                    Object.keys(solutionValues).forEach((key, index) => {
                                        solutionValues[key] = "―"; //exemple : solutionValues["ep"] = "-";
                                        document.getElementById(solutionValuesID[index]).textContent = solutionValues[key]; //exemple : document.getElementById(solutionValuesID[0]).textContent = solutionValues["ep"];
                                    });
                                
                                    // Reset la taille du point
                                    d3.select(this)
                                      .transition()
                                      .duration(200)
                                      .attr("r", 5);
                                
                                } else {
                                    // Update le texte des paramètres de la solution sélectionnée
                                    Object.keys(solutionValuesSelected).forEach((key, index) => { document.getElementById(solutionValuesID[index]).textContent = parseFloat(solutionValuesSelected[key]).toFixed(solutionPrecision[index]) }); //exemple : document.getElementById(solutionValuesID[0]).textContent = parseFloat(solutionValuesSelected["epSelect"]).toFixed(solutionPrecision[0]);
                                
                                    // Reset la taille du point
                                    d3.select(this)
                                      .transition()
                                      .duration(200)
                                      .attr("r", 5);
                                }
                            });
                        
                            // Clic sur un point
                            this.addEventListener("click", async function() {
                            
                                // On réinitialise les tailles si un point est déjà cliqué
                                plot.selectAll("circle").attr("r", 5);
                                // Agrandit le point cliqué
                                d3.select(this).attr("r", 7);
                                // Update les valeurs des paramètres de la solution sélectionnée
                                Object.keys(solutionValuesSelected).forEach((key, index) => { solutionValuesSelected[key] = solutions[solutionHeaders[index]][i] }); //exemple : solutionValuesSelected["epSelect"] = data[solutionHeaders[0]][i];
                                
                                ////// Afficher le sablier
                                document.getElementById('loading').style.display = 'block';

                                // Récupération de l'image 3D et des profiles 1D
                                const [imageUrl, solution] = await fetch_solution(parameterSpaceInput, familyInput, solutionValuesSelected);

                                // Update de l'image
                                document.getElementById('threed-image').style.backgroundImage = 'url(' + imageUrl + ')';

                                // Update des profils 1D
                                Object.keys(profiles).forEach((key, index) => {

                                    // Récupération du profil 1D
                                    profiles[key].profile.coordinates.x = solution.x;
                                    profiles[key].profile.coordinates.y = solution[key];

                                    // Update des limites de l'axe Y
                                    const padding = 0.2;
                                    const [minY, maxY] = compute_axis_lim(profiles[key].profile.coordinates.y, padding);
                                    profiles[key].profile.axes.limits.ymin = minY;
                                    profiles[key].profile.axes.limits.ymax = maxY;
                                
                                    // Update des axes x, y et de la grille sur le SVG
                                    profiles[key].profile.plot.remove();
                                    [profiles[key].profile.plot, profiles[key].profile.axes.scales.x, profiles[key].profile.axes.scales.y, profiles[key].profile.grid, profiles[key].profile.axes.axes] = axes_create(profiles[key].svgProfile.svg, profiles[key].profile.dimensions, profiles[key].offsetsProfile, profiles[key].profile.axes.limits);

                                    // Update de la courbe sur le SVG
                                    profiles[key].profile.line.remove()
                                    profiles[key].profile.line = line_plot(profiles[key].profile.plot, profiles[key].profile.axes.scales, profiles[key].profile.coordinates);

                                    // Plot du tooltip sur le SVG
                                    profiles[key].profile.tooltip.tooltip.remove()
                                    profiles[key].profile.tooltip.tooltip = tooltip_plot(profiles[key].profile.plot, profiles[key].profile.tooltip.dimensions, profiles[key].profile.axes.scales, profiles[key].profile.coordinates, profiles[key].profile.tooltip.coordinates, profiles[key].profile.dimensions);
                                });

                                ////// Cacher le sablier
                                document.getElementById('loading').style.display = 'none';
                            });
                        });
    return circles;
};

function colorbar_create(plot, plotDimensions, colorbarDimensions, colormap, colorGradient, pointCoordinates) {
    // plotDimensions objet contenant les dimensions du plot à créer
    // colorbarDimensions objet contenant les dimensions de la colorbar
    // pointCoordinates objet contenant les coordonnées x,y,z

    const {width: plotWidth} = plotDimensions;
    const {width: colorbarWidth, height: colorbarHeight, marginLeft: colorbarLeftMargin, marginRight: colorbarRightMargin} = colorbarDimensions;
    const {z: z} = pointCoordinates;


    // Ajout du groupe colorbar dans le groupe plot
    const colorbar = plot.append("g")
                         .attr("transform", "translate(" + (colorbarLeftMargin + plotWidth) + "," + 0 + ")");

    // Initialisation de l'échelle de couleur
    const colorbarScale = d3.scaleSequential(colormap)
                            .domain([d3.max(z), d3.min(z)]);

    // Initialisation des ticks
    const ticks = [d3.min(z), (d3.min(z) + d3.max(z))/2, d3.max(z)];

    // Initialisation de l'échelle des ticks
    const tickScale = d3.scaleLinear()
                        .domain([d3.max(z), d3.min(z)])
                        .range([0, colorbarHeight]);

    // Plot du rectangle de gradient
    colorbar.append("rect")
            .attr("width", colorbarWidth)
            .attr("height", colorbarHeight)
            .style("fill", 'url(#' + colorGradient + ')');

    // Plot du gradient de couleur
    colorbar.append("linearGradient")
            .attr("id", colorGradient)
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%")
            .selectAll("stop")
            .data(d3.range(d3.min(z), d3.max(z) + (d3.max(z) - d3.min(z)) / 10, (d3.max(z) - d3.min(z)) / 10)) // Utilisez le domaine actualisé
            .enter()
            .append("stop")
            .attr("offset", function(d) { return ((d - d3.min(z)) / (d3.max(z) - d3.min(z)) * 100) + "%"; }) // Utilisez le domaine actualisé
            .attr("stop-color", function(d) { return colorbarScale(d); });

    // Plot du contour de la colorbar
    colorbar.append("rect")
        .attr("width", colorbarWidth)
        .attr("height", colorbarHeight)
        .style("fill", "none") // Assurez-vous que le rectangle n'a pas de remplissage
        .style("stroke", "black") // Couleur de la bordure
        .style("stroke-width", 1); // Épaisseur de la bordure

    // Plot des ticks
    colorbar.selectAll(".tick")
            .data(ticks)
            .enter().append("line")
            .attr("class", "tick")
            .attr("x1", colorbarWidth)
            .attr("x2", colorbarWidth + 5)
            .attr("y1", function(d) { return tickScale(d); })
            .attr("y2", function(d) { return tickScale(d); })
            .style("stroke", "black")
            .style("opacity", 1.0);
    
    // Plot des labels des ticks
    colorbar.selectAll(".tick-label")
            .data(ticks)
            .enter().append("text")
            .attr("class", "tick-label")
            .attr("x", colorbarWidth + colorbarRightMargin)
            .attr("y", function(d) { return tickScale(d); })
            .attr("dy", 3)
            .style("font-size", "14px")
            .text(function(d) { return d.toFixed(2); })
            .style("opacity", 1.0);

    colorbar.selectAll(".tick-label")
            .style("font-size", "12px");

    //// Plot du label de la colorbar
    //colorbar.append("text")
    //        .attr("class", "y label")
    //        .attr("text-anchor", "middle")
    //        .attr("width",100)
    //        .attr("height",100)
    //        .attr("x", (0.5)*colorbarDimensions.width)
    //        .attr("y", -10)
    //        .text(axesZlabel);

    return colorbar;
};

function line_plot(plot, axisScales, pointCoordinates) {
    // axisScales objet contenant les échelles des axes xscale, yscale
    // pointCoordinates objet contenant les coordonnées x,y,z

    const {x: xScale, y: yScale} = axisScales;
    const {x: x, y: y}           = pointCoordinates;

    // Ajout de la courbe
    const line = plot.append('g')
                     .append("path")
                     .datum(x)
                     .attr("d", d3.line()
                                  .x(function(d, i) { return xScale(x[i]); })
                                  .y(function(d, i) { return yScale(y[i]); })
                     )
                     .attr("stroke", light_black)
                     .style("stroke-width", 4)
                     .style("fill", "none")
                     .style("opacity", 1.0);

    return line;
};

function tooltip_plot(plot, tooltipDimensions, axisScales, pointCoordinates, tooltipCoordinates, profileDimensions) {
    // tooltipDimensions objet contenant les dimensions du tooltip
    // axisScales objet contenant les échelles des axes xscale, yscale
    // pointCoordinates objet contenant les coordonnées x,y,z
    // tooltipCoordinates objet contenant les dimensions du tooltip
    // profileDimensions objet contenant les dimensions du profil

    const {width: tooltipWidth, height: tooltipHeight} = tooltipDimensions;
    const {x: xScale, y: yScale}                       = axisScales;
    const {x: x, y: y}                                 = pointCoordinates;
    let {x: tooltipx, y: tooltipy}                     = tooltipCoordinates;
    const {width: profileWidth, height: profileHeight} = profileDimensions;

    const tooltip = plot.append('g')
                        .append('foreignObject')
                        .attr('class', 'tooltip')
                        .attr('width', tooltipWidth)
                        .attr('height', tooltipHeight)
                        .style('display', 'block');

    // Paramètres du texte dans le tooltip
    tooltip.append('xhtml:div')
           .attr('class', 'tooltip-content')
           .style('font-size', '12px')
           .style('text-align', 'center')
           .style('color', light_black)
           .style('opacity', 0.6);


    // Curseur dans le plot
    plot.on('mousemove', function(event) {
        const [xPos, yPos] = d3.pointer(event);
        const xValue = xScale.invert(xPos);
        const yValue = yScale.invert(yPos);

        const xLine = x[x.reduce((acc, val, idx) => Math.abs(val - xValue) < Math.abs(x[acc] - xValue) ? idx : acc, 0)];
        const yLine = y[x.reduce((acc, val, idx) => Math.abs(val - xValue) < Math.abs(x[acc] - xValue) ? idx : acc, 0)];

        if (xScale(xLine) < tooltipWidth / 2)                          {tooltipx = xScale.range()[0] + 0;}
        else if (xScale.range()[1] - xScale(xLine) < tooltipWidth / 2) {tooltipx = xScale.range()[1] - tooltipWidth;}
        else                                                           {tooltipx = xScale(xLine) - tooltipWidth / 2;}

        tooltipy = 0.1 * tooltipHeight;

        tooltip.attr('transform', "translate(" + (tooltipx) + "," + (tooltipy) + ")");
        tooltip.select('.tooltip-content').html("(" + xLine.toFixed(2) + " ; " + yLine.toFixed(2) + ")");
        tooltip.style('display', 'block');

        plot.selectAll('.line').remove();
        plot.selectAll('.circle').remove();

        plot.append('line')
                    .attr('class', 'line')
                    .attr('x1', xScale(xLine))
                    .attr('y1', 0.7 * tooltipHeight)
                    .attr('x2', xScale(xLine))
                    .attr('y2', yScale.range()[0]) // Longueur du trait
                    .attr('stroke', light_black)
                    .style('opacity', 0.6)
                    .style('stroke-dasharray', '2,2')
                    .style("pointer-events", "none");

        plot.append("circle")
                    .attr('class', 'circle')
                    .attr("cx", xScale(xLine))
                    .attr("cy", yScale(yLine))
                    .attr("r", 3)
                    .style("fill", "white")
                    .style("stroke", light_black)
                    .style("stroke-width", 2)
                    .style("pointer-events", "none");
    });

    // Curseur hors du plot
    plot.on('mouseout', function() {
        tooltip.style('display', 'none');
        plot.selectAll('.line').remove();
        plot.selectAll('.circle').remove();
    });

    // Ajoute un rectangle pour couvrir tout le plot et permettre au tooltip d'exister dans tout le plot
    plot.append("rect")
                .attr("width", profileWidth)
                .attr("height", profileHeight)
                .style("opacity", 0);


    return tooltip;
};


///////////////////////////////////////////
////////// FONCTIONS INTERACTION //////////
///////////////////////////////////////////

async function update_solution_type(family) {
    //
    // Met à jour l'espace de paramètres affiché dans le graphique et les données associées.
    // @param {string} space - Le nouvel espace de paramètres ("xi-mu" pour (xi, mu), "lambda-kappa" pour (lambda, kappa)).
    //

    // Update du bouton plan espace des paramètres et update de data
    if (family == "superSM") {

        userInput.family = "SM";

        // Couleur des boutons super-SM et super-A
        document.getElementById('button-sm').style.backgroundColor = black;
        document.getElementById('button-sm').style.color           = white;
        document.getElementById('button-a').style.backgroundColor  = blue_white;
        document.getElementById('button-a').style.color            = black;
        document.getElementById('button-sm').addEventListener('mouseout', function() {this.style.backgroundColor = black;});
        document.getElementById('button-sm').addEventListener('mouseover', function() {this.style.backgroundColor = light_black;});
        document.getElementById('button-a').addEventListener('mouseout', function() {this.style.backgroundColor = blue_white;});
        document.getElementById('button-a').addEventListener('mouseover', function() {this.style.backgroundColor = blue_gray;});

    } else if (family == "superA") {

        userInput.family = "A";

        // Couleur des boutons super-SM et super-A
        document.getElementById('button-sm').style.backgroundColor = blue_white;
        document.getElementById('button-sm').style.color           = black;
        document.getElementById('button-a').style.backgroundColor  = black;
        document.getElementById('button-a').style.color            = white;
        document.getElementById('button-sm').addEventListener('mouseout', function() {this.style.backgroundColor = blue_white;});
        document.getElementById('button-sm').addEventListener('mouseover', function() {this.style.backgroundColor = blue_gray;});
        document.getElementById('button-a').addEventListener('mouseout', function() {this.style.backgroundColor = black;});
        document.getElementById('button-a').addEventListener('mouseover', function() {this.style.backgroundColor = light_black;});

    };

    // Récupération des paramètres associés aux points de l'espace des paramètres
    solutions = await fetch_solutions(userInput.parameterSpace, userInput.family);

    // Mise-à-jour des coordonnées des points du plot
    if (userInput.slice == "xi-mu") {
        scatterPlot.points.coordinates.x = solutions["mu"];
        scatterPlot.points.coordinates.y = solutions["xi"];
        scatterPlot.points.coordinates.z = solutions["p"];
    } else if (userInput.slice == "lambda-kappa") {
        scatterPlot.points.coordinates.x = solutions["kappa"];
        scatterPlot.points.coordinates.y = solutions["lambda"];
        scatterPlot.points.coordinates.z = solutions["Omega*"];
    }

    // Mise-à-jour des points sur le SVG
    scatterPlot.points.points.remove();
    scatterPlot.points.points = points_plot(scatterPlot.plot, scatterPlot.axes.scales, scatterPlot.points.coordinates, colorbar.colormap, solutions, solutionValues, solutionValuesSelected, solutionValuesID, solutionHeaders, solutionPrecision, userInput.parameterSpace, userInput.family, solutionValuesSelected);

    //  Mise-à-jour de la colorbar sur le SVG
    colorbar.colorbar.remove();
    colorbar.colorbar = colorbar_create(scatterPlot.plot, scatterPlot.dimensions, colorbar.dimensions, colorbar.colormap, colorbar.colorGradient, scatterPlot.points.coordinates);

    // Reset les valeurs des paramètres de la solution
    Object.keys(solutionValuesSelected).forEach((key, index) => {
        solutionValuesSelected[key] = null; //exemple : solutionValues["ep"] = "-";
    });

    // Reset le texte des paramètres de la solution
    Object.keys(solutionValues).forEach((key, index) => {
        solutionValues[key] = "―"; //exemple : solutionValues["ep"] = "-";
        document.getElementById(solutionValuesID[index]).textContent = solutionValues[key]; //exemple : document.getElementById(solutionValuesID[0]).textContent = solutionValues["ep"];
    });

    // Reset de l'image
    document.getElementById('threed-image').style.backgroundImage = null;

    // Reset des profils 1D
    Object.keys(profiles).forEach((key, index) => {
        // Récupération du profil 1D
        profiles[key].profile.coordinates.x = Array.from({length: nbPoints}, (_, index) => index / (nbPoints-1) * profiles[key].profile.axes.limits.xmax);
        profiles[key].profile.coordinates.y = new Array(nbPoints).fill(0.0);

        // Update des limites de l'axe Y
        profiles[key].profile.axes.limits.ymin = 0.0;
        profiles[key].profile.axes.limits.ymax = 1.0;
    
        // Update des axes x, y et de la grille sur le SVG
        profiles[key].profile.plot.remove();
        [profiles[key].profile.plot, profiles[key].profile.axes.scales.x, profiles[key].profile.axes.scales.y, profiles[key].profile.grid, profiles[key].profile.axes.axes] = axes_create(profiles[key].svgProfile.svg, profiles[key].profile.dimensions, profiles[key].offsetsProfile, profiles[key].profile.axes.limits);
        
        // Update de la courbe sur le SVG
        profiles[key].profile.line.remove()
        profiles[key].profile.line = line_plot(profiles[key].profile.plot, profiles[key].profile.axes.scales, profiles[key].profile.coordinates);
        
        // Plot du tooltip sur le SVG
        profiles[key].profile.tooltip.tooltip.remove()
        profiles[key].profile.tooltip.tooltip = tooltip_plot(profiles[key].profile.plot, profiles[key].profile.tooltip.dimensions, profiles[key].profile.axes.scales, profiles[key].profile.coordinates, profiles[key].profile.tooltip.coordinates, profiles[key].profile.dimensions);
    });
};

function update_parameter_space(slice) {
    //
    // Met à jour l'espace de paramètres affiché dans le graphique et les données associées.
    // @param {string} space - Le nouvel espace de paramètres ("xi-mu" pour (xi, mu), "lambda-kappa" pour (lambda, kappa)).
    //

    // Update du bouton plan espace des paramètres et update de data
    if (slice == "xi-mu") {

        userInput.slice = "xi-mu";

        // Couleur des boutons xi(mu) et lambda(kappa)
        document.getElementById('button-xi-mu').style.backgroundColor        = black;
        document.getElementById('button-xi-mu').style.color                  = white;
        document.getElementById('button-lambda-kappa').style.backgroundColor = blue_white;
        document.getElementById('button-lambda-kappa').style.color           = black;
        document.getElementById('button-xi-mu').addEventListener('mouseout', function() {this.style.backgroundColor = black;});
        document.getElementById('button-xi-mu').addEventListener('mouseover', function() {this.style.backgroundColor = light_black;});
        document.getElementById('button-lambda-kappa').addEventListener('mouseout', function() {this.style.backgroundColor = blue_white;});
        document.getElementById('button-lambda-kappa').addEventListener('mouseover', function() {this.style.backgroundColor = blue_gray;});

        // Mise-à-jour des coordonnées des points du plot
        scatterPlot.points.coordinates.x = solutions["mu"];
        scatterPlot.points.coordinates.y = solutions["xi"];
        scatterPlot.points.coordinates.z = solutions["p"];


        // Valeurs min et max des axes (A AJUSTER AVEC LES DATA RECUPEREES)
        scatterPlot.axes.limits.xmin = -5;
        scatterPlot.axes.limits.xmax = 3;
        scatterPlot.axes.limits.ymin = -6;
        scatterPlot.axes.limits.ymax = 3;

        // Mise-à-jour du label des axes
        document.getElementById('parameter_space_label_x1').style.display = 'block';
        document.getElementById('parameter_space_label_y1').style.display = 'block';
        document.getElementById('parameter_space_label_z1').style.display = 'block';
        document.getElementById('parameter_space_label_x2').style.display = 'none';
        document.getElementById('parameter_space_label_y2').style.display = 'none';
        document.getElementById('parameter_space_label_z2').style.display = 'none';

        // Colormap
        colorbar.colormap = d3.interpolateInferno;

    } else if (slice == "lambda-kappa") {

        userInput.slice = "lambda-kappa";

        // Couleur des boutons xi(mu) et lambda(kappa)
        document.getElementById('button-xi-mu').style.backgroundColor        = blue_white;
        document.getElementById('button-xi-mu').style.color                  = black;
        document.getElementById('button-lambda-kappa').style.backgroundColor = black;
        document.getElementById('button-lambda-kappa').style.color           = white;
        document.getElementById('button-xi-mu').addEventListener('mouseout', function() {this.style.backgroundColor = blue_white;});
        document.getElementById('button-xi-mu').addEventListener('mouseover', function() {this.style.backgroundColor = blue_gray;});
        document.getElementById('button-lambda-kappa').addEventListener('mouseout', function() {this.style.backgroundColor = black;});
        document.getElementById('button-lambda-kappa').addEventListener('mouseover', function() {this.style.backgroundColor = light_black;});

        // Mise-à-jour des coordonnées des points du plot
        scatterPlot.points.coordinates.x = solutions["kappa"];
        scatterPlot.points.coordinates.y = solutions["lambda"];
        scatterPlot.points.coordinates.z = solutions["Omega*"];

        // Valeurs min et max des axes (A AJUSTER AVEC LES DATA RECUPEREES)
        scatterPlot.axes.limits.xmin = -5;
        scatterPlot.axes.limits.xmax = 3;
        scatterPlot.axes.limits.ymin = -1;
        scatterPlot.axes.limits.ymax = 5;

        // Mise-à-jour du label des axes
        document.getElementById('parameter_space_label_x1').style.display = 'none';
        document.getElementById('parameter_space_label_y1').style.display = 'none';
        document.getElementById('parameter_space_label_z1').style.display = 'none';
        document.getElementById('parameter_space_label_x2').style.display = 'block';
        document.getElementById('parameter_space_label_y2').style.display = 'block';
        document.getElementById('parameter_space_label_z2').style.display = 'block';

        // Colormap
        colorbar.colormap = d3.interpolateViridis;

    };

    // Mise-à-jour des axes x et y sur le SVG
    scatterPlot.grid.remove();
    scatterPlot.axes.axes.remove();
    [scatterPlot.plot, scatterPlot.axes.scales.x, scatterPlot.axes.scales.y, scatterPlot.grid, scatterPlot.axes.axes] = axes_create(svgScatterPlot.svg, scatterPlot.dimensions, offsetsScatterPlot, scatterPlot.axes.limits);

    // Mise-à-jour des points sur le SVG
    scatterPlot.points.points.remove();
    scatterPlot.points.points = points_plot(scatterPlot.plot, scatterPlot.axes.scales, scatterPlot.points.coordinates, colorbar.colormap, solutions, solutionValues, solutionValuesSelected, solutionValuesID, solutionHeaders, solutionPrecision, userInput.parameterSpace, userInput.family, solutionValuesSelected);

    // Mise-à-jour de la colorbar sur le SVG
    colorbar.colorbar.remove();
    colorbar.colorbar = colorbar_create(scatterPlot.plot, scatterPlot.dimensions, colorbar.dimensions, colorbar.colormap, colorbar.colorGradient, scatterPlot.points.coordinates);
};

async function update_scatter() {
    //
    // Met à jour le graphique de dispersion en fonction des données sélectionnées.
    // @param {d3.Selection} containerPlot  - La sélection du conteneur du graphique à mettre à jour.
    // @param {Object}       dataMaxSol     - Les données maximales des solutions.
    // @param {number}       colorbarHeight - La hauteur de la barre de couleur.
    // @param {string}       dic1           - La clé du premier attribut dans les données.
    // @param {string}       dic2           - La clé du deuxième attribut dans les données.
    // @param {string}       dic3           - La clé du troisième attribut dans les données.
    //

    function snap_to_value(value, arr) {
        var closestValue = arr.reduce(function(prev, curr) { return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev); });
        return closestValue.toString();
    };    

    // Récupération des valeurs des sliders que l'utilisateur vient de modifier
    userInput.parameterSpace.ep     = document.getElementById('slider-ep').value;
    userInput.parameterSpace.alpham = document.getElementById('slider-alpham').value;
    userInput.parameterSpace.chim   = document.getElementById('slider-chim').value;
    userInput.parameterSpace.pm     = document.getElementById('slider-pm').value;
    userInput.parameterSpace.alphap = document.getElementById('slider-alphap').value;

    // Mise à jour des valeurs des sliders avec des valeurs autorisée
    userInput.parameterSpace.ep     = snap_to_value(userInput.parameterSpace.ep,     parameterSpace.ep.map(parseFloat));
    userInput.parameterSpace.alpham = snap_to_value(userInput.parameterSpace.alpham, parameterSpace.alpham.map(parseFloat));
    userInput.parameterSpace.chim   = snap_to_value(userInput.parameterSpace.chim,   parameterSpace.chim.map(parseFloat));
    userInput.parameterSpace.pm     = snap_to_value(userInput.parameterSpace.pm,     parameterSpace.pm.map(parseFloat));
    userInput.parameterSpace.alphap = snap_to_value(userInput.parameterSpace.alphap, parameterSpace.alphap.map(parseFloat));

    // Mise à jour de la position des sliders avec les valeurs autorisées (i.e. aimantation)
    document.getElementById('slider-ep').value     = userInput.parameterSpace.ep;
    document.getElementById('slider-alpham').value = userInput.parameterSpace.alpham;
    document.getElementById('slider-chim').value   = userInput.parameterSpace.chim;
    document.getElementById('slider-pm').value     = userInput.parameterSpace.pm;
    document.getElementById('slider-alphap').value = userInput.parameterSpace.alphap;

    // Modification des décimales
    userInput.parameterSpace.ep     = parseFloat(userInput.parameterSpace.ep).toFixed(2);
    userInput.parameterSpace.alpham = parseFloat(userInput.parameterSpace.alpham).toFixed(1);
    userInput.parameterSpace.chim   = parseFloat(userInput.parameterSpace.chim).toFixed(1);
    userInput.parameterSpace.pm     = parseFloat(userInput.parameterSpace.pm).toFixed(1);
    userInput.parameterSpace.alphap = parseFloat(userInput.parameterSpace.alphap).toFixed(1);

    // Mise à jour du texte à côté des sliders
    document.getElementById("ep-value-slider").textContent     = userInput.parameterSpace.ep;
    document.getElementById("alpham-value-slider").textContent = userInput.parameterSpace.alpham;
    document.getElementById("chim-value-slider").textContent   = userInput.parameterSpace.chim;
    document.getElementById("pm-value-slider").textContent     = userInput.parameterSpace.pm;
    document.getElementById("alphap-value-slider").textContent = userInput.parameterSpace.alphap;

    // Mise-à-jour des coordonnées des points de l'espace des paramètres
    solutions = await fetch_solutions(userInput.parameterSpace, userInput.family);

    // Mise-à-jour des coordonnées des points du plot
    if (userInput.slice == "xi-mu") {
        scatterPlot.points.coordinates.x = solutions["mu"];
        scatterPlot.points.coordinates.y = solutions["xi"];
        scatterPlot.points.coordinates.z = solutions["p"];
    } else if (userInput.slice == "lambda-kappa") {
        scatterPlot.points.coordinates.x = solutions["kappa"];
        scatterPlot.points.coordinates.y = solutions["lambda"];
        scatterPlot.points.coordinates.z = solutions["Omega*"];
    }

    // Mise-à-jour des points sur le SVG
    scatterPlot.points.points.remove();
    scatterPlot.points.points = points_plot(scatterPlot.plot, scatterPlot.axes.scales, scatterPlot.points.coordinates, colorbar.colormap, solutions, solutionValues, solutionValuesSelected, solutionValuesID, solutionHeaders, solutionPrecision, userInput.parameterSpace, userInput.family, solutionValuesSelected);

    // Mise-à-jour de la colorbar sur le SVG
    colorbar.colorbar.remove();
    colorbar.colorbar = colorbar_create(scatterPlot.plot, scatterPlot.dimensions, colorbar.dimensions, colorbar.colormap, colorbar.colorGradient, scatterPlot.points.coordinates);

    // Reset les valeurs des paramètres de la solution
    Object.keys(solutionValuesSelected).forEach((key, index) => {
        solutionValuesSelected[key] = null; //exemple : solutionValues["ep"] = "-";
    });

    // Reset le texte des paramètres de la solution
    Object.keys(solutionValues).forEach((key, index) => {
        solutionValues[key] = "―"; //exemple : solutionValues["ep"] = "-";
        document.getElementById(solutionValuesID[index]).textContent = solutionValues[key]; //exemple : document.getElementById(solutionValuesID[0]).textContent = solutionValues["ep"];
    });

    // Reset de l'image
    document.getElementById('threed-image').style.backgroundImage = null;

    // Reset des profils 1D
    Object.keys(profiles).forEach((key, index) => {
        // Récupération du profil 1D
        profiles[key].profile.coordinates.x = Array.from({length: nbPoints}, (_, index) => index / (nbPoints-1) * profiles[key].profile.axes.limits.xmax);
        profiles[key].profile.coordinates.y = new Array(nbPoints).fill(0.0);

        // Update des limites de l'axe Y
        profiles[key].profile.axes.limits.ymin = 0.0;
        profiles[key].profile.axes.limits.ymax = 1.0;
    
        // Update des axes x, y et de la grille sur le SVG
        profiles[key].profile.plot.remove();
        [profiles[key].profile.plot, profiles[key].profile.axes.scales.x, profiles[key].profile.axes.scales.y, profiles[key].profile.grid, profiles[key].profile.axes.axes] = axes_create(profiles[key].svgProfile.svg, profiles[key].profile.dimensions, profiles[key].offsetsProfile, profiles[key].profile.axes.limits);
        
        // Update de la courbe sur le SVG
        profiles[key].profile.line.remove()
        profiles[key].profile.line = line_plot(profiles[key].profile.plot, profiles[key].profile.axes.scales, profiles[key].profile.coordinates);
        
        // Plot du tooltip sur le SVG
        profiles[key].profile.tooltip.tooltip.remove()
        profiles[key].profile.tooltip.tooltip = tooltip_plot(profiles[key].profile.plot, profiles[key].profile.tooltip.dimensions, profiles[key].profile.axes.scales, profiles[key].profile.coordinates, profiles[key].profile.tooltip.coordinates, profiles[key].profile.dimensions);
    });
};


function download_solution() {
    const solutionUrl = "https://raw.githubusercontent.com/nathanzimniak/maes_data/main/MHD_solutions/A_0.10_1.0_1.0_1.0_0.0_-2.0_-2.0_-2.0_-2.0/A_0.10_1.0_1.0_1.0_0.0_-2.0_-2.0_-2.0_-2.0_0.0056_0.6836_3.30.dat";

    const link = document.createElement("a");
    link.href = solutionUrl;
    link.download = "A_0.10_1.0_1.0_1.0_0.0_-2.0_-2.0_-2.0_-2.0_0.0056_0.6836_3.30.dat";
    document.body.appendChild(link);
    link.click();
    link.remove();
};








function interpolate(x, y, x_interp) {
    let y_interp = [];

    for (let xi of x_interp) {
        if (xi < x[0] || xi > x[x.length - 1]) {
            // Si xi est en dehors de l'intervalle de x, tu peux choisir de gérer ce cas différemment.
            y_interp.push(NaN); // ou une autre valeur de ton choix.
            continue;
        }

        // Trouver les deux points entre lesquels xi se situe
        let i = 0;
        while (i < x.length - 1 && xi > x[i + 1]) {
            i++;
        }

        // Interpolation linéaire
        let x0 = x[i];
        let x1 = x[i + 1];
        let y0 = y[i];
        let y1 = y[i + 1];

        let interpolatedValue = y0 + (xi - x0) * (y1 - y0) / (x1 - x0);
        y_interp.push(interpolatedValue);
    }

    return y_interp;
}

function compute_axis_lim(data, padding) {
    //
    // Calcule les limites d'axe en ajustant les valeurs minimales et maximales des données selon un facteur spécifié.
    // @param   {Array<number>} data - Les données à partir desquelles calculer les limites de l'axe.
    // @param   {number}        padding - Le facteur pour ajuster les limites.
    // @returns {Array<number>} Un tableau contenant les limites ajustées de l'axe.
    //

    console.log(data);

    var minValue = Math.min(...data);
    var maxValue = Math.max(...data);

    if (minValue >= 0) {
        minValue = (1 - padding) * minValue;
    } else {
        minValue = (1 + padding) * minValue;
    }
    if (maxValue >= 0) {
        maxValue = (1 + padding) * maxValue;
    } else {
        maxValue = (1 - padding) * maxValue;
    }

    return [minValue, maxValue];
};