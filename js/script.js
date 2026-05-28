const ERAS = [
    {
        id: "open",
        name: "Open Era Foundations",
        period: "1968-1979",
        start: 1968,
        end: 1979,
        color: "#2f80ed",
        summary: "This is the era of serve-and-volley, where volleys, slices and lobs account for 38% of shots while groundstrokes are not as dominant as in the later eras. That profile fits the wood-racket game, where control, variation, and forward court positioning mattered as much as baseline play."
    },
    {
        id: "graphite",
        name: "Graphite Era",
        period: "1980-1994",
        start: 1980,
        end: 1994,
        color: "#00a878",
        summary: "Groundstrokes rise to 71% and volleys fall to 10%, showing the first major move away from pure serve-and-volley patterns. Graphite frames add pace from the back of the court, while a lot of players is still attached to the serve-and-volley pattern."
    },
    {
        id: "transition",
        name: "Transition Era",
        period: "1995-2007",
        start: 1995,
        end: 2007,
        color: "#f59f00",
        summary: "Groundstrokes jump to 80% and volleys drop to about 5%, making this the clearest break from the older forward-court profile. Polyester strings, heavier topspin, and better movement shift rally value toward baseline construction and defensive playstyle while the chart still keeps visible traces of attacking net play."
    },
    {
        id: "big3",
        name: "Big 3 Era",
        period: "2008-2019",
        start: 2008,
        end: 2019,
        color: "#e25555",
        summary: "The Big 3 era is the most baseline-heavy section of the rally chart, with groundstrokes at 84% and volleys near 3%. Dominance now comes from repeatable rally control, depth, and defense, while net play becomes a finishing option rather than the center of the profile."
    },
    {
        id: "modern",
        name: "Modern Era",
        period: "2020-Present",
        start: 2020,
        end: Infinity,
        color: "#7c5ce0",
        summary: "Modern profiles remain strongly baseline-oriented, while drop shots and slices become slightly more visible. It suggests a game optimized around heavy groundstroke pressure, with variety used to disrupt opponents rather than define the main pattern."
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

const FINISH_TYPES = [
    { key: "ace", label: "Aces", color: "#1f78b4" },
    { key: "winners_fh", label: "Forehand winners", color: "#e25555" },
    { key: "winners_bh", label: "Backhand winners", color: "#7c5ce0" },
    { key: "net_winner", label: "Net winners", color: "#00a878" },
    { key: "passed_at_net", label: "Passing winners", color: "#f59f00" },
    { key: "unforced", label: "Opponent unforced errors", color: "#6f7d95" }
];

const RANKING_LINE_COLORS = [
    "#1e5bff",
    "#e25555",
    "#00a878",
    "#f59f00",
    "#7c5ce0",
    "#00a3b5",
    "#d14d8b",
    "#596275",
    "#8a6d3b",
    "#2f7d6d"
];

const RANKING_MAX_RANK = 5;
const RANKING_PRIMARY_PLAYER_COUNT = 7;
const RANKING_SEGMENT_GAP = 0.72;
const RANKING_EXIT_RANK = 5.62;
const RANKING_ERA_START_OVERRIDES = {
    open: 1976
};
let rankingSeriesPromise = null;

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
        scatterValueSuffix: "%",
        detailTitle: "Shot Type Percentage",
        detailSubtitle: "Aggregated rally shot distribution",
        detailType: "histogram"
    },
    service: {
        id: "service",
        selectorLabel: "Service",
        statusKicker: "Service feature family",
        allTitle: "Service profiles across all eras",
        scatterTitle: "Percentage of Points w/ High Service Impact vs ATP Points",
        scatterSubtitle: "Missing ATP points use rank-derived estimates.",
        scatterXAxisLabel: "Service points won in less than 3 shots",
        scatterMetricLabel: "Serve points won in less than 3 shots",
        scatterValueSuffix: "%",
        detailTitle: "Service Heat Map",
        detailSubtitle: "Distribution of service outcomes across zones",
        detailType: "court"
    },
    finishes: {
        id: "finishes",
        selectorLabel: "Finishes",
        statusKicker: "Finishes feature family",
        allTitle: "Point-ending profiles across all eras",
        scatterTitle: "Mean Winners per Match vs ATP Points",
        scatterSubtitle: "Missing ATP points use rank-derived estimates.",
        scatterXAxisLabel: "Mean winners per match",
        scatterMetricLabel: "Mean winners per match",
        scatterValueSuffix: "",
        detailTitle: "How Players Win Points",
        detailSubtitle: "Share of charted point-ending routes",
        detailType: "pie"
    }
};

const SERVICE_ERA_SUMMARIES = {
    open: "Players show low service domination in points and a strong serve was not yet a prerequisite for success, a reflection of the limitations of wooden rackets. In heat map, wide errors are relatively rare while net and deep errors dominate the fault distribution.",
    graphite: "Graphite frames made the serve a more direct weapon, increasing the value of points settled before a neutral rally could form. This era is characterized by an over-dominance of service at the top level.",
    transition: "Powerful serves start to pair with baseline patterns, so quick service points become part of a broader attacking package. Newcomers are adapting to the serve power, which leads to longer points and less service dominance. The introduction of polyester strings and the continuous technological improvement helped the development of these new defensive skills.",
    big3: "In this new era of excellence, the serve remains a key weapon, but the best players are also strong returners and baseliners, leading to more balanced profiles. The heat map shows a more even distribution of service errors, with wide and deep errors becoming more common as players push for aggressive placements.",
    modern: "In the Modern era, the top player all cluster tightly around a 35–45% short-point serve rate, despite having very different playing styles. This convergence likely reflects how the modern game has been optimized to a point where elite players, regardless of their individual approach, are forced to operate within the same tactical window."
};

const FINISH_ERA_SUMMARIES = {
    open: "The important proportion of net and passing winners, accounting for 28% of finishes, shows the dominance of the serve-and-volley strategy during this era. Due to the woden rackets and the slow pace of the game, the number of winners per match do not correlate with elite playstyle.",
    graphite: "Graphite is the highest winner-output era. Aces rise to 8% and net winners stay high at 16%, showing how new racket power adds first-strike value without immediately removing the attacking net game.",
    transition: "Players in this era adapt to the increased power of the serve, leading to less winners and longer rallies. The finish profile moves away from closing at net and toward baseline pressure, where heavier shots force rushed replies and mistakes.",
    big3: "Elite finishers combine winners with patience: forcing one more ball and collecting opponent errors becomes part of dominance.",
    modern: "The modern finish profile is still influenced by the Big 3 era, with a similar distribution of finish types. However, the number of winners per match increases, as the match duration and physical demand grow."
};

document.addEventListener("DOMContentLoaded", () => {
    initializeChartPlaceholders();
    addScrollAnimations();
    initializeRallyStory();
});

function initializeChartPlaceholders() {
    const eraSections = document.querySelectorAll(".era-section");

    eraSections.forEach((section, index) => {
        const era = ERAS[index];
        const eraBox = section.querySelector(".era-box");
        const chartContent = section.querySelector(".chart-content");

        if (!eraBox || !chartContent || !era) {
            return;
        }

        eraBox.addEventListener("mouseenter", () => {
            section.dataset.rankingHover = "true";
            renderRankingLoading(chartContent, era);
            loadRankingSeriesData()
                .then((rankingSeries) => {
                    if (section.dataset.rankingHover === "true") {
                        createEraRankingChart(chartContent, rankingSeries.byEra.get(era.id), era, rankingSeries.meta);
                    }
                })
                .catch((error) => {
                    if (section.dataset.rankingHover === "true") {
                        renderRankingError(chartContent, error);
                    }
                });
        });

        eraBox.addEventListener("mouseleave", () => {
            section.dataset.rankingHover = "false";
            chartContent.innerHTML = "";
            hideTooltip();
        });
    });
}

function renderRankingLoading(container, era) {
    container.innerHTML = "";
    const loading = document.createElement("div");
    loading.className = "chart-loading";
    loading.textContent = `Loading ${era.name} ranking paths...`;
    container.appendChild(loading);
}

function renderRankingError(container, error) {
    container.innerHTML = "";
    const message = document.createElement("div");
    message.className = "chart-error";
    message.textContent = `Ranking data could not load: ${error.message}`;
    container.appendChild(message);
}

function loadRankingSeriesData() {
    if (!rankingSeriesPromise) {
        rankingSeriesPromise = fetch("datasets/clean_datasets/top_5_rankings.csv")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("top_5_rankings.csv is unavailable");
                }

                if (response.body && response.body.getReader && typeof TextDecoder !== "undefined") {
                    return parseRankingStream(response.body);
                }

                return response.text().then(parseRankingText);
            })
            .catch((error) => {
                rankingSeriesPromise = null;
                throw error;
            });
    }

    return rankingSeriesPromise;
}

async function parseRankingStream(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    const builder = createRankingSeriesBuilder();
    let pending = "";

    while (true) {
        const { value, done } = await reader.read();

        if (done) {
            break;
        }

        pending += decoder.decode(value, { stream: true });
        const lines = pending.split(/\r?\n/);
        pending = lines.pop() || "";
        lines.forEach((line) => addRankingRow(builder, line));
    }

    pending += decoder.decode();
    if (pending) {
        addRankingRow(builder, pending);
    }

    return finalizeRankingSeries(builder);
}

function parseRankingText(text) {
    const builder = createRankingSeriesBuilder();
    text.split(/\r?\n/).forEach((line) => addRankingRow(builder, line));
    return finalizeRankingSeries(builder);
}

function createRankingSeriesBuilder() {
    const buckets = new Map();

    ERAS.forEach((era) => {
        buckets.set(era.id, {
            recordCount: 0,
            dates: new Map()
        });
    });

    return {
        buckets,
        meta: {
            minYear: Infinity,
            maxYear: -Infinity
        }
    };
}

function addRankingRow(builder, line) {
    const cleanLine = line.trim();

    if (!cleanLine || cleanLine.startsWith(",ranking_date")) {
        return;
    }

    const values = cleanLine.split(",");
    const dateValue = values[1];
    const rank = toNumber(values[2]);

    if (!dateValue || rank < 1 || rank > RANKING_MAX_RANK) {
        return;
    }

    const year = parseYear(dateValue);
    const era = getEraForYear(year);

    if (!era) {
        return;
    }

    if (year < getRankingEraStart(era)) {
        return;
    }

    const bucket = builder.buckets.get(era.id);
    const playerName = values.slice(5).join(",").replace(/^"|"$/g, "").trim();

    if (!bucket || !playerName) {
        return;
    }

    const decimalYear = toDecimalYear(dateValue);

    if (!Number.isFinite(decimalYear)) {
        return;
    }

    const record = {
        x: decimalYear,
        rank,
        date: dateValue,
        points: toNumber(values[4]),
        playerName
    };
    const dateRecords = bucket.dates.get(dateValue) || [];
    dateRecords.push(record);
    bucket.dates.set(dateValue, dateRecords);
    bucket.recordCount += 1;
    builder.meta.minYear = Math.min(builder.meta.minYear, decimalYear);
    builder.meta.maxYear = Math.max(builder.meta.maxYear, decimalYear);
}

function finalizeRankingSeries(builder) {
    const byEra = new Map();

    builder.buckets.forEach((bucket, eraId) => {
        const sampledDates = getSampledRankingDates(bucket.dates);
        const sampledRecords = getSampledRankingRecords(bucket.dates, sampledDates);
        const playerBuckets = new Map();

        sampledRecords.forEach((record) => {
            const player = playerBuckets.get(record.playerName) || {
                name: record.playerName,
                records: [],
                recordCount: 0,
                rankSum: 0,
                bestRank: Infinity
            };

            player.records.push(record);
            player.recordCount += 1;
            player.rankSum += record.rank;
            player.bestRank = Math.min(player.bestRank, record.rank);
            playerBuckets.set(record.playerName, player);
        });

        const players = Array.from(playerBuckets.values())
            .map((player) => ({
                ...player,
                averageRank: player.recordCount ? player.rankSum / player.recordCount : Infinity,
                records: player.records.sort((a, b) => a.x - b.x)
            }))
            .sort((a, b) => {
                const firstA = a.records[0]?.x || Infinity;
                const firstB = b.records[0]?.x || Infinity;
                return firstA - firstB || a.bestRank - b.bestRank || b.recordCount - a.recordCount || a.name.localeCompare(b.name);
            });

        byEra.set(eraId, {
            players,
            sampledDates,
            totalTopFivePlayers: playerBuckets.size,
            sampledDateCount: sampledDates.length,
            recordCount: sampledRecords.length
        });
    });

    return {
        byEra,
        meta: builder.meta
    };
}

function getSampledRankingRecords(dates, selectedDates = getSampledRankingDates(dates)) {
    return selectedDates.flatMap((date) => (dates.get(date) || [])
        .slice()
        .sort((a, b) => a.rank - b.rank)
        .filter((record) => record.rank <= RANKING_MAX_RANK));
}

function getSampledRankingDates(dates) {
    const selectedByHalf = new Map();

    Array.from(dates.keys()).sort().forEach((date) => {
        const year = parseYear(date);
        const half = getRankingDateHalf(date);
        const key = `${year}|${half}`;

        if (!selectedByHalf.has(key)) {
            selectedByHalf.set(key, date);
        }
    });

    return Array.from(selectedByHalf.values()).sort();
}

function createEraRankingChart(container, rankingData, era, meta) {
    d3.select(container).html("");

    const width = Math.max(container.clientWidth || 620, 360);
    const height = Math.max(container.clientHeight || 320, 280);
    const margin = { top: 42, right: 172, bottom: 78, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const range = getRankingYearRange(era, meta);
    const xScale = d3.scaleLinear()
        .domain([range.start, range.end])
        .range([margin.left, margin.left + innerWidth]);
    const yScale = d3.scaleLinear()
        .domain([1, RANKING_MAX_RANK])
        .range([margin.top, margin.top + innerHeight]);
    const players = rankingData?.players || [];

    const svg = d3.select(container)
        .append("svg")
        .attr("class", "chart-svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-label", `${era.name} ATP ranking time series`);

    appendSvg(svg, "text", {
        class: "ranking-title",
        x: margin.left,
        y: 12
    }, `${era.name} Top-5 ranking`);

    appendSvg(svg, "text", {
        class: "ranking-subtitle",
        x: margin.left,
        y: 28
    }, `ATP top-${RANKING_MAX_RANK} snapshots twice per season, ${formatRankingPeriod(range, era)}`);

    const axisGroup = svg.append("g").attr("class", "chart-axis");

    for (let rank = 1; rank <= RANKING_MAX_RANK; rank += 1) {
        const y = yScale(rank);
        appendSvg(axisGroup, "line", {
            x1: margin.left,
            x2: margin.left + innerWidth,
            y1: y,
            y2: y,
            class: "ranking-grid-line"
        });
        appendSvg(axisGroup, "text", {
            x: margin.left - 8,
            y: y + 4,
            "text-anchor": "end"
        }, String(rank));
    }

    getYearTicks(range.start, range.labelEnd).forEach((year) => {
        const x = xScale(year);
        appendSvg(axisGroup, "line", {
            x1: x,
            x2: x,
            y1: margin.top,
            y2: margin.top + innerHeight,
            class: "ranking-year-line"
        });
        appendSvg(axisGroup, "text", {
            x,
            y: margin.top + innerHeight + 20,
            "text-anchor": "middle"
        }, String(year));
    });

    appendSvg(svg, "line", {
        x1: margin.left,
        x2: margin.left + innerWidth,
        y1: margin.top + innerHeight,
        y2: margin.top + innerHeight,
        stroke: "#aeb7c8"
    });
    appendSvg(svg, "line", {
        x1: margin.left,
        x2: margin.left,
        y1: margin.top,
        y2: margin.top + innerHeight,
        stroke: "#aeb7c8"
    });

    if (!players.length) {
        addNoRankingDataMessage(svg, era, meta, width, height);
    } else {
        const highlightedPlayers = getHighlightedRankingPlayers(players);
        const sampledDates = (rankingData?.sampledDates || []).filter((date) => {
            const x = toDecimalYear(date);
            return x >= range.start && x <= range.end;
        });

        highlightedPlayers.forEach((player, index) => {
            const color = RANKING_LINE_COLORS[index % RANKING_LINE_COLORS.length];
            const records = player.records.filter((record) => record.x >= range.start && record.x <= range.end);
            const pathData = buildRankingPath(records, xScale, yScale);

            if (!pathData || !records.length) {
                return;
            }

            addRankingTransitionLines(svg, player, sampledDates, xScale, yScale, color);

            appendSvg(svg, "path", {
                class: "ranking-line ranking-line-highlight",
                d: pathData,
                stroke: color
            })
            .on("mousemove", (event) => {
                showTooltip(event, [
                    `<strong>${player.name}</strong>`,
                    `Best rank: #${formatNumber(player.bestRank)}`,
                    `Average top-${RANKING_MAX_RANK} rank: #${roundValue(player.averageRank)}`,
                    `Sampled top-${RANKING_MAX_RANK} appearances: ${formatNumber(player.recordCount)}`
                ].join("<br>"));
            })
            .on("mouseleave", hideTooltip);

            const lastRecord = records[records.length - 1];
            const lastX = xScale(lastRecord.x);
            const lastY = yScale(lastRecord.rank);
            appendSvg(svg, "circle", {
                class: "ranking-endpoint",
                cx: lastX,
                cy: lastY,
                r: 3.5,
                fill: color
            });
        });

        addRankingLegend(svg, highlightedPlayers, width - margin.right + 14, margin.top);
    }

    appendSvg(svg, "text", {
        class: "ranking-axis-label",
        x: 18,
        y: margin.top + innerHeight / 2,
        transform: `rotate(-90 16 ${margin.top + innerHeight / 2})`,
        "text-anchor": "middle"
    }, "ATP rank");

    appendSvg(svg, "text", {
        class: "ranking-axis-label",
        x: margin.left + innerWidth / 2,
        y: margin.top + innerHeight + 46,
        "text-anchor": "middle"
    }, "Season");
}

function getHighlightedRankingPlayers(players) {
    const primaryPlayers = players
        .slice()
        .sort(compareRankingPresence)
        .slice(0, RANKING_PRIMARY_PLAYER_COUNT);
    const highlighted = new Map(primaryPlayers.map((player) => [player.name, player]));

    players
        .filter((player) => player.bestRank === 1)
        .sort(compareRankingPresence)
        .forEach((player) => {
            highlighted.set(player.name, player);
        });

    return Array.from(highlighted.values()).sort(compareRankingPresence);
}

function compareRankingPresence(a, b) {
    return b.recordCount - a.recordCount
        || a.bestRank - b.bestRank
        || a.averageRank - b.averageRank
        || a.name.localeCompare(b.name);
}

function addRankingTransitionLines(svg, player, sampledDates, xScale, yScale, color) {
    if (sampledDates.length < 2) {
        return;
    }

    const recordsByDate = new Map(player.records.map((record) => [record.date, record]));
    let previousRecord = recordsByDate.get(sampledDates[0]) || null;
    let previousDate = sampledDates[0];

    for (let index = 1; index < sampledDates.length; index += 1) {
        const currentDate = sampledDates[index];
        const currentRecord = recordsByDate.get(currentDate) || null;
        const previousX = toDecimalYear(previousDate);
        const currentX = toDecimalYear(currentDate);

        if (previousRecord && !currentRecord) {
            addRankingTransitionLine(svg, xScale(previousRecord.x), yScale(previousRecord.rank), xScale(currentX), yScale(RANKING_EXIT_RANK), color);
        } else if (!previousRecord && currentRecord) {
            addRankingTransitionLine(svg, xScale(previousX), yScale(RANKING_EXIT_RANK), xScale(currentRecord.x), yScale(currentRecord.rank), color);
        }

        previousRecord = currentRecord;
        previousDate = currentDate;
    }
}

function addRankingTransitionLine(svg, x1, y1, x2, y2, color) {
    appendSvg(svg, "line", {
        class: "ranking-transition-line",
        x1,
        y1,
        x2,
        y2,
        stroke: color
    });
}

function buildRankingPath(records, xScale, yScale) {
    if (!records.length) {
        return "";
    }

    const line = d3.line()
        .x((record) => xScale(record.x))
        .y((record) => yScale(record.rank));
    const segments = records.reduce((groups, record, index) => {
        if (index === 0 || record.x - records[index - 1].x > RANKING_SEGMENT_GAP) {
            groups.push([]);
        }

        groups[groups.length - 1].push(record);
        return groups;
    }, []);

    return segments.map((segment) => line(segment)).join(" ");
}

function addRankingLegend(svg, players, x, y) {
    players.forEach((player, index) => {
        const color = RANKING_LINE_COLORS[index % RANKING_LINE_COLORS.length];
        const rowY = y + index * 16;

        appendSvg(svg, "line", {
            class: "ranking-legend-swatch",
            x1: x,
            x2: x + 15,
            y1: rowY,
            y2: rowY,
            stroke: color
        });
        appendSvg(svg, "text", {
            class: "ranking-player-label",
            x: x + 20,
            y: rowY + 4,
            fill: color
        }, formatRankingPlayerLabel(player.name));
    });

    const transitionY = y + players.length * 16 + 12;
    appendSvg(svg, "line", {
        class: "ranking-transition-line ranking-legend-transition",
        x1: x,
        x2: x + 15,
        y1: transitionY,
        y2: transitionY,
        stroke: "#68645d"
    });
    appendSvg(svg, "text", {
        class: "ranking-legend-note",
        x: x + 20,
        y: transitionY - 3
    }, "Leaves or");
    appendSvg(svg, "text", {
        class: "ranking-legend-note",
        x: x + 20,
        y: transitionY + 10
    }, "enters top 5");
}

function addNoRankingDataMessage(svg, era, meta, width, height) {
    const dataStartYear = Number.isFinite(meta?.minYear) ? Math.floor(meta.minYear) : null;
    const period = formatRankingPeriod(getRankingYearRange(era, meta), era);
    const lines = dataStartYear && Number.isFinite(era.end) && era.end < dataStartYear
        ? [`Ranking file starts in ${dataStartYear}.`, `No top-${RANKING_MAX_RANK} records for ${period}.`]
        : [`No top-${RANKING_MAX_RANK} ranking records found`, `for ${period}.`];

    lines.forEach((line, index) => {
        appendSvg(svg, "text", {
            class: "ranking-no-data",
            x: width / 2,
            y: height / 2 + index * 18,
            "text-anchor": "middle"
        }, line);
    });
}

function getRankingYearRange(era, meta) {
    const start = getRankingEraStart(era);

    if (Number.isFinite(era.end)) {
        return {
            start,
            end: era.end + 0.99,
            labelEnd: era.end
        };
    }

    const dataEnd = Number.isFinite(meta?.maxYear) ? meta.maxYear : new Date().getFullYear();
    return {
        start,
        end: Math.max(start + 1, dataEnd),
        labelEnd: Math.max(start + 1, Math.floor(dataEnd))
    };
}

function getRankingEraStart(era) {
    return RANKING_ERA_START_OVERRIDES[era.id] || era.start;
}

function formatRankingPeriod(range, era = null) {
    const start = Math.round(range.start);
    const label = `${start}-${Math.round(range.labelEnd)}`;
    return era?.id === "open" ? `${label} (no ranking data before ${start})` : label;
}

function getYearTicks(startYear, endYear) {
    const start = Math.round(startYear);
    const end = Math.round(endYear);
    const span = Math.max(1, end - start);
    const step = span <= 6 ? 1 : span <= 12 ? 2 : span <= 18 ? 3 : 5;
    const ticks = [start];

    for (let year = Math.ceil((start + 1) / step) * step; year < end; year += step) {
        ticks.push(year);
    }

    ticks.push(end);
    return Array.from(new Set(ticks));
}

function toDecimalYear(dateValue) {
    const [year, month = 1, day = 1] = String(dateValue).split("-").map((part) => Number.parseInt(part, 10));

    if (!Number.isFinite(year)) {
        return NaN;
    }

    const start = Date.UTC(year, 0, 1);
    const next = Date.UTC(year + 1, 0, 1);
    const current = Date.UTC(year, Math.max(0, month - 1), Math.max(1, day));

    return year + (current - start) / (next - start);
}

function getRankingDateHalf(dateValue) {
    const month = Number.parseInt(String(dateValue).slice(5, 7), 10);
    return month <= 6 ? 0 : 1;
}

function formatRankingPlayerLabel(name) {
    if (name.length <= 15) {
        return name;
    }

    const parts = name.split(" ");
    const compact = parts.length > 1
        ? `${parts[0][0]}. ${parts.slice(1).join(" ")}`
        : name;

    return compact.length > 18 ? `${compact.slice(0, 16)}...` : compact;
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
        if (!window.d3) {
            throw new Error("D3.js could not load. Check the D3 script tag in index.html.");
        }

        const [shotsRows, serviceRows, overviewRows, netRows, atpRows] = await Promise.all([
            fetchCsv("datasets/clean_datasets/shots_stats.csv"),
            fetchCsv("datasets/clean_datasets/service_stats.csv"),
            fetchCsv("datasets/clean_datasets/overview_stats.csv"),
            fetchCsv("datasets/clean_datasets/netpoints_stats.csv"),
            fetchCsv("datasets/clean_datasets/all_atp_matches.csv")
        ]);
        updateEraAverageProfiles(atpRows);
        const strengthByPlayerEra = buildPlayerStrengthLookup(atpRows);
        const features = {
            rally: prepareRallyData(shotsRows, strengthByPlayerEra),
            service: prepareServiceData(serviceRows, strengthByPlayerEra),
            finishes: prepareFinishesData(overviewRows, serviceRows, netRows, strengthByPlayerEra)
        };
        const state = {
            activeEra: "all",
            activeFeature: "service",
            features,
            currentData: features.service,
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

        setActiveFeature(state, "service", true);
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
    if (window.d3?.csvParse) {
        return d3.csvParse(text);
    }

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

function prepareFinishesData(overviewRows, serviceRows, netRows, strengthByPlayerEra) {
    const profileMap = new Map();
    const overviewByMatch = new Map();

    overviewRows.forEach((row) => {
        const year = parseYear(row.match_id);
        const era = getEraForYear(year);
        const player = (row.player || "").trim();

        if (!era || !player) {
            return;
        }

        const matchRows = overviewByMatch.get(row.match_id) || [];
        matchRows.push({ ...row, era, player, normalizedPlayer: normalizeName(player) });
        overviewByMatch.set(row.match_id, matchRows);
    });

    overviewByMatch.forEach((matchRows) => {
        matchRows.forEach((row) => {
            const profile = getOrCreateFinishProfile(profileMap, row.era, row.player);
            const opponentUnforced = matchRows
                .filter((opponent) => opponent.normalizedPlayer !== row.normalizedPlayer)
                .reduce((sum, opponent) => sum + toNumber(opponent.unforced), 0);

            profile.matches.add(row.match_id);
            profile.winnerMatches.add(row.match_id);
            profile.winners += toNumber(row.winners);
            profile.finishes.winners_fh += toNumber(row.winners_fh);
            profile.finishes.winners_bh += toNumber(row.winners_bh);
            profile.finishes.unforced += opponentUnforced;
        });
    });

    serviceRows.forEach((row) => {
        const year = parseYear(row.match_id);
        const era = getEraForYear(year);
        const player = (row.player || "").trim();

        if (!era || !player) {
            return;
        }

        const profile = getOrCreateFinishProfile(profileMap, era, player);
        profile.matches.add(row.match_id);
        profile.finishes.ace += toNumber(row.aces);
    });

    netRows.forEach((row) => {
        const year = parseYear(row.match_id);
        const era = getEraForYear(year);
        const player = (row.player || "").trim();

        if (!era || !player) {
            return;
        }

        const profile = getOrCreateFinishProfile(profileMap, era, player);
        profile.matches.add(row.match_id);
        profile.finishes.net_winner += toNumber(row.net_winner);
        profile.finishes.passed_at_net += toNumber(row.passed_at_net);
    });

    const profiles = Array.from(profileMap.values()).map((profile) => {
        const strength = strengthByPlayerEra.get(profile.key);
        const pointsFromRanking = strength?.points || 0;
        const rankEstimate = strength?.bestRank ? rankToPointEstimate(strength.bestRank) : null;
        const atpPoints = pointsFromRanking > 0 ? pointsFromRanking : rankEstimate;
        const winnerMatchCount = profile.winnerMatches.size;
        const finishTotal = FINISH_TYPES.reduce((sum, type) => sum + profile.finishes[type.key], 0);
        const meanWinnersPerMatch = winnerMatchCount
            ? profile.winners / winnerMatchCount
            : finishTotal / Math.max(1, profile.matches.size);

        return {
            ...profile,
            era: ERA_BY_ID[profile.eraId],
            matches: profile.matches.size,
            winnerMatchCount,
            finishTotal,
            meanWinnersPerMatch,
            xValue: meanWinnersPerMatch,
            xValueLabel: FEATURE_META.finishes.scatterMetricLabel,
            atpPoints,
            pointsEstimated: pointsFromRanking <= 0 && Number.isFinite(rankEstimate),
            bestRank: strength?.bestRank || null
        };
    }).filter((profile) => profile.finishTotal > 0 && profile.matches > 0);

    const scatterData = profiles.filter((profile) => Number.isFinite(profile.atpPoints) && profile.atpPoints > 0);
    const distributions = buildFinishDistributions(profiles);
    const summaries = buildFinishSummaries(profiles);

    return {
        ...FEATURE_META.finishes,
        profiles,
        scatterData,
        distributions,
        summaries
    };
}

function getOrCreateFinishProfile(profileMap, era, player) {
    const normalizedPlayer = normalizeName(player);
    const key = `${era.id}|${normalizedPlayer}`;

    if (!profileMap.has(key)) {
        profileMap.set(key, {
            key,
            eraId: era.id,
            player,
            normalizedPlayer,
            winners: 0,
            finishes: createFinishCountBucket(),
            matches: new Set(),
            winnerMatches: new Set()
        });
    }

    return profileMap.get(key);
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

function updateEraAverageProfiles(rows) {
    const summaries = buildEraAverageProfiles(rows);

    document.querySelectorAll("[data-era-profile]").forEach((profileBox) => {
        const summary = summaries.get(profileBox.dataset.eraProfile);

        setProfileStat(profileBox, "age", summary && Number.isFinite(summary.meanAge)
            ? `${roundValue(summary.meanAge)} yrs`
            : "--");
        setProfileStat(profileBox, "height", summary && Number.isFinite(summary.meanHeight)
            ? `${Math.round(summary.meanHeight)} cm`
            : "--");
        setProfileStat(profileBox, "duration", summary && Number.isFinite(summary.meanDuration)
            ? `${Math.round(summary.meanDuration)} min`
            : "--");
    });
}

function buildEraAverageProfiles(rows) {
    const buckets = new Map();

    ERAS.forEach((era) => {
        buckets.set(era.id, {
            ageSum: 0,
            ageCount: 0,
            heightSum: 0,
            heightCount: 0,
            durationSum: 0,
            durationCount: 0
        });
    });

    rows.forEach((row) => {
        const year = parseYear(row.tourney_date);
        const era = getEraForYear(year);

        if (!era) {
            return;
        }

        const bucket = buckets.get(era.id);
        addAverageProfileValue(bucket, "age", row.winner_age);
        addAverageProfileValue(bucket, "age", row.loser_age);
        addAverageProfileValue(bucket, "height", row.winner_ht);
        addAverageProfileValue(bucket, "height", row.loser_ht);
        addAverageProfileValue(bucket, "duration", row.minutes);
    });

    const summaries = new Map();

    buckets.forEach((bucket, eraId) => {
        summaries.set(eraId, {
            meanAge: bucket.ageCount ? bucket.ageSum / bucket.ageCount : NaN,
            meanHeight: bucket.heightCount ? bucket.heightSum / bucket.heightCount : NaN,
            meanDuration: bucket.durationCount ? bucket.durationSum / bucket.durationCount : NaN
        });
    });

    return summaries;
}

function addAverageProfileValue(bucket, metric, value) {
    const number = toNumber(value);

    if (number <= 0) {
        return;
    }

    bucket[`${metric}Sum`] += number;
    bucket[`${metric}Count`] += 1;
}

function setProfileStat(profileBox, key, value) {
    const element = profileBox.querySelector(`[data-profile-stat="${key}"]`);

    if (element) {
        element.textContent = value;
    }
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

function buildFinishDistributions(profiles) {
    const buckets = new Map();
    buckets.set("all", createFinishCountBucket());
    ERAS.forEach((era) => buckets.set(era.id, createFinishCountBucket()));

    profiles.forEach((profile) => {
        addFinishCounts(buckets.get("all"), profile.finishes);
        addFinishCounts(buckets.get(profile.eraId), profile.finishes);
    });

    const distributions = new Map();
    buckets.forEach((counts, key) => {
        const total = FINISH_TYPES.reduce((sum, type) => sum + counts[type.key], 0);
        distributions.set(key, {
            counts,
            total,
            values: FINISH_TYPES.map((type) => ({
                ...type,
                count: counts[type.key],
                value: total ? (counts[type.key] / total) * 100 : 0
            }))
        });
    });

    return distributions;
}

function buildFinishSummaries(profiles) {
    const buckets = new Map();
    buckets.set("all", { winners: 0, winnerMatches: 0 });
    ERAS.forEach((era) => buckets.set(era.id, { winners: 0, winnerMatches: 0 }));

    profiles.forEach((profile) => {
        ["all", profile.eraId].forEach((key) => {
            const bucket = buckets.get(key);
            bucket.winners += profile.winners;
            bucket.winnerMatches += profile.winnerMatchCount;
        });
    });

    const summaries = new Map();
    buckets.forEach((bucket, key) => {
        summaries.set(key, {
            ...bucket,
            meanWinnersPerMatch: bucket.winnerMatches ? bucket.winners / bucket.winnerMatches : 0
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

function createFinishCountBucket() {
    return FINISH_TYPES.reduce((bucket, type) => {
        bucket[type.key] = 0;
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

function addFinishCounts(target, source) {
    FINISH_TYPES.forEach((type) => {
        target[type.key] += source[type.key] || 0;
    });
}

function appendSvg(selection, name, attributes = {}, text = "") {
    const child = selection.append(name);
    Object.entries(attributes).forEach(([key, value]) => {
        child.attr(key, value);
    });

    if (text) {
        child.text(text);
    }

    return child;
}

function createScatterChart(host, rallyData) {
    d3.select(host).html("");

    const width = 760;
    const height = 430;
    const margin = { top: 34, right: 28, bottom: 62, left: 76 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const maxVolley = Math.max(...rallyData.scatterData.map((profile) => profile.xValue), 1);
    const maxPoints = Math.max(...rallyData.scatterData.map((profile) => profile.atpPoints), 1);
    const xMax = Math.ceil((maxVolley + 1) / 2) * 2;
    const yMax = niceMax(maxPoints);
    const xScale = d3.scaleLinear()
        .domain([0, xMax])
        .range([margin.left, margin.left + innerWidth]);
    const yScale = d3.scaleLinear()
        .domain([0, yMax])
        .range([margin.top + innerHeight, margin.top]);
    const svg = d3.select(host)
        .append("svg")
        .attr("class", "chart-svg")
        .attr("viewBox", `0 0 ${width} ${height}`);
    const grid = svg.append("g").attr("class", "chart-grid");
    const axes = svg.append("g").attr("class", "chart-axis");
    const pointsLayer = svg.append("g").attr("class", "scatter-points");
    const labelsLayer = svg.append("g").attr("class", "scatter-labels");
    const circles = new Map();

    getTicks(xMax, 6).forEach((tick) => {
        const x = xScale(tick);
        appendSvg(grid, "line", {
            x1: x,
            x2: x,
            y1: margin.top,
            y2: margin.top + innerHeight
        });
        appendSvg(axes, "text", {
            x,
            y: height - 30,
            "text-anchor": "middle"
        }, formatScatterXValue(tick, rallyData));
    });

    getTicks(yMax, 5).forEach((tick) => {
        const y = yScale(tick);
        appendSvg(grid, "line", {
            x1: margin.left,
            x2: width - margin.right,
            y1: y,
            y2: y
        });
        appendSvg(axes, "text", {
            x: margin.left - 10,
            y: y + 4,
            "text-anchor": "end"
        }, formatNumber(tick));
    });

    appendSvg(axes, "line", {
        x1: margin.left,
        x2: width - margin.right,
        y1: margin.top + innerHeight,
        y2: margin.top + innerHeight,
        stroke: "#aeb7c8"
    });
    appendSvg(axes, "line", {
        x1: margin.left,
        x2: margin.left,
        y1: margin.top,
        y2: margin.top + innerHeight,
        stroke: "#aeb7c8"
    });
    appendSvg(axes, "text", {
        class: "chart-axis-label",
        x: margin.left + innerWidth / 2,
        y: height - 6,
        "text-anchor": "middle"
    }, rallyData.scatterXAxisLabel);
    appendSvg(axes, "text", {
        class: "chart-axis-label",
        x: 18,
        y: margin.top + innerHeight / 2,
        transform: `rotate(-90 18 ${margin.top + innerHeight / 2})`,
        "text-anchor": "middle"
    }, "ATP points or rank-derived estimate");

    drawScatterLegend(svg, width);

    pointsLayer.selectAll("circle")
        .data(rallyData.scatterData, (profile) => profile.key)
        .join("circle")
        .attr("class", "scatter-point")
        .attr("cx", (profile) => xScale(profile.xValue))
        .attr("cy", (profile) => yScale(profile.atpPoints))
        .attr("r", "3.8")
        .attr("fill", (profile) => profile.era.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", "1.1")
        .attr("opacity", "0.62")
        .on("mousemove", (event, profile) => {
            showTooltip(event, getScatterTooltip(profile, rallyData));
        })
        .on("mouseleave", hideTooltip)
        .each(function(profile) {
            circles.set(profile.key, this);
        });

    return {
        svg: svg.node(),
        pointsLayer: pointsLayer.node(),
        labelsLayer: labelsLayer.node(),
        labelsLayerSelection: labelsLayer,
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
        appendSvg(svg, "circle", {
            cx: x,
            cy: y,
            r: "4.5",
            fill: era.color
        });
        appendSvg(svg, "text", {
            x: x + 8,
            y: y + 4,
            fill: "#596275",
            "font-size": "11",
            "font-weight": "700"
        }, era.name.replace(" Era", ""));
        x += Math.min(142, Math.max(92, era.name.length * 6.6));
    });

    appendSvg(svg, "text", {
        x: width - 28,
        y: y + 4,
        fill: "#7d8797",
        "font-size": "11",
        "text-anchor": "end"
    }, "Each dot = one player in one era");
}

function updateScatterChart(chart, selectedEra) {
    const isGlobal = selectedEra === "all";
    const activeData = chart.data.scatterData.filter((profile) => isGlobal || profile.eraId === selectedEra);
    const activeKeys = new Set(activeData.map((profile) => profile.key));

    chart.data.scatterData.forEach((profile) => {
        const circle = chart.circles.get(profile.key);
        if (!circle) return;

        if (isGlobal) {
            circle.classList.remove("is-highlighted", "is-dimmed");
        } else if (activeKeys.has(profile.key)) {
            circle.classList.add("is-highlighted");
            circle.classList.remove("is-dimmed");
            chart.pointsLayer.appendChild(circle);
        } else {
            circle.classList.add("is-dimmed");
            circle.classList.remove("is-highlighted");
        }
    });

    chart.labelsLayerSelection.html("");
    const labels = activeData
        .slice()
        .sort((a, b) => b.atpPoints - a.atpPoints)
        .slice(0, isGlobal ? 4 : 5);

    labels.forEach((profile) => {
        const placement = placeScatterLabel(profile, labels, chart);

        appendSvg(chart.labelsLayerSelection, "line", {
            class: "scatter-label-line",
            x1: placement.pointX,
            y1: placement.pointY,
            x2: placement.anchor === "start" ? placement.x - 5 : placement.x + 5,
            y2: placement.y - 4,
            opacity: isGlobal ? "0.34" : "0.5"
        });

        appendSvg(chart.labelsLayerSelection, "text", {
            class: "scatter-label",
            x: placement.x,
            y: placement.y,
            "text-anchor": placement.anchor,
            opacity: isGlobal ? "0.72" : "0.92"
        }, profile.player);
    });
}

function formatScatterXValue(value, featureData) {
    if (featureData.scatterValueSuffix === "%") {
        return formatPercent(value);
    }

    return String(roundValue(value));
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
    d3.select(host).html("");

    const width = 560;
    const height = 430;
    const margin = { top: 34, right: 54, bottom: 42, left: 116 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const values = Array.from(rallyData.distributions.values()).flatMap((distribution) => distribution.values.map((item) => item.value));
    const xMax = Math.ceil((Math.max(...values, 1) + 4) / 10) * 10;
    const xScale = d3.scaleLinear()
        .domain([0, xMax])
        .range([margin.left, margin.left + innerWidth]);
    const rowHeight = innerHeight / SHOT_TYPES.length;
    const barHeight = Math.min(28, rowHeight * 0.54);
    const svg = d3.select(host)
        .append("svg")
        .attr("class", "chart-svg")
        .attr("viewBox", `0 0 ${width} ${height}`);
    const bars = new Map();
    const valuesByKey = new Map();

    getTicks(xMax, 5).forEach((tick) => {
        const x = xScale(tick);
        appendSvg(svg, "line", {
            x1: x,
            x2: x,
            y1: margin.top - 10,
            y2: margin.top + innerHeight,
            stroke: "#e3e7ef",
            "stroke-dasharray": "2 4"
        });
        appendSvg(svg, "text", {
            class: "chart-tick-label",
            x,
            y: height - 16,
            "text-anchor": "middle"
        }, `${roundValue(tick)}%`);
    });

    const rows = svg.selectAll("g.histogram-row")
        .data(SHOT_TYPES, (type) => type.key)
        .join("g")
        .attr("class", "histogram-row")
        .attr("transform", (type, index) => {
            const y = margin.top + index * rowHeight + (rowHeight - barHeight) / 2;
            return `translate(0 ${y})`;
        });

    rows.each(function(type, index) {
        const y = margin.top + index * rowHeight + (rowHeight - barHeight) / 2;
        const row = d3.select(this);

        appendSvg(row, "text", {
            class: "histogram-label",
            x: margin.left - 12,
            y: barHeight / 2 + 4,
            "text-anchor": "end"
        }, type.label);

        appendSvg(row, "rect", {
            x: margin.left,
            y: 0,
            width: innerWidth,
            height: barHeight,
            fill: "#edf1f7",
            rx: "4"
        });

        const bar = appendSvg(row, "rect", {
            class: "histogram-bar",
            x: margin.left,
            y: 0,
            width: 0,
            height: barHeight,
            fill: type.color,
            rx: "4"
        });
        const valueText = appendSvg(row, "text", {
            class: "histogram-value",
            x: margin.left + 8,
            y: barHeight / 2 + 4
        }, "0%");

        bar.on("mousemove", (event) => {
            const currentValue = Number(bar.node().dataset.value || 0);
            showTooltip(event, `<strong>${type.label}</strong>${formatPercent(currentValue)} of charted rally shots`);
        });
        bar.on("mouseleave", hideTooltip);

        bars.set(type.key, bar.node());
        valuesByKey.set(type.key, valueText.node());
    });

    appendSvg(svg, "text", {
        class: "chart-axis-label",
        x: margin.left + innerWidth / 2,
        y: height - 2,
        "text-anchor": "middle"
    }, "Share of all rally shots");

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

        d3.select(bar)
            .attr("width", width)
            .attr("fill", item.color);
        bar.dataset.value = item.value;
        d3.select(valueText)
            .attr("x", labelX)
            .text(formatPercent(item.value));
    });
}

function createPieChart(host, featureData) {
    d3.select(host).html("");

    const width = 560;
    const height = 430;
    const centerX = 190;
    const centerY = 204;
    const radius = 158;
    const svg = d3.select(host)
        .append("svg")
        .attr("class", "chart-svg")
        .attr("viewBox", `0 0 ${width} ${height}`);
    const slices = new Map();
    const sliceLabels = new Map();

    const sliceLayer = svg.append("g");
    const labelLayer = svg.append("g");

    sliceLayer.selectAll("path")
        .data(FINISH_TYPES, (type) => type.key)
        .join("path")
        .attr("class", "pie-slice")
        .attr("fill", (type) => type.color)
        .attr("d", d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
            .startAngle(-Math.PI / 2)
            .endAngle(-Math.PI / 2))
        .attr("transform", `translate(${centerX} ${centerY})`)
        .on("mousemove", function(event, type) {
            showTooltip(event, `<strong>${type.label}</strong>${formatPercent(Number(this.dataset.value || 0))} of point endings`);
        })
        .on("mouseleave", hideTooltip)
        .each(function(type) {
            slices.set(type.key, this);
        });

    labelLayer.selectAll("text")
        .data(FINISH_TYPES, (type) => type.key)
        .join("text")
        .attr("class", "pie-slice-label")
        .attr("x", centerX)
        .attr("y", centerY)
        .attr("text-anchor", "middle")
        .attr("opacity", "0")
        .text("0%")
        .each(function(type) {
            sliceLabels.set(type.key, this);
        });

    FINISH_TYPES.forEach((type, index) => {
        const legendY = 104 + index * 40;
        appendSvg(svg, "rect", {
            x: 390,
            y: legendY - 11,
            width: 12,
            height: 12,
            fill: type.color,
            rx: 2
        });
        appendSvg(svg, "text", {
            class: "pie-legend-label",
            x: 410,
            y: legendY
        }, type.label);

    });

    return {
        type: "pie",
        slices,
        sliceLabels,
        centerX,
        centerY,
        radius,
        data: featureData
    };
}

function updatePieChart(chart, selectedEra) {
    const distribution = chart.data.distributions.get(selectedEra) || chart.data.distributions.get("all");
    const total = Math.max(distribution.total, 1);
    const pie = d3.pie()
        .sort(null)
        .value((item) => item.count)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI * 1.5);
    const arc = d3.arc().innerRadius(0).outerRadius(chart.radius);
    const labelArc = d3.arc().innerRadius(chart.radius * 0.64).outerRadius(chart.radius * 0.64);

    pie(distribution.values).forEach((sliceDatum) => {
        const item = sliceDatum.data;
        const slice = chart.slices.get(item.key);
        const sliceLabel = chart.sliceLabels.get(item.key);
        const labelPoint = labelArc.centroid(sliceDatum);

        d3.select(slice)
            .attr("d", arc(sliceDatum))
            .attr("fill", item.color);
        slice.dataset.value = item.value;

        d3.select(sliceLabel)
            .attr("x", chart.centerX + labelPoint[0])
            .attr("y", chart.centerY + labelPoint[1] + 4)
            .attr("opacity", item.value >= 3 ? "1" : "0")
            .text(formatPercent((item.count / total) * 100));
    });
}

function createDetailChart(host, featureData) {
    if (featureData.detailType === "court") {
        return createCourtHeatmapChart(host, featureData);
    }

    if (featureData.detailType === "pie") {
        return createPieChart(host, featureData);
    }

    return createHistogramChart(host, featureData);
}

function updateDetailChart(chart, selectedEra) {
    if (chart.type === "court") {
        updateCourtHeatmapChart(chart, selectedEra);
        return;
    }

    if (chart.type === "pie") {
        updatePieChart(chart, selectedEra);
        return;
    }

    updateHistogramChart(chart, selectedEra);
}

function createCourtHeatmapChart(host, serviceData) {
    d3.select(host).html("");

    const width = 540;
    const height = 560;
    const court = getCourtGeometry(width, height);
    const zoneShapes = buildServiceCourtZones(court);
    const svg = d3.select(host)
        .append("svg")
        .attr("class", "chart-svg")
        .attr("viewBox", `0 0 ${width} ${height}`);
    const zones = new Map();
    const labels = new Map();
    const values = new Map();
    const groupLabels = new Map();
    const groupValues = new Map();
    const labelElements = [];

    appendSvg(svg, "rect", {
        class: "court-surface",
        x: court.outerLeft,
        y: court.top,
        width: court.outerWidth,
        height: court.courtHeight,
        rx: 2
    });

    zoneShapes.forEach((shape) => {
        const rects = svg.selectAll(`rect[data-zone="${shape.key}"]`)
            .data(shape.rects)
            .join("rect")
            .attr("class", `court-zone ${shape.isError ? "court-zone-error" : "court-zone-target"}`)
            .attr("data-zone", shape.key)
            .attr("x", (zoneRect) => zoneRect.x)
            .attr("y", (zoneRect) => zoneRect.y)
            .attr("width", (zoneRect) => zoneRect.width)
            .attr("height", (zoneRect) => zoneRect.height)
            .attr("rx", 2)
            .attr("fill", "#dce8d8")
            .attr("opacity", "0.74")
            .on("mousemove", function(event) {
                const mode = this.dataset.mode;
                const kind = this.dataset.kind;
                const suffix = mode === "inout"
                    ? "of all mapped serves"
                    : `of ${kind === "in" ? "in serves" : "serve errors"}`;
                const tooltipLabel = mode === "inout"
                    ? (kind === "in" ? "In serves" : "Serve errors")
                    : shape.label;
                showTooltip(event, `<strong>${tooltipLabel}</strong>${formatPercent(Number(this.dataset.value || 0))} ${suffix}`);
            })
            .on("mouseleave", hideTooltip)
            .nodes();

        const labelPoints = shape.labelPoints || [{
            x: shape.labelX,
            y: shape.labelY,
            label: shape.shortLabel || shape.label
        }];
        const zoneLabels = [];
        const zoneValues = [];

        labelPoints.forEach((point) => {
            const label = appendSvg(svg, "text", {
                class: "court-zone-label",
                x: point.x,
                y: point.y - 4
            }, point.label || shape.shortLabel || shape.label).node();
            const value = appendSvg(svg, "text", {
                class: "court-zone-value",
                x: point.x,
                y: point.y + 13
            }, "0%").node();

            labelElements.push(label, value);
            zoneLabels.push(label);
            zoneValues.push(value);
        });

        zones.set(shape.key, rects);
        labels.set(shape.key, zoneLabels);
        values.set(shape.key, zoneValues);
    });

    [
        {
            key: "in",
            label: "IN",
            x: court.centerX,
            y: (court.topServiceLine + court.netY) / 2
        },
        {
            key: "out",
            label: "OUT",
            x: court.centerX,
            y: (court.baselineTop + court.topServiceLine) / 2
        }
    ].forEach((group) => {
        const label = appendSvg(svg, "text", {
            class: "court-group-label",
            x: group.x,
            y: group.y - 6,
            opacity: "0"
        }, group.label).node();
        const value = appendSvg(svg, "text", {
            class: "court-group-value",
            x: group.x,
            y: group.y + 17,
            opacity: "0"
        }, "0%").node();

        labelElements.push(label, value);
        groupLabels.set(group.key, label);
        groupValues.set(group.key, value);
    });

    drawCourtLines(svg, court);
    labelElements.forEach((element) => {
        svg.node().appendChild(element);
    });

    appendSvg(svg, "text", {
        x: width / 2,
        y: height - 18,
        fill: "#68645d",
        "font-size": "12",
        "font-weight": "700",
        "text-anchor": "middle"
    }, "Receiving service boxes and serve error zones");

    const chart = {
        type: "court",
        mode: "inout",
        activeEra: "all",
        zones,
        labels,
        values,
        groupLabels,
        groupValues,
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
    const showAggregate = chart.mode === "inout";

    distribution.values.forEach((zone) => {
        const rects = chart.zones.get(zone.key) || [];
        const valueTexts = chart.values.get(zone.key) || [];
        const labelTexts = chart.labels.get(zone.key) || [];
        const modeValue = modeValues.get(zone.key) || { value: 0, visible: false, kind: SERVICE_IN_KEYS.includes(zone.key) ? "in" : "out" };
        const intensity = modeValue.visible
            ? (showAggregate ? modeValue.value / 100 : modeValue.value / maxValue)
            : 0;
        const color = modeValue.kind === "out"
            ? interpolateColor("#ffc0b5", "#d71920", intensity)
            : interpolateColor("#b9dcff", "#006fdf", intensity);
        const opacity = modeValue.visible ? 0.22 + (modeValue.value / 100) * 0.76 : 0.04;
        const showZoneText = modeValue.visible && !showAggregate;

        rects.forEach((rect) => {
            d3.select(rect)
                .attr("fill", color)
                .attr("opacity", String(opacity));
            rect.dataset.value = modeValue.value;
            rect.dataset.mode = chart.mode;
            rect.dataset.kind = modeValue.kind;
        });

        valueTexts.forEach((valueText) => {
            d3.select(valueText)
                .text(showZoneText ? formatPercent(modeValue.value) : "")
                .attr("opacity", showZoneText ? "1" : "0");
        });
        labelTexts.forEach((labelText) => {
            d3.select(labelText)
                .attr("opacity", showZoneText ? "1" : "0");
        });
    });

    updateCourtGroupLabel(chart, "in", modeValues.get(SERVICE_IN_KEYS[0])?.value || 0, showAggregate);
    updateCourtGroupLabel(chart, "out", modeValues.get(SERVICE_OUT_KEYS[0])?.value || 0, showAggregate);
}

function updateCourtGroupLabel(chart, key, value, visible) {
    const label = chart.groupLabels.get(key);
    const valueText = chart.groupValues.get(key);

    if (label) {
        d3.select(label).attr("opacity", visible ? "1" : "0");
    }

    if (valueText) {
        d3.select(valueText)
            .text(visible ? formatPercent(value) : "")
            .attr("opacity", visible ? "1" : "0");
    }
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
    const courtWidthFt = 36;
    const visualBackcourtFt = 11;
    const visualServiceBoxFt = 21;
    const visualCourtLengthFt = visualBackcourtFt * 2 + visualServiceBoxFt * 2;
    const verticalPadding = 18;
    const captionSpace = 30;
    const availableHeight = height - verticalPadding * 2 - captionSpace;
    const availableWidth = width - 84;
    const courtHeight = availableHeight;
    const outerWidth = Math.min(availableWidth, courtHeight * 0.64);
    const outerLeft = (width - outerWidth) / 2;
    const outerRight = outerLeft + outerWidth;
    const top = verticalPadding;
    const scaleX = outerWidth / courtWidthFt;
    const scaleY = courtHeight / visualCourtLengthFt;
    const x = (feetFromLeftDoublesSideline) => outerLeft + feetFromLeftDoublesSideline * scaleX;
    const y = (visualFeetFromTopBaseline) => top + visualFeetFromTopBaseline * scaleY;

    return {
        scaleX,
        scaleY,
        top,
        bottom: top + courtHeight,
        outerLeft,
        outerRight,
        outerWidth,
        courtHeight,
        singlesLeft: x(4.5),
        singlesRight: x(31.5),
        centerX: x(18),
        baselineTop: y(0),
        topServiceLine: y(visualBackcourtFt),
        netY: y(visualBackcourtFt + visualServiceBoxFt),
        bottomServiceLine: y(visualBackcourtFt + visualServiceBoxFt * 2),
        baselineBottom: y(visualCourtLengthFt),
        x,
        y
    };
}

function drawCourtLines(svg, court) {
    const lines = [
        ["rect", { class: "court-line court-line-outer", x: court.outerLeft, y: court.top, width: court.outerWidth, height: court.courtHeight }],
        ["line", { class: "court-line", x1: court.singlesLeft, x2: court.singlesLeft, y1: court.top, y2: court.bottom }],
        ["line", { class: "court-line", x1: court.singlesRight, x2: court.singlesRight, y1: court.top, y2: court.bottom }],
        ["line", { class: "court-line", x1: court.singlesLeft, x2: court.singlesRight, y1: court.topServiceLine, y2: court.topServiceLine }],
        ["line", { class: "court-line", x1: court.singlesLeft, x2: court.singlesRight, y1: court.bottomServiceLine, y2: court.bottomServiceLine }],
        ["line", { class: "court-line", x1: court.centerX, x2: court.centerX, y1: court.topServiceLine, y2: court.bottomServiceLine }],
        ["line", { class: "court-line court-center-mark", x1: court.centerX, x2: court.centerX, y1: court.top, y2: court.top + 12 }],
        ["line", { class: "court-line court-center-mark", x1: court.centerX, x2: court.centerX, y1: court.bottom - 12, y2: court.bottom }]
    ];

    lines.forEach(([tag, attrs]) => {
        appendSvg(svg, tag, attrs);
    });

    appendSvg(svg, "line", {
        class: "court-net",
        x1: court.outerLeft - 18,
        x2: court.outerRight + 18,
        y1: court.netY,
        y2: court.netY
    });
}

function buildServiceCourtZones(court) {
    const serviceTop = court.topServiceLine;
    const serviceBottom = court.netY;
    const serviceHeight = serviceBottom - serviceTop;
    const adLeft = court.singlesLeft;
    const adRight = court.centerX;
    const deuceLeft = court.centerX;
    const deuceRight = court.singlesRight;
    const adThird = (adRight - adLeft) / 3;
    const deuceThird = (deuceRight - deuceLeft) / 3;
    const alleyWidth = court.singlesLeft - court.outerLeft;
    const deepTop = court.baselineTop;
    const deepHeight = court.topServiceLine - court.baselineTop;
    const netBandHeight = Math.max(26, court.scaleY * 4);

    const makeRect = (x, y, width, height) => ({ x, y, width, height });
    const corridorRects = (y, height) => [
        makeRect(court.outerLeft, y, alleyWidth, height),
        makeRect(court.singlesRight, y, alleyWidth, height)
    ];

    return [
        {
            key: "ad_wide",
            label: "Ad wide",
            shortLabel: "Wide",
            rects: [makeRect(adLeft, serviceTop, adThird, serviceHeight)],
            labelX: adLeft + adThird / 2,
            labelY: serviceTop + serviceHeight / 2
        },
        {
            key: "ad_middle",
            label: "Ad body",
            shortLabel: "Body",
            rects: [makeRect(adLeft + adThird, serviceTop, adThird, serviceHeight)],
            labelX: adLeft + adThird * 1.5,
            labelY: serviceTop + serviceHeight / 2
        },
        {
            key: "ad_t",
            label: "Ad T",
            shortLabel: "T",
            rects: [makeRect(adLeft + adThird * 2, serviceTop, adThird, serviceHeight)],
            labelX: adLeft + adThird * 2.5,
            labelY: serviceTop + serviceHeight / 2
        },
        {
            key: "deuce_t",
            label: "Deuce T",
            shortLabel: "T",
            rects: [makeRect(deuceLeft, serviceTop, deuceThird, serviceHeight)],
            labelX: deuceLeft + deuceThird / 2,
            labelY: serviceTop + serviceHeight / 2
        },
        {
            key: "deuce_middle",
            label: "Deuce body",
            shortLabel: "Body",
            rects: [makeRect(deuceLeft + deuceThird, serviceTop, deuceThird, serviceHeight)],
            labelX: deuceLeft + deuceThird * 1.5,
            labelY: serviceTop + serviceHeight / 2
        },
        {
            key: "deuce_wide",
            label: "Deuce wide",
            shortLabel: "Wide",
            rects: [makeRect(deuceLeft + deuceThird * 2, serviceTop, deuceThird, serviceHeight)],
            labelX: deuceLeft + deuceThird * 2.5,
            labelY: serviceTop + serviceHeight / 2
        },
        {
            key: "err_net",
            label: "Net errors",
            shortLabel: "Net error",
            isError: true,
            rects: [makeRect(court.singlesLeft, court.netY, court.singlesRight - court.singlesLeft, netBandHeight)],
            labelX: court.centerX,
            labelY: court.netY + netBandHeight / 2
        },
        {
            key: "err_wide",
            label: "Wide errors",
            shortLabel: "Wide error",
            isError: true,
            rects: corridorRects(serviceTop, serviceHeight),
            labelX: court.outerLeft + alleyWidth / 2,
            labelY: serviceTop + serviceHeight / 2,
            labelPoints: [
                {
                    x: court.outerLeft + alleyWidth / 2,
                    y: serviceTop + serviceHeight / 2,
                    label: "Wide error"
                },
                {
                    x: court.singlesRight + alleyWidth / 2,
                    y: serviceTop + serviceHeight / 2,
                    label: "Wide error"
                }
            ]
        },
        {
            key: "err_deep",
            label: "Deep errors",
            shortLabel: "Deep error",
            isError: true,
            rects: [makeRect(court.singlesLeft, deepTop, court.singlesRight - court.singlesLeft, deepHeight)],
            labelX: court.centerX,
            labelY: deepTop + deepHeight / 2
        },
        {
            key: "err_wide_deep",
            label: "Wide-deep errors",
            shortLabel: "Wide-deep error",
            isError: true,
            rects: corridorRects(deepTop, deepHeight),
            labelX: court.outerLeft + alleyWidth / 2,
            labelY: deepTop + deepHeight / 2,
            labelPoints: [
                {
                    x: court.outerLeft + alleyWidth / 2,
                    y: deepTop + deepHeight / 2,
                    label: "Wide-deep error"
                },
                {
                    x: court.singlesRight + alleyWidth / 2,
                    y: deepTop + deepHeight / 2,
                    label: "Wide-deep error"
                }
            ]
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
    const anchor = window.innerHeight * 0.68;
    let activeStep = steps[0] || null;

    for (let index = 0; index < steps.length - 1; index += 1) {
        const currentStep = steps[index];
        const nextStep = steps[index + 1];
        const currentRect = currentStep.getBoundingClientRect();
        const nextRect = nextStep.getBoundingClientRect();
        const currentCenter = currentRect.top + currentRect.height / 2;
        const nextCenter = nextRect.top + nextRect.height / 2;
        const thresholdRatio = currentStep.dataset.era === "all" ? 0.88 : 0.5;
        const threshold = currentCenter + (nextCenter - currentCenter) * thresholdRatio;

        if (anchor >= threshold) {
            activeStep = nextStep;
        } else {
            break;
        }
    }

    return activeStep;
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
        state.visual.style.setProperty("--era-color", era?.color || "#9b27c8");
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

    if (featureData.id === "finishes") {
        updateFinishesText(featureData, eraId, selectedProfiles, estimatedProfiles, title, copy);
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
        copy.textContent = `The scatter plot shows the players' tendency of net attacking plays, with 3.7% of shots being volleys overall. The histogram shows the diversity of shot types, traducing a preference for groundstrokes across eras.`;
    } else {
        title.textContent = `${era.name} (${era.period})`;
        copy.textContent = era.summary;
    }

    scatterCount.textContent = `${selectedProfiles.length} profiles`;
}

function updateServiceText(featureData, eraId, selectedProfiles, estimatedProfiles, title, copy) {
    const era = ERA_BY_ID[eraId];
    if (eraId === "all") {
        title.textContent = featureData.allTitle;
        copy.textContent = `The scatter plot shows how players across different eras compare in their tendency to win service points quickly, with 36% of all charted points won within three shots. The heat map visualizes where serves land and where they miss, with overall 29% of all serves failing to make it in.`;
        return;
    }

    title.textContent = `${era.name} (${era.period})`;
    copy.textContent = SERVICE_ERA_SUMMARIES[eraId];
}

function updateFinishesText(featureData, eraId, selectedProfiles, estimatedProfiles, title, copy) {
    const era = ERA_BY_ID[eraId];
    const summary = featureData.summaries.get(eraId) || featureData.summaries.get("all");
    const distribution = featureData.distributions.get(eraId) || featureData.distributions.get("all");
    const topFinish = distribution.values.slice().sort((a, b) => b.value - a.value)[0];
    const estimateNote = estimatedProfiles
        ? ` ${estimatedProfiles} profiles use rank-derived point estimates where ATP point fields are missing.`
        : "";

    if (eraId === "all") {
        title.textContent = featureData.allTitle;
        copy.textContent = `The scatter plot shows the agressivity of players, reflected by the average number of winners per match. The pie chart shows the distribution of point endings, with 57% of points won by an attack from the player.`;
        return;
    }

    title.textContent = `${era.name} (${era.period})`;
    copy.textContent = FINISH_ERA_SUMMARIES[eraId];
}

function getScatterTooltip(profile, featureData) {
    const pointLabel = profile.pointsEstimated
        ? `ATP point estimate: ${formatNumber(profile.atpPoints)} from best rank #${formatNumber(profile.bestRank)}`
        : `Peak ATP points: ${formatNumber(profile.atpPoints)}`;
    const volumeLabel = featureData.id === "service"
        ? `Service points: ${formatNumber(profile.pts)}`
        : featureData.id === "finishes"
            ? `Point endings: ${formatNumber(profile.finishTotal)}`
            : `Charted shots: ${formatNumber(profile.totalTypeShots)}`;

    return [
        `<strong>${profile.player}</strong>`,
        `${profile.era.name}, ${profile.era.period}`,
        `${featureData.scatterMetricLabel}: ${formatScatterXValue(profile.xValue, featureData)}`,
        pointLabel,
        volumeLabel
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

function describePieSlice(centerX, centerY, radius, startAngle, endAngle) {
    const safeEndAngle = Math.min(endAngle, startAngle + Math.PI * 2 - 0.0001);
    const start = polarToCartesian(centerX, centerY, radius, startAngle);
    const end = polarToCartesian(centerX, centerY, radius, safeEndAngle);
    const largeArc = safeEndAngle - startAngle > Math.PI ? 1 : 0;

    return [
        `M ${centerX} ${centerY}`,
        `L ${start.x} ${start.y}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
        "Z"
    ].join(" ");
}

function polarToCartesian(centerX, centerY, radius, angle) {
    return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
    };
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
