<template>
<div class="next-track-root-container">
  <div v-if="raceTrack !== null" class="next-track-list-item">
    <svg-icon class="arrow-icon" type="mdi" :path="pathArrow" @click="onArrowPress"></svg-icon>
    <div class="next-track-list-item-left" @click="onArrowPress">
      <h3>{{ raceTrack.raceName }}</h3>
    </div>
    <div class="next-track-list-item-right">
      <h4>{{ getDateRepresentation}}</h4>
    </div>
    <div class="clear-fix">
    </div>
    <!-- Box containing infos about the circuit -->
    <div class="next-track-list-item-info-container" v-if="isHidden === false">
      <h4>Round {{raceTrack.round}}: {{raceTrack.Circuit.circuitName}}</h4>
      <ul>
        <li>
          <a :href="raceTrack.Circuit.url" target="_blank" rel="noopener noreferrer">Wikipedia</a>
        </li>
        <li>
          <!-- style of google maps link: https://www.google.de/maps/@<longitude>,<latitude>,<zoom>z -->
          <a>Location: </a><a :href="'https://www.google.de/maps/@' + raceTrack.Circuit.Location.lat + ',' + raceTrack.Circuit.Location.long + ',16z'" target="_blank" rel="noopener noreferrer">{{raceTrack.Circuit.Location.locality}}/{{raceTrack.Circuit.Location.country}}</a>
        </li>
      </ul>
      
      <br>
      
    </div>
  </div>
</div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowRightBold, mdiArrowDownBold , } from '@mdi/js';

export default {
  name: "NextTrackListItem",
  props: {
    raceTrack: {
      type: Object,
      required: true,
    },
  },
  components: {
      SvgIcon,
  },
  data() {
    return {
      isHidden: true,                   // flag for showing additional information about the track
      pathArrow: mdiArrowRightBold ,    // value of displayed icon
    };
  },

  computed: {
    getDateRepresentation() {
      // display date and time of the race in a suitable format
      var dateRace = new Date(Date.now());
      if (this.raceTrack !== null) {
        dateRace = new Date(
          Date.parse(this.raceTrack.date + " " + this.raceTrack.time)
        );
      } else {
        return "Racetime unknown";
      }
      return dateRace.toLocaleString();
    },
  },
  methods: {
    onArrowPress(){
        // method for toggling arrow icon state and isHidden flag
        this.isHidden = !this.isHidden;
        this.pathArrow = this.isHidden ? mdiArrowRightBold : mdiArrowDownBold ;
    },
  }
};
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.next-track-list-item-info-container{
  border: 2px;
}
.next-track-root-container{
  margin: auto;
}
.arrow-icon {
  flex-grow: 1;
  align-self: bottom;
  text-align:center;
  grid-column-start: arrow;
  grid-column-end: name;
  align-self: center;
  cursor: pointer;
  box-sizing: border-box;
}

/* settings for grid layout and small screens*/
@media only screen and (max-width: 600px) {
  .next-track-list-item{
    grid-template-columns: [arrow] 20px [name] auto [date] auto;
  }
}

@media only screen and (min-width: 601px) {
  .next-track-list-item {
      grid-template-columns: [arrow] 20px [name] 240px [date] auto;
      
  }
}
.next-track-list-item {
  justify-content: center;   
  background-color: whitesmoke;
  display: grid;
  margin: auto;
  align-items: baseline;
}
.next-track-list-item-left {
  /*float: left;*/
  flex-grow: 1;
  padding: 2px;
  margin-left: 1px;
  text-align: left;
  color: black;
  align-self: center;
  cursor: pointer;
  box-sizing: border-box;
}
.next-track-list-item-left:hover {
  color: gray;
}
.next-track-list-item-right {
  /*float: left;*/
  flex-grow: 1;
  padding: 2px;
  color: #3c00ff;
  text-align: left;
  align-self: center;
  box-sizing: border-box;
}
.clear-fix {
  clear: both;
}
li{
  padding: 5px;
}
ul {
  text-align: left;
  margin: 5px;
}

</style>
