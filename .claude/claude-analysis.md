```text
     ┌───────┐
     │ ◉   ◉ │       C   L   A   U   D   E
     │   ▿   │
     └─┬───┬─┘       Analysis: how to draw the charts of the site
     ┌─┴───┴─┐       (and a report, if I ever ask for one).
     │ ▓▓▓▓▓ │
     └─┘   └─┘
```

# ANALYSIS

Read this file **before drawing a chart on the site** (cash flow, loan repayment, returns, …) or writing a report.
These are principles to take inspiration from, not a straitjacket: adapt them to what I ask, but a chart must always
be read correctly.

**Contents**

0. In short
1. Charts on the site
2. Choosing the chart
3. Encoding and colours
4. Scales
5. Labels, tooltips and uncertainty
6. Anti-patterns
7. Code
8. Before delivering
9. Sources

---

## 0. IN SHORT

1. **Start from the message**: a comparison, a distribution, a correlation or an evolution. One chart, one message.
2. **Position before colour**: what must be compared goes on a common axis.
3. **Bars start at zero**. No 3D, no pie, no rainbow.
4. **Units in `[]`** in axis titles and labels: `Montant [k€]`, `Cash flow [€ / mois]`.
5. **Show the uncertainty**: a simulation rests on hypotheses (rate, rent, vacancy); show the range, not one number.
6. **Same choices everywhere**: one quantity keeps the same colour, name and order on the whole site.

---

## 1. CHARTS ON THE SITE

| Rule                    | In practice                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| A chart when it helps   | a chart when the shape matters (evolution, split); a single figure stays a figure           |
| One chart, one message  | the description above the chart says what to look at, in a sentence                        |
| Explanatory, not a dump | as many charts as there are messages; no dashboard of everything                            |
| Same choices everywhere | capital, interest, rent, charges… keep the same colour and name in every card               |
| Table or chart          | a table (or the totals under the chart) for exact numbers, a chart for a pattern            |
| Hypotheses visible      | the inputs the chart depends on are next to it, or recalled in the description              |

---

## 2. CHOOSING THE CHART

| Message      | Chart                                                     | Example on the site                          |
| ------------ | --------------------------------------------------------- | -------------------------------------------- |
| Comparison   | bars starting at zero, or dots                            | return of several properties                 |
| Composition  | stacked bars (two or three parts at most)                 | capital and interest of each year            |
| Evolution    | a line, or bars per period, against time                  | cash flow per year, capital still owed       |
| Signed flows | bars above and below a zero line                          | monthly cash flow: rent in, loan and charges out |
| Sensitivity  | a line of the result against the hypothesis               | monthly payment against the interest rate    |
| Distribution | all the points along an axis, or a histogram if many      | prices per m² of the visited properties      |

- **Several scenarios**: tell them apart within one chart, or use small charts **sharing their scales**.
- **Cumulative or not**: a cumulative curve (total cash flow since purchase) shows when it turns positive; yearly
  bars show the rhythm. Pick the one that answers the question, say which one it is.

---

## 3. ENCODING AND COLOURS

Channels from the most to the least accurately read:

**position on a common scale > position on unaligned scales > length > angle > area > luminance, saturation.**

The site is dark only. Colours come from the CSS variables of `assets/css/base.css`, never hard-coded in the JavaScript:

| Use                                | Colour                                                             |
| ---------------------------------- | ------------------------------------------------------------------ |
| Two categories (capital, interest) | `--chart-capital` and `--chart-interets` (pair checked for contrast and colour blindness) |
| Positive / negative value          | `--color-accent` and `--color-negative`, plus the sign and the side of the zero line |
| Ordered quantity                   | one hue from dark to light, never a rainbow                        |
| Emphasis                           | everything in `--color-muted`, the one thing to notice in colour   |
| Text, grid                         | `--color-text`, `--color-muted`, `--color-border`                  |

- A new category needs a new variable in `base.css`, checked against the surface `#141415` for contrast.
- **Colour never carries alone** what the reader must not miss (1 in 12 men has a colour vision deficiency):
  repeat it with position, a sign or a label.
- More than three or four categories in one chart: group them, or use small charts.

---

## 4. SCALES

- **Linear** by default. Logarithmic almost never on this site: it hides the euros that matter.
- **Bars start at zero**, as they encode a length. Lines and dots can show a narrow range, if the axis says so.
- Large amounts in `[k€]`, with round graduations (`graduations()` in `graphique.js`).
- Charts to compare (two scenarios, two properties) **share their scales**.
- A signed quantity has a visible zero line, and the axis keeps it in view.
- No misleading aspect ratio: the chart is wide enough for the variation to be seen as it is.

---

## 5. LABELS, TOOLTIPS AND UNCERTAINTY

- **Label in place** rather than with a legend when possible; a legend, if needed, never covers data.
- **Axis titles**: quantity and unit in `[]`, in French with « vous » when a sentence is needed, translated in
  `traductions.js`.
- **Tooltip** on hover (and touch) for the exact values of a bar or a point, as in the repayment chart.
- **Show the uncertainty**: the site already works with a minimum and a maximum rate. Show both (a band, two lines,
  a range in the tooltip) rather than one value.
- **Say the hypotheses**: fixed rate, constant payments, costs not included… in the description or under the chart.
- Remove what no one reads (heavy grid, frames, decoration), but keep light grid lines when values must be read.

---

## 6. ANTI-PATTERNS

| Do not                          | Because                                              | Instead                         |
| ------------------------------- | ---------------------------------------------------- | ------------------------------- |
| Pie chart                       | angles are hard to compare                           | bars, or two or three parts     |
| 3D, shadows, gradients in bars  | it distorts perception, and adds nothing             | flat marks, position then colour|
| Cut a bar from zero             | a bar encodes a length: the cut exaggerates          | bars from zero, or dots         |
| Two y-axes                      | any correlation can be drawn by moving one of them   | two charts sharing the x-axis   |
| A single scenario as the truth  | the result depends on uncertain hypotheses           | the range of the hypotheses     |
| Rainbow colours                 | invents steps that are not in the data               | one hue, light to dark          |
| A chart for one number          | adds ink, not information                            | the number, large               |

---

## 7. CODE

- Charts are **plain SVG** built in JavaScript (`assets/js/graphique.js`): no chart library unless we agree on one.
- Reuse what exists: `svg()` to create elements, `graduations()` for round ticks, the tooltip of the repayment chart.
- Colours through CSS classes using the variables (`.chart__capital { fill: var(--chart-capital); }`).
- The chart redraws at the right width when it becomes visible and when the window is resized.
- Every text of a chart is translatable (`data-i18n` or `t()`), and amounts use the formats of the chosen language.

---

## 8. BEFORE DELIVERING

- [ ] Can the message of the chart be said in one sentence? Does the description say it?
- [ ] Do all the axes have a quantity and a unit in `[]`?
- [ ] Do bars start at zero? Do charts to compare share their scales?
- [ ] Are the colours those of the site, and the same as for this quantity elsewhere?
- [ ] Would the chart still read without colour vision?
- [ ] Is the uncertainty (range of hypotheses) shown, and are the hypotheses said?
- [ ] Does it read at phone width, in French and in English?

---

## 9. SOURCES

| Source                                  | Link                                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------- |
| Gilles Louppe, Lecture 3: Visualization | [dats0001](https://glouppe.github.io/dats0001-foundations-of-data-science/?p=lecture3.md#1) |
| Choosing colormaps in Matplotlib        | [matplotlib.org](https://matplotlib.org/stable/users/explain/colors/colormaps.html)         |
| Crameri et al. (2020), misuse of colour | [doi.org](https://doi.org/10.1038/s41467-020-19160-7)                                       |
