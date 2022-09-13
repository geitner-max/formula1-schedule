<template>
<div class="root-container">
    <div class="box-container">
        <h1 class="margin-title display-3">Post-Race-Analysis</h1>
    </div>
    <div class="flex-container">
        <div class="selection-container">
            <h2 class="h2-select">Race Selection </h2>
            <div class="row-container">
                <select v-model="selectedDecade" id="selectedDecade" style="width:auto;" class="form-select" aria-label="select decade">
                    <option :value='0'>Select Decade</option>
                    <option v-for="item of optionDecades" :key="item.value" :value="item.value">
                        {{item.label}}
                    </option>
                </select>
            </div>
            <div class="row-container">
                <select :disabled="selectedDecade === 0" v-model="selectedYear" style="width:auto;" class="form-select" aria-label="select year">
                    <option :value='0'>Select Year</option>
                    <option v-for="item of optionYears" :key="item.value" :value="item.value">
                        {{item.label}}
                    </option>
                </select>
            </div>
            <div class="row-container">
                <select :disabled="selectedYear === 0" v-model="selectedRound" style="width:auto;" class="form-select" aria-label="select race">
                    <option :value='0'>Select Race</option>
                    <option v-for="item of optionRounds" :key="item.value" :value="item.value">
                        {{item.label}}
                    </option>
                </select>
            </div>
            <h2 class="h2-select">Result </h2>
            <race-result-table :data="dataRaceResult"/>
            <h2 class="h2-select">Charts </h2>
            <div class="row-container">
                <select v-model="selectedChart" id="selectedChart" style="width:auto;" class="form-select" aria-label="select chart">
                    <option :value='0'>Select Chart</option>
                    <option v-for="(item,index) of optionCharts" :key="index" :value="index+1">
                        {{item}}
                    </option>
                </select>
            </div>
            <lap-times-chart v-if="laptimeData && selectedChart === 1" :chartOptions="chartOptions" :lapTimes="laptimeData" :driverMapping="driverMapping" />
            <position-changes-chart v-if="laptimeData && selectedChart === 2" :lapTimes="laptimeData" :driverMapping="driverMapping" />
            <leader-gap-chart v-if="laptimeData && selectedChart === 3" :lapTimes="laptimeData" :driverMapping="driverMapping" />
        </div>
        
    </div>
</div>
</template>


<script>
import FetchMixin from '../util/FetchMixin';
import RaceResultTable from './subcomponents/charts/RaceResultTable.vue';
import Nationality from '../util/Nationality.json';
import LapTimesChart from './subcomponents/charts/LapTimesChart.vue';
import UtilMixin from '../util/UtilMixin';
import PositionChangesChart from './subcomponents/charts/PositionChangesChart.vue';
import LeaderGapChart from './subcomponents/charts/LeaderGapChart.vue';
export default {
  components: { 
    RaceResultTable,
    LapTimesChart,
    PositionChangesChart,
    LeaderGapChart 
  },
    name: "Analysis",
   
    mixins: [
        FetchMixin, 
        UtilMixin,
      ],
    setup() {
        
    },
    data() {
        return {
            selectedDecade: 0,
            selectedYear: 0,
            selectedRound: 0,
            optionDecades: [],
            optionYears: [],
            optionRounds: [],
            dataRaceResult: null,//[{name: "Sebastian", startingPos: "1", finishingPos: "1", totalTime: "1:34:45", fastestLap: "1:45:123"}],
            // "Laptimes by Stint (1)", "Laptimes By Stint (2)"
            optionCharts: ["Laptimes", "Position Changes", "Gap To Leader", ],
            selectedChart: 0,
            driverMapping: null,
            laptimeData: null,
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
    mounted() {
        // initialize decades
        let decade = 1950;
        this.optionDecades = [];
        const curYear = new Date(Date.now()).getUTCFullYear();
        while(decade < curYear) {
            const label = (decade < 2000)? (decade%100) + "'s" : "" + decade + "'s";
            this.optionDecades.push({value: decade, label: label});
            decade += 10;
        }
        this.selectedDecade = 2010;
    },
    watch: {
        selectedDecade(newValue, oldValue) {
            if(newValue === 0) {
                this.selectedYear = 0;
            }else if(newValue !== oldValue) {
                this.selectedYear = 0;
                this.optionYears = this.generateYears(this.selectedDecade);
            }
        },
        async selectedYear(newValue, oldValue) {
            // configure available races
            if(newValue === 0) {
                this.selectedRound = 0;
            }else if(newValue !== oldValue) {
                this.selectedRound = 0;
                this.optionRounds = await this.generateRoundsOptions(newValue);
            }
        },
        async selectedRound(newValue, oldValue) {
            if(newValue !== 0 && newValue !== oldValue) {
                this.prepareRaceResultTable(this.selectedYear, this.selectedRound);
                this.laptimeData = null;
                this.prepareLaptimeData();
            }
        },
        async selectedChart(newValue) {
            console.log(newValue);
            this.prepareLaptimeData();
        }
    },
    methods: {
        async prepareLaptimeData() {
            if(this.selectedChart !== 0 && this.selectedYear !== 0 && this.selectedRound !== 0 && this.laptimeData === null) {
                console.log("Fetch for ", this.selectedYear, this.selectedRound);
                let rawLapTimeData = await this.fetchAllLapTimesByYearRound(this.selectedYear, this.selectedRound);
                this.laptimeData = this.preprocessLaptimeData(rawLapTimeData);
            
            }
        },
        preprocessLaptimeData(rawData) {
            //console.log(rawData);
            let resultLapTimesByDriver =  {}; // {"vettel": [<laptimes>], "hamilton": [<laptimes>]}
            for(let rawDataPart of rawData) {
                let rawDataPartInner = rawDataPart.flat();
                for(let lap of rawDataPartInner) {
                    let lapNumber = lap.number;
                    for(let lapObj of lap.Timings) {
                        // add lap to result array sorted by array
                        let driverId = lapObj.driverId;
                        let objToAdd = {number: lapNumber, position: lapObj.position, time: lapObj.time};
                        if(Object.prototype.hasOwnProperty.call(resultLapTimesByDriver, driverId)) {
                            // add to existing entry
                            resultLapTimesByDriver[driverId].push(objToAdd);
                        }else {
                            resultLapTimesByDriver[driverId] = [objToAdd];
                        }
                    }
                }
            }
            return resultLapTimesByDriver;
        },
        generateYears(decade) {
            const curYear = new Date(Date.now()).getUTCFullYear();
            let results = [];
            let year = decade;
            while(year < decade+10 && year <= curYear) {
                results.push({value: year, label: "" + year});
                year++;
            }
            return results;
        },
        async generateRoundsOptions(year) {
            let results = [];
            let racesResponse = await this.fetchRaceSchedule(year);
            if(racesResponse.status === 200) {
                results = racesResponse.value.map(race => {
                    return {value: Number(race.round), label: race.raceName}
                });
            }
            return results;
        },
        async prepareRaceResultTable(year, round) {
            let raceResult = await this.fetchRaceResult(year, round);
            //console.log(raceResult);
            if(raceResult !== null && raceResult !== undefined && raceResult.MRData.RaceTable.Races[0] !== undefined) {
                let raceResultBefore = raceResult.MRData.RaceTable.Races[0].Results;
                raceResult = raceResultBefore.map(item => {
                    //console.log(item);
                    return {
                        name: item.Driver.givenName + " " + item.Driver.familyName,
                        startingPos: this.formatStartingPos(item),
                        finishingPos: item.position, 
                        totalTime: this.formatTotalTime(item),
                        fastestLap: (item.FastestLap)?item.FastestLap.Time.time:"",
                        nationality: this.formatNationality(item.Driver.nationality),
                    };
                });
                this.dataRaceResult = raceResult;
                this.driverMapping = this.calculateDriverIdMapping(raceResultBefore);
            }else{
                this.dataRaceResult = null;
            }
            
        },
        calculateDriverIdMapping(raceResult) {
            let result = {};
            for(let item of raceResult) {
                result[item.Driver.driverId] = item.Driver;
                result[item.Driver.driverId]["color"] = this.getTeamcolor(item.Constructor.name);
            }
            return result;
        },
        formatTotalTime(item) {
            if(item.status === "Finished") {
                return item.Time.time;
            }else {
                return item.status;
            }
        },
        formatStartingPos(item) {
            if(item.grid === "0") {
                return "Pitlane Start";
            }else {
                return item.grid;
            }
        },
        formatNationality(value) {
            if(Nationality[value] !== undefined) {
                return Nationality[value];
            }else {
                return value;
            }
        }
    }
}
</script>