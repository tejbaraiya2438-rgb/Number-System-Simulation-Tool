/* =========================================
   STARK NUMBER SYSTEM ANALYZER
   PURE JAVASCRIPT LOGIC
========================================= */

const numberInput = document.getElementById("numberInput");
const analyzeBtn = document.getElementById("analyzeBtn");

const baseSelector = document.getElementById("baseSelector");
const baseOptions = document.querySelectorAll(".base-option");

const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

const detectionPanel = document.getElementById("detectionPanel");
const conversionPanel = document.getElementById("conversionPanel");
const analysisPanel = document.getElementById("analysisPanel");

const detectedInput = document.getElementById("detectedInput");
const detectedSystem = document.getElementById("detectedSystem");
const detectedBase = document.getElementById("detectedBase");

const binaryOutput = document.getElementById("binaryOutput");
const octalOutput = document.getElementById("octalOutput");
const decimalOutput = document.getElementById("decimalOutput");
const hexOutput = document.getElementById("hexOutput");

const toDecimalTitle = document.getElementById("toDecimalTitle");
const toDecimalSteps = document.getElementById("toDecimalSteps");

const binarySteps = document.getElementById("binarySteps");
const octalSteps = document.getElementById("octalSteps");
const hexSteps = document.getElementById("hexSteps");

const deepExplanation = document.getElementById("deepExplanation");


let selectedBase = null;


/* =========================================
   NUMBER SYSTEM INFORMATION
========================================= */

const systems = {
    2: "Binary",
    8: "Octal",
    10: "Decimal / Integer",
    16: "Hexadecimal"
};


/* =========================================
   INPUT CLEANING
========================================= */

function cleanInput(value) {

    return value
        .trim()
        .toUpperCase();

}


/* =========================================
   CHECK VALID NUMBER FOR BASE
========================================= */

function isValidForBase(value, base) {

    if (!value) {
        return false;
    }

    const patterns = {

        2: /^[01]+$/,

        8: /^[0-7]+$/,

        10: /^[0-9]+$/,

        16: /^[0-9A-F]+$/

    };

    return patterns[base].test(value);

}


/* =========================================
   FIND POSSIBLE BASES
========================================= */

function findPossibleBases(value) {

    const possible = [];

    [2, 8, 10, 16].forEach((base) => {

        if (isValidForBase(value, base)) {

            possible.push(base);

        }

    });

    return possible;

}


/* =========================================
   SMART BASE DETECTION
========================================= */

function detectBase(value) {

    /*
        Letters A-F automatically mean Hexadecimal.
    */

    if (/[A-F]/.test(value)) {

        if (isValidForBase(value, 16)) {

            return 16;

        }

        return null;

    }


    /*
        Contains 8 or 9 → cannot be binary/octal.
        Therefore Decimal.
    */

    if (/[89]/.test(value)) {

        if (isValidForBase(value, 10)) {

            return 10;

        }

        return null;

    }


    /*
        If only 0 and 1:
        ambiguous between Binary, Octal and Decimal.
    */

    if (/^[01]+$/.test(value)) {

        return null;

    }


    /*
        Contains 2-7:
        Could be Octal or Decimal.
        We ask user if necessary.
    */

    if (/^[2-7]+$/.test(value)) {

        return null;

    }


    return null;

}


/* =========================================
   SHOW ERROR
========================================= */

function showError(message) {

    errorText.textContent = message;

    errorMessage.hidden = false;

}


/* =========================================
   HIDE ERROR
========================================= */

function hideError() {

    errorMessage.hidden = true;

}


/* =========================================
   RESET UI
========================================= */

function resetOutput() {

    detectionPanel.hidden = true;
    conversionPanel.hidden = true;
    analysisPanel.hidden = true;

    baseSelector.hidden = true;

    binaryOutput.textContent = "—";
    octalOutput.textContent = "—";
    decimalOutput.textContent = "—";
    hexOutput.textContent = "—";

    toDecimalSteps.innerHTML =
        "<p>Waiting for analysis...</p>";

    binarySteps.innerHTML =
        "<p>Waiting for analysis...</p>";

    octalSteps.innerHTML =
        "<p>Waiting for analysis...</p>";

    hexSteps.innerHTML =
        "<p>Waiting for analysis...</p>";

    deepExplanation.textContent =
        "Enter a number and run the analysis to see the complete mathematical explanation.";

}


/* =========================================
   DECIMAL → BASE
========================================= */

function decimalToBase(decimal, base) {

    if (decimal === 0) {

        return "0";

    }

    return decimal.toString(base).toUpperCase();

}


/* =========================================
   BASE → DECIMAL
========================================= */

function baseToDecimal(value, base) {

    return parseInt(value, base);

}


/* =========================================
   FORMAT CURRENCY-LIKE NUMBER
========================================= */

function formatNumber(value) {

    return value.toLocaleString("en-IN");

}


/* =========================================
   GENERATE POSITIONAL NOTATION
========================================= */

function generateDecimalExplanation(value, base) {

    const digits = value.split("");

    const powerCount = digits.length - 1;

    let expressionParts = [];

    let calculationParts = [];

    digits.forEach((digit, index) => {

        const power = powerCount - index;

        const digitValue = parseInt(digit, 16);

        expressionParts.push(
            `${digit} × ${base}<sup>${power}</sup>`
        );

        calculationParts.push(
            `(${digitValue} × ${base ** power})`
        );

    });


    const decimal =
        baseToDecimal(value, base);


    return `
        <div class="step">
            ${value}<sub>${base}</sub>
        </div>

        <div class="step">
            = ${expressionParts.join(" + ")}
        </div>

        <div class="step">
            = ${calculationParts.join(" + ")}
        </div>

        <div class="step result">
            = ${formatNumber(decimal)}<sub>10</sub>
        </div>
    `;

}


/* =========================================
   GENERATE DIVISION STEPS
========================================= */

function generateDivisionSteps(decimal, base) {

    if (decimal === 0) {

        return `
            <div class="step">
                0 → 0
            </div>

            <div class="step result">
                Result = 0
            </div>
        `;

    }


    let current = decimal;

    const steps = [];

    const digits = [];


    while (current > 0) {

        const quotient =
            Math.floor(current / base);

        const remainder =
            current % base;

        const remainderSymbol =
            remainder.toString(16).toUpperCase();

        steps.push({

            current,
            quotient,
            remainder,
            remainderSymbol

        });

        digits.push(remainderSymbol);

        current = quotient;

    }


    let html = "";


    steps.forEach((step) => {

        html += `
            <div class="step">
                ${step.current} ÷ ${base}
                =
                ${step.quotient}
                remainder
                ${step.remainderSymbol}
            </div>
        `;

    });


    html += `
        <div class="step result">
            Read the remainders from bottom → top
            <br>
            = ${digits.reverse().join("")}
        </div>
    `;


    return html;

}


/* =========================================
   CREATE DEEP EXPLANATION
========================================= */

function generateDeepExplanation(
    input,
    detectedBase,
    decimal
) {

    const system =
        systems[detectedBase];


    let explanation = "";


    explanation += `
        The input <strong>${input}</strong> was interpreted as
        <strong>${system}</strong> because it is valid in
        base ${detectedBase}.
    `;


    explanation += `

        Every number system uses positional notation.
        The position of each digit determines its power of
        the base.

        The value was first converted to decimal:
        <strong>${formatNumber(decimal)}</strong>.
    `;


    explanation += `

        Once the decimal value was obtained, the program
        converted that same value into Binary, Octal and
        Hexadecimal using repeated division by the target base.
    `;


    explanation += `

        Therefore all four representations describe the
        <strong>same numerical value</strong>; only their
        number-system representation is different.
    `;


    return explanation;

}


/* =========================================
   ANALYZE
========================================= */

function analyzeNumber(baseOverride = null) {

    hideError();


    const input =
        cleanInput(numberInput.value);


    if (!input) {

        resetOutput();

        showError(
            "Please enter a number before starting the analysis."
        );

        return;

    }


    const possibleBases =
        findPossibleBases(input);


    /*
        Completely invalid
    */

    if (possibleBases.length === 0) {

        resetOutput();

        showError(
            "Invalid number. Use digits 0–9 and hexadecimal letters A–F where applicable."
        );

        return;

    }


    let base = baseOverride;


    /*
        If user selected a base manually
    */

    if (base) {

        if (!isValidForBase(input, base)) {

            showError(
                `${input} is not a valid ${systems[base]} number.`
            );

            return;

        }

    }


    /*
        Automatically detect obvious formats
    */

    if (!base) {

        base = detectBase(input);

    }


    /*
        Ambiguous input
    */

    if (!base) {

        baseSelector.hidden = false;

        baseOptions.forEach((button) => {

            const buttonBase =
                Number(button.dataset.base);

            button.hidden =
                !possibleBases.includes(buttonBase);

            button.classList.remove("selected");

        });

        return;

    }


    selectedBase = base;

    baseSelector.hidden = true;


    /*
        Convert input → decimal
    */

    const decimal =
        baseToDecimal(input, base);


    if (!Number.isSafeInteger(decimal)) {

        showError(
            "This number is too large for safe JavaScript integer calculations."
        );

        return;

    }


    /*
        Show detection
    */

    detectionPanel.hidden = false;

    detectedInput.textContent =
        input;

    detectedSystem.textContent =
        systems[base];

    detectedBase.textContent =
        `Base ${base}`;


    /*
        All conversions
    */

    binaryOutput.textContent =
        decimalToBase(decimal, 2);

    octalOutput.textContent =
        decimalToBase(decimal, 8);

    decimalOutput.textContent =
        decimal.toString(10);

    hexOutput.textContent =
        decimalToBase(decimal, 16);


    conversionPanel.hidden = false;


    /*
        Input → Decimal explanation
    */

    toDecimalTitle.textContent =
        `${systems[base].toUpperCase()} → DECIMAL`;


    toDecimalSteps.innerHTML =
        generateDecimalExplanation(
            input,
            base
        );


    /*
        Decimal → Binary
    */

    binarySteps.innerHTML =
        generateDivisionSteps(
            decimal,
            2
        );


    /*
        Decimal → Octal
    */

    octalSteps.innerHTML =
        generateDivisionSteps(
            decimal,
            8
        );


    /*
        Decimal → Hexadecimal
    */

    hexSteps.innerHTML =
        generateDivisionSteps(
            decimal,
            16
        );


    /*
        Deep explanation
    */

    deepExplanation.innerHTML =
        generateDeepExplanation(
            input,
            base,
            decimal
        );


    analysisPanel.hidden = false;


    /*
        Scroll to result
    */

    setTimeout(() => {

        detectionPanel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* =========================================
   BUTTON
========================================= */

analyzeBtn.addEventListener(
    "click",
    () => analyzeNumber()
);


/* =========================================
   ENTER KEY
========================================= */

numberInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            analyzeNumber();

        }

    }
);


/* =========================================
   BASE SELECTION
========================================= */

baseOptions.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            baseOptions.forEach((item) => {

                item.classList.remove("selected");

            });

            button.classList.add("selected");

            const base =
                Number(button.dataset.base);

            selectedBase = base;

            analyzeNumber(base);

        }
    );

});


/* =========================================
   COPY BUTTONS
========================================= */

const copyButtons =
    document.querySelectorAll(".copy-btn");


copyButtons.forEach((button) => {

    button.addEventListener(
        "click",
        async () => {

            const targetId =
                button.dataset.copy;

            const target =
                document.getElementById(targetId);

            if (!target) {
                return;
            }

            const text =
                target.textContent.trim();

            if (!text || text === "—") {
                return;
            }


            try {

                await navigator.clipboard.writeText(text);

                const original =
                    button.textContent;

                button.textContent =
                    "COPIED";

                setTimeout(() => {

                    button.textContent =
                        original;

                }, 1000);

            } catch (error) {

                console.error(
                    "Copy failed:",
                    error
                );

            }

        }
    );

});


/* =========================================
   CLEAR ERROR WHILE TYPING
========================================= */

numberInput.addEventListener(
    "input",
    () => {

        hideError();

        /*
            Don't keep old results when user
            starts entering a completely new value.
        */

    }
);
