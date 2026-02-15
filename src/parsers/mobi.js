// helper for PalmDoc LZ77 decompression
function decompressPalmDoc(compressed) {
    let out = [];
    let i = 0;
    while (i < compressed.length) {
        let b = compressed[i++];
        if (b >= 1 && b <= 8) {
            // copy next b bytes
            for (let j = 0; j < b; j++) out.push(compressed[i++]);
        } else if (b <= 0x7f) {
            // normal char
            out.push(b);
        } else if (b >= 0xc0) {
            // space + char
            out.push(32);
            out.push(b ^ 0x80);
        } else if (b >= 0x80) {
            // LZ77 distance/length
            let b2 = compressed[i++];
            let distance = ((b << 8) | b2) & 0x3fff;
            let length = (distance & 7) + 3;
            distance = (distance >> 3) & 0x07ff;

            let start = out.length - distance;
            for (let j = 0; j < length; j++) {
                out.push(out[start + j]);
            }
        } else {
            out.push(b);
        }
    }
    return new Uint8Array(out);
}

export async function parseMobi(file) {
    console.log('[MOBI] Starting parse...');
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);
    const data = new Uint8Array(buffer);

    // PalmDB Header
    const numRecords = view.getUint16(76);
    console.log('[MOBI] Number of records:', numRecords);

    // MOBI header starts at the first record
    const firstRecordOffset = view.getUint32(78);
    // MOBI header has a field for compression at offset 0
    const compression = view.getUint16(firstRecordOffset);
    console.log('[MOBI] Compression type:', compression, compression === 2 ? '(PalmDoc)' : compression === 1 ? '(none)' : '(unknown)');

    let fullContent = [];

    // Text records actually start after the MOBI header records
    // But for a simple parser, we'll try to find TEXtREmS records or just handle all
    for (let i = 1; i < numRecords; i++) {
        const offset = view.getUint32(78 + i * 8);
        const nextOffset = (i < numRecords - 1) ? view.getUint32(78 + (i + 1) * 8) : buffer.byteLength;
        let record = data.slice(offset, nextOffset);

        if (compression === 2) {
            record = decompressPalmDoc(record);
        }

        // Accumulate raw bytes
        for (let b of record) fullContent.push(b);
    }

    console.log('[MOBI] Total content bytes:', fullContent.length);

    // Decode as UTF-8 (most modern MOBI files use UTF-8)
    const rawBytes = new Uint8Array(fullContent);
    const decoded = new TextDecoder('utf-8').decode(rawBytes);
    console.log('[MOBI] Decoded as UTF-8, text length:', decoded.length);

    // Extract text from HTML if it exists
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = decoded;
    let finalText = tempDiv.innerText || decoded;

    // Remove any remaining HTML tags
    finalText = finalText.replace(/<[^>]+>/g, '');

    console.log('[MOBI] Final text length:', finalText.length);
    return finalText;
}
