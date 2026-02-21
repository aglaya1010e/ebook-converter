/**
 * Split text content into specified number of parts
 * @param {string} text - The text content to split
 * @param {number} parts - Number of parts (1-10)
 * @returns {string[]} - Array of text parts
 */
export function splitText(text, parts) {
    if (parts < 1 || parts > 10) {
        throw new Error('Parts must be between 1 and 10');
    }

    if (parts === 1) {
        return [text];
    }

    const totalLength = text.length;
    const partSize = Math.ceil(totalLength / parts);
    const result = [];

    for (let i = 0; i < parts; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, totalLength);
        result.push(text.substring(start, end));
    }

    return result;
}

/**
 * Create downloadable parts from split text
 * @param {string[]} parts - Array of text parts
 * @param {string} originalFileName - Original file name
 * @returns {Array<{blob: Blob, fileName: string}>} - Array of downloadable parts
 */
export function createDownloadableParts(parts, originalFileName) {
    const baseName = originalFileName.replace(/\.txt$/i, '');

    return parts.map((part, index) => ({
        blob: new Blob([part], { type: 'text/plain' }),
        fileName: `${baseName}_part${index + 1}.txt`
    }));
}
