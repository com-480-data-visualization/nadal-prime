const ERAS = [
    {
        id: "open",
        name: "Open Era Foundations",
        period: "1968-1979",
        start: 1968,
        end: 1979,
        color: "#2f80ed",
        summary: "Net play remains prominent in the charted profile, matching an era shaped by wood rackets, lower rally speeds, and forward court positioning."
    },
    {
        id: "graphite",
        name: "Graphite Era",
        period: "1980-1994",
        start: 1980,
        end: 1994,
        color: "#00a878",
        summary: "Graphite power increases the ceiling of the sport, but elite profiles still contain many players comfortable turning rallies into net attacks."
    },
    {
        id: "transition",
        name: "Transition Era",
        period: "1995-2007",
        start: 1995,
        end: 2007,
        color: "#f59f00",
        summary: "The relationship between volley share and dominance loosens as polyester strings, heavier topspin, and stronger defense push more value into baseline exchanges."
    },
    {
        id: "big3",
        name: "Big 3 Era",
        period: "2008-2019",
        start: 2008,
        end: 2019,
        color: "#e25555",
        summary: "The highest ATP point totals now sit inside complete baseline-first profiles: the net is still useful, but it is no longer the main source of separation."
    },
    {
        id: "modern",
        name: "Modern Era",
        period: "2020-Present",
        start: 2020,
        end: Infinity,
        color: "#7c5ce0",
        summary: "Modern shot patterns keep the rally compact and aggressive, with volleys used as tactical finishers rather than the core of the dominant profile."
    }
];

const ERA_BY_ID = ERAS.reduce((lookup, era) => {
    lookup[era.id] = era;
    return lookup;
}, {});

const SHOT_TYPES = [
    { key: "Dr_shots", label: "Drop shots", color: "#6f7d95" },
    { key: "Gs_shots", label: "Groundstrokes", color: "#1e5bff" },
    { key: "Lo_shots", label: "Lobs", color: "#00a878" },
    { key: "Ov_shots", label: "Overheads", color: "#f59f00" },
    { key: "Sl_shots", label: "Slices", color: "#e25555" },
    { key: "Sw_shots", label: "Swing volleys", color: "#7c5ce0" },
    { key: "Vo_shots", label: "Volleys", color: "#00a3b5" }
];

// Era data: ATP points are indicative for the historical framing mini-charts.
const eraData = {
    era1: {
        name: "Open Era Foundations (1968-1979)",
        players: [
            { rank: 1, name: "Rod Laver", points: 2500 },
            { rank: 2, name: "Jimmy Connors", points: 2300 },
            { rank: 3, name: "Bjorn Borg", points: 2100 },
            { rank: 4, name: "Guillermo Vilas", points: 1900 },
            { rank: 5, name: "Arthur Ashe", points: 1700 },
            { rank: 6, name: "Stan Smith", points: 1500 },
            { rank: 7, name: "Ken Rosewall", points: 1400 },
            { rank: 8, name: "Tom Okker", points: 1200 },
            { rank: 9, name: "Ilie Nastase", points: 1100 },
            { rank: 10, name: "John McEnroe", points: 900 }
        ]
    },
    era2: {
        name: "Graphite Era (1980-1994)",
        players: [
            { rank: 1, name: "Ivan Lendl", points: 3200 },
            { rank: 2, name: "John McEnroe", points: 3000 },
            { rank: 3, name: "Jimmy Connors", points: 2800 },
            { rank: 4, name: "Bjorn Borg", points: 2600 },
            { rank: 5, name: "Pete Sampras", points: 2400 },
            { rank: 6, name: "Boris Becker", points: 2200 },
            { rank: 7, name: "Stefan Edberg", points: 2000 },
            { rank: 8, name: "Michael Chang", points: 1800 },
            { rank: 9, name: "Guillermo Vilas", points: 1600 },
            { rank: 10, name: "Goran Ivanisevic", points: 1400 }
        ]
    },
    era3: {
        name: "Transition Era (1995-2007)",
        players: [
            { rank: 1, name: "Pete Sampras", points: 3500 },
            { rank: 2, name: "Andre Agassi", points: 3300 },
            { rank: 3, name: "Roger Federer", points: 3100 },
            { rank: 4, name: "Goran Ivanisevic", points: 2800 },
            { rank: 5, name: "Yevgeny Kafelnikov", points: 2600 },
            { rank: 6, name: "Carlos Moya", points: 2400 },
            { rank: 7, name: "Gustavo Kuerten", points: 2200 },
            { rank: 8, name: "Marcelo Rios", points: 2000 },
            { rank: 9, name: "Juan Carlos Ferrero", points: 1800 },
            { rank: 10, name: "Tommy Haas", points: 1600 }
        ]
    },
    era4: {
        name: "Big 3 Era (2008-2019)",
        players: [
            { rank: 1, name: "Roger Federer", points: 4500 },
            { rank: 2, name: "Rafael Nadal", points: 4800 },
            { rank: 3, name: "Novak Djokovic", points: 5200 },
            { rank: 4, name: "Andy Murray", points: 3200 },
            { rank: 5, name: "David Ferrer", points: 2800 },
            { rank: 6, name: "Dominic Thiem", points: 2400 },
            { rank: 7, name: "Stan Wawrinka", points: 2200 },
            { rank: 8, name: "Juan Martin del Potro", points: 2000 },
            { rank: 9, name: "Milos Raonic", points: 1800 },
            { rank: 10, name: "Kei Nishikori", points: 1600 }
        ]
    },
    era5: {
        name: "Modern Era (2020-Present)",
        players: [
            { rank: 1, name: "Carlos Alcaraz", points: 12050 },
            { rank: 2, name: "Jannik Sinner", points: 11500 },
            { rank: 3, name: "Alexander Zverev", points: 5110 },
            { rank: 4, name: "Novak Djokovic", points: 4820 },
            { rank: 5, name: "Felix Auger-Aliassime", points: 4190 },
            { rank: 6, name: "Taylor Fritz", points: 4085 },
            { rank: 7, name: "Alex De Minaur", points: 4080 },
            { rank: 8, name: "Lorenzo Musetti", points: 3990 },
            { rank: 9, name: "Ben Shelton", points: 3960 },
            { rank: 10, name: "Jack Draper", points: 2990 }
        ]
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initializeChartPlaceholders();
    addScrollAnimations();
    initializeRallyStory();
});

function initializeChartPlaceholders() {
    const eraSections = document.querySelectorAll(".era-section");

    eraSections.forEach((section, index) => {
        const eraKey = `era${index + 1}`;
        const eraBox = section.querySelector(".era-box");
        const chartContent = section.querySelector(".chart-content");
        const data = eraData[eraKey];

        if (!eraBox || !chartContent || !data) {
            return;
        }

        eraBox.addEventListener("mouseenter", () => {
            createEraBarChart(chartContent, data);
        });

        eraBox.addEventListener("mouseleave", () => {
            chartContent.innerHTML = "";
            hideTooltip();
        });
    });
}

function createEraBarChart(container, data) {
    container.innerHTML = "";

    const width = Math.max(container.clientWidth || 520, 320);
    const height = Math.max(container.clientHeight || 300, 260);
    const margin = { top: 16, right: 18, bottom: 92, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const maxPoints = Math.max(...data.players.map((player) => player.points));
    const xStep = innerWidth / data.players.length;
    const barWidth = Math.max(10, xStep * 0.68);
    const yMax = niceMax(maxPoints);
    const yScale = (value) => margin.top + innerHeight - (value / yMax) * innerHeight;

    const svg = createSvg("svg", {
        class: "chart-svg",
        viewBox: `0 0 ${width} ${height}`,
        role: "img",
        "aria-label": `${data.name} top player ATP points`
    });

    const axisGroup = createSvg("g", { class: "chart-axis" });
    svg.appendChild(axisGroup);

    getTicks(yMax, 4).forEach((tick) => {
        const y = yScale(tick);
        axisGroup.appendChild(createSvg("line", {
            x1: margin.left,
            x2: width - margin.right,
            y1: y,
            y2: y,
            stroke: "#e3e7ef"
        }));
        axisGroup.appendChild(createSvg("text", {
            x: margin.left - 8,
            y: y + 4,
            "text-anchor": "end"
        }, formatNumber(tick)));
    });

    svg.appendChild(createSvg("line", {
        x1: margin.left,
        x2: width - margin.right,
        y1: margin.top + innerHeight,
        y2: margin.top + innerHeight,
        stroke: "#aeb7c8"
    }));
    svg.appendChild(createSvg("line", {
        x1: margin.left,
        x2: margin.left,
        y1: margin.top,
        y2: margin.top + innerHeight,
        stroke: "#aeb7c8"
    }));

    data.players.forEach((player, index) => {
        const x = margin.left + index * xStep + (xStep - barWidth) / 2;
        const y = yScale(player.points);
        const barHeight = margin.top + innerHeight - y;
        const color = interpolateColor("#2f80ed", "#7c5ce0", index / Math.max(1, data.players.length - 1));
        const rect = createSvg("rect", {
            x,
            y,
            width: barWidth,
            height: barHeight,
            fill: color,
            opacity: "0.86",
            rx: "3"
        });

        rect.addEventListener("mousemove", (event) => {
            showTooltip(event, `<strong>${player.name}</strong>ATP points: ${formatNumber(player.points)}`);
        });
        rect.addEventListener("mouseleave", hideTooltip);

        svg.appendChild(rect);
        svg.appendChild(createSvg("text", {
            x: x + barWidth / 2,
            y: margin.top + innerHeight + 12,
            "text-anchor": "end",
            transform: `rotate(-42 ${x + barWidth / 2} ${margin.top + innerHeight + 12})`,
            fill: "#596275",
            "font-size": "10"
        }, player.name));
    });

    svg.appendChild(createSvg("text", {
        x: 16,
        y: margin.top + innerHeight / 2,
        transform: `rotate(-90 16 ${margin.top + innerHeight / 2})`,
        fill: "#596275",
        "font-size": "11",
        "text-anchor": "middle"
    }, "ATP points"));

    container.appendChild(svg);
}

async function initializeRallyStory() {
    const scatterHost = document.getElementById("rally-scatter");
    const histogramHost = document.getElementById("rally-histogram");

    if (!scatterHost || !histogramHost) {
        return;
    }

    scatterHost.innerHTML = '<div class="chart-loading">Loading rally player profiles...</div>';
    histogramHost.innerHTML = '<div class="chart-loading">Loading shot distribution...</div>';

    try {
        const [shotsRows, atpRows] = await Promise.all([
            fetchCsv("datasets/clean_datasets/shots_stats.csv"),
            fetchCsv("datasets/clean_datasets/all_atp_matches.csv")
        ]);
        const rallyData = prepareRallyData(shotsRows, atpRows);
        const scatterChart = createScatterChart(scatterHost, rallyData);
        const histogramChart = createHistogramChart(histogramHost, rallyData);
        const state = {
            activeEra: "all",
            rallyData,
            scatterChart,
            histogramChart,
            steps: Array.from(document.querySelectorAll(".rally-step"))
        };

        state.steps.forEach((step) => {
            const era = ERA_BY_ID[step.dataset.era];
            if (era) {
                step.style.setProperty("--era-color", era.color);
            }
            step.addEventListener("focus", () => setActiveRallyEra(state, step.dataset.era));
            step.addEventListener("click", () => setActiveRallyEra(state, step.dataset.era));
        });

        setupRallyScroll(state);
        setActiveRallyEra(state, "all", true);
    } catch (error) {
        const message = "The rally charts could not load. Start the page through a local server so the CSV files are available.";
        scatterHost.innerHTML = `<div class="chart-error">${message}</div>`;
        histogramHost.innerHTML = `<div class="chart-error">${error.message}</div>`;
        console.error(error);
    }
}

async function fetchCsv(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Could not load ${path}`);
    }

    return parseCsv(await response.text());
}

function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/);
    if (!lines.length) {
        return [];
    }

    const headers = splitCsvLine(lines[0]).map((header, index) => header || `column_${index}`);
    const rows = [];

    for (let index = 1; index < lines.length; index += 1) {
        if (!lines[index]) {
            continue;
        }

        const values = splitCsvLine(lines[index]);
        const row = {};
        headers.forEach((header, headerIndex) => {
            row[header] = values[headerIndex] || "";
        });
        rows.push(row);
    }

    return rows;
}

function splitCsvLine(line) {
    const values = [];
    let current = "";
    let insideQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
        const character = line[index];
        const nextCharacter = line[index + 1];

        if (character === '"' && insideQuotes && nextCharacter === '"') {
            current += '"';
            index += 1;
        } else if (character === '"') {
            insideQuotes = !insideQuotes;
        } else if (character === "," && !insideQuotes) {
            values.push(current);
            current = "";
        } else {
            current += character;
        }
    }

    values.push(current);
    return values;
}

function prepareRallyData(shotsRows, atpRows) {
    const pointsByPlayerEra = buildAtpPointLookup(atpRows);
    const profileMap = new Map();

    shotsRows.forEach((row) => {
        const year = parseYear(row.match_id);
        const era = getEraForYear(year);
        const player = (row.player || "").trim();

        if (!era || !player) {
            return;
        }

        const normalizedPlayer = normalizeName(player);
        const key = `${era.id}|${normalizedPlayer}`;

        if (!profileMap.has(key)) {
            profileMap.set(key, {
                key,
                eraId: era.id,
                player,
                normalizedPlayer,
                totalShots: 0,
                counts: createShotCountBucket(),
                matches: new Set()
            });
        }

        const profile = profileMap.get(key);
        profile.totalShots += toNumber(row.shots);
        profile.matches.add(row.match_id);
        SHOT_TYPES.forEach((type) => {
            profile.counts[type.key] += toNumber(row[type.key]);
        });
    });

    const profiles = Array.from(profileMap.values()).map((profile) => {
        const totalTypeShots = SHOT_TYPES.reduce((sum, type) => sum + profile.counts[type.key], 0);
        const denominator = totalTypeShots || profile.totalShots || 1;
        const shotPercentages = {};

        SHOT_TYPES.forEach((type) => {
            shotPercentages[type.key] = (profile.counts[type.key] / denominator) * 100;
        });

        return {
            ...profile,
            era: ERA_BY_ID[profile.eraId],
            matches: profile.matches.size,
            totalTypeShots,
            shotPercentages,
            volleyPct: shotPercentages.Vo_shots,
            atpPoints: pointsByPlayerEra.get(profile.key) || null
        };
    }).filter((profile) => profile.totalTypeShots > 0);

    const scatterData = profiles.filter((profile) => Number.isFinite(profile.atpPoints) && profile.atpPoints > 0);
    const distributions = buildShotDistributions(profiles);

    return {
        profiles,
        scatterData,
        distributions
    };
}

function buildAtpPointLookup(rows) {
    const lookup = new Map();

    rows.forEach((row) => {
        const year = parseYear(row.tourney_date);
        const era = getEraForYear(year);

        if (!era) {
            return;
        }

        addPointRecord(lookup, era.id, row.winner_name, row.winner_rank_points);
        addPointRecord(lookup, era.id, row.loser_name, row.loser_rank_points);
    });

    return lookup;
}

function addPointRecord(lookup, eraId, player, pointsValue) {
    const points = toNumber(pointsValue);
    const normalizedPlayer = normalizeName(player);

    if (!normalizedPlayer || points <= 0) {
        return;
    }

    const key = `${eraId}|${normalizedPlayer}`;
    const previous = lookup.get(key) || 0;

    if (points > previous) {
        lookup.set(key, points);
    }
}

function buildShotDistributions(profiles) {
    const buckets = new Map();
    buckets.set("all", createShotCountBucket());
    ERAS.forEach((era) => buckets.set(era.id, createShotCountBucket()));

    profiles.forEach((profile) => {
        addShotCounts(buckets.get("all"), profile.counts);
        addShotCounts(buckets.get(profile.eraId), profile.counts);
    });

    const distributions = new Map();
    buckets.forEach((counts, key) => {
        const total = SHOT_TYPES.reduce((sum, type) => sum + counts[type.key], 0);
        distributions.set(key, {
            counts,
            total,
            values: SHOT_TYPES.map((type) => ({
                ...type,
                value: total ? (counts[type.key] / total) * 100 : 0
            }))
        });
    });

    return distributions;
}

function createShotCountBucket() {
    return SHOT_TYPES.reduce((bucket, type) => {
        bucket[type.key] = 0;
        return bucket;
    }, {});
}

function addShotCounts(target, source) {
    SHOT_TYPES.forEach((type) => {
        target[type.key] += source[type.key] || 0;
    });
}

function createScatterChart(host, rallyData) {
    host.innerHTML = "";

    const width = 760;
    const height = 430;
    const margin = { top: 34, right: 28, bottom: 62, left: 76 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const maxVolley = Math.max(...rallyData.scatterData.map((profile) => profile.volleyPct), 1);
    const maxPoints = Math.max(...rallyData.scatterData.map((profile) => profile.atpPoints), 1);
    const xMax = Math.ceil((maxVolley + 1) / 2) * 2;
    const yMax = niceMax(maxPoints);
    const xScale = (value) => margin.left + (value / xMax) * innerWidth;
    const yScale = (value) => margin.top + innerHeight - (value / yMax) * innerHeight;
    const svg = createSvg("svg", {
        class: "chart-svg",
        viewBox: `0 0 ${width} ${height}`
    });
    const grid = createSvg("g", { class: "chart-grid" });
    const axes = createSvg("g", { class: "chart-axis" });
    const pointsLayer = createSvg("g", { class: "scatter-points" });
    const labelsLayer = createSvg("g", { class: "scatter-labels" });
    const circles = new Map();

    getTicks(xMax, 6).forEach((tick) => {
        const x = xScale(tick);
        grid.appendChild(createSvg("line", {
            x1: x,
            x2: x,
            y1: margin.top,
            y2: margin.top + innerHeight
        }));
        axes.appendChild(createSvg("text", {
            x,
            y: height - 30,
            "text-anchor": "middle"
        }, `${roundValue(tick)}%`));
    });

    getTicks(yMax, 5).forEach((tick) => {
        const y = yScale(tick);
        grid.appendChild(createSvg("line", {
            x1: margin.left,
            x2: width - margin.right,
            y1: y,
            y2: y
        }));
        axes.appendChild(createSvg("text", {
            x: margin.left - 10,
            y: y + 4,
            "text-anchor": "end"
        }, formatNumber(tick)));
    });

    axes.appendChild(createSvg("line", {
        x1: margin.left,
        x2: width - margin.right,
        y1: margin.top + innerHeight,
        y2: margin.top + innerHeight,
        stroke: "#aeb7c8"
    }));
    axes.appendChild(createSvg("line", {
        x1: margin.left,
        x2: margin.left,
        y1: margin.top,
        y2: margin.top + innerHeight,
        stroke: "#aeb7c8"
    }));
    axes.appendChild(createSvg("text", {
        class: "chart-axis-label",
        x: margin.left + innerWidth / 2,
        y: height - 6,
        "text-anchor": "middle"
    }, "Volley shot percentage"));
    axes.appendChild(createSvg("text", {
        class: "chart-axis-label",
        x: 18,
        y: margin.top + innerHeight / 2,
        transform: `rotate(-90 18 ${margin.top + innerHeight / 2})`,
        "text-anchor": "middle"
    }, "Peak ATP points in era"));

    svg.appendChild(grid);
    svg.appendChild(axes);

    drawScatterLegend(svg, width);

    rallyData.scatterData.forEach((profile) => {
        const circle = createSvg("circle", {
            class: "scatter-point",
            cx: xScale(profile.volleyPct),
            cy: yScale(profile.atpPoints),
            r: "3.8",
            fill: profile.era.color,
            stroke: "#fff",
            "stroke-width": "1.1",
            opacity: "0.62"
        });

        circle.addEventListener("mousemove", (event) => {
            showTooltip(event, getScatterTooltip(profile));
        });
        circle.addEventListener("mouseleave", hideTooltip);

        pointsLayer.appendChild(circle);
        circles.set(profile.key, circle);
    });

    svg.appendChild(pointsLayer);
    svg.appendChild(labelsLayer);
    host.appendChild(svg);

    return {
        svg,
        pointsLayer,
        labelsLayer,
        circles,
        xScale,
        yScale,
        rallyData
    };
}

function drawScatterLegend(svg, width) {
    let x = 88;
    const y = 16;

    ERAS.forEach((era) => {
        svg.appendChild(createSvg("circle", {
            cx: x,
            cy: y,
            r: "4.5",
            fill: era.color
        }));
        svg.appendChild(createSvg("text", {
            x: x + 8,
            y: y + 4,
            fill: "#596275",
            "font-size": "11",
            "font-weight": "700"
        }, era.name.replace(" Era", "")));
        x += Math.min(142, Math.max(92, era.name.length * 6.6));
    });

    svg.appendChild(createSvg("text", {
        x: width - 28,
        y: y + 4,
        fill: "#7d8797",
        "font-size": "11",
        "text-anchor": "end"
    }, "Each dot = one player in one era"));
}

function updateScatterChart(chart, selectedEra) {
    const isGlobal = selectedEra === "all";
    const activeData = chart.rallyData.scatterData.filter((profile) => isGlobal || profile.eraId === selectedEra);
    const activeKeys = new Set(activeData.map((profile) => profile.key));

    chart.rallyData.scatterData.forEach((profile) => {
        const circle = chart.circles.get(profile.key);
        const isActive = isGlobal || activeKeys.has(profile.key);

        circle.setAttribute("opacity", isGlobal ? "0.62" : (isActive ? "0.84" : "0.08"));
        circle.setAttribute("r", isGlobal ? "3.8" : (isActive ? "5.4" : "2.7"));
        circle.setAttribute("stroke", isActive && !isGlobal ? "#101622" : "#fff");
        circle.setAttribute("stroke-width", isActive && !isGlobal ? "1.6" : "1.1");

        if (isActive && !isGlobal) {
            chart.pointsLayer.appendChild(circle);
        }
    });

    chart.labelsLayer.innerHTML = "";
    const labels = activeData
        .slice()
        .sort((a, b) => b.atpPoints - a.atpPoints)
        .slice(0, isGlobal ? 4 : 5);

    labels.forEach((profile) => {
        chart.labelsLayer.appendChild(createSvg("text", {
            class: "scatter-label",
            x: chart.xScale(profile.volleyPct) + 8,
            y: chart.yScale(profile.atpPoints) - 8,
            opacity: isGlobal ? "0.72" : "0.92"
        }, profile.player));
    });
}

function createHistogramChart(host, rallyData) {
    host.innerHTML = "";

    const width = 560;
    const height = 430;
    const margin = { top: 34, right: 54, bottom: 42, left: 116 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const values = Array.from(rallyData.distributions.values()).flatMap((distribution) => distribution.values.map((item) => item.value));
    const xMax = Math.ceil((Math.max(...values, 1) + 4) / 10) * 10;
    const xScale = (value) => margin.left + (value / xMax) * innerWidth;
    const rowHeight = innerHeight / SHOT_TYPES.length;
    const barHeight = Math.min(28, rowHeight * 0.54);
    const svg = createSvg("svg", {
        class: "chart-svg",
        viewBox: `0 0 ${width} ${height}`
    });
    const bars = new Map();
    const valuesByKey = new Map();

    getTicks(xMax, 5).forEach((tick) => {
        const x = xScale(tick);
        svg.appendChild(createSvg("line", {
            x1: x,
            x2: x,
            y1: margin.top - 10,
            y2: margin.top + innerHeight,
            stroke: "#e3e7ef",
            "stroke-dasharray": "2 4"
        }));
        svg.appendChild(createSvg("text", {
            class: "chart-tick-label",
            x,
            y: height - 16,
            "text-anchor": "middle"
        }, `${roundValue(tick)}%`));
    });

    SHOT_TYPES.forEach((type, index) => {
        const y = margin.top + index * rowHeight + (rowHeight - barHeight) / 2;

        svg.appendChild(createSvg("text", {
            class: "histogram-label",
            x: margin.left - 12,
            y: y + barHeight / 2 + 4,
            "text-anchor": "end"
        }, type.label));

        svg.appendChild(createSvg("rect", {
            x: margin.left,
            y,
            width: innerWidth,
            height: barHeight,
            fill: "#edf1f7",
            rx: "4"
        }));

        const bar = createSvg("rect", {
            class: "histogram-bar",
            x: margin.left,
            y,
            width: 0,
            height: barHeight,
            fill: type.color,
            rx: "4"
        });
        const valueText = createSvg("text", {
            class: "histogram-value",
            x: margin.left + 8,
            y: y + barHeight / 2 + 4
        }, "0%");

        bar.addEventListener("mousemove", (event) => {
            const currentValue = Number(bar.dataset.value || 0);
            showTooltip(event, `<strong>${type.label}</strong>${formatPercent(currentValue)} of charted rally shots`);
        });
        bar.addEventListener("mouseleave", hideTooltip);

        svg.appendChild(bar);
        svg.appendChild(valueText);
        bars.set(type.key, bar);
        valuesByKey.set(type.key, valueText);
    });

    svg.appendChild(createSvg("text", {
        class: "chart-axis-label",
        x: margin.left + innerWidth / 2,
        y: height - 2,
        "text-anchor": "middle"
    }, "Share of all rally shots"));

    host.appendChild(svg);

    return {
        bars,
        valuesByKey,
        xScale,
        margin,
        rallyData
    };
}

function updateHistogramChart(chart, selectedEra) {
    const distribution = chart.rallyData.distributions.get(selectedEra) || chart.rallyData.distributions.get("all");

    distribution.values.forEach((item) => {
        const bar = chart.bars.get(item.key);
        const valueText = chart.valuesByKey.get(item.key);
        const width = Math.max(2, chart.xScale(item.value) - chart.margin.left);
        const labelX = chart.margin.left + width + 8;

        bar.setAttribute("width", width);
        bar.setAttribute("fill", item.color);
        bar.dataset.value = item.value;
        valueText.setAttribute("x", labelX);
        valueText.textContent = formatPercent(item.value);
    });
}

function setupRallyScroll(state) {
    let ticking = false;

    const requestUpdate = () => {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(() => {
            ticking = false;
            const activeStep = getClosestStep(state.steps);
            if (activeStep) {
                setActiveRallyEra(state, activeStep.dataset.era);
            }
        });
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
}

function getClosestStep(steps) {
    const anchor = window.innerHeight * 0.5;
    let closestStep = null;
    let closestDistance = Infinity;

    steps.forEach((step) => {
        const rect = step.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - anchor);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestStep = step;
        }
    });

    return closestStep;
}

function setActiveRallyEra(state, eraId, force = false) {
    if (!force && state.activeEra === eraId) {
        return;
    }

    state.activeEra = eraId;
    state.steps.forEach((step) => {
        step.classList.toggle("is-active", step.dataset.era === eraId);
    });

    updateScatterChart(state.scatterChart, eraId);
    updateHistogramChart(state.histogramChart, eraId);
    updateRallyText(state.rallyData, eraId);
}

function updateRallyText(rallyData, eraId) {
    const title = document.getElementById("rally-active-title");
    const copy = document.getElementById("rally-active-copy");
    const scatterCount = document.getElementById("scatter-count");
    const histogramEra = document.getElementById("histogram-era");
    const selectedProfiles = eraId === "all"
        ? rallyData.scatterData
        : rallyData.scatterData.filter((profile) => profile.eraId === eraId);
    const distribution = rallyData.distributions.get(eraId) || rallyData.distributions.get("all");
    const volleyShare = distribution.values.find((item) => item.key === "Vo_shots")?.value || 0;
    const groundstrokeShare = distribution.values.find((item) => item.key === "Gs_shots")?.value || 0;
    const era = ERA_BY_ID[eraId];

    if (eraId === "all") {
        title.textContent = "Rally profiles across all eras";
        copy.textContent = `${selectedProfiles.length} player-era profiles are visible. Groundstrokes account for ${formatPercent(groundstrokeShare)} of charted rally shots overall, while volleys account for ${formatPercent(volleyShare)}.`;
        histogramEra.textContent = "All eras";
    } else {
        title.textContent = `${era.name} (${era.period})`;
        copy.textContent = `${selectedProfiles.length} player-era profiles are highlighted. Volleys make up ${formatPercent(volleyShare)} of charted rally shots in this era. ${era.summary}`;
        histogramEra.textContent = era.name;
    }

    scatterCount.textContent = `${selectedProfiles.length} profiles`;
}

function getScatterTooltip(profile) {
    return [
        `<strong>${profile.player}</strong>`,
        `${profile.era.name}, ${profile.era.period}`,
        `Volley shots: ${formatPercent(profile.volleyPct)}`,
        `Peak ATP points: ${formatNumber(profile.atpPoints)}`,
        `Charted shots: ${formatNumber(profile.totalTypeShots)}`
    ].join("<br>");
}

function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll(".era-section").forEach((section) => {
        observer.observe(section);
    });
}

document.querySelector(".scroll-indicator")?.addEventListener("click", () => {
    document.querySelector(".eras-container").scrollIntoView({ behavior: "smooth" });
});

function getEraForYear(year) {
    if (!Number.isFinite(year)) {
        return null;
    }

    return ERAS.find((era) => year >= era.start && year <= era.end) || null;
}

function parseYear(value) {
    const year = Number.parseInt(String(value || "").slice(0, 4), 10);
    return Number.isFinite(year) ? year : NaN;
}

function normalizeName(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/gi, " ")
        .trim()
        .toLowerCase();
}

function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function createSvg(name, attributes = {}, text = "") {
    const element = document.createElementNS("http://www.w3.org/2000/svg", name);

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    if (text) {
        element.textContent = text;
    }

    return element;
}

function getTicks(max, count) {
    const safeMax = Math.max(max, 1);
    const step = niceStep(safeMax / Math.max(1, count - 1));
    const ticks = [];

    for (let value = 0; value <= safeMax + step * 0.5; value += step) {
        ticks.push(value);
    }

    return ticks.slice(0, count + 1);
}

function niceMax(value) {
    const step = niceStep(value / 4);
    return Math.ceil(value / step) * step;
}

function niceStep(value) {
    const exponent = Math.floor(Math.log10(value || 1));
    const fraction = value / (10 ** exponent);
    let niceFraction = 1;

    if (fraction <= 1) {
        niceFraction = 1;
    } else if (fraction <= 2) {
        niceFraction = 2;
    } else if (fraction <= 5) {
        niceFraction = 5;
    } else {
        niceFraction = 10;
    }

    return niceFraction * (10 ** exponent);
}

function formatNumber(value) {
    return Math.round(value).toLocaleString("en-US");
}

function formatPercent(value) {
    return `${roundValue(value)}%`;
}

function roundValue(value) {
    if (value >= 10) {
        return Math.round(value);
    }

    return Math.round(value * 10) / 10;
}

function showTooltip(event, html) {
    const tooltip = getTooltip();
    tooltip.innerHTML = html;
    tooltip.style.left = `${event.pageX}px`;
    tooltip.style.top = `${event.pageY - 12}px`;
    tooltip.style.opacity = "1";
}

function hideTooltip() {
    const tooltip = document.querySelector(".chart-tooltip");
    if (tooltip) {
        tooltip.style.opacity = "0";
    }
}

function getTooltip() {
    let tooltip = document.querySelector(".chart-tooltip");

    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.className = "chart-tooltip";
        document.body.appendChild(tooltip);
    }

    return tooltip;
}

function interpolateColor(start, end, amount) {
    const startRgb = hexToRgb(start);
    const endRgb = hexToRgb(end);
    const rgb = startRgb.map((channel, index) => Math.round(channel + (endRgb[index] - channel) * amount));
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function hexToRgb(hex) {
    const value = hex.replace("#", "");
    return [
        Number.parseInt(value.slice(0, 2), 16),
        Number.parseInt(value.slice(2, 4), 16),
        Number.parseInt(value.slice(4, 6), 16)
    ];
}
