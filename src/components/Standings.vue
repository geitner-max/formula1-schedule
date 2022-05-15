<template>
    <div class="root-container">
     
    <div class="table-container">
      <h2>Constructor Standings</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Constructor</th>
            <th scope="col">Points</th>
            <th scope="col">Wins</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,) in itemsConstructors" :key="item.name">
            <th scope="row">{{item.pos}}</th>
            <td class="table-column-name">{{item.name}}</td>
            <td>{{item.points}}</td>
            <td>{{item.wins}}</td>
          </tr>
        
        </tbody>
      </table>
      <standings-chart :chartOptions="chartOptions" :chartData="chartData"/>
    </div>
      <div class="table-container">
        <h2>Driver Standings</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Driver</th>
              <th scope="col">Points</th>
              <th scope="col">Wins</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,) in itemsDrivers" :key="item.name">
              <th scope="row">{{item.pos}}</th>
              <td class="table-column-name">{{item.name}}</td>
              <td>{{item.points}}</td>
              <td>{{item.wins}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
</template>


<script>
import FetchMixin from '../util/FetchMixin';
import StandingsChart from './subcomponents/StandingsChart.vue';
import TeamColors from '../assets/teamcolors';

export default {
  components: {StandingsChart },
  mixins: [
    FetchMixin,
  ],
  name: 'Standings',
  data () {
    
    return {
      itemsConstructors: [],
      itemsDrivers: [],
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
            }
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
      chartData: null,
    }
  },
  async mounted() {
     // init axios for http requests
    const strCurrentYear = new Date(Date.now()).getUTCFullYear().toString(); // get current year
    //const currentStandings = "http://ergast.com/api/f1/current/constructorStandings.json";
    //const api = "http://ergast.com/api/f1/" + strCurrentYear + "/constructorStandings" + ".json";
    //console.log(currentStandings); //http://ergast.com/api/f1/current/constructorStandings.json
    let constructorStandingsData = await this.fetchCurrentConstructorStandings();
    if (!constructorStandingsData){
      this.itemsConstructors = [];
    }else{
      this.processConstructorStandings(constructorStandingsData);
    }

    let driverData = await this.fetchCurrentDriverStandings();
    if (!driverData){
      this.itemsDrivers = [];
    }else{
      this.processDriverStandings(driverData);
    }
    // process chart data
    if(constructorStandingsData) {
      let season = constructorStandingsData.MRData.StandingsTable.StandingsLists[0].season;
      let round = constructorStandingsData.MRData.StandingsTable.StandingsLists[0].round;
      let chartTemp = [];
      for(let prevRound = 1; prevRound < round; prevRound++) {
        let data = await this.fetchConstructorStandingsByYearAndRound(season, prevRound)
        chartTemp.push(data);
      }
      chartTemp.push(constructorStandingsData);
      let raceSchedule = await this.fetchRaceSchedule(strCurrentYear);
      this.processConstructorChartData(chartTemp, raceSchedule, round);
   }
    
  },
  methods: {
   processConstructorStandings(responseData) {
     let constrStandings = responseData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
     this.itemsConstructors = [];
     for (let constr of constrStandings){
       this.itemsConstructors.push({points: constr.points, wins:  constr.wins, name: constr.Constructor.name, pos: constr.position})
     }
   },
   processDriverStandings(responseData) {
     let driverStandings = responseData.MRData.StandingsTable.StandingsLists[0].DriverStandings;
     //console.log(driverStandings);
     this.itemsDrivers = [];
     for(let driver of driverStandings) {
        this.itemsDrivers.push({
          name: driver.Driver.givenName + " " + driver.Driver.familyName, 
          points: driver.points,
          wins: driver.wins,
          pos: driver.position,
          nationality: driver.Driver.nationality,
          code: driver.Driver.code,
          permanentNumber: driver.Driver.permanentNumber,
        });
     }
   },
   processConstructorChartData(dataConstr, raceSchedule, roundsCompleted) {
     
    // find teams
    dataConstr = dataConstr.map(e => e.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);
    let teams = this.getTeams(dataConstr[0]);

    // make points data more accessible, round[team_name] with entry {position, points}
    dataConstr = dataConstr.map(roundData => {
        let result = {};
        for(let entry of roundData) {
          result[entry.Constructor.name] = {position: entry.position, points: entry.points};
        }
        return result;
      }
    );
    let dataset = teams.map(team => {
      let valuesPoints = this.getDataByTeam(dataConstr, team, "points");
      return {label: team, data: valuesPoints, borderColor: this.getTeamcolor(team), backgroundColor: this.getTeamcolor(team)};
    });
    let labelMapping = Array.from({length: roundsCompleted}, (_, i) => "Round " + (i + 1));
    if(raceSchedule.status == 200) {
      labelMapping = raceSchedule.value.map(race => race.raceName);
      // only display completed races
      labelMapping = labelMapping.splice(0, roundsCompleted);
      //console.log(schedule);
      
    }
    this.chartData = {labels: labelMapping, datasets: dataset};
   },
   getTeams(constrStandingsData) {
     return constrStandingsData.map(e => e.Constructor.name);
   },
   getDataByTeam(data, teamName, attribute) {
     return data.map(round => round[teamName][attribute]);
   },
   getTeamcolor(teamname) {
     if(Object.prototype.hasOwnProperty.call(TeamColors, teamname)) {

       return TeamColors[teamname];
     }else{
       console.log("Error color: ",teamname);
       return "#111";
     }
   }
  }
}
</script>