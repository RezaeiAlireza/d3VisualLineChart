# Visualization and Visualize Data Analysis (A2)
## Alireza Rezaei
## 12207501

### Overal
- This project uses a dataset in csv which is loaded using d3 in vis.js and visualize the line chart using d3.js. Also there is a brushing part at the bottom of chart to be able to zoom to see lines more precisely since it gets too complicated and unreadable in some timelines.
- When hovering on a line the line gets highlighted and the name of responding state gets written on top left of the chart.
- When selecting a line its color changes permanently(until the user click on it again) and the name of responding state will be written in the same color as the line itself on the top right of chart.

### index.html
The HTML file is a basic structure of the project which is linked to the d3.min.js, vis.js and styles.css. The div classed as chart is used in vis.js to append the svg to it.
Instead of defining the chart's title(h1), I added it using d3 in my vis.js.

### vis.js
The vis.js file contains the JavaScript code to create the line chart. It defines the chart dimensions, loads data from data.csv, and handles interactivity like highlighting and brushing.

- Title and Styling:
I created an <h1> element and set its text, alignment, font, and margins.

- Chart Dimensions and SVG Container:
I defined the dimensions and margins for the line chart. This helps in creating an appropriate space for visualization.

- Loading Data:
I loaded the data from a CSV file named "data.csv" using d3.csv function.

- Scales:
I defined scales for the x-axis and y-axis.
The x-axis scale (xScale) is a band scale for the years, mapping them to the chart's width with a bit of padding.
The y-axis scale (yScale) is a linear scale that maps burglary rates to the chart's height.

- Creating Axes:
I created and append both the x-axis and y-axis to the chart.
The x-axis is labeled "Years," and the y-axis is labeled "Burglary Rate (per 100,000 people)."

- Line Generator:
I created a line generator (line) using D3.js, which will be used to draw lines on the chart.

- Drawing Lines:
I used the line generator to draw lines for each state on the chart. The data for each state is represented as a line on the chart, with different colors.

- Interaction:
I added interaction to the chart. When user hover over a line representing a state, it changes color to orange and displays the state name on top left of the chart.

- Selection:
When user click on line, the line changes color to a random color(which is not black nor white) and is labeled with the state name.

- Brushing:
I created an additional chart below the main chart to provide brushing functionality. This allows users to select a specific time range on the x-axis.
I used d3.brushX() feature to enable this functionality, and when a selection is made, it updates the main chart accordingly.

### styles.css
In this file I added some styling during the development phase to make the visualization a little more beautiful.