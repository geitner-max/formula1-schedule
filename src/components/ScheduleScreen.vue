<template>
<div v-if="hasValidData" class="root-container">
  <div class="box-container">
    <next-track-box-item :raceTrack="selectedRaceTrack"></next-track-box-item>
  </div>
  <div class="schedule-container" v-if="listFutureRaces.length > 0">
    <p>Schedule: </p>
    <next-track-list-item v-for="item in listFutureRaces" :key="item.round" :raceTrack="item">
    </next-track-list-item>
  </div>
  <div v-else>
    <p>Final race of the Formula 1 Season!</p>
  </div>
</div>
<div v-else>
  <h1>{{strResponse}}</h1>
</div>
</template>


<script>
import { inject } from 'vue';
import schedule from './../assets/race_schedule_response.json';
import NextTrackBoxItem from './subcomponents/NextTrackBoxItem.vue';
import NextTrackListItem from './subcomponents/NextTrackListItem.vue';
import "@/main.css";

export default {
  components: { NextTrackBoxItem, NextTrackListItem },
  name: 'ScheduleScreen',
  props: {
    dateRace: {
      type: Date,
      default: null, 
    },
  },
  data (){
    return {
      selectedRaceTrack: null, // contains data about the next race
      listFutureRaces: [],      // list of the following races
      useLocalData: false,      // only used for debugging purposes
      hasValidData: false,      // flag switching between race schedule information and error screen
      strResponse: "",          // displayed status on error screen
      axios: null,
    };
  },
  created () {
    this.axios = inject('axios'); // init axios for http requests
    const strCurrentYear = new Date(Date.now()).getUTCFullYear().toString(); // get current year
    this.processUpdateRequest(strCurrentYear);
    // start timer for periodically schedule updates (every two hour)
    this.timer = setInterval(this.updateSchedule, 2 * 3600 * 1000);
  },
  unmounted() {
    clearInterval(this.timer);
  },
  methods: {
    updateSchedule(){
      const strCurrentYear = new Date(Date.now()).getUTCFullYear().toString(); // get current year
      this.processUpdateRequest(strCurrentYear);
    },
    processUpdateRequest(year) {
      // build url
      const apiRequest = "http://ergast.com/api/f1/" + year + ".json";
      var raceTable = null

      if(this.useLocalData){
        raceTable = schedule.MRData.RaceTable.Races;
        this.processRaceTable(raceTable);
      }else{
        // send request and process response
        this.axios.get(apiRequest).then((response) => {
          if(response.status !== 200){
            //invalid response code
            this.strResponse = "Request for current Formula 1 schedule failed!";
            this.hasValidData = false;
          }else{
            //console.log(response.data)
            raceTable = response.data.MRData.RaceTable.Races
            //look at response
            if(response.data.MRData.RaceTable.Races == null){
              this.strResponse = "Response has an invalid data format!";
              this.hasValidData = false;
            }else if(response.data.MRData.RaceTable.Races.length === 0){
              //valid response, but the race scheduled hasn't been published yet.
              this.strResponse = "Formula 1 Schedule TBA";
              this.hasValidData = false;
            }else{
              this.hasValidData = true;
              this.processRaceTable(raceTable);
            }
          }
        })
      }
    },
    processRaceTable(raceTable){
       /*
          Attributes for each race:
          season, round, 
          circuit object: {circuitId, url, circuitName, location, }
          date, raceName, time
        */
      var curDate = Date.now();
      // find first race that hasn't happened yet
      var nextRaceIndex = raceTable.findIndex(e => 
      {
        var dateRace = new Date(e.date + " " + e.time);
        return curDate < dateRace;
      });
      if(nextRaceIndex !== -1 && nextRaceIndex !== null){
        // set race as main element, following races in another list
        this.selectedRaceTrack = raceTable[nextRaceIndex];

        this.listFutureRaces = raceTable.filter( (e, index) => index > nextRaceIndex);
        if(this.listFutureRaces.length == 0){
          this.listFutureRaces = [];
        }
        this.hasValidData = true;
      }else{
        // if result is -1, then no future race is in the table
        // No next race has been found, the last race of the season has already started!
        this.hasValidData = false;
        this.strResponse = "The Formula 1 Season is over.";
        this.selectedRaceTrack = null;
        this.listFutureRaces = [];
      }
      
    },
  }
}
</script>
