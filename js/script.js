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

const SERVICE_ZONES = [
    { key: "ad_wide", label: "Ad wide" },
    { key: "ad_middle", label: "Ad body" },
    { key: "ad_t", label: "Ad T" },
    { key: "deuce_t", label: "Deuce T" },
    { key: "deuce_middle", label: "Deuce body" },
    { key: "deuce_wide", label: "Deuce wide" },
    { key: "err_net", label: "Net errors" },
    { key: "err_wide", label: "Wide errors" },
    { key: "err_deep", label: "Deep errors" },
    { key: "err_wide_deep", label: "Wide-deep errors" }
];

const SERVICE_IN_KEYS = ["ad_wide", "ad_middle", "ad_t", "deuce_t", "deuce_middle", "deuce_wide"];
const SERVICE_OUT_KEYS = ["err_net", "err_wide", "err_deep", "err_wide_deep"];

const FEATURE_META = {
    rally: {
        id: "rally",
        selectorLabel: "Rally",
        statusKicker: "Rally feature family",
        allTitle: "Rally profiles across all eras",
        scatterTitle: "Volley Shot Percentage vs ATP Points",
        scatterSubtitle: "Missing ATP points use rank-derived estimates.",
        scatterXAxisLabel: "Volley shot percentage",
        scatterMetricLabel: "Volley shots",
        detailTitle: "Shot Type Percentage",
        detailSubtitle: "Aggregated rally shot distribution",
        detailType: "histogram"
    },
    service: {
        id: "service",
        selectorLabel: "Service",
        statusKicker: "Service feature family",
        allTitle: "Service profiles across all eras",
        scatterTitle: "Short-Point Serve Rate vs ATP Points",
        scatterSubtitle: "X-axis is service points won in three shots or fewer divided by total service points.",
        scatterXAxisLabel: "Service points won in <=3 shots",
        scatterMetricLabel: "Serve points won in <=3 shots",
        detailTitle: "Serve Direction and Error Heat Map",
        detailSubtitle: "Share of charted serve locations and service errors by court zone",
        detailType: "court"
    }
};

const SERVICE_ERA_SUMMARIES = {
    open: "Short service points show how first-strike tennis could still shape the wood-racket game, even before modern serve speeds.",
    graphite: "Graphite frames made the serve a more direct weapon, increasing the value of points settled before a neutral rally could form.",
    transition: "Bigger serves and stronger first balls start to pair with baseline patterns, so quick service points become part of a broader attacking package.",
    big3: "The elite profile is not only about raw serving: top players combine quick holds with enough rally depth to survive when the serve comes back.",
    modern: "Modern servers hunt early control aggressively, using pace, direction, and the plus-one shot to shorten service games."
};

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
    const detailHost = document.getElementById("rally-histogram");

    if (!scatterHost || !detailHost) {
        return;
    }

    scatterHost.innerHTML = '<div class="chart-loading">Loading player profiles...</div>';
    detailHost.innerHTML = '<div class="chart-loading">Loading feature distribution...</div>';

    try {
        const [shotsRows, serviceRows, atpRows] = await Promise.all([
            fetchCsv("datasets/clean_datasets/shots_stats.csv"),
            fetchCsv("datasets/clean_datasets/service_stats.csv"),
            fetchCsv("datasets/clean_datasets/all_atp_matches.csv")
        ]);
        const strengthByPlayerEra = buildPlayerStrengthLookup(atpRows);
        const features = {
            rally: prepareRallyData(shotsRows, strengthByPlayerEra),
            service: prepareServiceData(serviceRows, strengthByPlayerEra)
        };
        const state = {
            activeEra: "all",
            activeFeature: "rally",
            features,
            currentData: features.rally,
            scatterHost,
            detailHost,
            scatterChart: null,
            detailChart: null,
            steps: Array.from(document.querySelectorAll(".rally-step")),
            featureButtons: Array.from(document.querySelectorAll(".feature-pill")),
            visual: document.querySelector(".rally-visual-sticky"),
            transitionTimer: null
        };

        state.steps.forEach((step) => {
            const era = ERA_BY_ID[step.dataset.era];
            if (era) {
                step.style.setProperty("--era-color", era.color);
            }
            step.addEventListener("focus", () => setActiveRallyEra(state, step.dataset.era));
            step.addEventListener("click", () => setActiveRallyEra(state, step.dataset.era));
        });

        state.featureButtons.forEach((button) => {
            button.addEventListener("click", () => setActiveFeature(state, button.dataset.feature));
        });

        setActiveFeature(state, "rally", true);
        setupRallyScroll(state);
    } catch (error) {
        const message = "The playstyle charts could not load. Start the page through a local server so the CSV files are available.";
        scatterHost.innerHTML = `<div class="chart-error">${message}</div>`;
        detailHost.innerHTML = `<div class="chart-error">${error.message}</div>`;
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

function prepareRallyData(shotsRows, strengthByPlayerEra) {
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

        const strength = strengthByPlayerEra.get(profile.key);
        const pointsFromRanking = strength?.points || 0;
        const rankEstimate = strength?.bestRank ? rankToPointEstimate(strength.bestRank) : null;
        const atpPoints = pointsFromRanking > 0 ? pointsFromRanking : rankEstimate;

        return {
            ...profile,
            era: ERA_BY_ID[profile.eraId],
            matches: profile.matches.size,
            totalTypeShots,
            shotPercentages,
            volleyPct: shotPercentages.Vo_shots,
            xValue: shotPercentages.Vo_shots,
            xValueLabel: FEATURE_META.rally.scatterMetricLabel,
            atpPoints,
            pointsEstimated: pointsFromRanking <= 0 && Number.isFinite(rankEstimate),
            bestRank: strength?.bestRank || null
        };
    }).filter((profile) => profile.totalTypeShots > 0);

    const scatterData = profiles.filter((profile) => Number.isFinite(profile.atpPoints) && profile.atpPoints > 0);
    const distributions = buildShotDistributions(profiles);

    return {
        ...FEATURE_META.rally,
        profiles,
        scatterData,
        distributions
    };
}

function prepareServiceData(serviceRows, strengthByPlayerEra) {
    const profileMap = new Map();

    serviceRows.forEach((row) => {
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
                pts: 0,
                ptsWon: 0,
                shortPointsWon: 0,
                zones: createServiceZoneBucket(),
                matches: new Set()
            });
        }

        const profile = profileMap.get(key);
        profile.pts += toNumber(row.pts);
        profile.ptsWon += toNumber(row.pts_won);
        profile.shortPointsWon += toNumber(row.pts_won_lte_3_shots);
        profile.matches.add(row.match_id);
        SERVICE_ZONES.forEach((zone) => {
            profile.zones[zone.key] += toNumber(row[zone.key]);
        });
    });

    const profiles = Array.from(profileMap.values()).map((profile) => {
        const strength = strengthByPlayerEra.get(profile.key);
        const pointsFromRanking = strength?.points || 0;
        const rankEstimate = strength?.bestRank ? rankToPointEstimate(strength.bestRank) : null;
        const atpPoints = pointsFromRanking > 0 ? pointsFromRanking : rankEstimate;
        const shortPointPct = profile.pts ? (profile.shortPointsWon / profile.pts) * 100 : 0;

        return {
            ...profile,
            era: ERA_BY_ID[profile.eraId],
            matches: profile.matches.size,
            xValue: shortPointPct,
            shortPointPct,
            xValueLabel: FEATURE_META.service.scatterMetricLabel,
            atpPoints,
            pointsEstimated: pointsFromRanking <= 0 && Number.isFinite(rankEstimate),
            bestRank: strength?.bestRank || null
        };
    }).filter((profile) => profile.pts > 0);

    const scatterData = profiles.filter((profile) => Number.isFinite(profile.atpPoints) && profile.atpPoints > 0);
    const zoneDistributions = buildServiceZoneDistributions(profiles);
    const summaries = buildServiceSummaries(profiles);

    return {
        ...FEATURE_META.service,
        profiles,
        scatterData,
        zoneDistributions,
        summaries
    };
}

function buildPlayerStrengthLookup(rows) {
    const lookup = new Map();

    rows.forEach((row) => {
        const year = parseYear(row.tourney_date);
        const era = getEraForYear(year);

        if (!era) {
            return;
        }

        addStrengthRecord(lookup, era.id, row.winner_name, row.winner_rank_points, row.winner_rank);
        addStrengthRecord(lookup, era.id, row.loser_name, row.loser_rank_points, row.loser_rank);
    });

    return lookup;
}

function addStrengthRecord(lookup, eraId, player, pointsValue, rankValue) {
    const points = toNumber(pointsValue);
    const rank = toNumber(rankValue);
    const normalizedPlayer = normalizeName(player);

    if (!normalizedPlayer) {
        return;
    }

    const key = `${eraId}|${normalizedPlayer}`;
    const previous = lookup.get(key) || { points: 0, bestRank: null };

    if (points > previous.points) {
        previous.points = points;
    }

    if (rank > 0 && (!previous.bestRank || rank < previous.bestRank)) {
        previous.bestRank = rank;
    }

    lookup.set(key, previous);
}

function rankToPointEstimate(rank) {
    return Math.round(5600 / Math.sqrt(Math.max(rank, 1)));
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

function buildServiceZoneDistributions(profiles) {
    const buckets = new Map();
    buckets.set("all", createServiceZoneBucket());
    ERAS.forEach((era) => buckets.set(era.id, createServiceZoneBucket()));

    profiles.forEach((profile) => {
        addServiceZoneCounts(buckets.get("all"), profile.zones);
        addServiceZoneCounts(buckets.get(profile.eraId), profile.zones);
    });

    const distributions = new Map();
    buckets.forEach((counts, key) => {
        const total = SERVICE_ZONES.reduce((sum, zone) => sum + counts[zone.key], 0);
        distributions.set(key, {
            counts,
            total,
            values: SERVICE_ZONES.map((zone) => ({
                ...zone,
                count: counts[zone.key],
                value: total ? (counts[zone.key] / total) * 100 : 0
            }))
        });
    });

    return distributions;
}

function buildServiceSummaries(profiles) {
    const buckets = new Map();
    buckets.set("all", { pts: 0, shortPointsWon: 0 });
    ERAS.forEach((era) => buckets.set(era.id, { pts: 0, shortPointsWon: 0 }));

    profiles.forEach((profile) => {
        ["all", profile.eraId].forEach((key) => {
            const bucket = buckets.get(key);
            bucket.pts += profile.pts;
            bucket.shortPointsWon += profile.shortPointsWon;
        });
    });

    const summaries = new Map();
    buckets.forEach((bucket, key) => {
        summaries.set(key, {
            ...bucket,
            shortPointPct: bucket.pts ? (bucket.shortPointsWon / bucket.pts) * 100 : 0
        });
    });

    return summaries;
}

function createShotCountBucket() {
    return SHOT_TYPES.reduce((bucket, type) => {
        bucket[type.key] = 0;
        return bucket;
    }, {});
}

function createServiceZoneBucket() {
    return SERVICE_ZONES.reduce((bucket, zone) => {
        bucket[zone.key] = 0;
        return bucket;
    }, {});
}

function addShotCounts(target, source) {
    SHOT_TYPES.forEach((type) => {
        target[type.key] += source[type.key] || 0;
    });
}

function addServiceZoneCounts(target, source) {
    SERVICE_ZONES.forEach((zone) => {
        target[zone.key] += source[zone.key] || 0;
    });
}

function createScatterChart(host, rallyData) {
    host.innerHTML = "";

    const width = 760;
    const height = 430;
    const margin = { top: 34, right: 28, bottom: 62, left: 76 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const maxVolley = Math.max(...rallyData.scatterData.map((profile) => profile.xValue), 1);
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
    }, rallyData.scatterXAxisLabel));
    axes.appendChild(createSvg("text", {
        class: "chart-axis-label",
        x: 18,
        y: margin.top + innerHeight / 2,
        transform: `rotate(-90 18 ${margin.top + innerHeight / 2})`,
        "text-anchor": "middle"
    }, "ATP points or rank-derived estimate"));

    svg.appendChild(grid);
    svg.appendChild(axes);

    drawScatterLegend(svg, width);

    rallyData.scatterData.forEach((profile) => {
        const circle = createSvg("circle", {
            class: "scatter-point",
            cx: xScale(profile.xValue),
            cy: yScale(profile.atpPoints),
            r: "3.8",
            fill: profile.era.color,
            stroke: "#fff",
            "stroke-width": "1.1",
            opacity: "0.62"
        });

        circle.addEventListener("mousemove", (event) => {
            showTooltip(event, getScatterTooltip(profile, rallyData));
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
        width,
        height,
        margin,
        data: rallyData
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
    const activeData = chart.data.scatterData.filter((profile) => isGlobal || profile.eraId === selectedEra);
    const activeKeys = new Set(activeData.map((profile) => profile.key));

    chart.data.scatterData.forEach((profile) => {
        const circle = chart.circles.get(profile.key);
        const isActive = isGlobal || activeKeys.has(profile.key);

        circle.setAttribute("opacity", isGlobal ? "0.62" : (isActive ? "0.84" : "0.18"));
        circle.setAttribute("r", isGlobal ? "3.8" : (isActive ? "5.4" : "3.1"));
        circle.setAttribute("stroke", isActive && !isGlobal ? "#101622" : "#fff");
        circle.setAttribute("stroke-width", isActive && !isGlobal ? "1.6" : "1.1");
        circle.style.filter = isActive && !isGlobal ? "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.18))" : "none";

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
        const placement = placeScatterLabel(profile, labels, chart);

        chart.labelsLayer.appendChild(createSvg("line", {
            class: "scatter-label-line",
            x1: placement.pointX,
            y1: placement.pointY,
            x2: placement.anchor === "start" ? placement.x - 5 : placement.x + 5,
            y2: placement.y - 4,
            opacity: isGlobal ? "0.34" : "0.5"
        }));

        chart.labelsLayer.appendChild(createSvg("text", {
            class: "scatter-label",
            x: placement.x,
            y: placement.y,
            "text-anchor": placement.anchor,
            opacity: isGlobal ? "0.72" : "0.92"
        }, profile.player));
    });
}

function placeScatterLabel(profile, labels, chart) {
    const labelHeight = 16;
    const pointX = chart.xScale(profile.xValue);
    const pointY = chart.yScale(profile.atpPoints);
    const sortedLabels = labels
        .map((label) => ({
            profile: label,
            pointX: chart.xScale(label.xValue),
            pointY: chart.yScale(label.atpPoints)
        }))
        .sort((a, b) => a.pointY - b.pointY);
    const placements = sortedLabels.map((label, index) => ({
        ...label,
        y: clamp(label.pointY - 8 + (index % 2 ? 5 : -2), chart.margin.top + 18, chart.height - chart.margin.bottom - 8)
    }));

    for (let index = 1; index < placements.length; index += 1) {
        if (placements[index].y - placements[index - 1].y < labelHeight) {
            placements[index].y = placements[index - 1].y + labelHeight;
        }
    }

    const overflow = placements[placements.length - 1]?.y - (chart.height - chart.margin.bottom - 8);
    if (overflow > 0) {
        placements.forEach((placement) => {
            placement.y -= overflow;
        });
    }

    for (let index = placements.length - 2; index >= 0; index -= 1) {
        if (placements[index + 1].y - placements[index].y < labelHeight) {
            placements[index].y = placements[index + 1].y - labelHeight;
        }
    }

    const placement = placements.find((item) => item.profile.key === profile.key);
    const estimatedWidth = clamp(profile.player.length * 6.2, 54, 126);
    const preferLeft = pointX > chart.width - chart.margin.right - estimatedWidth - 24;
    const x = preferLeft
        ? Math.max(chart.margin.left + estimatedWidth, pointX - 11)
        : Math.min(chart.width - chart.margin.right - estimatedWidth, pointX + 11);

    return {
        pointX,
        pointY,
        x,
        y: placement?.y || pointY - 8,
        anchor: preferLeft ? "end" : "start"
    };
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
        type: "histogram",
        bars,
        valuesByKey,
        xScale,
        margin,
        data: rallyData
    };
}

function updateHistogramChart(chart, selectedEra) {
    const distribution = chart.data.distributions.get(selectedEra) || chart.data.distributions.get("all");

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

function createDetailChart(host, featureData) {
    if (featureData.detailType === "court") {
        return createCourtHeatmapChart(host, featureData);
    }

    return createHistogramChart(host, featureData);
}

function updateDetailChart(chart, selectedEra) {
    if (chart.type === "court") {
        updateCourtHeatmapChart(chart, selectedEra);
        return;
    }

    updateHistogramChart(chart, selectedEra);
}

function createCourtHeatmapChart(host, serviceData) {
    host.innerHTML = "";

    const width = 860;
    const height = 430;
    const court = getCourtGeometry(width, height);
    const zoneShapes = buildServiceCourtZones(court);
    const svg = createSvg("svg", {
        class: "chart-svg",
        viewBox: `0 0 ${width} ${height}`
    });
    const zones = new Map();
    const labels = new Map();
    const values = new Map();
    const labelElements = [];

    svg.appendChild(createSvg("rect", {
        class: "court-surface",
        x: court.outerLeft,
        y: court.top,
        width: court.outerWidth,
        height: court.courtHeight,
        rx: 2
    }));

    zoneShapes.forEach((shape) => {
        const rects = shape.rects.map((zoneRect) => {
            const rect = createSvg("rect", {
                class: `court-zone ${shape.isError ? "court-zone-error" : "court-zone-target"}`,
                x: zoneRect.x,
                y: zoneRect.y,
                width: zoneRect.width,
                height: zoneRect.height,
                rx: 2,
                fill: "#dce8d8",
                opacity: "0.74"
            });

            rect.addEventListener("mousemove", (event) => {
                const mode = rect.dataset.mode;
                const kind = rect.dataset.kind;
                const suffix = mode === "inout"
                    ? `of all ${kind === "in" ? "in serves" : "serve errors"}`
                    : `of ${kind === "in" ? "in serves" : "serve errors"}`;
                showTooltip(event, `<strong>${shape.label}</strong>${formatPercent(Number(rect.dataset.value || 0))} ${suffix}`);
            });
            rect.addEventListener("mouseleave", hideTooltip);

            svg.appendChild(rect);
            return rect;
        });

        const label = createSvg("text", {
            class: "court-zone-label",
            x: shape.labelX,
            y: shape.labelY - 4
        }, shape.shortLabel || shape.label);
        const value = createSvg("text", {
            class: "court-zone-value",
            x: shape.labelX,
            y: shape.labelY + 13
        }, "0%");

        labelElements.push(label, value);
        zones.set(shape.key, rects);
        labels.set(shape.key, label);
        values.set(shape.key, value);
    });

    drawCourtLines(svg, court);
    labelElements.forEach((element) => {
        svg.appendChild(element);
    });

    svg.appendChild(createSvg("text", {
        x: width / 2,
        y: 414,
        fill: "#68645d",
        "font-size": "12",
        "font-weight": "700",
        "text-anchor": "middle"
    }, "Receiving service boxes and serve error zones"));

    host.appendChild(svg);

    const chart = {
        type: "court",
        mode: "inout",
        activeEra: "all",
        zones,
        labels,
        values,
        zoneShapes,
        data: serviceData
    };

    initializeCourtModeControls(chart);
    return chart;
}

function updateCourtHeatmapChart(chart, selectedEra) {
    const distribution = chart.data.zoneDistributions.get(selectedEra) || chart.data.zoneDistributions.get("all");
    chart.activeEra = selectedEra;
    const modeValues = getServiceHeatmapValues(distribution, chart.mode);
    const visibleValues = Array.from(modeValues.values()).filter((item) => item.visible).map((item) => item.value);
    const maxValue = Math.max(...visibleValues, 1);

    distribution.values.forEach((zone) => {
        const rects = chart.zones.get(zone.key) || [];
        const value = chart.values.get(zone.key);
        const label = chart.labels.get(zone.key);
        const modeValue = modeValues.get(zone.key) || { value: 0, visible: false, kind: SERVICE_IN_KEYS.includes(zone.key) ? "in" : "out" };
        const intensity = modeValue.visible
            ? (chart.mode === "inout" ? modeValue.value / 100 : modeValue.value / maxValue)
            : 0;
        const color = modeValue.kind === "out"
            ? interpolateColor("#f7d8d2", "#c7372f", intensity)
            : interpolateColor("#d7e9fb", "#1f70bf", intensity);
        const opacity = modeValue.visible ? 0.12 + (modeValue.value / 100) * 0.76 : 0.04;

        rects.forEach((rect) => {
            rect.setAttribute("fill", color);
            rect.setAttribute("opacity", String(opacity));
            rect.dataset.value = modeValue.value;
            rect.dataset.mode = chart.mode;
            rect.dataset.kind = modeValue.kind;
        });
        value.textContent = modeValue.visible ? formatPercent(modeValue.value) : "";
        value.setAttribute("opacity", modeValue.visible ? "1" : "0");
        label.setAttribute("opacity", modeValue.visible ? "1" : "0");
    });
}

function initializeCourtModeControls(chart) {
    const buttons = Array.from(document.querySelectorAll(".heatmap-mode-button"));

    buttons.forEach((button) => {
        const isActive = button.dataset.mode === chart.mode;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
        button.onclick = () => {
            chart.mode = button.dataset.mode;
            document.querySelectorAll(".heatmap-mode-button").forEach((modeButton) => {
                const active = modeButton.dataset.mode === chart.mode;
                modeButton.classList.toggle("active", active);
                modeButton.setAttribute("aria-pressed", String(active));
            });
            updateCourtHeatmapChart(chart, chart.activeEra);
        };
    });
}

function getServiceHeatmapValues(distribution, mode) {
    const values = new Map();
    const counts = distribution.counts;
    const inTotal = sumKeys(counts, SERVICE_IN_KEYS);
    const outTotal = sumKeys(counts, SERVICE_OUT_KEYS);
    const total = inTotal + outTotal || 1;
    const inOverall = (inTotal / total) * 100;
    const outOverall = (outTotal / total) * 100;

    SERVICE_IN_KEYS.forEach((key) => {
        values.set(key, {
            kind: "in",
            visible: mode === "inout" || mode === "in",
            value: mode === "in" ? percentageOf(counts[key], inTotal) : inOverall
        });
    });

    SERVICE_OUT_KEYS.forEach((key) => {
        values.set(key, {
            kind: "out",
            visible: mode === "inout" || mode === "out",
            value: mode === "out" ? percentageOf(counts[key], outTotal) : outOverall
        });
    });

    return values;
}

function sumKeys(counts, keys) {
    return keys.reduce((sum, key) => sum + (counts[key] || 0), 0);
}

function percentageOf(value, total) {
    return total ? ((value || 0) / total) * 100 : 0;
}

function getCourtGeometry(width, height) {
    const courtLengthFt = 78;
    const courtWidthFt = 36;
    const outerLeft = 32;
    const outerRight = width - 32;
    const outerWidth = outerRight - outerLeft;
    const courtHeight = Math.min(height - 112, outerWidth * 0.43);
    const top = 58;
    const scaleX = outerWidth / courtLengthFt;
    const scaleY = courtHeight / courtWidthFt;
    const x = (feetFromLeftBaseline) => outerLeft + feetFromLeftBaseline * scaleX;
    const y = (feetFromTopDoubles) => top + feetFromTopDoubles * scaleY;

    return {
        scaleX,
        scaleY,
        top,
        bottom: top + courtHeight,
        outerLeft,
        outerRight,
        outerWidth,
        courtHeight,
        singlesTop: y(4.5),
        singlesBottom: y(31.5),
        centerY: y(18),
        baselineLeft: x(0),
        leftServiceLine: x(18),
        netX: x(39),
        rightServiceLine: x(60),
        baselineRight: x(78),
        x,
        y
    };
}

function drawCourtLines(svg, court) {
    const lines = [
        ["rect", { class: "court-line court-line-outer", x: court.outerLeft, y: court.top, width: court.outerWidth, height: court.courtHeight }],
        ["line", { class: "court-line", x1: court.outerLeft, x2: court.outerRight, y1: court.singlesTop, y2: court.singlesTop }],
        ["line", { class: "court-line", x1: court.outerLeft, x2: court.outerRight, y1: court.singlesBottom, y2: court.singlesBottom }],
        ["line", { class: "court-line", x1: court.leftServiceLine, x2: court.leftServiceLine, y1: court.singlesTop, y2: court.singlesBottom }],
        ["line", { class: "court-line", x1: court.rightServiceLine, x2: court.rightServiceLine, y1: court.singlesTop, y2: court.singlesBottom }],
        ["line", { class: "court-line", x1: court.leftServiceLine, x2: court.rightServiceLine, y1: court.centerY, y2: court.centerY }],
        ["line", { class: "court-line court-center-mark", x1: court.outerLeft, x2: court.outerLeft + 10, y1: court.centerY, y2: court.centerY }],
        ["line", { class: "court-line court-center-mark", x1: court.outerRight - 10, x2: court.outerRight, y1: court.centerY, y2: court.centerY }]
    ];

    lines.forEach(([tag, attrs]) => {
        svg.appendChild(createSvg(tag, attrs));
    });

    svg.appendChild(createSvg("line", {
        class: "court-net",
        x1: court.netX,
        x2: court.netX,
        y1: court.top - 18,
        y2: court.bottom + 18
    }));
}

function buildServiceCourtZones(court) {
    const serviceLeft = court.netX;
    const serviceRight = court.rightServiceLine;
    const serviceWidth = serviceRight - serviceLeft;
    const topSingles = court.singlesTop;
    const bottomSingles = court.singlesBottom;
    const mid = court.centerY;
    const halfHeight = (bottomSingles - topSingles) / 2;
    const third = halfHeight / 3;
    const alleyHeight = court.singlesTop - court.top;
    const deepLeft = court.rightServiceLine;
    const deepWidth = court.baselineRight - court.rightServiceLine;
    const netBandWidth = Math.max(22, court.scaleX * 4);
    const labelX = serviceLeft + serviceWidth / 2;

    const makeRect = (x, y, width, height) => ({ x, y, width, height });
    const corridorRects = (x, width) => [
        makeRect(x, court.top, width, alleyHeight),
        makeRect(x, court.singlesBottom, width, alleyHeight)
    ];

    return [
        {
            key: "ad_wide",
            label: "Ad wide",
            shortLabel: "Wide",
            rects: [makeRect(serviceLeft, topSingles, serviceWidth, third)],
            labelX,
            labelY: topSingles + third / 2
        },
        {
            key: "ad_middle",
            label: "Ad body",
            shortLabel: "Body",
            rects: [makeRect(serviceLeft, topSingles + third, serviceWidth, third)],
            labelX,
            labelY: topSingles + third * 1.5
        },
        {
            key: "ad_t",
            label: "Ad T",
            shortLabel: "T",
            rects: [makeRect(serviceLeft, topSingles + third * 2, serviceWidth, third)],
            labelX,
            labelY: topSingles + third * 2.5
        },
        {
            key: "deuce_t",
            label: "Deuce T",
            shortLabel: "T",
            rects: [makeRect(serviceLeft, mid, serviceWidth, third)],
            labelX,
            labelY: mid + third / 2
        },
        {
            key: "deuce_middle",
            label: "Deuce body",
            shortLabel: "Body",
            rects: [makeRect(serviceLeft, mid + third, serviceWidth, third)],
            labelX,
            labelY: mid + third * 1.5
        },
        {
            key: "deuce_wide",
            label: "Deuce wide",
            shortLabel: "Wide",
            rects: [makeRect(serviceLeft, mid + third * 2, serviceWidth, third)],
            labelX,
            labelY: mid + third * 2.5
        },
        {
            key: "err_net",
            label: "Net errors",
            shortLabel: "Net",
            isError: true,
            rects: [makeRect(court.netX, topSingles, netBandWidth, bottomSingles - topSingles)],
            labelX: court.netX + netBandWidth / 2,
            labelY: mid
        },
        {
            key: "err_wide",
            label: "Wide errors",
            shortLabel: "Wide",
            isError: true,
            rects: corridorRects(serviceLeft, serviceRight - serviceLeft),
            labelX: serviceLeft + serviceWidth / 2,
            labelY: court.top + alleyHeight / 2
        },
        {
            key: "err_deep",
            label: "Deep errors",
            shortLabel: "Deep",
            isError: true,
            rects: [makeRect(deepLeft, topSingles, deepWidth, bottomSingles - topSingles)],
            labelX: deepLeft + deepWidth / 2,
            labelY: mid
        },
        {
            key: "err_wide_deep",
            label: "Wide-deep errors",
            shortLabel: "Wide-deep",
            isError: true,
            rects: corridorRects(deepLeft, deepWidth),
            labelX: deepLeft + deepWidth / 2,
            labelY: court.bottom - alleyHeight / 2
        }
    ];
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

function setActiveFeature(state, featureId, force = false) {
    if (!force && state.activeFeature === featureId) {
        return;
    }

    const featureData = state.features[featureId];
    if (!featureData) {
        return;
    }

    state.activeFeature = featureId;
    state.currentData = featureData;
    if (state.visual) {
        state.visual.dataset.feature = featureId;
    }
    state.featureButtons.forEach((button) => {
        const isActive = button.dataset.feature === featureId;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    updateChartHeadings(featureData);
    state.scatterChart = createScatterChart(state.scatterHost, featureData);
    state.detailChart = createDetailChart(state.detailHost, featureData);
    setActiveRallyEra(state, state.activeEra, true);
}

function updateChartHeadings(featureData) {
    document.getElementById("feature-status-kicker").textContent = featureData.statusKicker;
    document.getElementById("scatter-title").textContent = featureData.scatterTitle;
    document.getElementById("scatter-subtitle").textContent = featureData.scatterSubtitle;
    document.getElementById("detail-title").textContent = featureData.detailTitle;
    document.getElementById("detail-subtitle").textContent = featureData.detailSubtitle;
    const serviceMode = document.getElementById("service-heatmap-mode");
    if (serviceMode) {
        serviceMode.hidden = featureData.id !== "service";
    }
}

function setActiveRallyEra(state, eraId, force = false) {
    if (!force && state.activeEra === eraId) {
        return;
    }

    state.activeEra = eraId;
    const era = ERA_BY_ID[eraId];

    if (state.visual) {
        state.visual.dataset.activeEra = eraId;
        state.visual.style.setProperty("--era-color", era?.color || "#1d5f9f");
        state.visual.classList.add("is-transitioning");
        window.clearTimeout(state.transitionTimer);
        state.transitionTimer = window.setTimeout(() => {
            state.visual.classList.remove("is-transitioning");
        }, 420);
    }

    state.steps.forEach((step) => {
        step.classList.toggle("is-active", step.dataset.era === eraId);
    });

    updateScatterChart(state.scatterChart, eraId);
    updateDetailChart(state.detailChart, eraId);
    updateFeatureText(state.currentData, eraId);
}

function updateFeatureText(featureData, eraId) {
    const title = document.getElementById("rally-active-title");
    const copy = document.getElementById("rally-active-copy");
    const scatterCount = document.getElementById("scatter-count");
    const selectedProfiles = eraId === "all"
        ? featureData.scatterData
        : featureData.scatterData.filter((profile) => profile.eraId === eraId);
    const estimatedProfiles = selectedProfiles.filter((profile) => profile.pointsEstimated).length;
    const era = ERA_BY_ID[eraId];

    if (featureData.id === "service") {
        updateServiceText(featureData, eraId, selectedProfiles, estimatedProfiles, title, copy);
        scatterCount.textContent = `${selectedProfiles.length} profiles`;
        return;
    }

    const distribution = featureData.distributions.get(eraId) || featureData.distributions.get("all");
    const volleyShare = distribution.values.find((item) => item.key === "Vo_shots")?.value || 0;
    const groundstrokeShare = distribution.values.find((item) => item.key === "Gs_shots")?.value || 0;

    if (eraId === "all") {
        title.textContent = featureData.allTitle;
        const estimateNote = estimatedProfiles
            ? ` ${estimatedProfiles} profiles use rank-derived point estimates where ranking-point fields are missing.`
            : "";
        copy.textContent = `${selectedProfiles.length} player-era profiles are visible. Groundstrokes account for ${formatPercent(groundstrokeShare)} of charted rally shots overall, while volleys account for ${formatPercent(volleyShare)}.${estimateNote}`;
    } else {
        title.textContent = `${era.name} (${era.period})`;
        const estimateNote = estimatedProfiles
            ? ` ${estimatedProfiles} profiles use rank-derived point estimates because ATP point fields are unavailable for that era.`
            : "";
        copy.textContent = `${selectedProfiles.length} player-era profiles are highlighted. Volleys make up ${formatPercent(volleyShare)} of charted rally shots in this era.${estimateNote} ${era.summary}`;
    }

    scatterCount.textContent = `${selectedProfiles.length} profiles`;
}

function updateServiceText(featureData, eraId, selectedProfiles, estimatedProfiles, title, copy) {
    const era = ERA_BY_ID[eraId];
    const summary = featureData.summaries.get(eraId) || featureData.summaries.get("all");
    const distribution = featureData.zoneDistributions.get(eraId) || featureData.zoneDistributions.get("all");
    const topZone = distribution.values.slice().sort((a, b) => b.value - a.value)[0];
    const estimateNote = estimatedProfiles
        ? ` ${estimatedProfiles} profiles use rank-derived point estimates where ATP point fields are missing.`
        : "";

    if (eraId === "all") {
        title.textContent = featureData.allTitle;
        copy.textContent = `${selectedProfiles.length} player-era profiles are visible. ${formatPercent(summary.shortPointPct)} of charted service points were won within three shots, and the largest mapped zone is ${topZone.label.toLowerCase()} at ${formatPercent(topZone.value)}.${estimateNote}`;
        return;
    }

    title.textContent = `${era.name} (${era.period})`;
    copy.textContent = `${selectedProfiles.length} player-era profiles are highlighted. ${formatPercent(summary.shortPointPct)} of service points were won within three shots; ${topZone.label.toLowerCase()} is the largest mapped zone at ${formatPercent(topZone.value)}.${estimateNote} ${SERVICE_ERA_SUMMARIES[eraId]}`;
}

function getScatterTooltip(profile, featureData) {
    const pointLabel = profile.pointsEstimated
        ? `ATP point estimate: ${formatNumber(profile.atpPoints)} from best rank #${formatNumber(profile.bestRank)}`
        : `Peak ATP points: ${formatNumber(profile.atpPoints)}`;

    return [
        `<strong>${profile.player}</strong>`,
        `${profile.era.name}, ${profile.era.period}`,
        `${featureData.scatterMetricLabel}: ${formatPercent(profile.xValue)}`,
        pointLabel,
        featureData.id === "service"
            ? `Service points: ${formatNumber(profile.pts)}`
            : `Charted shots: ${formatNumber(profile.totalTypeShots)}`
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

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
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

function interpolateHeatColor(amount) {
    const clamped = clamp(amount, 0, 1);
    if (clamped < 0.5) {
        return interpolateColor("#dbeed8", "#f4c15d", clamped * 2);
    }

    return interpolateColor("#f4c15d", "#c84b40", (clamped - 0.5) * 2);
}

function hexToRgb(hex) {
    const value = hex.replace("#", "");
    return [
        Number.parseInt(value.slice(0, 2), 16),
        Number.parseInt(value.slice(2, 4), 16),
        Number.parseInt(value.slice(4, 6), 16)
    ];
}
