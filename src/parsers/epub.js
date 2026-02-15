import JSZip from 'jszip';

export async function parseEpub(file) {
    console.log('[EPUB] Starting parse...');
    const zip = await JSZip.loadAsync(file);
    console.log('[EPUB] ZIP loaded, files:', Object.keys(zip.files).length);

    const containerXml = await zip.file('META-INF/container.xml').async('string');
    const parser = new DOMParser();
    const containerDoc = parser.parseFromString(containerXml, 'text/xml');
    const rootfile = containerDoc.getElementsByTagName('rootfile')[0];
    if (!rootfile) throw new Error('Invalid EPUB: No rootfile found');

    const opfPath = rootfile.getAttribute('full-path');
    console.log('[EPUB] OPF path:', opfPath);

    const opfXml = await zip.file(opfPath).async('string');
    const opfDoc = parser.parseFromString(opfXml, 'text/xml');
    const spineItems = Array.from(opfDoc.getElementsByTagName('itemref'));
    const manifestItems = Array.from(opfDoc.getElementsByTagName('item'));
    console.log('[EPUB] Spine items:', spineItems.length, 'Manifest items:', manifestItems.length);

    const basePath = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : '';

    let fullText = '';
    let processedChapters = 0;

    for (const itemref of spineItems) {
        const idref = itemref.getAttribute('idref');
        const manifestItem = manifestItems.find(item => item.getAttribute('id') === idref);
        if (!manifestItem) {
            console.warn('[EPUB] No manifest item for idref:', idref);
            continue;
        }

        const href = manifestItem.getAttribute('href');
        const filePath = basePath + href;
        const zippedFile = zip.file(filePath);

        if (!zippedFile) {
            console.warn('[EPUB] File not found:', filePath);
            continue;
        }

        const contentXml = await zippedFile.async('string');
        console.log(`[EPUB] Chapter ${filePath}: content length ${contentXml.length} bytes`);

        // Use innerHTML to parse, then innerText to extract clean text without HTML tags
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentXml;

        let chapterText = tempDiv.innerText || tempDiv.textContent || '';

        // Remove any remaining HTML tags that might have slipped through
        chapterText = chapterText.replace(/<[^>]+>/g, '');
        // Clean up multiple consecutive newlines
        chapterText = chapterText.replace(/\n{3,}/g, '\n\n');

        console.log(`[EPUB] Extracted text length: ${chapterText.length}, trimmed: ${chapterText.trim().length}`);

        if (chapterText.trim()) {
            fullText += chapterText + '\n\n';
            processedChapters++;
        } else {
            console.warn('[EPUB] Empty chapter after extraction');
        }
    }

    console.log('[EPUB] Processed chapters:', processedChapters, 'Total text length:', fullText.length);
    return fullText.trim();
}
