function isValidText(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function isValidDate(value) {
    return !isNaN(Date.parse(value));
}

function isValidImageUrl(value) {
    return typeof value === 'string' && value.startsWith('http');
}

module.exports = {
    isValidText,
    isValidDate,
    isValidImageUrl,
};
