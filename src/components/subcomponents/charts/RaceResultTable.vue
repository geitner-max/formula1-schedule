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
              <th class="table-text-align">{{item.finishingPos}}</th>
              <td class="table-text-align" scope="row">
                <div v-if="item.nationality.code !== undefined">
                    <country-flag class="flag-container" v-tooltip="item.nationality.name" :country='item.nationality.code' size="normal"/> 
                </div>
                <span v-else>{{item.nationality}} </span>
              </td>
              <td class="table-text-align" scope="row">{{item.name}}</td>
              <td class="table-text-align">{{item.startingPos}}</td>
              <td class="table-text-align">{{item.totalTime}}</td>
              <td class="table-text-align">{{item.fastestLap}}</td>
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
        //VTooltip,
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