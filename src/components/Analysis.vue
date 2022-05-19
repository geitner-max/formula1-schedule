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
            <h2 class="h2-select">Driver Selection </h2>
        </div>
    </div>
</div>
</template>


<script>
import FetchMixin from '../util/FetchMixin';
import RaceResultTable from './subcomponents/RaceResultTable.vue';
import Nationality from '../util/Nationality.json';

export default {
  components: { RaceResultTable },
    name: "Analysis",
   
    mixins: [FetchMixin],
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
            }
        }
    },
    methods: {
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
            console.log(raceResult);
            if(raceResult !== null && raceResult !== undefined && raceResult.MRData.RaceTable.Races[0] !== undefined) {
                raceResult = raceResult.MRData.RaceTable.Races[0].Results;
                raceResult = raceResult.map(item => {
                    console.log(item);
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
            }else{
                this.dataRaceResult = null;
            }
            
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