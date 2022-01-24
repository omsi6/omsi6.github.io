const statGraph = {
    initalized: false,
    init() {
        if (this.initalized) return;
        const statChartCtx = document.getElementById("statChartCtx");
        const dataset = this.getGraphDatasets();
        const statLabels = [];
        $(statList).each((_index, stat) => {
            statLabels.push(_txt(`stats>${stat}>short_form`));
        });
        this.graphObject = new Chart(statChartCtx, {
            type: "radar",
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label(context) {
                                // format raw value as a reasonable percentage
                                let formattedValue = context.raw;
                                if (formattedValue > 99.99999999) formattedValue = formattedValue.toPrecision(12);
                                else if (formattedValue > 99.999999) formattedValue = formattedValue.toPrecision(10);
                                else if (formattedValue > 99.9999) formattedValue = formattedValue.toPrecision(8);
                                else if (formattedValue > 99.99) formattedValue = formattedValue.toPrecision(6);
                                else if (formattedValue === 0) formattedValue = 0;
                                else formattedValue = formattedValue.toPrecision(4);
                                return `${context.dataset.label}: ${formattedValue}%`;
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0,
                        borderWidth: 4
                    },
                    point: {
                        radius: 5,
                        hoverRadius: 6,
                        hitRadius: 1
                    }
                },
                scales: {
                    r: {
                        suggestedMin: 0,
                        suggestedMax: 20,
                        ticks: {
                            showLabelBackdrop: false,
                            maxTicksLimit: 6,
                            stepSize: 10,
                            precision: 0,
                            z: 1
                        },
                    },
                },
            },
            data: {
                labels: statLabels,
                datasets: dataset,
            }
        });
        this.initalized = true;
    },
    graphObject: null,
    getGraphDatasets() {
        const dataset = [
            {
                label: _txt("stats>tooltip>mana_cost_reduction"),
                data: [],
                fill: true,
                backgroundColor: "rgba(157, 103, 205, 0.2)",
                borderColor: "rgb(157, 103, 205)",
                pointBackgroundColor: "rgb(157, 103, 205)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(157, 103, 205)",
            }
        ];
        for (let i = 0; i < statList.length; i++) {
            dataset[0].data.push((1 - (1 / (1 + getLevel(statList[i]) * 0.01))) * 100);
        }
        return dataset;
    },
    update() {
        const newDatasets = this.getGraphDatasets();
        this.graphObject.data.datasets.forEach((dataset, index) => {
            dataset.data = newDatasets[index].data;
        });
        this.graphObject.update();
        view.updateStatGraphNeeded = false;
    }
};

let radarModifier;