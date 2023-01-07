export function formatDate(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    const formattedDateString = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    return (formattedDateString)
}

export function calculateSkillsPercent(skills) {
    let count = 0;
    let passed = 0;
    let percents = 0.0;
    for (let i = 0; i < Object.keys(skills).length; i++) {
        count += Object.values(skills)[i]['count'];
        passed += Object.values(skills)[i]['passed'];
    }
    percents = passed * 100 / count;
    return (percents.toFixed(2));
}

export function getCompleteStatus(externalItems) {
    let status = '';

    for (let i = 0; i < externalItems.length; i++) {
        const node = externalItems[i];
        switch (node['type']) {
            case 'make-error':
                status += 'Build error\n';
                break;
            case 'coding-style-fail':
                status += 'Too many style errors\n';
                break;
            case 'banned':
                status += 'Banned function used\n';
                break;
            case 'crash':
                status += 'Crash\n';
                break;
            case 'delivery-error':
                status += 'Delivery error\n';
                break;
            case 'no-test-passed':
                status += 'No tests passed\n';
                break;
            default:
                break;
        }
    }
    if (status.length < 1)
        status = 'Prerequisites met';
    return (status);
}

export function getCompleteNorme(externalItems) {
    let norme = '[-] Major\n[--] Minor\n[---] Info';

    for (let i = 0; i < externalItems.length; i++) {
        const node = externalItems[i];
        switch (node['type']) {
            case 'lint.major':
                norme = norme.replace('-', node['value']);
                break;
            case 'lint.minor':
                norme = norme.replace('--', node['value']);
                break;
            case 'lint.info':
                norme = norme.replace('---', node['value']);
                break;
            default:
                break;
        }
    }
    return (norme);
}

export function getCompleteUrl(testCode, testSlug, testRunId) {
    let url = 'https://my.epitech.eu/index.html#d/2021/';

    url += testCode;
    url += '/';
    url += testSlug;
    url += '/';
    url += testRunId;
    return (url);
}

export function getAdaptiveColor(percentPassed) {
    if (percentPassed < 25)
        return (0xdb0f0f);
    else if (percentPassed < 75)
        return (0xd36410);
    else
        return (0x45ad0e);
}
