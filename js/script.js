// Era data for placeholder charts
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
        name: "Graphite Era (1980-1995)",
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
        name: "Transition Era (1995-2008)",
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
        name: "Big 3 Era (2008-2020)",
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
            { rank: 1, name: "Novak Djokovic", points: 5400 },
            { rank: 2, name: "Rafael Nadal", points: 4600 },
            { rank: 3, name: "Daniil Medvedev", points: 3800 },
            { rank: 4, name: "Dominic Thiem", points: 3200 },
            { rank: 5, name: "Roger Federer", points: 3000 },
            { rank: 6, name: "Stefanos Tsitsipas", points: 2800 },
            { rank: 7, name: "Alexander Zverev", points: 2400 },
            { rank: 8, name: "Matteo Berrettini", points: 2200 },
            { rank: 9, name: "Diego Schwartzman", points: 2000 },
            { rank: 10, name: "Gael Monfils", points: 1800 }
        ]
    }
};

// Initialize events on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeChartPlaceholders();
    initializeSankeySkeletons();
    addScrollAnimations();
});

function initializeSankeySkeletons() {
    const sankeyContainers = document.querySelectorAll('.sankey-flows');

    sankeyContainers.forEach((container) => {
        container.innerHTML = `
            <svg class="sankey-svg" viewBox="0 0 600 320" preserveAspectRatio="none" aria-hidden="true">
                <rect class="sankey-node left l1" x="6" y="8" width="44" height="44"></rect>
                <rect class="sankey-node left l2" x="6" y="64" width="44" height="44"></rect>
                <rect class="sankey-node left l3" x="6" y="120" width="44" height="44"></rect>
                <rect class="sankey-node left l4" x="6" y="176" width="44" height="44"></rect>
                <rect class="sankey-node left l5" x="6" y="232" width="44" height="44"></rect>

                <rect class="sankey-node right r1" x="550" y="44" width="44" height="92"></rect>
                <rect class="sankey-node right r2" x="550" y="168" width="44" height="108"></rect>

                <path class="sankey-link s1" d="M50 30 C210 30, 390 70, 550 70"></path>
                <path class="sankey-link s2" d="M50 86 C210 86, 390 106, 550 106"></path>
                <path class="sankey-link s3" d="M50 142 C210 142, 390 90, 550 88"></path>
                <path class="sankey-link s4" d="M50 198 C210 198, 390 230, 550 230"></path>
                <path class="sankey-link s5" d="M50 254 C210 254, 390 244, 550 244"></path>
                <path class="sankey-link s6" d="M50 30 C210 30, 390 214, 550 214"></path>
                <path class="sankey-link s7" d="M50 142 C210 142, 390 198, 550 198"></path>
                <path class="sankey-link s8" d="M50 198 C210 198, 390 104, 550 104"></path>
            </svg>
        `;
    });
}

// Initialize chart placeholders with D3
function initializeChartPlaceholders() {
    const eraSections = document.querySelectorAll('.era-section');
    
    eraSections.forEach((section, index) => {
        const eraKey = `era${index + 1}`;
        const eraBox = section.querySelector('.era-box');
        const chartContent = section.querySelector('.chart-content');
        const chartPlaceholder = section.querySelector('.chart-placeholder');
        const data = eraData[eraKey];
        
        // On hover, generate histogram in the description panel area.
        eraBox.addEventListener('mouseenter', () => {
            createHistogram(chartContent, data);
        });

        eraBox.addEventListener('mouseleave', () => {
            chartContent.innerHTML = '';
            d3.select('.chart-tooltip').style('opacity', 0);
        });

        eraBox.style.cursor = 'pointer';
    });
}

// Create D3 histogram for top 10 players
function createHistogram(container, data) {
    // Clear previous content
    container.innerHTML = '';
    
    const margin = { top: 20, right: 20, bottom: 80, left: 50 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', container.clientWidth)
        .attr('height', container.clientHeight);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const xScale = d3.scaleBand()
        .range([0, width])
        .padding(0.2)
        .domain(data.players.map(d => d.rank));
    
    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data.players, d => d.points) * 1.1]);
    
    // Color scale
    const colorScale = d3.scaleSequential()
        .domain([1, 10])
        .interpolator(d3.interpolateBlues);
    
    // Bars
    g.selectAll('.bar')
        .data(data.players)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.rank))
        .attr('y', d => yScale(d.points))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.points))
        .attr('fill', d => colorScale(d.rank))
        .style('opacity', 0)
        .transition()
        .duration(400)
        .style('opacity', 0.85);
    
    // X Axis
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', width / 2)
        .attr('y', margin.bottom - 10)
        .attr('fill', '#555')
        .style('font-size', '12px')
        .text('Player Rank');
    
    // Y Axis
    g.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -35)
        .attr('fill', '#555')
        .style('font-size', '12px')
        .text('Net Points');
    
    // Tooltip (singleton)
    let tooltip = d3.select('body').select('.chart-tooltip');
    if (tooltip.empty()) {
        tooltip = d3.select('body').append('div').attr('class', 'chart-tooltip');
    }

    tooltip
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px 12px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('opacity', 0);
    
    g.selectAll('.bar')
        .on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', 1);
            tooltip.html(`<strong>${d.name}</strong><br/>Points: ${d.points}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
            
            d3.select(event.currentTarget)
                .transition()
                .duration(200)
                .style('opacity', 1);
        })
        .on('mouseout', (event) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', 0);
            
            d3.select(event.currentTarget)
                .transition()
                .duration(200)
                .style('opacity', 0.85);
        });
}

// Add scroll animations for era sections
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.era-section').forEach(section => {
        observer.observe(section);
    });
}

// Smooth scroll for scroll indicator
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    document.querySelector('.eras-container').scrollIntoView({ behavior: 'smooth' });
});
