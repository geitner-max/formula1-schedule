<template>
    <Line
        v-if="chartData !== null"
        chart-id="line-chart-lap-times"
        :chart-data="chartData"
        :chart-options="chartOptions"
        :width="500"
        :height="500"
    />
</template>

<script>
import {Line} from 'vue-chartjs';
import UtilMixin from '../../../util/UtilMixin';

export default {
    name: "LeaderGapChart",
    data() {
        return {
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 60,
                            minRotation: 60
                        }
                    },
                    yAxes: {
                        reverse: true,
                    },
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    }
                },
            },
        }
    },
    setup() {
        
    },
    mixins: [
        UtilMixin
    ],
    components: {
        Line
    },
    props: {
        driverMapping: {
            required: true,
        },
        lapTimes: {
            required: true,
        },
    },
    computed: {
        chartData() {
            let datasets =  [];
            let lapsTotal = 0;

            // for each driver prepare dataset
            //label, borderColor, backgroundColor
            if(this.lapTimes !== null && this.driverMapping !== null) {
                console.log(this.lapTimes);
                // step 1: calculate total time after every lap for every driver
                let driverTotalTime = {};
                for(let driverId of Object.keys(this.lapTimes)) {
                    let lapDriverData = this.lapTimes[driverId];
                    lapsTotal = Math.max(lapsTotal, lapDriverData.length); // find amount of laps in the race
                    
                    let data = [];
                    let currentTotalTime = 0;
                    for (let lap of lapDriverData) {
                        currentTotalTime += this.parseTime(lap.time);
                        //console.log(value);
                        data.push(currentTotalTime);
                    }
                    console.log(data);
                    driverTotalTime[driverId] = data;
                }
                let lowestLaptimes = [];
                for(let i = 0; i < lapsTotal; i++) {
                    lowestLaptimes[i] = -1;
                }
                // step 2: find lowest toal time for every lap
                for(let driverId of Object.keys(driverTotalTime)) {
                    let totalTime = driverTotalTime[driverId];
                    for(let i = 0; i < totalTime.length; i++) {
                        if(lowestLaptimes[i] === -1) {
                            lowestLaptimes[i] = totalTime[i];
                        }else if(lowestLaptimes[i] > totalTime[i]) {
                            lowestLaptimes[i] = totalTime[i];
                        }
                    }
                }
                // step 3: calculate difference to lowest total time for every lap and driver
                // step 4: initialize data for chart
                let driverTimeDelta = {};
                for(let driverId of Object.keys(driverTotalTime)) {
                    // calculate time difference between driver and leader
                    let totalTime = driverTotalTime[driverId];
                    let data =  [];
                    let isWinner = false;
                    for(let i = 0; i < totalTime.length; i++) {
                        data.push(totalTime[i] - lowestLaptimes[i]);
                    }
                    // position is of type string
                    if(totalTime.length === lapsTotal && (this.lapTimes[driverId])[lapsTotal - 1].position === "1") {
                        console.log(driverId, " has won the race")
                        isWinner = true;
                    }
                    driverTimeDelta[driverId] = data;
                    let label = this.driverMapping[driverId].givenName + " " + this.driverMapping[driverId].familyName;
                    let teamColor = this.driverMapping[driverId].color;
                    datasets.push({label: label, borderColor: teamColor, backgroundColor: teamColor, data: data, hidden: !isWinner});
                }
                
                
            }

            
                    //console.log(label,"| ", driverId, " | ", teamColor); // 2011, R5
                    // datasets.push({label: label, borderColor: teamColor, backgroundColor: teamColor, data: data, hidden: true});
            let labelMapping = Array.from({length: lapsTotal}, (_, i) => "Lap " + (i + 1));
            let result =  {labels: labelMapping, datasets: datasets};
            return result;
        }
    }
}
</script>