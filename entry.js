const colors = {
    BLACK: 0,
    RED: 1,
    GREEN: 2,
    YELLOW: 3,
    BLUE: 4,
    MANGETA: 5,
    CYAN: 6,
    WHITE: 7,
};

/**
 * @param {any[]} questions
 * @returns {{question: string, answer: string, possiblities:string[]}}
 */
function getRandomQuestion(questions) {
    const i = Math.floor(Math.random() * questions.length);
    return questions[i];
}

/**
 * @param {string} response
 * @param {string[]} possiblities
 * @returns boolean
 */
function checkResponse(response, possiblities) {
    return possiblities
        .map(x => x.toLowerCase())
        .includes(response.toLowerCase());
}

/**
 * Get the correct answer of question
 * @param {string} question The riddle
 * @param {{question: string, answer: string, possibilities: string[]}[]} data Riddle data
 * @returns {string} answer
 */
function getCorrectAnswer(question, data) {
    return data.find(riddle => riddle.question === question).answer;
}

/**
 * @param {boolean} response
 * @returns {string}
 */
function formatResponse(response) {
    return response ? colorText("MARINA", colors.GREEN, true) : colorText("DISO", colors.RED, true);
}

/**
 * Create input prompt for getting user input on the console
 * @param {string} message
 * @returns {Promise<string>}
 */
function input(message = ">", newLine = false) {
    const readline = require("readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve, reject) => {
        try {
            rl.question(`${message}${newLine ? "\n" : ' '}`, (value) => {
                resolve(value);
                rl.close();
            });
        } catch (err) {
            reject(err);
            rl.close();
        }
    });
}
/**
 * Check if the answer agrees or not
 * @param {string} answer The answer to check
 * @returns {boolean} true if answer agree
 */
function isAgree(answer) {
    return !(['t', 'tsia', 'aaa', 'a3', 'tsy', 'ts'].includes(answer.toLowerCase()));
}

/**
 * Show loader
 * @param {string} text
 * @param {string[]} chars
 * @param {number} delay
 * @returns
 */
function loadingAnimation(
    text = "",
    chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"],
    delay = 100
) {
    chars = chars.map(c => colorText(c, 5))
    let x = 0;
    return setInterval(function () {
        process.stdout.write("\r" + chars[x++] + " " + text);
        x = x % chars.length;
    }, delay);
}

/**
 * Await for a specific delay
 * @param {number} duration
 * @returns
 */
function sleep(duration) {
    return new Promise(resolve => {
        return setTimeout(() => {
            resolve();
        }, duration);
    });
}

/**
 * Return preformated text with colors
 * @param {string} text
 * @param {number} color A number 0 to 7
 * @returns {string}
 */
function colorText(text, color = 0, bgColor) {
    let start = 30, max = 37;
    if (bgColor) {
        start += 10;
        max += 10;
    }
    return text.split('')
        .map(t => {
            if (color > max || start + color > max) {
                color = start;
            }
            return `\x1b[${start + color}m${t}\x1b[0m`
        }).join('');
}
/**
 * return score
 * @param response: {boolean}
 * return {number}
 */

function countPoint(response){
    if(response) 
        return 1
    return 0;  
}

async function main() {
    let play = true;
    let point = 0;
    let round = 0;
    const data = require("./ankamantatra.json");
    loop: while (play) {
        round++;
        const q = getRandomQuestion(data);
        console.log(`INONA ARY IZAO: ${colorText(q.question, colors.YELLOW)} ?`);
        let userInput = await input();
        let satisfied = false;
        find: do {
            if (!userInput.length) {
                continue loop;
            }
            q.possiblities.push(q.answer); // Add the answer to the possiblities list
            let checked = checkResponse(userInput, q.possiblities);
            point += countPoint(checked); 
            const response = formatResponse(checked);
            const a = loadingAnimation("Miandrasa kely ...");
            const t = await sleep(1000);
            clearTimeout(t);
            clearInterval(a);
            console.log(`\n${response}`);
            if (!checked) {
                userInput = await input(`Afapo ve ianao? ${colorText("(ENY/TSIA)", colors.CYAN)}\n`);
                if (isAgree(userInput)) {
                    console.log(`${colorText(getCorrectAnswer(q.question, data), colors.GREEN)} nefaaaa 😬😅`);
                } else {
                    userInput = await input("Dia inona ary... ");
                    continue find;
                }
            }
            satisfied = true;
        } while (!satisfied);
        userInput = await input(`MBOLA HANOY VE IANAO ? ${colorText("(ENY/Tsia)", colors.MANGETA)}\n>`);
        if (!isAgree(userInput)) {
            if(point > 0)
                console.log(colorText(`ISA:${point}/${round}`, colors.GREEN, true));
            else
                console.log(colorText(`ISA:${point}/${round}`, colors.RED, true));


            console.log(colorText(`VELOMA ✋ !`, colors.BLUE, true));

            play = false;
        }
    }
}

main();