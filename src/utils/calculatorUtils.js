// Універсальна бібліотека допоміжних функцій для калькуляторів антен

/**
 * Форматування довжини в різних одиницях
 */
export const formatLength = (valueInMm, unit = 'cm', precision = 2) => {
    switch (unit) {
        case 'm':
            return (valueInMm / 1000).toFixed(4);
        case 'cm':
            return (valueInMm / 10).toFixed(precision);
        case 'mm':
        default:
            return valueInMm.toFixed(1);
    }
};

/**
 * Отримання підпису одиниці
 */
export const getUnitLabel = (unit) => {
    switch (unit) {
        case 'm':
            return 'м';
        case 'cm':
            return 'см';
        case 'mm':
        default:
            return 'мм';
    }
};

/**
 * Конвертація значення з сантиметрів в задану одиницю
 */
export const convertFromCm = (valueInCm, unit) => {
    switch (unit) {
        case 'm':
            return (valueInCm / 100).toFixed(4);
        case 'mm':
            return (valueInCm * 10).toFixed(1);
        case 'cm':
        default:
            return parseFloat(valueInCm).toFixed(2);
    }
};

/**
 * Функція для стандартних частот
 */
export const getStandardFrequencies = () => [
    { value: '', label: 'Ввести частоту вручну' },
    { value: '144', label: '144 МГц (2м)' },
    { value: '433.9', label: 'LPD' },
    { value: '446', label: 'PMR' },
    { value: '462.64', label: 'GMRS' },
    { value: '465.135', label: 'FRS' },
    { value: '925', label: 'GSM 900' }
];

/**
 * Розрахунок довжини хвилі
 */
export const calculateWavelength = (frequency) => {
    return 299792.458 / frequency; // у мм
};

/**
 * Розрахунок коефіцієнта буму для Yagi антени
 */
export const calculateBoomCorrection = (boomDiameter, wavelength, isRound = true, mountingType = 0) => {
    const ratio = boomDiameter / wavelength;
    let correction = ratio * ratio * (630 * ratio * ratio - 164 * ratio + 13.5);
    
    if (!isRound) {
        correction = ratio * ratio * (1221 * ratio * ratio - 269.4 * ratio + 18.8);
    }
    
    if (mountingType === 0) {
        correction *= 2;
    }
    
    return correction;
};

/**
 * Функція DL6WU для розрахунку Yagi антени
 */
export const calculateYagiDL6WU = (frequency, elements, boomDiameter, elementDiameter, mountingType, dipoleForm, boomForm, elementShape, elementThickness = 0) => {
    const wavelength = calculateWavelength(frequency);
    const lambda = wavelength / 1000; // в метрах для розрахунків
    
    // Базові параметри
    const results = {
        wavelength: wavelength,
        totalElements: elements,
        mounting: mountingType,
        dipoleForm: dipoleForm,
        elementShape: elementShape,
        boomForm: boomForm,
        elements: [],
        boomLength: 0,
        gain: 0
    };
    
    // Розрахунок коефіцієнта буму
    const boomCorrection = calculateBoomCorrection(boomDiameter, wavelength, boomForm === 'round', mountingType);
    
    // Базові довжини елементів (приблизні формули DL6WU)
    const reflectorLength = 0.508 * lambda; // 508 мм на метр
    const dipoleLength = dipoleForm === 1 ? 0.505 * lambda : 0.473 * lambda; // петльовий або розрізний
    
    // Рефлектор
    results.elements.push({
        type: 'reflector',
        name: 'R',
        length: (reflectorLength * 1000) + (boomCorrection * wavelength), // мм
        position: 0,
        distance: 0
    });
    
    // Диполь (активний вібратор)
    const dipolePosition = 0.2 * lambda * 1000; // мм
    results.elements.push({
        type: 'dipole',
        name: 'F',
        length: (dipoleLength * 1000) + (boomCorrection * wavelength), // мм
        position: dipolePosition,
        distance: dipolePosition,
        gap: dipoleForm === 1 ? 0.012 * lambda * 1000 : undefined // для петльового
    });
    
    // Директори
    let directorPosition = dipolePosition;
    const directorSpacing = 0.2 * lambda * 1000; // початкова відстань між директорами
    
    for (let i = 1; i <= elements - 2; i++) {
        const spacingMultiplier = 1 + (i - 1) * 0.15; // збільшення відстані
        const lengthReduction = 0.95 - (i - 1) * 0.01; // зменшення довжини
        
        directorPosition += directorSpacing * spacingMultiplier;
        
        results.elements.push({
            type: 'director',
            name: `D${i}`,
            length: (dipoleLength * lengthReduction * 1000) + (boomCorrection * wavelength), // мм
            position: directorPosition,
            distance: directorPosition - results.elements[results.elements.length - 1].position
        });
    }
    
    // Загальна довжина буму
    results.boomLength = directorPosition;
    
    // Приблизне підсилення (емпірична формула)
    results.gain = 10 + 1.5 * Math.log10(elements) + 10 * Math.log10(results.boomLength / wavelength);
    results.gain = Math.round(results.gain * 10) / 10;
    
    return results;
};

/**
 * Форматування результатів Yagi в структурованому HTML вигляді
 */
export const formatYagiResultsHTML = (results, unit = 'mm') => {
    const mountingTexts = [
        'Елементи монтуються по центру металічного буму та електрично з\'єднані з ним.',
        'Елементи ізольовані від буму, або монтуються на бумі зверху.',
        'Елементи на діелектричному бумі або на металічному, але віддалені від нього.'
    ];

    return {
        header: {
            title: 'Волновий канал Long-yagi DL6WU',
            subtitle: 'Javascript Version 2025-09-10 by UARO (based on DL6WU.BAS source code)',
            dipoleForm: results.dipoleForm === 1 ? 'Петльовий' : 'Розрізний',
            elementShape: results.elementShape === 'round' ? 'Круглий' : 'Плоский',
            boomForm: results.boomForm === 'round' ? 'круглим' : 'квадратним'
        },
        basicParams: {
            frequency: `${results.frequency} МГц`,
            wavelength: `${formatLength(results.wavelength, unit)} ${getUnitLabel(unit)}`,
            totalElements: results.totalElements,
            boomLength: `${formatLength(results.boomLength, unit)} ${getUnitLabel(unit)}`,
            gain: `${results.gain} dBi (прибл.)`
        },
        elements: results.elements.map((element, index) => ({
            name: element.name,
            type: element.type,
            length: `${formatLength(element.length, unit)} ${getUnitLabel(unit)}`,
            position: `${formatLength(element.position, unit)} ${getUnitLabel(unit)}`,
            distance: index > 0 ? `${formatLength(element.distance, unit)} ${getUnitLabel(unit)}` : '0',
            gap: element.gap ? `${formatLength(element.gap, unit)} ${getUnitLabel(unit)}` : null
        })),
        mounting: mountingTexts[results.mounting]
    };
};

/**
 * Форматування результатів Yagi в текстовому вигляді
 */
export const formatYagiResults = (results, unit = 'mm') => {
    let output = `Javascript Version 2025-09-10 by UARO\n`;
    output += `based on DL6WU.BAS source code\n`;
    output += `Волновий канал Long-yagi DL6WU\n`;
    output += `-------------------------------------------------------------\n`;
    output += `Форма активного вібратора: ${results.dipoleForm === 1 ? 'Петльовий' : 'Розрізний'}\n`;
    output += `Вид елемента: ${results.elementShape === 'round' ? 'Круглий' : 'Плоский'}\n`;
    output += `Бум з ${results.boomForm === 'round' ? 'круглим' : 'квадратним'} поперечним перерізом.\n`;
    output += `-------------------------------------------------------------\n`;
    output += `Частота f: ${results.frequency} МГц\n`;
    output += `Довжина хвилі λ: ${formatLength(results.wavelength, unit)} ${getUnitLabel(unit)}\n`;
    output += `-------------------------------------------------------------\n`;
    output += `Загальне число елементів: ${results.totalElements}\n`;
    output += `Довжина стріли: ${formatLength(results.boomLength, unit)} ${getUnitLabel(unit)}\n`;
    output += `Підсилення: ${results.gain} dBi (прибл.)\n`;
    output += `-------------------------------------------------------------\n`;
    
    results.elements.forEach((element, index) => {
        output += `Довжина ${element.name}: ${formatLength(element.length, unit)} ${getUnitLabel(unit)}\n`;
        output += `Позиція ${element.name}: ${formatLength(element.position, unit)} ${getUnitLabel(unit)}\n`;
        
        if (element.gap) {
            output += `Проміжок в місці підключення g <= ${formatLength(element.gap, unit)} ${getUnitLabel(unit)}\n`;
        }
        
        if (index > 0) {
            output += `Відстань ${results.elements[index-1].name}-${element.name}: ${formatLength(element.distance, unit)} ${getUnitLabel(unit)}\n`;
        }
        
        output += `-------------------------------------------------------------\n`;
    });
    
    const mountingTexts = [
        'Елементи монтуються по центру металічного буму та електрично з\'єднані з ним.',
        'Елементи ізольовані від буму, або монтуються на бумі зверху.',
        'Елементи на діелектричному бумі або на металічному, але віддалені від нього.'
    ];
    
    output += mountingTexts[results.mounting] + '\n';
    output += `Розрахунок ведеться з урахуванням бумкорекції.\n`;
    
    return output;
};

/**
 * Перевірка валідності вхідних даних
 */
export const validateYagiInputs = (frequency, elements, boomDiameter, elementDiameter) => {
    const errors = [];
    
    if (!frequency || frequency <= 0) {
        errors.push('Некоректна частота');
    }
    
    if (!elements || elements < 3) {
        errors.push('Мінімальна кількість елементів - 3');
    }
    
    if (!boomDiameter || boomDiameter <= 0) {
        errors.push('Некоректний діаметр буму');
    }
    
    if (!elementDiameter || elementDiameter <= 0) {
        errors.push('Некоректний діаметр елемента');
    }
    
    if (frequency && boomDiameter) {
        const wavelength = calculateWavelength(frequency);
        if (boomDiameter / wavelength > 0.09) {
            errors.push('Діаметр буму занадто великий для цієї частоти');
        }
    }
    
    return errors;
};
