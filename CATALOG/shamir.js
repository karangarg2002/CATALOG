const fs = require('fs');

// Read the JSON test cases from the file
fs.readFile('test_case.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Parse the JSON data
    const testData = JSON.parse(data);

    // Function to decode the base-encoded values
    const decodeValue = (value, base) => {
        return parseInt(value, base);
    };

    // Function to apply Lagrange Interpolation to find the constant term c (f(0))
    const lagrangeInterpolation = (points) => {
        let result = 0;

        for (let i = 0; i < points.length; i++) {
            let term = points[i].y;

            for (let j = 0; j < points.length; j++) {
                if (i !== j) {
                    term *= (0 - points[j].x) / (points[i].x - points[j].x);
                }
            }

            result += term;
        }

        return result;
    };

    // Process each test case
    testData.test_cases.forEach((testCase, caseIndex) => {
        console.log(`Processing test case ${caseIndex + 1}:`);

        // Extracting keys n and k for the current test case
        const n = testCase.keys.n;
        const k = testCase.keys.k;

        // Prepare an array to store the points (x, y)
        const points = [];

        // Collect the points (x, y) from the JSON
        Object.keys(testCase).forEach(key => {
            if (key !== "keys") {
                const base = parseInt(testCase[key].base, 10);  // Convert base to decimal
                const value = testCase[key].value;
                const decodedValue = decodeValue(value, base);  // Decode the value
                const x = parseInt(key, 10);  // The key serves as x
                points.push({ x: x, y: decodedValue });
            }
        });

        // Log the points for verification
        console.log('Decoded points (x, y):', points);

        // Solve for the constant term c using Lagrange Interpolation
        const constantTermC = lagrangeInterpolation(points.slice(0, k));

        // Output the constant term c
        console.log('The constant term c of the polynomial is:', constantTermC);
        console.log('----------------------------------');
    });
});
