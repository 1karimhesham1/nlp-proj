const meaningCloud = "https://api.meaningcloud.com/sentiment-2.1";
const axios = require("axios");

const analyze = async (url, key) => {
    try {
        // Make the API request to MeaningCloud
        const response = await axios.get(`${meaningCloud}?key=${key}&url=${url}&lang=en`);

        const { code } = response.data.status;

        // Handle errors based on the response code
        if (code === 100) {
            return handleError(code, "Please enter a valid URL");
        } else if (code === 212) {
            return handleError(code, response.data.status.msg);
        }

        // Process the successful response and send the data
        return successResponse(response.data, code);
    } catch (error) {
        // Handle any errors from the request
        return handleError(500, "An error occurred while making the API request.");
    }
};

const handleError = (code, msg) => {
    return {
        code: code,
        msg: msg
    };
};

// Process the successful response data
const successResponse = (data, code) => {
    const { score_tag, agreement, subjectivity, confidence, irony } = data;
    let sample = {
        score_tag: score_tag,
        agreement: agreement,
        subjectivity: subjectivity,
        confidence: confidence,
        irony: irony
    };
    return { sample, status: code };
};

module.exports = {
    analyze
};
