<template>
    <div class="root-container">
      <button>Test</button>
    </div>
    <div class="table-container">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Constructor</th>
            <th scope="col">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in itemsConstructor" :key="item.name">
            <th scope="row">{{index+1}}</th>
            <td>{{item.name}}</td>
            <td>{{item.points}}</td>
          </tr>
        
        </tbody>
        
      </table>
    </div>
    
</template>


<script>

export default {
  components: { },
  name: 'Standings',
  data () {
    
    return {
      fields2: ['name', 'points', ],
      itemsConstructor: [
        {name: "Mercedes", points: 20},
        {name: "Red Bull", points: 10},
        {name: "Ferrari", points: 10},
        {name: "Williams", points: 10},
        {name: "Aston Martin", points: 10},
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
  setup() {
    const strCurrentYear = new Date(Date.now()).getUTCFullYear().toString(); // get current year
      const api = "http://ergast.com/api/f1/" + strCurrentYear + "/constructorStandings" + ".json";
      console.log(api); //http://ergast.com/api/f1/2022/constructorStandings.json
  },
  methods: {
   
  }
}
</script>