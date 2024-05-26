# Retail Dashboard Information Visualization 

## Abstract

“Retail sales tracks consumer demand for finished goods by measuring the purchases of durable and non-durable goods over a defined period of time.” ([Investopedia](https://www.investopedia.com/terms/r/retail-sales.asp))

It’s important for a company to keep track of its profits and sales so that they know which of their products are generating revenue, the influence of the type of product brand regarding the sales, in which country or city they should be investing more or even stop investing, which departments are generating more profit, and if the customer age group or the customer income level impacts sales.

With our project and visualization, we aim to provide answers to these questions by showing multiple idioms, all connected between themselves, that take into account variables like, “Month”, “Country”, “Brand”, “Year”, “Customer Income Level”, “Department”, “Customer Age Group”, and more variables that we will show in future sections of this report.

## Author Keywords

Retail; Sales; Profits; Pricing;

## Introduction

Retail is an everyday affair for everyone and has been so for a really long time. From Mom&Pop stores to Giant Retailers, everybody is trying to go digital for all their processes - from POS to their merchandising solutions and hence ‘data’ has become the centre for everything. Be it demand forecasting, or budgets, or pricing strategies or even the in-store product display takes into account the past sales and profit trends. And exactly this is what we planned to explore with our project.


## The Data

Retail Dashboard is based on a subset of retail sales dataset ([source](https://www.kaggle.com/frtgnn/dunnhumby-the-complete-journey?select=product.csv)) however sliced and/or aggregated at different levels.

It essentially has following linked entities:
1. Product:
   - The smallest saleable unit in retail
   - It has a 3 level hierarchy
     - Products are grouped into sub-classes
     - Sub-classes are grouped into Classes
     - Classes are grouped into Departments
2. Stores:
   - Only Physical stores
   - Grouped at the Country level
3. Customer:
   - Customer is essentially who buys the products at a store
   - Customers are global here - no relationship between stores and customers
   - Customer Database is maintained and has essentially:
     - Customer Ids
     - Customer Age groups
     - Customer Income Levels

**In accordance with the dataset, following were the questions (refined over the course) we decided to answer through this project:**
- Which dept or class (of products) appealed most to the different customer age groups in 2007? or in 2008?
- What was the 'brand' popularity among customers belonging to different income levels in 2007? or in 2008?
- What’s the monthly trend in sales for 2007? or for 2008?
- Were the total sales per year (per dept) in 2008 more than those of 2007?
- Which Countries are stronger/weaker on profits?
- Does giving discounts improve the sales?

We wanted to answer these questions because none of the visualizations we found when we were doing research for this project answered all of them. This is further explained in the “related work” section.

As we said before, what we expected by going with this approach is to know how a person’s income level and age affect the type of products they buy, how the number of sales changes in the different months of the year and in the different countries where the store operates.

Our aim was to create a dashboard where the user could see all of this information in one screen, see the evolution of sales in the different months, see what departments sell more and see the products that sold the most given in each category that the user wants to see. The user can also see the effect of the discounts on the sales of a given product.

## Related Work

When we were doing the research for our project we found different visualizations that were related to our project but they were composed by a single graph, most of them with no interactivity where we could only see a specific aspect of that specific store or product, like the one on figure 1.

![Figure 1. IBM 5-Year Quarterly Revenue Growth](images/0.jpg)

What we wanted was a dashboard that showcased the information for all the aspects of the store. We wanted the user to have information on the type of customers the store as, what are the trends in sales over the months, see how much a discount affects the sales of a products, and what are the most popular products in the different departments and different sub-departments (that we call classes) and also what type of brand the customers prefer overall.

We could only find graphs that showed the attributes that we wanted to show individually, we could not find a connected dashboard that showed in-depth information about a specific store and its customers.

The graphs that are found online only showed a limited amount of data and in all the years of experience dealing with datasets and information on sales and retail revenue there were no graphs that connected the different data collected from a store.

## Visualization

On applying necessary filters,

![Top filters for the entire dashboard](1.jpg)

### Upper-Part Overview
The upper portion of the dashboard offers a comprehensive view of various metrics and comparisons, each tailored to specific filters applied by the user. Here's a breakdown:

1. **Total Sales per Month per filtered Year per filtered Customer Age Group:** 
   ![Bar Chart with total sales over months](images/2.jpg)

2. **Total Profits per Month per filtered Year per filtered Customer Age Group:** 
   ![Bar Chart with total profits over months](images/3.jpg)

3. **Total Sales per Country per filtered Year per filtered Customer Age Group:** 
   ![Bar Chart with total sales over countries](images/4.jpg)

4. **Total Profits per Country per filtered Year per filtered Customer Age Group:** 
   ![Bar Chart with total profits over countries](images/5.jpg)

5. **Comparison Sales for each Brand for various customer-income-level-groups per filtered Year, per filtered Customer Age Group:** 
   ![Stacked Area Chart with total sales over income levels](images/6.jpg)

6. **Comparison Profits for each Brand for various customer-income-level-groups per filtered Year, per filtered Customer Age Group:** 
   ![Stacked Area Chart with total profits over income levels](images/7.jpg)

7. **Comparison Sales for each Department (of product) for 2007 and 2008 per filtered Customer Age Group:**
   ![Slope Chart with total sales for 2007 and 2008](images/8.jpg)

8. **Comparison Profits for each Department (of product) for 2007 and 2008 per filtered Customer Age Group:**
   ![Slope Chart with total profits for 2007 and 2008](images/9.jpg)

9. **Comparison Sales or distribution over containing classes (of products) per filtered Year per filtered Customer Age Group:**
   ![Treemap with total sales](images/10.jpg)

10. **Comparison Profits or distribution over containing classes (of products) per filtered Year per filtered Customer Age Group:**
    ![Treemap with total profits](images/11.jpg)

11. **Top Selling Products of the company per filtered Year per filtered Customer Age Group:**
    ![Word Cloud with top selling products](images/12.jpg)

12. **Top Profit-making Products of the company per filtered Year per filtered Customer Age Group:**
    ![Word Cloud with top profit-making products](images/13.jpg)

![Legend for both the slope graph and the treemap](images/16.jpg)

### Lower-Part Overview
The lower portion of the dashboard includes a single idiom:

13. **Line Chart:**
    The line chart shows “What would have been the sales” (per filtered Product over the weeks of the filtered Year-Quarters) if there was no discount on the weeks when there was a discount. Essentially, it gives out the actual quantity vs. the projected quantity if there was no discount on that week.
    ![Line Chart with sales value of “hamburger buns” over weeks](images/14.jpg)

### Idioms Interaction
Each idiom interacts with others in the upper-part of the dashboard, ensuring a cohesive user experience:

- **Bar Chart (Idiom 1):** Interacts with Stacked Area Chart, Slopegraph, Treemap, and Wordcloud.
- **Stacked Area Chart (Idiom 2):** Interacts with Bar Chart, Slopegraph, Treemap, and Wordcloud.
- **Slopegraph (Idiom 3):** Interacts with Bar Chart, Stacked Area Chart, Treemap, and Wordcloud.
- **Treemap (Idiom 4):** Interacts with Bar Chart, Stacked Area Chart, Slopegraph, and Wordcloud.
- **WordCloud (Idiom 5):** Interacts with Bar Chart, Stacked Area Chart, Slopegraph, and Treemap.

### Dashboard with No Filters
![Dashboard with No Filters](images/15.jpg)

In the initial state, the dashboard displays data without any applied filters. Here's what the user sees:

- **Year Selection:** Users can select the desired year they want to analyze.
- **Age Group Filter:** Users can filter the customer age group, focusing on specific demographics. For instance, in this example, the age group selected is between 40 and 55 years.
- **Top Products:** The dashboard highlights the products that the selected age group purchased the most during the chosen year. This insight helps in understanding consumer preferences and popular items within the target demographic.
- **Departmental Spending:** Additionally, users can visualize the departments where the selected age group spent the most money. This information provides valuable insights into consumer behavior and helps in strategic decision-making for product placement, promotions, and inventory management.

By starting with no filters and gradually applying them, users can explore different aspects of retail sales data and gain valuable insights into consumer behavior, product popularity, and departmental performance.

### Rationale
- The choice of visualization idioms was based on their suitability for representing various aspects of retail sales data.
- Challenges faced during implementation included treemap zoom functionality, legend integration, dataset adjustments, and word cloud implementation.
- The integration of visualization idioms ensures a cohesive and informative user experience.

## Conclusion & Future Work

Future enhancements may include implementing zoom functionality for the treemap, extending the line chart for predictive analysis, and refining the word cloud implementation. The dashboard offers valuable insights into retail operations and serves as a foundation for further analysis and decision-making.

## How to Run

1. Clone the repository.
2. Open the `index.html` file in a web browser.
3. Explore the dashboard with various filters and visualizations.

## Acknowledgments

This project was made possible with the support of the VI Project - G09 - CP5 team.

## License

This project is licensed under the MIT License.
