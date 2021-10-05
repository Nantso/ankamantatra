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
 * @param {boolean} response
 * @returns {string}
 */
function formatResponse(response) {
    return response ? "\x1b[42mMARINA\x1b[0m" : "\x1b[41mDISO\x1b[0m";
}

/**
 * Create input prompt for getting user input on the console
 * @param {string} message
 * @returns {{ closer: Function, lineReader: any}}
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

function loadingAnimation(
    text = "",
    chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"],
    delay = 100
) {
    let x = 0;
    return setInterval(function () {
        process.stdout.write("\r" + chars[x++] + " " + text);
        x = x % chars.length;
    }, delay);
}
async function main() {
    const data = require("./ankamantatra.json");
    const q = getRandomQuestion(data);
    console.log(`INONA ARY IZAO: ${q.question} ?`);
    const userInput = await input(); // TODO: Get user input
    q.possiblities.push(q.answer); // Add the answer to the possiblities list
    const animation = loadingAnimation()
    setTimeout(() => {
        const response = formatResponse(checkResponse(userInput, q.possiblities));
        clearInterval(animation);
        console.log(`\n${response}\n`);
    }, 1000);
}

main();