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

export default {
    name: "LapTimesChart",
    mixins: [
    ],
    components: {
        Line
    },
    setup() {
        
    },
    data() {
        return {
            
        };
    },
    props: {
        driverMapping: {
            required: true,
        },
        lapTimes: {
            required: true,
        },
        chartOptions: {
            required: true,
        },
    },
    mounted() {
        // compute chart data
        //
        
        
    },
    methods: {
        parseTime(time) {
            // convert value to seconds, e.g. 1:30.123
            let parts = time.split(":");
            let value = 0.0;
            if(parts.length === 3) {
                // HH:mm:ss.sss
                let parts2 = parts[2].split(".");
                value = 3600 * Number.parseInt(parts[0]) + 60.0 * Number.parseInt(parts[1]) + Number.parseInt(parts2[0]) + (Number.parseInt(parts2[1])/1000.0);
            }else if(parts.length === 2) {
                //mm:ss.sss
                let parts2 = parts[1].split(".");
                value = 60 * Number.parseInt(parts[0]) + Number.parseInt(parts2[0]) + (Number.parseInt(parts2[1])/1000.0);
            }
            return value;
        },
    },
    watch: {
        /*lapTimes(newValue) {
            console.log("init");
            console.log(newValue);
        }*/
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
                        data.push(this.parseTime(lap.time));
                    }
                    console.log(data);
                    datasets.push({label: label, borderColor: teamColor, backgroundColor: teamColor, data: data, hidden: true});
                }
            }
            let labelMapping = Array.from({length: lapsTotal}, (_, i) => "Lap " + (i + 1));
            let result =  {labels: labelMapping, datasets: datasets};
            return result;
        }
    }

}
</script>