<template>
<div class="next-track-root-container">
  <div v-if="raceTrack !== null" class="next-track-list-item">
    <svg-icon class="arrow-icon" type="mdi" :path="pathArrow" @click="onArrowPress"></svg-icon>
    <div class="next-track-list-item-left" @click="onArrowPress">
      <h4>{{ raceTrack.raceName }}</h4>
    </div>
    <div class="next-track-list-item-right">
      <h5>{{ getDateRepresentation}}</h5>
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
