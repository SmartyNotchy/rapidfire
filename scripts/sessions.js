/* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */
/* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */
/* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */ /* HELPER FUNCTIONS */

// Written by ChatGPT

// Seeded pseudo-random number generator using xorshift
function seeded_random(seed) {
    return function() {
        seed ^= seed << 13;
        seed ^= seed >> 17;
        seed ^= seed << 5;
        return (seed < 0 ? ~seed + 1 : seed) % 10000 / 10000;
    };
}

// Fisher-Yates shuffle with seed
function shuffle_with_seed(arr, seed) {
    const random = seeded_random(seed);

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1)); // Random index based on seeded RNG
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }

    return arr;
}

// Seedless shuffle algorithm
function shuffle_seedless(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        
        // Swap elements array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Levenshtein Distance Algorithm
function compare_strings(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    
    // Create a matrix to store distances
    const matrix = [];

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    // Calculate the cost of substitutions, deletions, or insertions
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    // Get the Levenshtein distance (last element of the matrix)
    const distance = matrix[len1][len2];

    // Calculate similarity as 1 minus the normalized distance
    const maxLength = Math.max(len1, len2);
    return 1 - distance / maxLength;
}

// Sets options for a dropdown HTML element
function set_dropdown(dropdown, options) {
    dropdown.innerHTML = '';

    options.forEach(option => {
        let newOption = document.createElement('option');
        newOption.value = option[0];
        newOption.text = option[1];
        dropdown.appendChild(newOption);
    });
}

// Cookie Helpers
function setCookie(name, value) {
    var expires = "";
    var date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return JSON.parse(cookie.substring(nameEQ.length, cookie.length));
        }
    }
    return undefined;
}

/* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */
/* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */
/* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */
/* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */
/* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */ /* TRIVIA SESSION HTML */

const SAQ_DIV = document.getElementById("scq_sa_div");
const SAQ_INPUT_BOX = document.getElementById("scq_sa_input");
const SAQ_INPUT_BTN = document.getElementById("scq_sa_btn");
const SAQ_INPUT_BTN_SVG = document.getElementById("scq_sa_btn_svg_src");
const SAQ_FEEDBACK_DIV = document.getElementById("scq_sa_feedback");
const SAQ_FEEDBACK_SVG = document.getElementById("scq_sa_feedback_svg");
const SAQ_FEEDBACK_TEXT = document.getElementById("scq_sa_feedback_text");

function reset_saq_div() {
    // Clear SAQ Input Div
    SAQ_INPUT_BOX.value = "";
    SAQ_INPUT_BOX.removeAttribute("disabled");
    SAQ_INPUT_BOX.className = "";

    SAQ_INPUT_BTN.setAttribute("disabled", "");
    SAQ_INPUT_BTN.className = "scq_submit_btn";
    SAQ_INPUT_BTN_SVG.setAttribute("href", "#svg_submit");
    SAQ_INPUT_BTN.onclick = function() { process_input(["SUBMIT", SAQ_INPUT_BOX.value]) };

    SAQ_INPUT_BOX.addEventListener('input', (event) => {
        process_input(["TYPED_KEY", undefined]);
    });

    SAQ_INPUT_BOX.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            process_input(["SUBMIT", SAQ_INPUT_BOX.value])
        }
    });

    SAQ_FEEDBACK_DIV.style.display = "none";
}

function hide_saq_div() { SAQ_DIV.style.display = "none"; }
function show_saq_div() { SAQ_DIV.style.display = "block"; }

const MCQ_DIV = document.getElementById("scq_mcq_div");
const MCQ_OPTIONS_DIV = document.getElementById("scq_mcq_options");
const MCQ_INPUT_BTN = document.getElementById("scq_mcq_btn");
const MCQ_INPUT_BTN_TEXT = document.getElementById("scq_mcq_btn_text");
const MCQ_INPUT_BTN_SVG = document.getElementById("scq_mcq_btn_svg_src");
const MCQ_FEEDBACK_DIV = document.getElementById("scq_mcq_feedback");
const MCQ_FEEDBACK_SVG = document.getElementById("scq_mcq_feedback_svg");
const MCQ_FEEDBACK_TEXT = document.getElementById("scq_mcq_feedback_text");

function reset_mcq_div() {
    MCQ_OPTIONS_DIV.innerText = "";
    MCQ_OPTIONS_DIV.style.display = "block";
    MCQ_FEEDBACK_DIV.style.display = "none";

    MCQ_INPUT_BTN.setAttribute("disabled", "");
    MCQ_INPUT_BTN.className = "scq_submit_btn";
    MCQ_INPUT_BTN_SVG.setAttribute("href", "#svg_submit");
    MCQ_INPUT_BTN_TEXT.innerText = "Submit";
    MCQ_INPUT_BTN.onclick = function() { process_input(["SUBMIT", undefined]) };
}

function hide_mcq_div() { MCQ_DIV.style.display = "none"; }
function show_mcq_div() { MCQ_DIV.style.display = "block"; }

const SCQ_QNUM = document.getElementById("scq_qnum");
const SCQ_QTYPE = document.getElementById("scq_qtype");
const SCQ_QDESC = document.getElementById("scq_qdesc");
const SCQ_SKIP_BTN = document.getElementById("scq_skip_btn");
const SCQ_DIV = document.getElementById("session_content_question_div");

function reset_scq_div() {
    reset_saq_div();
    reset_mcq_div();
}

function hide_scq_div() { SCQ_DIV.style.display = "none"; }
function show_scq_div() { SCQ_DIV.style.display = "block"; }
function hide_scq_div_except(toShow) {
    if (toShow == "saq") { show_saq_div(); } else { hide_saq_div(); }
    if (toShow == "mcq") { show_mcq_div(); } else { hide_mcq_div(); }
}

const SCE_DIV = document.getElementById("session_content_end_div");
const SCE_BACK_BTN = document.getElementById("sce_backtomm_btn");

function reset_sce_div() {
    SCE_BACK_BTN.removeAttribute("disabled");
    SCE_BACK_BTN.onclick = function() { CURRENT_SESSION.close_session() }
}

function hide_sce_div() { SCE_DIV.style.display = "none"; }
function show_sce_div() { SCE_DIV.style.display = "block"; }

const SESSION_DIV = document.getElementById("session_div");

function reset_session_div() {
    reset_scq_div();
    reset_sce_div();
}

function hide_session_div() { SESSION_DIV.style.display = "none"; }
function show_session_div() { SESSION_DIV.style.display = "flex"; }

/* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */
/* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */
/* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */ /* KEYBIND LISTENERS */

KEYS_LISTENING = {}
function add_letter_keybind(letter) { KEYS_LISTENING[letter] = true; }
function remove_letter_keybind(letter) { KEYS_LISTENING[letter] = false; }

function handle_keypress(event) {
    const key = event.key.toLowerCase();
    if (KEYS_LISTENING[key]) {
        process_input(["OPTION_SELECT", "abcdefghijklmnopqrstuvwxyz".indexOf(key)]);
    }
}

/* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */
/* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */
/* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */ /* QUESTION OBJECTS */

class SAQQuestion {
    constructor(q, topic, correctAnswers) {
        this.q = q;
        this.topic = topic;
        this.correctAnswers = correctAnswers;

        this.processingSubmit = false;
    }

    render(settings) {
        this.processingSubmit = false;

        reset_saq_div();
        hide_scq_div_except("saq");

        SCQ_QTYPE.innerText = `Short Answer | ${this.topic}`;
        SCQ_QDESC.innerHTML = this.q;
        SAQ_INPUT_BOX.focus();
    }

    rerender(settings) {

    }

    process_input(event, session) {
        if (this.processingSubmit) { return; }

        if (event[0] == "SKIP") {
            this.processingSubmit = true;
            SCQ_SKIP_BTN.setAttribute("disabled", "");
            SAQ_INPUT_BOX.setAttribute("disabled", "");
            SAQ_INPUT_BTN.setAttribute("disabled", "");

            SAQ_INPUT_BOX.classList.add("skipped");
            SAQ_INPUT_BTN.onclick = function() { process_input(["NEXT", ""]) }
            SAQ_INPUT_BTN_SVG.setAttribute("href", "#svg_next");
            SAQ_INPUT_BTN.removeAttribute("disabled", "");
            SAQ_INPUT_BTN.focus();

            // TODO: FEEDBACK DIV
            SAQ_FEEDBACK_SVG.setAttribute("href", "#svg_mincirc");
            SAQ_FEEDBACK_DIV.className = "scq_feedback skipped";
            SAQ_FEEDBACK_TEXT.innerText = `Skipped! Accepted Answers: ${this.correctAnswers.join(", ")}`;
            SAQ_FEEDBACK_DIV.style.display = "flex";
        } if (event[0] == "SUBMIT") {
            let ans = trim_lower(event[1]);
            if (ans != "") {
                this.processingSubmit = true;
                SAQ_INPUT_BTN.setAttribute("disabled", "");

                let isCorrect = false;
                let threshold = 0.77; // TODO: CORRECTNESS THRESHOLD
                for (const ca of this.correctAnswers) {
                    if (compare_strings(ans, trim_lower(ca)) >= threshold) {
                        isCorrect = true;
                        break;
                    }
                }

                if (isCorrect) {
                    SCQ_SKIP_BTN.setAttribute("disabled", "");
                    SAQ_INPUT_BOX.setAttribute("disabled", "");
                    SAQ_INPUT_BOX.classList.add("correct");

                    SAQ_INPUT_BTN.onclick = function() { process_input(["NEXT", ""]) }
                    SAQ_INPUT_BTN_SVG.setAttribute("href", "#svg_next");
                    SAQ_INPUT_BTN.removeAttribute("disabled", "");
                    SAQ_INPUT_BTN.focus();

                    // TODO: FEEDBACK DIV
                    SAQ_FEEDBACK_SVG.setAttribute("href", "#svg_check");
                    SAQ_FEEDBACK_DIV.className = "scq_feedback correct";
                    SAQ_FEEDBACK_TEXT.innerText = `Correct! (Accepted Answers: ${this.correctAnswers.join(", ")})`;
                    SAQ_FEEDBACK_DIV.style.display = "flex";
                } else {
                    SAQ_INPUT_BOX.classList.add("incorrect");
                    SAQ_INPUT_BTN.removeAttribute("disabled");
                    this.processingSubmit = false;

                    // TODO: FEEDBACK DIV
                    SAQ_FEEDBACK_SVG.setAttribute("href", "#svg_x");
                    SAQ_FEEDBACK_DIV.className = "scq_feedback incorrect";
                    SAQ_FEEDBACK_TEXT.innerText = "Incorrect";
                    SAQ_FEEDBACK_DIV.style.display = "flex";
                }
            }      
        } else if (event[0] == "TYPED_KEY") {
            if (trim_lower(SAQ_INPUT_BOX.value) == "") {
                SAQ_INPUT_BTN.setAttribute("disabled", "");
            } else {
                SAQ_INPUT_BTN.removeAttribute("disabled");
            }
            SAQ_INPUT_BOX.className = "";
        }
    }
}

class MCQOption {
    constructor(idx, letter, desc, isCorrect) {
        // Create Button
        this.button = document.createElement('button');
        this.button.classList.add('scq_mcq');

        // Button's "Letter" Label
        this.buttonLetter = document.createElement('div');
        this.buttonLetter.classList.add('scq_mcq_label');
        this.buttonLetter.textContent = letter;

        // Option Answer Text
        this.answerText = document.createElement('p');
        this.answerText.classList.add('scq_mcq_text');
        this.answerText.textContent = desc;

        this.button.appendChild(this.buttonLetter);
        this.button.appendChild(this.answerText);

        this.idx = idx;
        this.letter = letter;
        this.button.onclick = function() { process_input(["OPTION_SELECT", idx]) };
    }

    add_to_div() {
        // Adds the button to MCQ_DIV.
        // Probably call .render() before this.
        MCQ_OPTIONS_DIV.appendChild(this.button);
    }

    render(disabled, button_class) {
        // Style the button (by modifying classlist & disabled attribute.)
        // Depends on the state vars (see constructor).
        if (disabled) {
            this.button.setAttribute("disabled", "");
        } else {
            this.button.removeAttribute("disabled");
        }

        this.button.className = "scq_mcq " + button_class;
    }
}

class MCQQuestion {
    constructor(q, topic, correct, wrongAnswers) {
        this.q = q;
        this.topic = topic;
        this.correctAnswer = correct;
        this.correctIdx = undefined;
        this.wrongAnswers = wrongAnswers;

        this.selected = undefined;
        this.buttons = [];

        this.processingSubmit = false;
    }
    
    render(settings) {
        this.processingSubmit = false;
        reset_mcq_div();
        
        this.selected = undefined;
        this.correctIdx = Math.floor(Math.random() * (this.wrongAnswers.length+1));
        this.buttons = [];
        
        let waList = shuffle_seedless(this.wrongAnswers);
        let options = waList.slice(0, this.correctIdx).concat([this.correctAnswer]).concat(waList.slice(this.correctIdx));
        let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (let i in options) {
            this.buttons.push(new MCQOption(i, alphabet[i], options[i], i == this.correctIdx));
            this.buttons[i].render(false, "");
            this.buttons[i].add_to_div();
            add_letter_keybind(alphabet[i].toLowerCase()); // TODO SETTINGS
        }

        hide_scq_div_except("mcq");

        SCQ_QTYPE.innerText = `Multiple Choice | ${this.topic}`;
        SCQ_QDESC.innerHTML = this.q;
    }

    rerender(settings) {
        let letterListener = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[this.correctIdx];

        document.addEventListener('keydown', handleKeyPress);
    }

    process_input(event, session) {
        if (this.processingSubmit) { return; }

        if (event[0] == "SKIP") {
            this.processingSubmit = true;
            SCQ_SKIP_BTN.setAttribute("disabled", "");
            MCQ_INPUT_BTN.setAttribute("disabled", "");

            for (let idx in this.buttons) {
                this.buttons[idx].render(true, idx == this.correctIdx ? "greendashed" : "")
                remove_letter_keybind("abcdefghijklmnopqrstuvwxyz"[idx]);
            }

            MCQ_INPUT_BTN.onclick = function() { process_input(["NEXT", ""]) }
            MCQ_INPUT_BTN_SVG.setAttribute("href", "#svg_next");
            MCQ_INPUT_BTN_TEXT.innerText = "Next";
            MCQ_INPUT_BTN.removeAttribute("disabled", "");
            MCQ_INPUT_BTN.focus();

            // TODO: FEEDBACK DIV
            MCQ_FEEDBACK_SVG.setAttribute("href", "#svg_mincirc");
            MCQ_FEEDBACK_DIV.className = "scq_feedback skipped";
            MCQ_FEEDBACK_TEXT.innerText = `Skipped! Correct Answer: ${this.buttons[this.correctIdx].letter}`;
            MCQ_FEEDBACK_DIV.style.display = "flex";
        } else if (event[0] == "SUBMIT") {
            if (this.selected != undefined) {
                this.processingSubmit = true;
                SCQ_SKIP_BTN.setAttribute("disabled", "");
                MCQ_INPUT_BTN.setAttribute("disabled", "");
                let isCorrect = (this.selected == this.correctIdx);

                if (isCorrect) {
                    for (let idx in this.buttons) {
                        this.buttons[idx].render(true, idx == this.correctIdx ? "green" : "")
                        remove_letter_keybind("abcdefghijklmnopqrstuvwxyz"[idx]);
                    }
                    MCQ_INPUT_BTN.onclick = function() { process_input(["NEXT", ""]) }
                    MCQ_INPUT_BTN_SVG.setAttribute("href", "#svg_next");
                    MCQ_INPUT_BTN_TEXT.innerText = "Next";
                    MCQ_INPUT_BTN.removeAttribute("disabled", "");
                    MCQ_INPUT_BTN.focus();

                    // TODO: FEEDBACK DIV
                    MCQ_FEEDBACK_SVG.setAttribute("href", "#svg_check");
                    MCQ_FEEDBACK_DIV.className = "scq_feedback correct";
                    MCQ_FEEDBACK_TEXT.innerText = `Correct!`;
                    MCQ_FEEDBACK_DIV.style.display = "flex";            
                } else {
                    this.buttons[this.selected].render(false, "red");
                    this.buttons[this.selected].button.focus();
                    MCQ_INPUT_BTN.removeAttribute("disabled");
                    this.processingSubmit = false;

                    // TODO: FEEDBACK DIV
                    MCQ_FEEDBACK_SVG.setAttribute("href", "#svg_x");
                    MCQ_FEEDBACK_DIV.className = "scq_feedback incorrect";
                    MCQ_FEEDBACK_TEXT.innerText = "Incorrect";
                    MCQ_FEEDBACK_DIV.style.display = "flex";
                }
            }            
        } else if (event[0] == "OPTION_SELECT") {
            let newSelected = event[1];
            if (newSelected == this.selected) {
                MCQ_INPUT_BTN.setAttribute("disabled", "");
                this.buttons[this.selected].selected = false;
                this.buttons[this.selected].render(false, "");
                this.selected = undefined;
            } else {
                this.buttons[newSelected].selected = true;
                this.buttons[newSelected].render(false, "blue")
                
                if (this.selected != undefined) {
                    this.buttons[this.selected].selected = false;
                    this.buttons[this.selected].render(false, "");
                }

                this.selected = newSelected;
                MCQ_INPUT_BTN.removeAttribute("disabled");
                MCQ_INPUT_BTN.focus();
            }
        }
    }
}

/* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */
/* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */
/* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */ /* SESSIONS */

var CURRENT_SESSION = undefined;

class TriviaSession {
    constructor(subject, topics, qNum, seed, settings) {
        //this.questions = [new MCQQuestion("What is 1 + 1? Debug", "Debug Problems", ["2"], ["3", "4", "5"])];
        //this.questions = [new SAQQuestion("What is 1 + 1?", "Debug Problems", ["2"]), new SAQQuestion("What is 1 + 2?", "Debug Problems", ["3"])]
        this.subject = subject;
        this.topics = topics;
        this.questions = [];
        for (let t of topics) {
            this.questions = this.questions.concat(QUESTION_BANK[subject][t]);
        }

        this.questionNum = qNum;
        this.seed = seed;

        this.settings = settings;

        this.questionCount = this.questions.length;
        this.questionOrder = shuffle_with_seed(Array.from({ length: this.questionCount }, (_, i) => i), this.seed);

        this.currentQuestion = this.questions[this.questionOrder[this.questionNum]];
    }

    firstrender() {
        reset_session_div();
        hide_sce_div();
        show_scq_div();
        show_session_div();
        this.render();
        this.save_progress();
    }

    render() {
        if (this.questionNum >= this.questionCount) {
            hide_scq_div();
            show_sce_div();
        } else {
            SCQ_QNUM.innerText = `Question #${this.questionNum+1}/${this.questionCount}`;
            SCQ_SKIP_BTN.onclick = function() { process_input(["SKIP", ""]) };
            SCQ_SKIP_BTN.removeAttribute("disabled");

            this.currentQuestion.render(this.settings);
        }
    }

    close_session() {
        // TODO: SAVING LOGIC

        SCE_BACK_BTN.setAttribute("disabled", "");
        hide_sce_div();
        reset_mm_div();
        show_mm_div();
    }

    save_progress() {
        // TODO
        if (this.questionNum >= this.questionCount) {
            setCookie("inSession", false);
        } else {
            setCookie("inSession", true);
            setCookie("subject", this.subject);
            setCookie("topics", this.topics);
            setCookie("questionNum", this.questionNum);
            setCookie("seed", this.seed);
        }
    }

    process_input(event) {
        if (event[0] == "NEXT") {
            this.questionNum += 1;
            this.save_progress();

            if (this.questionNum >= this.questionCount) {
                this.currentQuestion = undefined;
            } else {
                this.currentQuestion = this.questions[this.questionOrder[this.questionNum]];
            }

            this.render();
        } else {
            this.currentQuestion.process_input(event, CURRENT_SESSION);
        }
    }
}

function process_input(event) {
    CURRENT_SESSION.process_input(event);
}