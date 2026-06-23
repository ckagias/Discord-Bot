function randomColor() {
    return Math.floor(Math.random() * 0xFFFFFF);
}

// Returns { color } on success or { error } on invalid input. Blank input yields a random color.
function parseHexColor(raw) {
    const trimmed = (raw ?? '').trim();
    if (!trimmed) return { color: randomColor() };

    const parsed = parseInt(trimmed.replace('#', ''), 16);
    if (isNaN(parsed) || parsed < 0 || parsed > 0xFFFFFF)
        return { error: 'Invalid hex color. Use format `#5865F2`.' };

    return { color: parsed };
}

module.exports = { randomColor, parseHexColor };
