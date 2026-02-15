export async function parseFb2(file) {
    console.log('[FB2] Starting parse...');
    const text = await file.text();
    console.log('[FB2] File size:', text.length, 'chars');

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');

    // Check for parse errors
    const parseError = xmlDoc.getElementsByTagName('parsererror')[0];
    if (parseError) {
        console.error('[FB2] Parse error:', parseError.textContent);
        throw new Error('FB2 XML parse error');
    }

    // Use getElementsByTagName to avoid namespace issues
    const body = xmlDoc.getElementsByTagName('body')[0];
    console.log('[FB2] Body found:', !!body);
    if (!body) {
        console.log('[FB2] All tags:', Array.from(xmlDoc.getElementsByTagName('*')).map(el => el.nodeName).slice(0, 20));
        return 'Текст не найден';
    }

    let fullText = '';

    function extract(node) {
        if (node.nodeType === 3) { // Text node
            return node.textContent;
        }

        let result = '';
        for (const child of node.childNodes) {
            const tagName = child.nodeName.toLowerCase().replace(/.*:/, ''); // Strip namespace

            if (tagName === 'p') {
                result += extract(child).trim() + '\n';
            } else if (tagName === 'title' || tagName === 'v') {
                result += '\n' + extract(child).trim().toUpperCase() + '\n\n';
            } else if (tagName === 'empty-line') {
                result += '\n';
            } else if (tagName === 'emphasis') {
                result += extract(child).trim();
            } else if (tagName === 'strong') {
                result += extract(child).trim();
            } else {
                result += extract(child);
            }
        }
        return result;
    }

    fullText = extract(body).trim();
    console.log('[FB2] Extracted text length:', fullText.length);
    return fullText;
}
