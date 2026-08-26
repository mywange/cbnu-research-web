#!/usr/bin/env node

/**
 * ==========================================================================
 * CBNU Research Group - Node.js Data Synchronizer & Parser
 * Parses Markdown (.md) and JSON files in data/ subfolders into unified JSON
 * ==========================================================================
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');

function parseMarkdownFrontmatter(content) {
    const match = content.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    const metadata = {};
    let body = content.trim();

    if (match) {
        const yamlBlock = match[1];
        body = match[2].trim();

        const lines = yamlBlock.split(/\r?\n/);
        for (const line of lines) {
            const kvMatch = line.match(/^\s*([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);
            if (kvMatch) {
                const key = kvMatch[1].trim();
                let val = kvMatch[2].trim();

                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.substring(1, val.length - 1);
                }

                if (val === 'true') val = true;
                else if (val === 'false') val = false;
                else if (/^\d+$/.test(val) && key === 'id') val = parseInt(val, 10);

                metadata[key] = val;
            }
        }
    }

    if (!metadata.content) metadata.content = body;
    if (!metadata.summary && body) metadata.summary = body;

    return metadata;
}

function syncFolder(folderName, outputJsonName) {
    const folderPath = path.join(dataDir, folderName);
    const outputPath = path.join(dataDir, outputJsonName);
    const items = [];

    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('_') && f !== 'sample.md');
        let autoId = 1;

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const ext = path.extname(file).toLowerCase();

            try {
                if (ext === '.json') {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    if (data.id === undefined) data.id = autoId;
                    items.push(data);
                } else if (ext === '.md') {
                    const raw = fs.readFileSync(filePath, 'utf-8');
                    const parsed = parseMarkdownFrontmatter(raw);
                    if (!parsed.id) parsed.id = autoId;
                    items.push(parsed);
                }
                autoId++;
            } catch (err) {
                console.warn(`[WARN] Failed to parse ${file}:`, err.message);
            }
        }
    }

    if (items.length === 0 && fs.existsSync(outputPath)) {
        try {
            const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
            console.log(`[OK] ${outputJsonName} preserved (${existing.length} items).`);
            return;
        } catch {
            // overwrite with empty array
        }
    }

    items.sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        if (dateA !== dateB) return dateB.localeCompare(dateA);
        return (b.id || 0) - (a.id || 0);
    });

    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf-8');
    console.log(`[OK] ${outputJsonName} updated (${items.length} items).`);
}

console.log('========================================');
console.log('CBNU Research Group Data Synchronizer (Node)');
console.log('========================================');

syncFolder('news', 'news-data.json');
syncFolder('events', 'events-data.json');
syncFolder('gallery', 'gallery-data.json');

// Validate Publications
const pubDataPath = path.join(dataDir, 'publications-data.json');
if (fs.existsSync(pubDataPath)) {
    const pubs = JSON.parse(fs.readFileSync(pubDataPath, 'utf-8'));
    console.log(`[OK] publications-data.json validated (${pubs.length} publications).`);
}

console.log('\nData synchronization finished successfully!');
