// https://github.com/spencermountain/compromise

let doc = [];
let verbs = [];
let nouns = [];
let adjectives = [];
let places = [];
let adverbs = [];
let pronouns = [];
let conjunctions = [];
let people = [];
let determiners = [];
let current_page = 1;
let total_pages = 5;

// loop through total number of pages and collect headlines from each article
while(current_page <= total_pages){
    // Guardian API:
    const url = "https://content.guardianapis.com/search?" +
                `page=${current_page}&` +
                `page-size=100&` +
                `api-key=${config.guardianApiKey}`;

    function getData(){
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => {
                    if(response.ok) {
                        return response.json();
                    } else {
                        throw new Error("ERROR!", response.statusText);
                    };
                })
                .then((responseJson) => {
                    let data = responseJson.response.results;
                    if(data){
                        resolve(data);
                    } else{
                        reject("no data found");
                    };
                });
        });
    };

    current_page += 1;

    getData()
        .then(data => {
            for(let i = 0; i<100; i++){
                // using compromise, a natural-language processing tool
                doc = nlp(data[i].webTitle);

                // push all iterations of each word type to their respective array:
                verbs.push(doc.verbs().text());
                nouns.push(doc.nouns().text());
                adjectives.push(doc.adjectives().text());
                places.push(doc.places().text());
                adverbs.push(doc.adverbs().text());
                pronouns.push(doc.pronouns().text());
                conjunctions.push(doc.conjunctions().text());
                people.push(doc.people().text());
                if (doc.match("#Determiner").text() != ""){
                    determiners.push(doc.match("#Determiner").text())
                };
            };
            
            // trim each array using the promise from the below trimArrays() function:
            trimPromise(verbs)
                .then((res)=>{ verbs = lowercaseElements(res); return verbs; })
                .catch((error) => { console.log(error); })
            trimPromise(nouns)
                .then((res)=>{ nouns = res; return nouns; })
                .catch((error) => { console.log(error); })
            trimPromise(adjectives)
                .then((res)=>{ adjectives = lowercaseElements(res); return adjectives; })
                .catch((error) => { console.log(error); })
            trimPromise(places)
                .then((res)=>{ places = res; return places; })
                .catch((error) => { console.log(error); })
            trimPromise(adverbs)
                .then((res)=>{ adverbs = lowercaseElements(res); return adverbs; })
                .catch((error) => { console.log(error); })
            trimPromise(pronouns)
                .then((res)=>{ pronouns = lowercaseElements(res); return pronouns; })
                .catch((error) => { console.log(error); })
            trimPromise(conjunctions)
                .then((res)=>{ conjunctions = lowercaseElements(res); return conjunctions; })
                .catch((error) => { console.log(error); })
            trimPromise(people)
                .then((res)=>{ people = res; return people; })
                .catch((error) => { console.log(error); })
            trimPromise(determiners)
                .then((res)=>{ determiners = lowercaseElements(res); return determiners; })
                .catch((error) => { console.log(error); })
        })
        .catch((error) => {
            console.log(error);
        });
};

// Function to remove empty and duplicate elements
let trimPromise = function trimArrays(array){
    return new Promise((resolve, reject) => {
        let noEmptyElems = array.filter(item => item);

        let splitBySpace = [];
        noEmptyElems.forEach(element => {
            splitBySpace.push(element.split(" "));
        });

        let stringOfArr = splitBySpace.toString();

        let separatedElems = stringOfArr.split(",");

        let filteredArr = [...new Set(separatedElems)];
            
        if(array != filteredArr){
            resolve(filteredArr);
        } else{
            reject(array);
        };
    });
};

// Function to make all array elements in chosen arrays lowercase:
const lowercaseElements = (array) => {
    return array.map(element => element.toLowerCase())
};

// Function to capitalise first letter of headline
const capitaliseFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// random number generator function
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

// almost guaranteed unique id generator for each 'copy' button
const uniqueId = (length=16) => {
    return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""));
};

// function for copying headline text
const copyHeadline = (id) => {
    /* Get the h1 element's headline content */
    let copyBtn = document.getElementById(id);
    let copyText = copyBtn.previousElementSibling.firstElementChild.textContent;
    copyBtn.classList.add("copied");
    copyBtn.innerText = "Copied";
  
    /* Copy the text to clipboard */
    if(navigator.clipboard && window.isSecureContext){
        // straight-forward copy approach in secure contexts:
        return navigator.clipboard.writeText(copyText);
    } else{
        // copy approach when navigator.clipboard is not recognised
        let textArea = document.createElement("textarea");
        textArea.value = copyText;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    };
};

// make copyHeadline available to onclick inside below event listener:
window.copyHeadline = copyHeadline;

const genHeadlineButton = document.getElementById("gen-headline-btn");
const headlinesContainer = document.getElementById("headlines-container");
let html = "";
let colors = ["blue", "pink", "green", "purple", "yellow"];
genHeadlineButton.addEventListener("click", () => {
    // on click, generate an empty array of headlines and 9 random numbers for each word category
    let headlines = [];
    let r1 = getRandomInt(verbs.length);
    let r2 = getRandomInt(nouns.length);
    let r3 = getRandomInt(adjectives.length);
    let r4 = getRandomInt(places.length);
    let r5 = getRandomInt(adverbs.length);
    let r6 = getRandomInt(pronouns.length);
    let r7 = getRandomInt(conjunctions.length);
    let r8 = getRandomInt(people.length);
    let r9 = getRandomInt(determiners.length);

    // generate 5 headlines of differing sentence layouts for variation
    let headline1 = `${capitaliseFirstLetter(people[r8])} ${conjunctions[r7]} ${places[r4]}: ${capitaliseFirstLetter(determiners[r9])} ${adjectives[r3]} ${nouns[r2]} ${verbs[r1]} ${adjectives[adjectives.length - r3]}?`;
    
    let headline2 = `${capitaliseFirstLetter(nouns[r2])} ${conjunctions[r7]} ${people[r8]} ${verbs[r1]} ${adverbs[r5]} ${adjectives[r3]}`;
    
    let headline3 = `${capitaliseFirstLetter(pronouns[r6])} ${verbs[verbs.length - r1]} ${adjectives[r3]}: ${capitaliseFirstLetter(nouns[r2])} ${verbs[r1]} ${adverbs[r5]}`;

    let headline4 = `${capitaliseFirstLetter(conjunctions[r7])} ${people[r8]} ${adjectives[r3]}? ${capitaliseFirstLetter(pronouns[r6])} ${verbs[r1]} ${adverbs[r5]} ${nouns[r2]}`;

    let headline5 = `${capitaliseFirstLetter(determiners[r9])} ${nouns[r2]} ${verbs[r1]} ${adverbs[r5]}! ${capitaliseFirstLetter(determiners[determiners.length - r9])} ${pronouns[r6]} ${verbs[verbs.length - r1]} ${adjectives[adjectives.length - r3]} ${nouns[nouns.length - r2]}`

    // push each headline to headlines array
    headlines.push(headline1, headline2, headline3, headline4, headline5);
    // select a random headline from the array
    let randomHeadline = headlines[getRandomInt(5)];

    // varying the color of the headlines' output boxes
    let randomColor = colors[getRandomInt(5)];

    // div created to be inserted inside headlinesContainer for .insertBefore()
    let containerNode = document.createElement("div");

    // html for each headline created
    html = /*html*/`
        <div class="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-2 py-2 md:px-6 md:py-4 bg-${randomColor}-600 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0 news-headline">
            <!-- Dot Following the Left Vertical Line -->
            <div class="w-5 h-5 bg-${randomColor}-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

            <!-- Line connecting the box with the vertical line -->
            <div class="w-10 h-1 bg-${randomColor}-300 absolute -left-10 z-0"></div>

            <!-- Content showing in the box -->
            <div class="flex-auto py-2">
<!--                <h1 class="text-lg">Today's Irregular Headline:</h1>  -->
                <h1 class="text-lg font-bold typewriter">${randomHeadline} &#160;</h1>
            </div>
            <button href="#" class="text-center text-white hover:text-gray-300 ml-3" onclick="copyHeadline(this.id).then(() => console.log('text copied')).catch(() => console.log('error copying'));" id="btn-${uniqueId()}">Copy</button>
        </div>
    `
    // set inner html of newly created div; insert new div before the first child of the headlinesContainer - headlines appear in order of recency
    containerNode.innerHTML = html;
    headlinesContainer.insertBefore(containerNode, headlinesContainer.childNodes[0]);
});
