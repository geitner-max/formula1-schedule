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
            <h2 class="h2-select">Results </h2>
            <h2 class="h2-select">Driver Selection </h2>
        </div>
    </div>
</div>
</template>


<script>
import FetchMixin from '../util/FetchMixin';

export default {
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
        console.log(2022 < curYear);
        console.log(this.optionDecades);
    },
    watch: {
        selectedDecade(newValue, oldValue) {
            if(newValue === 0) {
                this.selectedYear = 0;
            }else if(newValue !== oldValue) {
                this.optionYears = this.generateYears(this.selectedDecade);
            }
        },
        async selectedYear(newValue, oldValue) {
            // configure available races
            if(newValue === 0) {
                this.selectedRound = 0;
            }else if(newValue !== oldValue) {
                this.optionRounds = await this.generateRoundsOptions(newValue);
            }
            console.log(this.optionRounds);
        },
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
        }
    }
}
</script>