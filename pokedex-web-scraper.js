/*
created by @ethans333
8/19/2020

version 1.0
*/

const puppeteer = require('puppeteer');
const readline = require('readline')
const terminalImage = require('terminal-image');
const got = require('got');
const colors = require('colors');

colors.setTheme({
    boldRed: ['brightRed', 'bold']
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let a_or_an = (word) => {
    let vowels = ['a','e','i','o','u']
    if(vowels.includes(word.charAt(0).toLowerCase())){
        return "an"
    } else {
        return "a"
    }
}

let get_pokemon_data = (pokemon_name) => {
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        let url = `https://bulbapedia.bulbagarden.net/wiki/${pokemon_name}`
        await page.goto(url, {waitUntil: 'networkidle2'});
    
        let pokemon = await page.evaluate(() => {
            let name = document.querySelector('td[class="roundy"] > table > tbody > tr > td > big > big').innerText,
            type = document.querySelector('td[class="roundy"] > table > tbody > tr > td > table').innerText,
            category = document.querySelector('table[class="roundy"] > tbody > tr > td[class="roundy"] > table tbody > tr > td > a').innerText,
            height = document.querySelectorAll('table[class="roundy"] > tbody > tr > td > table')[14].innerText,
            weight = document.querySelectorAll('table[class="roundy"] > tbody > tr > td > table')[15].innerText,

            image = document.querySelector('table[class="roundy"] > tbody > tr > td > a > img').src

            return {name, type, category, height, weight, image}
        });

        const pokemon_image = await got(pokemon.image).buffer();
        console.log(await terminalImage.buffer(pokemon_image));

        console.log(`${pokemon.name}, is ${a_or_an(pokemon.type)} ${pokemon.type} type pokemon.`.boldRed)
        console.log(`Category: ${pokemon.category}`)
        console.log(`Height: ${pokemon.height}`)
        console.log(`Weight: ${pokemon.weight}`)
    
        await browser.close();
        await process.exit()
    })();
};

rl.question("What Pokemon? ", (userInput)=>{
    get_pokemon_data(userInput)
});
