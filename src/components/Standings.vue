<template>
    <div class="root-container">
     
    </div>
    <div class="table-container">
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
            <td>{{item.name}}</td>
            <td>{{item.points}}</td>
            <td>{{item.wins}}</td>
          </tr>
        
        </tbody>
        
      </table>
    </div>
    
</template>


<script>
//import { inject } from 'vue';
import constructorStandingsData from './../assets/constructor_standings_response.json';

export default {
  components: { },
  name: 'Standings',
  data () {
    
    return {
      useLocalData: true,
      fields2: ['name', 'points', ],
      itemsConstructors: [],
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
    //const strCurrentYear = new Date(Date.now()).getUTCFullYear().toString(); // get current year
    const currentStandings = "http://ergast.com/api/f1/current/constructorStandings.json";
      //const api = "http://ergast.com/api/f1/" + strCurrentYear + "/constructorStandings" + ".json";
      console.log(currentStandings); //http://ergast.com/api/f1/current/constructorStandings.json
    if(this.useLocalData){
      this.processConstructorStandings(constructorStandingsData);
    }
  },
  methods: {
   processConstructorStandings(responseData) {
     let constrStandings = responseData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
     this.itemsConstructors = [];
     for (let constr of constrStandings){
       this.itemsConstructors.push({points: constr.points, wins:  constr.wins, name: constr.Constructor.name, pos: constr.position})
     }
     console.log(this.itemsConstructors);
   }
  }
}
</script>