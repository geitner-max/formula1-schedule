<template>
<div v-if="data !== null">
    <table class="table table-striped bi bi-sort-alpha-down" data-sortable="true" aria-label='Sort Icon'>
          <thead>
            <tr>
              <th scope="col" data-sortable="true">Pos</th>
              <th scope="col">Nationality</th>
              <th scope="col">Name</th>
              <th scope="col" data-sortable="true">Starting Position</th>
              <th scope="col">Total Time</th>
              <th scope="col" data-sortable="true">Fastest Lap</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,) in data" :key="item.name">
              <th>{{item.finishingPos}}</th>
              <td scope="row">
                <country-flag v-if="item.nationality.length === 2" :country='item.nationality' size='small'/>
                <span v-else>{{item.nationality}} </span>
              </td>
              <td scope="row">{{item.name}}</td>
              <td>{{item.startingPos}}</td>
              <td>{{item.totalTime}}</td>
              <td>{{item.fastestLap}}</td>
            </tr>
          </tbody>
        </table>
</div>
<div v-else>
    <h3>No results available</h3>
    
</div>
</template>


<script>
import CountryFlag from 'vue-country-flag-next'

export default {
    name: "RaceResultTable",
    components: {
        CountryFlag,
    },
    data () {
    return {

    };
  },
    setup() {
        
    },
    props: {
       data: {
           required: true,
       }
    },
}
</script>