<template>
    <div v-if="lapTimes === null || lapTimes === undefined || lapTimes === null" class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    <Line
        v-else
        chart-id="line-chart-position-changes"
        :chart-data="chartData"
        :chart-options="chartOptions"
        :width="500"
        :height="500"
    />
</template>

<script>
import {Line} from 'vue-chartjs';
import UtilMixin from '../../../util/UtilMixin'

export default {
    name: "PositionChangesChart",
    components: {
        Line
    },
    mixins: [
        UtilMixin,
    ],
    setup() {
        
    },
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
        };
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
                for(let driverId of Object.keys(this.lapTimes)) {
                    let lapDriverData = this.lapTimes[driverId];
                    lapsTotal = Math.max(lapsTotal, lapDriverData.length); // find amount of laps in the race
                    let label = this.driverMapping[driverId].givenName + " " + this.driverMapping[driverId].familyName;
                    let teamColor = this.driverMapping[driverId].color;
                    console.log(label,"| ", driverId, " | ", teamColor); // 2011, R5
                    let data = [];
                    for (let lap of lapDriverData) {
                        
                        //console.log(value);
                        data.push(lap.position);
                    }
                    console.log(data);
                    datasets.push({label: label, borderColor: teamColor, backgroundColor: teamColor, data: data, hidden: false});
                }
            }
            let labelMapping = Array.from({length: lapsTotal}, (_, i) => "Lap " + (i + 1));
            let result =  {labels: labelMapping, datasets: datasets};
            return result;
        }
    }
}
</script>