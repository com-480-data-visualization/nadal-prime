# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Valentin Belardi | 341372 |
| Luca Deandrea | 340949 |
| Martin Sanchez Lopez | 313238 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (20th March, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)).

Our primary source is Jeff Sackmann’s ATP repository: https://github.com/JeffSackmann/tennis_atp/tree/master. It provides yearly match-level files from 1968 to the present (plus historical/amateur data) with structured information on players (ID, age, handedness, height, nationality), competition context (tournament level, surface), and performance indicators (e.g., aces, double faults, serve points, break points), when recorded.

We also rely on Jeff Sackmann’s Match Charting Project: https://github.com/JeffSackmann/tennis_MatchChartingProject. This source contains shot-level and tactical metadata for a large set of manually charted matches, including serve direction, return depth, net-point patterns, and point-construction information. It is essential to our problem statement because it provides direct proxies for playing style, which are not available in standard ATP match files.

Together, these datasets are appropriate for our objective: `tennis_atp` ensures robust long-term coverage and comparability across eras, while `tennis_MatchChartingProject` enables deeper tactical interpretation of player profiles. The key limitations are heterogeneous completeness across time and selective charting coverage (fewer matches than the full ATP corpus, with uneven representation by period/tournament/player).

Our preprocessing pipeline will restrict the scope to ATP men’s singles matches, align and standardize variables across years and sources, handle missingness and sparsity, and group the data into fixed eras.

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

Our central research question is: how does the profile of the dominant ATP player change across eras? Rather than producing a single all-time ranking, we analyze how the attributes associated with sustained dominance evolve from the late 1960s to today.

The analysis will be communicated through a combination of complementary visual views, including feature-level plots, player-level comparisons, and longitudinal time-series representations. We will compare features such as serve efficiency, number of winners per match, return performance, age, physical characteristics, nationality distribution, average point duration, return depth behavior, net-point usage to define accurately the best players across different eras.

Our working hypothesis is that structural changes in tennis (equipment, training methods, pace of play, and court conditions) shift the feature set that best predicts elite performance. The visualization therefore emphasizes temporal comparison between eras, not a universal definition of greatness. The intended audience includes tennis followers and sports analytics readers but also equipment engineers, coaches and tennis regulators that can all be interested in how the different decisions they take can influence the game.

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

  
See [`M1_preprocessing.ipynb`](./M1_preprocessing.ipynb).

### Related work


> - What others have already done with the data?



The datasets we used are made available by Jeff Sackmann. They have been widely used, notably in TennisAbstract, an online tennis encyclopedia maintained by Sackmann. The website displays information about players, their recent results, and various detailed statistics such as serve speed, winners and unforced errors, rallies, tactics, etc.

The dataset is also used by [Ultimate Tennis Statistics](https://www.ultimatetennisstatistics.com), which displays different tennis statistics such as a GOAT (Greatest Of All Time) list, rivalries, rankings, and titles. The website features its own GOAT points system, which consists of tallying up tournament match results, rivalries, overall rankings, surface Elo ratings, etc.


From a previous year of this course, the group Racket-Science made a visualization that centered around various tennis GOAT rankings. The website uses two main visualizations throughout; by default, each section has a podium which displays the three best players for the selected parameters. One can click to display a bubble chart that shows the 10 best players; hovering over a player shows the raw data.

> - Why is your approach original?  

Our approach is original as we seek to identify the characteristics of top players and how these evolved over time. We aim to understand how the evolution of tennis has changed the game across eras by comparing match patterns and top-player profiles, and how different eras or rule changes promoted different styles of play.

> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).  

For our visualization, we aim to make a scrollable timeline that shows the effective styles of play for each period and explains why the evolution may have happened. 

One possible visualization we could make would be inspired by a [NYT interactive page about various economic indicators](https://www.nytimes.com/interactive/2014/06/05/upshot/how-the-recession-reshaped-the-economy-in-255-charts.html). This approach would allow for a clear way to visualize various statistical trends at the same time using colors and tooltips.  
Another possible visualization would take inspiration from a [Bloomberg article on auto sales](https://www.bloomberg.com/graphics/2015-auto-sales/), to show players as bubbles and create playstyle or stat clusters when scrolling.
The visualization may also feature pictures of the evolution of rackets which have had a big influence on the how the sport has evolved, as is done in a [NYT article that shows the evolution of the football](https://www.nytimes.com/interactive/2014/06/13/sports/worldcup/world-cup-balls.html).  

> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

## Milestone 2 (17th April, 5pm)

**10% of the final grade**


## Milestone 3 (29th May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

