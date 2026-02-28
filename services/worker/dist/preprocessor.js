export function preprocessJD(rawText) {
    const rawLower = rawText.toLowerCase();
    // 1. Zero-Token Early Exits
    const fatalKeywords = [
        'ts/sci',
        'security clearance required',
        '100% onsite',
        'must relocate'
    ];
    for (const kw of fatalKeywords) {
        if (rawLower.includes(kw)) {
            return {
                cleaned_jd_text: rawText,
                removed_sections: [],
                removed_char_count: 0,
                early_disqualification: `Fatal constraint detected before Vertex invocation: '${kw}'`
            };
        }
    }
    // 2. Deterministic EEOC, Benefits, and Privacy stripping (Boilerplate)
    const removed_sections = [];
    let cleaned = rawText;
    const boilerplatePatterns = [
        /equal opportunity employer.*$/gims,
        /eeo.*$/gims,
        /401k.*$/gims,
        /vision\/dental.*$/gims,
        /privacy policy.*$/gims,
        /benefits package.*$/gims
    ];
    for (const regex of boilerplatePatterns) {
        const matches = [...cleaned.matchAll(regex)];
        if (matches && matches.length > 0) {
            for (const match of matches) {
                removed_sections.push(match[0]);
                cleaned = cleaned.replace(match[0], '');
            }
        }
    }
    const removed_char_count = rawText.length - cleaned.length;
    return {
        cleaned_jd_text: cleaned.trim(),
        removed_sections,
        removed_char_count
    };
}
//# sourceMappingURL=preprocessor.js.map