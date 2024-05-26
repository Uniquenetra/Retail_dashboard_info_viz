//import * as d3Collection from 'd3-collection';
//Global Variables for filters
var global_year = 2007;
var global_salesorprofit = "sales";
var global_customeragegroup = "all";
var global_department = "all";          // useful for the word cloud chart
var global_class = "all";               // useful for the word cloud chart
var global_brand = "all";
var global_month = "all"
var global_country = "all"
var global_product = "all"


var global_department_lc = "DRY FOOD";
var global_class_lc = "DRUG GM";
var global_sub_class_lc = "CANDY - CHECKLANE";
var global_quarters_lc = 1;
var global_product_desc_lc = "CANDY BARS (SINGLES)(INCLUDING";
var global_lineChart_data = [];              // useful for the bottom filters

var global_sac_status = 0;
var global_tm_status = 0;
var global_sg_status = 0;
var global_lc_status = 0;

//Global Variables for Barchart
var global_status = 0;
var property = document.getElementById("month_button");
var global_cm_selection = 'month'
// set the dimensions and margins of the graph
var margin = {top: 10, right: 5, bottom: 70, left: 70},
    width = 1050,
    height = 195;

// Initialize the X axis
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

// Initialize the Y axis
var y = d3.scaleLinear()
    .range([height, 0]);
var svg, xAxis, yAxis
var global_render_SAC = 1

// Global variable for wordCloud
var iterator = 0;
var global_render_WC = 1
var global_wc_status = 0;

var global_sb
var global_sgd
var global_sgd_wc
var global_sb_wc

var global_prod_data
var div

d3.csv("data/ds_prodhier.csv")
    .then((data) => {
        global_prod_data = data;
    })
    .catch((error) => {
        console.log(error)
    });

//main function
function init() {
    createTopFilters();

    var chart_data
    d3.csv("data/ds_linechart.csv")
        .then((data) => {
            //dataSet = data;
            global_lineChart_data = data;
            console.log("aqui_create_lc");
            //console.log(global_lineChart_data);
            createBottomFilters(data);
            //createLineChartAux(data);
            render_charts();
        })
        .catch((error) => {
            console.log(error);
        });



}

function render_charts() {

    var var_salesorprofit = document.getElementById("selectButtonProfitOrSales");
    global_salesorprofit = var_salesorprofit.value

    var var_year = document.getElementById("selectButtonYear");
    global_year = var_year.value

    var var_customeragegroup = document.getElementById("selectButtonCustomerAgeGroup");
    global_customeragegroup = var_customeragegroup.value


    // bottom filters
    var var_department = document.getElementById("selectButtonDepartment");
    global_department_lc = var_department.value;

    var var_product = document.getElementById("selectButtonProduct");
    global_product_desc_lc = var_product.value;

    //Barchart
    createbarchart(global_cm_selection);
    //Treemap
    createtreemap("all");

    createStackedAreaChart("all")

    //Slopegraph
    createslopegraph("all")
    //WordCloudChart
    createWordCloudChart("all")

    //LineChart
    //createLineChart();
    createLineChartAux(global_lineChart_data);
}

/*
function createLineChart() {
    var chart_data
    d3.csv("data/ds_linechart.csv")
        .then((data) => {
            //dataSet = data;
            chart_data = data;
            console.log("aqui_create_lc");
            //console.log(global_lineChart_data);
            createLineChartAux(data);
        })
        .catch((error) => {
            console.log(error);
        });
    //global_lineChart_data = chart_data
}*/

function createLineChartAux(data) {
    console.log("-------------Line Chart begin----------------")
    console.log(data)
    console.log("-------------Line Chart end------------------")

    var filtered_data_lc

    // Filter the data based on the filters chosen by the user
    filtered_data_lc = data.filter(function (d) {
        if (
            (d.QUARTERS == global_quarters_lc) &&
            (d.PRODUCT_DESC == global_product_desc_lc) &&
            (d.YEAR == global_year)
        ) {
            return d;
        }
    });

    //console.log(filtered_data)

    // Getting the 3 only columns I need
    var filtered_data_cleaned_lc = filtered_data_lc.map(function (d) {
        return {
            WEEK_NO: +d.WEEK_NO,
            QTY: +d.QUANTITY,
            VAR_GRP: d.VAR_GRP
        }
    });
    console.log("filtered_data_cleaned" )
    console.log( filtered_data_cleaned_lc)

    // https://www.d3-graph-gallery.com/graph/line_several_group.html

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 1560 - margin.left - margin.right,
        height = 230 - margin.top - margin.bottom;

    var svg_lc

    if (global_lc_status == 0) {    // when it runs for the first time
        // append the svg object to the body of the page
        global_lc_status++;
    }
    else{   // NOT running for the first time
        svg_lc = d3.select("#lineChart")
            .select("svg")
            .remove()
    }

     svg_lc = d3.select("#lineChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // group the data: I want to draw one line per group
    const sumstat = d3.group(filtered_data_cleaned_lc, function(d) { return d.VAR_GRP;})

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
        .domain(d3.extent(filtered_data_cleaned_lc, function(d) { return d.WEEK_NO; }))
        .range([ 0, width ]);
    svg_lc.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(filtered_data_cleaned_lc, function(d) { return +d.QTY; })])
        .range([ height, 0 ]);
    svg_lc.append("g")
        .call(d3.axisLeft(y));

    // color palette
    const color = d3.scaleOrdinal()
        .range(['#e41a1c','#377eb8'])

    svg_lc.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return x(d.WEEK_NO); })
                .y(function(d) { return y(d.QTY); })
                (d[1])
        })


    svg_lc = d3.select("#lineChart")
        .select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");



    // toDo
    //createBottomFilters(data);

/*
    // Add text to the brand legends
    var f = d3.select("div#product0")
    d3.select("div#product0")
        .select("svg")
        .style("border", "1px black solid")
        .append("title")
    f.node().innerHTML = "No Discount";

    var ff = d3.select("div#product1")
    d3.select("div#product1")
        .select("svg")
        .style("border", "1px black solid")
        .append("title")
    ff.node().innerHTML = "Discount";*/
}

//filtersBottom Functions
function createBottomFilters(data) {

    var array_class = [];
    var array_sub_class = [];
    var array_product = [];



    // Legends of the bottom filters
    var x1 = d3.select("div#DepartmentLegend")
    d3.select("div#DepartmentLegend")
        .select("svg")
        .style("border", "1px black solid")
        .append("title")
    x1.node().innerHTML = "Department";

    /* Department button */
    var allGroup1 = ["DRY FOOD", "FRESH FOOD", "NON FOOD"]

    // add the options to the button
    d3.select("#selectButtonDepartment")
        .selectAll('myOptions')
        .data(allGroup1)
        .enter()
        .append('option')
        .text(function (d) { return d; })           // text showed in the menu
        .attr("value", function (d) { return d; })  // corresponding value returned by the button
    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------


    // Legends of the bottom filters
    var x2 = d3.select("div#Year2Legend")
    d3.select("div#Year2Legend")
        .select("svg")
        .style("border", "1px black solid")
        .append("title")
    x2.node().innerHTML = "Year";

    /* Class button */
    var allGroup2 = ["2007", "2008"]

    // Just to help
    /*
    console.log("data class 2")
    console.log(data_class2.length)
    console.log(data_class2[0]["CLASS"])
    console.log(typeof data_class2[1200])*/


    // add the options to the button
    d3.select("#selectButtonYear2")
        .selectAll('myOptions')
        .data(allGroup2)
        .enter()
        .append('option')
        .text(function (d) { return d; })           // text showed in the menu
        .attr("value", function (d) { return d; })  // corresponding value returned by the button
    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------



    // Legends of the bottom filters
    var x4 = d3.select("div#QuarterLegend")
    d3.select("div#QuarterLegend")
        .select("svg")
        .style("border", "1px black solid")
        .append("title")
    x4.node().innerHTML = "Quarter";

    /* Quarter button */
    var allGroup4 = [1, 2, 3, 4]

    // add the options to the button
    d3.select("#selectButtonQuarter")
        .selectAll('myOptions')
        .data(allGroup4)
        .enter()
        .append('option')
        .text(function (d) { return d; })           // text showed in the menu
        .attr("value", function (d) { return d; })  // corresponding value returned by the button
    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------


    // Legends of the bottom filters
    var x5 = d3.select("div#ProductLegend")
    d3.select("div#ProductLegend")
        .select("svg")
        .style("border", "1px black solid")
        .append("title")
    x5.node().innerHTML = "Product";

    /* Product button */
    //var allGroup5 = ["PRODUCT1", "PRODUCT2"]

    // Filter the data based on the filters chosen by the user
    data_class1 = data.filter(function (d) {
        if ((d.DEPARTMENT == global_department_lc) ){
            return d;
        }
    });

    data_class2 = data_class1.map(function (d) {
        return {
            PRODUCT_DESC: d.PRODUCT_DESC,
        }
    });

    for(var i = 0; i<data_class2.length; i++){
        array_product.push(data_class2[i]["PRODUCT_DESC"]);
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    var unique_array_product = array_product.filter(onlyUnique);
    console.log("array product")
    console.log(unique_array_product)

    // add the options to the button
    d3.select("#selectButtonProduct")
        .selectAll('myOptions')
        .data(unique_array_product)
        .enter()
        .append('option')
        .text(function (d) { return d; })           // text showed in the menu
        .attr("value", function (d) { return d; })  // corresponding value returned by the button
    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------


}

function createWordCloudChart(var_cm) {
    d3.csv("data/ds_wordcloud.csv")
        .then((data) => {
            //dataSet = data;
            createWordCloudChartAux(data, var_cm);
        })
        .catch((error) => {
            console.log(error);
        });
}

function createWordCloudChartAux(data, var_cm) {
var filtered_data
    // Filter the data based on the filters chosen by the user
    filtered_data = data.filter(function (d) {
        if ((d.YEAR == global_year) &&
            (d.CUSTOMER_AGE_GROUP == global_customeragegroup) &&
            (d.VAR_SP == global_salesorprofit) &&
            (d.DEPARTMENT == global_department) &&
            (d.CLASS == global_class) &&
            (d.BRAND == global_brand) &&
            (((d.VAR_CM == var_cm) && (var_cm == 'all')) ||
                ((d.VAR_CM == var_cm) && (var_cm == 'month') && (d.X_AXIS == global_month)) ||
                ((d.VAR_CM == var_cm) && (var_cm == 'country') && (d.X_AXIS == global_country)))) {
            return d;
        }
    });

    // Getting the 2 only columns I need
    filtered_data_cleaned = filtered_data.map(function (d) {
        return {
            PRODUCT_DESC: d.PRODUCT_DESC,
            TOTAL_VALUE: d.TOTAL_VALUE,
        }
    });

    // Convert TOTAL_VALUE from string to int
    filtered_data_cleaned_converted = filtered_data_cleaned.map(function (d) {
        return {
            PRODUCT_DESC: d.PRODUCT_DESC,
            TOTAL_VALUE: +d.TOTAL_VALUE,
        }
    });

    // Sort the data
    sorted_data = filtered_data_cleaned_converted.slice().sort((a, b) => d3.descending(a.TOTAL_VALUE, b.TOTAL_VALUE))
    var data_top5_products
    // Check if there is enough data and get top 5 products (or less)
    size = sorted_data.length
    if (size == 0) {
        return;
    } else {
        if (size < 5) {
            data_top5_products = sorted_data.slice(0, size);
        } else {
            data_top5_products = sorted_data.slice(0, 5);
        }
    }

    // Change the size of the top products
    font_size = 13;
    data_top5_products.forEach(function (item, index) {
        data_top5_products[index].TOTAL_VALUE = font_size;
        data_top5_products[index].COUNT = index;
        font_size -= 1;
    });

    // https://www.d3-graph-gallery.com/graph/wordcloud_size.html
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 400 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // Generate the Word Cloud Chart
    if (global_wc_status == 0) { //when it runs for the first time

        // append the svg object to the body of the page
        var svg = d3.select("#wordCloud").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        global_wc_status++;
    } else {   // NOT running for the first time
        svg = d3.select("#wordCloud").select("svg")

        svg
            .selectAll("text")
            .remove()

    }

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
        svg
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) {
                return d.size;
            })
            .style("fill", "#000000")
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) {
                return d.text;
            });
    }

    // Add text "Top Products"
    var x = d3.select("div#TopProductsLegend")
    d3.select("div#TopProductsLegend")
        .select("svg")
        .style("border", "1px black solid")
        .append("title")
    x.node().innerHTML = "Top Products";

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words
    //      that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(data_top5_products.map(function (d) {
            return {text: d.PRODUCT_DESC, size: d.TOTAL_VALUE, COUNT: d.COUNT};
        }))
        .padding(2)        //space between words
        .spiral("rectangular")
        .rotate(function () {
            return (~~(Math.random() * 2) * -0);
        })        // toDo I don't want rotates
        .fontSize(function (d) {
            return Math.max(10, Math.min(d.size * 1, 13));
        }) //font size of words
        .on("end", draw)

    layout.start();

    d3.select("#wordCloud")
        .select("svg")
        .selectAll("text")
        .on("mouseover", handlemouseover_wc)
        .on("mouseout", handlemouseout_wc)

}


//filtersTop Functions
function createTopFilters() {
    /* Sales or Profit button */
    var allGroup1 = ["sales", "profit"]

    // add the options to the button
    d3.select("#selectButtonProfitOrSales")
        .selectAll('myOptions')
        .data(allGroup1)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
        })           // text showed in the menu
        .attr("value", function (d) {
            return d;
        })  // corresponding value returned by the button


    /* Year button */
    var allGroup2 = ["2007", "2008"]
    // add the options to the button
    d3.select("#selectButtonYear")
        .selectAll('myOptions')
        .data(allGroup2)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
        })           // text showed in the menu
        .attr("value", function (d) {
            return d;
        })  // corresponding value returned by the button


    /* Customer Age Group button */
    var allGroup3 = ["all", "19-24", "25-34", "35-44", "45-54", "55-64", "65+"]
    // add the options to the button
    d3.select("#selectButtonCustomerAgeGroup")
        .selectAll('myOptions')
        .data(allGroup3)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
        })           // text showed in the menu
        .attr("value", function (d) {
            return d;
        })  // corresponding value returned by the button

    // Legends of the top filters
    var x1 = d3.select("div#SalesOrProfitLegend")
    d3.select("div#SalesOrProfitLegend")
        .select("svg")
        .style("border", "1px black solid")
        .append("title")
    x1.node().innerHTML = "Sales or Profit";

    var x2 = d3.select("div#YearLegend")
    d3.select("div#SalesOrProfitLegend")
        .select("svg")
        .style("border", "1px black solid")
        .append("title")
    x2.node().innerHTML = "Year";

    var x3 = d3.select("div#CustomerAgeGroupLegend")
    d3.select("div#SalesOrProfitLegend")
        .select("svg")
        .style("border", "1px black solid")
        .append("title")
    x3.node().innerHTML = "Customer Age Group";

}

//BarChart Functions
function updatebarchart(data) {
    if (!global_status) {
        // append the svg object to the body of the page
        svg = d3.select("#barChart")
            .append("svg")
            .attr("width", 1150)
            .attr("height", 225)
            //.attr("style", "outline: thin solid red;")
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")

        xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")

        yAxis = svg.append("g")
            .attr("class", "myYaxis")

        //Y-Axis Label
        svg.append("text")
            .attr("class", "ylabel")
            .attr("text-anchor", "end")
            .attr("x", -60)
            .attr("y", -50)
            .attr("font-size", 12)
            .text(function (d) {
                if (global_salesorprofit == "sales") {
                    return "Total Sales ($)";
                } else {
                    return "Total Profits ($)";
                }
            })
            .attr("transform", function (d) {
                return "rotate(-90)"
            });
        global_status = 1
    }

    svg.selectAll(".ylabel")
        .text(function (d) {
            if (global_salesorprofit == "sales") {
                return "Total Sales ($)";
            } else {
                return "Total Profits ($)";
            }
        })

    // Update the X axis
    x.domain(data.map(function (d) {
        return d.X_AXIS;
    }))
    xAxis.call(d3.axisBottom(x))

    // Update the Y axis
    y.domain([0, d3.max(data, function (d) {
        return d.TOTAL_VALUE * 1.2
    })]);
    yAxis.transition()
        .duration(500)
        .call(d3.axisLeft(y));

    // Create the u variable
    var u = svg.selectAll("rect")
        .data(data)

    u
        .enter()
        .append("rect") // Add a new rect for each new elements
        .merge(u) // get the already existing elements as well
        .transition() // and apply changes to all of them
        .duration(500)
        .attr("x", function (d) {
            return x(d.X_AXIS);
        })
        .attr("y", function (d) {
            return y(d.TOTAL_VALUE);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(d.TOTAL_VALUE);
        })
        .attr("fill", function (d) {
            if (d.VAR_CM == "country") {
                return "#B5EAD7";
            } else {
                return "#FFB7B2";
            }
        })
        .style("stroke", "black")


    // If less group in the new dataset, I delete the ones not in use anymore
    u
        .exit()
        .remove()

    d3.select("#barChart")
        .selectAll("rect")
        .on("mouseover", handlemouseover_bc)
        .on("mouseout", handlemouseout_bc)
}

function createbarchart(var_button) {
    d3.csv("data/ds_barchart.csv")
        .then((data) => {
            if (var_button == "month") {
                //Adding a data filter
                data = data.filter(function (d) {
                    if ((d.YEAR == global_year) &&
                        (d.CUSTOMER_AGE_GROUP == global_customeragegroup) &&
                        (d.VAR_SP == global_salesorprofit) &&
                        (d.VAR_CM == "month") &&
                        (d.BRAND == global_brand) &&
                        (d.DEPARTMENT == global_department) &&
                        (d.CLASS == global_class) &&
                        (d.PRODUCT_DESC == global_product)) {
                        return d;
                    }
                });
                property = document.getElementById("month_button");
                property.style.backgroundColor = "#FFFFFF"
                property = document.getElementById('country_button');
                property.style.backgroundColor = "#BDC3C7"
                global_cm_selection = 'month'
            } else if (var_button == "country") {
                //Adding a data filter
                data = data.filter(function (d) {
                    if ((d.YEAR == global_year) &&
                        (d.CUSTOMER_AGE_GROUP == global_customeragegroup) &&
                        (d.VAR_SP == global_salesorprofit) &&
                        (d.VAR_CM == "country") &&
                        (d.BRAND == global_brand) &&
                        (d.DEPARTMENT == global_department) &&
                        (d.CLASS == global_class) &&
                        (d.PRODUCT_DESC == global_product)) {
                        return d;
                    }
                });
                property = document.getElementById("country_button");
                property.style.backgroundColor = "#FFFFFF"
                property = document.getElementById('month_button');
                property.style.backgroundColor = "#BDC3C7"
                global_cm_selection = 'country'
            }
            updatebarchart(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

//Stacked Area Chart Functions
function createStackedAreaChart(var_cm) {
    //StackedAreaChart
    d3.csv("data/ds_stackedAreaChart.csv")
        .then((data) => {
            createStackedAreaChartAux(data, var_cm);

        })
        .catch((error) => {
            console.log(error)
        });
}

function createStackedAreaChartAux(data, var_cm) {

    var width = 400;
    var height = 250;
    var padding = {left: 70, right: 10, top: 10, bottom: 35};

    var filtered_data
    // Filter the data based on the filters chosen by the user
    filtered_data = data.filter(function (d) {
        if ((d.YEAR == global_year) &&
            (d.CUSTOMER_AGE_GROUP == global_customeragegroup) &&
            (d.VAR_SP == global_salesorprofit) &&
            (d.DEPARTMENT == global_department) &&
            (d.CLASS == global_class) &&
            (((d.VAR_CM == var_cm) && (var_cm == 'all')) ||
                ((d.VAR_CM == var_cm) && (var_cm == 'month') && (d.X_AXIS == global_month)) ||
                ((d.VAR_CM == var_cm) && (var_cm == 'country') && (d.X_AXIS == global_country)) ||
                ((d.VAR_CM == var_cm) && (var_cm == 'item') && (d.X_AXIS == global_product)))) {
            return d;
        }

    });


    var filtered_data_cleaned

    if (filtered_data.length < 1 || filtered_data == null)  {
        global_render_SAC = 0  //do not render the chart
        filtered_data_cleaned = [{CUSTOMER_INCOME_LEVEL: ["0"]}, {PRIVATE: [0]}, {NATIONAL: [0]}] //dummy values
    } else {
        filtered_data_cleaned = filtered_data.map(function (d) {
            return {
                CUSTOMER_INCOME_LEVEL: d.CUSTOMER_INCOME_LEVEL,
                PRIVATE: d.PRIVATE,
                NATIONAL: d.NATIONAL
            }
        });
    }

    keys = Object.keys(filtered_data_cleaned[0]).splice(1);
    var stack = d3
        .stack()
        .keys(keys)
        .order(d3.stackOrderAscending)
        .offset(d3.stackOffsetNone);

    var stackedData = stack(filtered_data_cleaned);

    //xaxis
    var xscale = d3
        .scaleLinear()
        .domain(
            d3.extent(filtered_data_cleaned, function (d) {
                return +d.CUSTOMER_INCOME_LEVEL;
            })
        )
        .range([padding.left, width - padding.right]);


    //yaxis
    var hscale = d3
        .scaleLinear()
        .domain([
            0,
            d3.max(stackedData, function (d) {
                return d3.max(d, function (e) {
                    return e[1] * 1.2;            // it was e[1] before
                });
            }),
        ])
        .range([height - padding.bottom, padding.top]);


    var color = d3
        .scaleOrdinal()
        .domain(keys)
        .range([
            "#B49DED",
            "#B2D17B",
        ]);

    // Generate the Stacked Area Chart
    if (global_sac_status == 0) { //when its run for the first time
        var svg = d3
            .select("#stackedAreaChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        //X-Axis Label
        svg.append("text")
            .attr("class", "xlabel")
            .attr("x", 170)
            .attr("y", 245)
            .attr("font-size", 12)
            .text("Customer Income Level")
            .attr("transform", function (d) {
                return "rotate(0)"
            });
        //Y-Axis Label
        svg.append("text")
            .attr("class", "ylabel")
            .attr("text-anchor", "end")
            .attr("x", -80)
            .attr("y", 15)
            .attr("font-size", 12)
            .text(function (d) {
                if (global_salesorprofit == "sales") {
                    return "Total Sales ($)";
                } else {
                    return "Total Profits ($)";
                }
            })
            .attr("transform", function (d) {
                return "rotate(-90)"
            });

        svg.selectAll(".ylabel") //update the label text
            .text(function (d) {
                if (global_salesorprofit == "sales") {
                    return "Total Sales ($)";
                } else {
                    return "Total Profits ($)";
                }
            })

        global_sac_status = global_sac_status + 1 //increment the run count
    } else //if NOT running for the first time
    {
        svg = d3.select("#stackedAreaChart")
            .select("svg")
        svg
            .selectAll("path")
            .remove()

        //remove the x-axis
        svg
            .select(".xaxis")
            .remove()

        //remove the y-axis
        svg
            .select(".yaxis")
            .remove()

        if (global_render_SAC == 1)//when there is enough data to render the chart
        {
            d3.selectAll(".Label_NED")
                .remove()
        }
    }

    //append the xaxis
    svg
        .append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0, " + (height - padding.bottom) + ")")
        .call(
            d3
                .axisBottom(xscale)
                .ticks(6)
                .tickFormat((d) => d)
        );

    //append the y-axis
    svg
        .append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + padding.left + ", 0)")
        .call(d3.axisLeft(hscale).tickFormat((d) => d / 1));    // it was d/1000000 before

    if (global_render_SAC) //if the data is enough to render the chart
    {
        svg
            .selectAll("areas")
            .data(stackedData)
            .enter()
            .append("path")
            .style("fill", function (d) {
                return color(d.key);
            })
            .attr(
                "d",
                d3
                    .area()
                    .x((d) => xscale(+d.data.CUSTOMER_INCOME_LEVEL))
                    .y0((d) => hscale(d[0]))
                    .y1((d) => hscale(d[1]))
            )
            .style("stroke", function (d) {
                return color(d.key);})
            .on("mouseover", handlemouseover_sac)
            .on("mouseout", handlemouseout_sac);
    }


    // Add text to the brand legends
    var x = d3.select("div#brand1")
    d3.select("div#brand1")
        .select("svg")
        .style("border", "1px black solid")
        .append("title")
    x.node().innerHTML = "Private Brand";

    var x = d3.select("div#brand2")
    d3.select("div#brand2")
        .select("svg")
        .style("border", "1px black solid")
        .append("title")
    x.node().innerHTML = "National Brand";

    if (global_render_SAC == 0) { //when not enough data to render the chart
        svg.append("text")
            .attr("class", "Label_NED")
            //.attr("text-anchor", "end")
            //.attr("x", 0-(padding.left0.001))    // padding.left=80
            .attr("x", 150)
            .attr("y", 150)
            //.attr("font-size", 56)
            .text("Not enough data").attr("transform", function (d) {
            return "rotate(0)"
        });
        global_render_SAC = 1;
    }

}

//Treemap
var data_tm, root, legend, color;
var data_path = "data/ds_treemap.csv";

var tm_margin = {top: 20, bottom: 20, left: 20, right: 70},
    tm_width = 570 - tm_margin.left - tm_margin.right,
    tm_height = 250 //- tm_margin.top - tm_margin.bottom;

//var dataset;

function createtreemap(var_cm) {
    legend = [
        "DRY FOOD",
        "FRESH FOOD",
        "NON FOOD"];

    format = d3.format("d");

    d3.csv(data_path, type)
        .then(function (dataset) {
            data_tm = dataset.filter(function (d) {
                if ((d.YEAR == global_year) &&
                    (d.CUSTOMER_AGE_GROUP == global_customeragegroup) &&
                    (d.VAR_SP == global_salesorprofit) &&
                    (d.BRAND == global_brand) &&
                    (((d.VAR_CM == var_cm) && (var_cm == 'all')) ||
                        ((d.VAR_CM == var_cm) && (var_cm == 'month') && (d.X_AXIS == global_month)) ||
                        ((d.VAR_CM == var_cm) && (var_cm == 'country') && (d.X_AXIS == global_country)))) {
                    return d;
                }
            });
            processData();
            treemap();
        })
        .catch((error) => {
            console.log(error);
        });
}

function processData() {

    var stratify = d3
        .stratify()
        .id(function (d) {
            return d.child;
        })
        .parentId(function (d) {
            return d.parent;
        });

    root = stratify(data_tm)
        .sum(function (d) {
            return d.TOTAL_VALUE;
        })
        .sort(function (a, b) {
            return b.tm_height - a.tm_height || b.TOTAL_VALUE - a.TOTAL_VALUE;
        });
}

function treemap() {
    data_tm.forEach(function (d) {
        d.TOTAL_VALUE = +d.TOTAL_VALUE;
    });

    var treemap = d3.treemap().size([tm_width, tm_height]).padding(1).round(true);
    treemap(root);

    color = d3
        .scaleOrdinal()
        .range(
            d3.schemeCategory10.map(function (c) {
                c = d3.rgb(c);
                c.opacity = 0.25;
                return c;
            })
        )
        .domain(legend);


    if (global_tm_status == 0) {
        createLegend();
        global_tm_status = global_tm_status + 1
    } else {
        d3.select("#sunBurst")
            .selectAll(".node")
            .remove()

    }
    createChart();
}

function createChart() {
    var node = d3
        .select("#sunBurst")
        .selectAll(".node")
        .data(root.leaves(), function (d) {
            return d.data.child;
        })
        .enter()
        .append("div")
        .attr("class", "node")
        .attr("title", function (d) {
            return d.id + "\n" + d.value;
        })
        .style("left", function (d) {
            return d.x0 + "px";
        })
        .style("top", function (d) {
            return d.y0 + "px";
        })
        .style("width", function (d) {
            return d.x1 - d.x0 + "px";
        })
        .style("height", function (d) {
            return d.y1 - d.y0 + "px";
        })
        .style("background", function (d, i) {
            return !d.children ? color(d.parent.data.child) : null;
        })
        .attr("transform", "translate(" + tm_width / 2 + "," + tm_height / 2 + ")")
        .on("mouseover", handlemouseover_tm)
        .on("mouseout", handlemouseout_tm);

    node.append("div").attr("class", "node-label");

    node.append("div").attr("class", "node-value");

    node.select(".node-label").text(function (d) {
        return d.data.child;
    });

    node.select(".node-value").text(function (d) {
        return format(d.value);
    });
}

function createLegend() {
    var svg = d3
        .select("#sunBurst")
        .append("svg")
        .attr("width", tm_width + 250)
        .attr("height", tm_height)
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + tm_width + ", " + 30 + ")");

    svg
        .append("text")
        //.style("font-weight", "bold")
        .style("font-size", 12)
        .attr("x", 4)
        .attr("y", -10)
        .text("");

    var legendItem = svg
        .selectAll(".legend-item")
        .data(legend)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", function (d, i) {
            return "translate(20," + i * 25 + ")";
        });

    legendItem
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("x", 50)
        .attr("y", 50)
        .style("fill", function (d) {
            return color(d);
        });

    legendItem
        .append("text")
        .style("font-size", 11)
        .attr("x", 70)
        .attr("y", 62)
        .text(function (d) {
            return d;
        });
}

function type(d) {
    d.TOTAL_VALUE = +d.TOTAL_VALUE;
    return d;
}

//Slopegraph

function createslopegraph(var_cm) {

// set the dimensions and margins of the graph
    var margin = {top: 30, right: 10, bottom: 10, left: 0},
        width = 570 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    var filtered_data

// Parse the Data
    d3.csv("/data/ds_slopegraph.csv").then(function (data) {
        filtered_data = data.filter(function (d) {
            if ((d.CUSTOMER_AGE_GROUP == global_customeragegroup) &&
                (d.VAR_SP == global_salesorprofit) &&
                (d.BRAND == global_brand) &&
                (((d.VAR_CM == var_cm) && (var_cm == 'all')) ||
                    ((d.VAR_CM == var_cm) && (var_cm == 'month') && (d.X_AXIS == global_month)) ||
                    ((d.VAR_CM == var_cm) && (var_cm == 'country') && (d.X_AXIS == global_country)))) {
                return d;
            }
        });
        var filtered_data_cleaned = filtered_data.map(function (d) {
            return {
                2007: +d.VALUE_2007,
                2008: +d.VALUE_2008,
                DEPARTMENT: d.DEPARTMENT
            }
        });

// Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
        dimensions = Object.keys(filtered_data_cleaned[0]).filter(function (d) {
            return d != 'DEPARTMENT'
        })

        var min2007 = d3.min(filtered_data_cleaned, function (d) {
            return d[2007];
        });
        var max2007 = d3.max(filtered_data_cleaned, function (d) {
            return d[2007];
        });

        var min2008 = d3.min(filtered_data_cleaned, function (d) {
            return d[2008];
        });
        var max2008 = d3.max(filtered_data_cleaned, function (d) {
            return d[2008];
        });

        var min = min2007;
        var max = max2008;

        if (min2007 < min2008)
            min = min2007;
        else
            min = min2008;

        if (max2007 > max2008)
            max = max2007;
        else
            max = max2008;

        min = min - 10000;
        max = max * 1.05;

        const SVG = d3.select("#legend_sg")
        var keys = ["DRY FOOD", "FRESH FOOD", "NON FOOD"];

        const y = {}
        for (i in dimensions) {
            name = dimensions[i]
            y[name] = d3.scaleLinear()
                .domain([min, max])
                .range([height, 0])
        }


        // Build the X scale -> it find the best position for each Y axis
        x_sg = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(dimensions);

        const color = d3.scaleOrdinal()
            .domain(["DRY FOOD", "FRESH FOOD", "NON FOOD"])
            .range(d3.schemeCategory10.map(function (c) {
                    c = d3.rgb(c);
                    c.opacity = 0.25;
                    return c;
                })
            )

        const size = 17
        SVG
            .selectAll("mydots")
            .data(keys)
            .enter()
            .append("rect")
            .attr("x", 100)
            .attr("y", function (d, i) {
                return 100 + i * (size + 5)
            }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function (d) {
                return color(d)
            })

        SVG
            .selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", 100 + size * 1.2)
            .attr("y", function (d, i) {
                return 100 + i * (size + 5) + (size / 1.3)
            }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", "#000000")
            .text(function (d) {
                return d
            })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(dimensions.map(function (p) {
                return [x_sg(p), y[p](d[p])];
            }));
        }

        if (global_sg_status == 0) {
            global_sg_status = global_sg_status + 1
        } else {
            d3.select("#slopeGraph")
                .select("svg")
                .remove()
        }

        // append the svg object to the body of the page
        var svg_sg = d3.select("#slopeGraph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg_sg
            .selectAll("myPath")
            .data(filtered_data_cleaned)
            .attr("class", "lines")
            .join("path")
            .attr("d", path)
            .style("fill", function(d){return( color(d.DEPARTMENT))})
            .style("stroke", function(d){return( color(d.DEPARTMENT))})
            .style("stroke-width", "4")
            .style("opacity", 20)
            .text(function (d) {
                return d.DEPARTMENT;
            })
            .on("mouseover", handlemouseover_sg)
            .on("mouseout", handlemouseout_sg)

        // Draw the axis:
        svg_sg.selectAll("myAxis")
            // For each dimension of the dataset I add a 'g' element:
            .data(dimensions).enter()
            .append("g")
            // I translate this element to its right position on the x axis
            .attr("transform", function (d) {
                return "translate(" + x_sg(d) + ")";
            })
            // And I build the axis with the call function
            .each(function (d) {
                d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d]));
            })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) {
                return d;
            })
            .style("fill", "black")

        svg_sg.append("text")
            .attr("class", "ylabel")
            .attr("text-anchor", "end")
            .attr("x", -60)
            .attr("y", 120)
            .attr("font-size", 12)
            .text(function (d) {
                if (global_salesorprofit == "sales") {
                    return "Total Sales ($)";
                } else {
                    return "Total Profits ($)";
                }
            })
            .attr("transform", function (d) {
                return "rotate(-90)"
            });
    })
}

function handlemouseover_bc(event, d) {
    d3.select(this)
        //.style("background-color", "orange")
        .style("stroke", "red")

    if (global_cm_selection == 'month') {
        global_month = d.X_AXIS
        global_country = "all"
    } else {
        global_country = d.X_AXIS
        global_month = "all"
    }
    createslopegraph(global_cm_selection)
    createtreemap(global_cm_selection)
    createStackedAreaChart(global_cm_selection)
    createWordCloudChart(global_cm_selection)
}

function handlemouseover_sac(event, d) {
    d3.select(this)
        //.style("background-color", "orange")
        .style("stroke", "red")
    global_brand = d.key
    createslopegraph("all")
    createtreemap("all")
    createbarchart(global_cm_selection);
    createWordCloudChart("all")

}


function handlemouseover_wc(event, d) {

    var slopegraph = d3.select("div#slopeGraph")
    d3.select(this)
        //.style("background-color", "orange")
        .style("fill", "red")

    var prod_dept
    var prod_class
    for (var x = 0; x < global_prod_data.length; x++) {
        if (global_prod_data[x].PRODUCT_DESC == d.text) {
            prod_dept = global_prod_data[x].DEPARTMENT;
            prod_class = global_prod_data[x].CLASS
        }
    }

    var sgd_wc = d3.select("div#slopeGraph")
        .select("svg")
        .select("g")
        .selectAll("path")
        .filter(function (c) {
            if (c != null && prod_dept == c.DEPARTMENT) {
                return c
            }
        })
        .style("stroke", "red");

    global_sb_wc = d3.selectAll("div.node")
        .filter(function (c) {
            if (prod_class == c.id) return c;
        })
        .style("border", "thin solid red");

    global_sgd_wc = sgd_wc

    global_department = prod_dept
    global_class = prod_class
    global_product = d.text
    createStackedAreaChart("item")
    createbarchart(global_cm_selection)
}

function handlemouseover_tm(event, d) {
    d3.select(this)
        .style("border", "thin solid red")

    var sgd = d3.select("div#slopeGraph")
        .select("svg")
        .select("g")
        .selectAll("path")
        .filter(function (c) {
            if (c != null && d.data.parent == c.DEPARTMENT) {
                return c
            }
        })
        .style("stroke", "red");

    global_sgd = sgd
    global_department = d.data.parent
    global_class = d.id;
    createWordCloudChart("all")
    createStackedAreaChart("all")
    createbarchart(global_cm_selection);
}

function handlemouseover_sg(event, d) {
    d3.select(this)
        .style("stroke", "red");

    global_sb = d3.selectAll("div.node")
        .filter(function (c) {
            if (d.DEPARTMENT == c.data.parent) return c;
        })
        .style("border", "thin solid red");

    div.transition()
        .duration(200)
        .style("opacity", .9);
    div.html(d.DEPARTMENT + "<br/>" + "2007: " + d[2007] +"<br/>" + "2008: " + d[2008])
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 44) + "px");

    global_department = d.DEPARTMENT
    createWordCloudChart("all")
    createStackedAreaChart("all")
    createbarchart(global_cm_selection);
}

function handlemouseout_sg() {
    d3.select(this)
        .style("stroke", function(d){return( color(d.DEPARTMENT))});

    div.transition()
        .duration(500)
        .style("opacity", 0);

    global_department = "all"
    createWordCloudChart("all");
    createStackedAreaChart("all")
    createbarchart(global_cm_selection);

    global_sb.style("border", "white");
}

function handlemouseout_tm() {
    d3.select(this)
        .style("border", "white");

    global_department = "all"
    global_class = "all"
    createWordCloudChart("all")
    createStackedAreaChart("all")
    createbarchart(global_cm_selection);

    global_sgd.style("stroke", function(d){return( color(d.DEPARTMENT))})
}

function handlemouseout_wc() {
    d3.select(this)
        .style("fill", "black");

    global_class = "all"
    createWordCloudChart("all");

    global_sgd_wc.style("stroke", function(d){return( color(d.DEPARTMENT))})
    global_sb_wc.style("border", "white");
    global_department = "all"
    global_product = "all"
    createStackedAreaChart("all")
    createbarchart(global_cm_selection)

}

function handlemouseout_sac() {
    d3.select(this)
        //.style("background-color", "orange")
        .style("stroke", "white")


    global_brand = "all"
    createslopegraph("all")
    createtreemap("all")
    createbarchart(global_cm_selection);
    createWordCloudChart("all")

}

function handlemouseout_bc() {
    d3.select(this)
        //.style("background-color", "orange")
        .style("stroke", "black")

    global_month = "all"
    global_country = "all"
    createslopegraph("all")
    createtreemap("all")
    createStackedAreaChart("all")
    createWordCloudChart("all")
}


