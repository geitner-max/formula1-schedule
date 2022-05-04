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

export default {
  components: { },
  mixins: [
    FetchMixin,
  ],
  name: 'Standings',
  data () {
    
    return {
      fields2: ['name', 'points', ],
      itemsConstructors: [],
      itemsDrivers: [],
      itemsConstructorTest: [
        {pos: 1, name: "Mercedes", points: 25, wins: 1},
        {pos: 2, name: "Red Bull", points: 18, wins: 0,},
        {pos: 2, name: "Ferrari", points: 15, wins: 0,},
        {pos: 2, name: "Williams", points: 12, wins: 0,},
        {pos: 2, name: "Aston Martin", points: 10, wins: 0,},
      ],
      fields: ['first_name', 'last_name', 'age'],
        items: [
          { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
          { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
          { isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson' },
          { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' }
        ]
    }
  },
  created() {
     // init axios for http requests
    //const strCurrentYear = new Date(Date.now()).getUTCFullYear().toString(); // get current year
    //const currentStandings = "http://ergast.com/api/f1/current/constructorStandings.json";
    //const api = "http://ergast.com/api/f1/" + strCurrentYear + "/constructorStandings" + ".json";
    //console.log(currentStandings); //http://ergast.com/api/f1/current/constructorStandings.json
    let constructorStandingsData = this.fetchCurrentConstructorStandings();
    if (!constructorStandingsData){
      this.itemsConstructors = [];
    }else{
      this.processConstructorStandings(constructorStandingsData);
    }

    let driverData = this.fetchCurrentDriverStandings();
    if (!driverData){
      this.itemsDrivers = [];
    }else{
      this.processDriverStandings(driverData);
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
     console.log(driverStandings);
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
   }

  }
}
</script>