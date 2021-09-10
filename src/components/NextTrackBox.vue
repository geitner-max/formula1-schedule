<template>
<div class="root-container">
  <div class="box-container">
    <next-track-box-item :raceTrack="selectedRaceTrack"></next-track-box-item>
  </div>
  <div class="schedule-container">
    <p>Schedule: </p>
    <next-track-list-item v-for="item in listFutureRaces" :key="item.round" :raceTrack="item">

    </next-track-list-item>
  </div>
</div>
</template>


<script>
import { inject } from 'vue'
import schedule from './../assets/race_schedule_response.json';
import NextTrackBoxItem from './NextTrackBoxItem.vue';
import NextTrackListItem from './NextTrackListItem.vue';


export default {
  components: { NextTrackBoxItem, NextTrackListItem },
  name: 'NextTrackBox',
  props: {
    dateRace: {
      type: Date,
      default: null, 
    },
  },
  data (){
    return {
      isFinished: true,
      selectedRaceTrack: null,
      listFutureRaces: [],
      useLocalData: false,
    };
  },
  created () {
    
    const strCurrentYear = new Date(Date.now()).getUTCFullYear().toString();
    const apiRequest = "http://ergast.com/api/f1/" + strCurrentYear + ".json";
    var raceTable = null//schedule.MRData.RaceTable.Races

    if(this.useLocalData){
      raceTable = schedule.MRData.RaceTable.Races;
      this.processRaceTable(raceTable);
    }else{
      const axios = inject('axios')  // inject axios
      axios.get(apiRequest).then((response) => {
        //console.log(response.data)
        raceTable = response.data.MRData.RaceTable.Races
        /*
        For each race:
        season, round, 
        circuit object: {circuitId, url, circuitName, location, }
        date, raceName, time
        */
        //1.) Find next track that has not yet started
        this.processRaceTable(raceTable);
        //2.) Create array with upcoming race tracks

        //this.selectedRaceTrack = raceTable[13]
        //console.log(raceTable)
        
        //console.log(apiRequest);
        //console.log(strCurrentYear);
      })
    }
    
    
    
    
  },
  methods: {
    processRaceTable(raceTable){
      
      var curDate = Date.now();
      //find next race that hasn't happened yet
      var nextRaceIndex = raceTable.findIndex(e => 
      {
        var dateRace = new Date(e.date);
        return curDate < dateRace;
      });
      if(nextRaceIndex !== -1 && nextRaceIndex !== null){
        //set race as main element, following races in another list
        this.selectedRaceTrack = raceTable[nextRaceIndex];
        console.log(this.selectedRaceTrack)
        this.listFutureRaces = raceTable.filter( (e, index) => index > nextRaceIndex);
        if(this.listFutureRaces.length == 0){
          this.listFutureRaces = [];
        }

      }else{
        //Result is -1, when no future race is in the table
        this.selectedRaceTrack = Object();
        this.listFutureRaces = [];
      }
      
    },
  },
 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.root-container {
  background-color: whitesmoke;
}
.box-container {
  padding-top: 20px;
  padding-bottom: 50px;
  align-content: center;
  background-color: whitesmoke;
}
.schedule-container {
  border: 2;
  border-style: solid none none none;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
p {
  background-color: whitesmoke;
  color: #42b983;
  font-size: 40px;
}
</style>
