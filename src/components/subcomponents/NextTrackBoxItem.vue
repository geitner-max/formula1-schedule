<template>
  <div class="box-container">
    <div v-if="raceTrack !== null">
      <h1 class="margin-title">{{ raceTrack.raceName }}</h1>
      <h2>{{ raceTrack.Circuit.circuitName }} - {{ getDateRepresentation }}</h2>
      <br />
      <div v-if="showCountdown">
        <h5>Next Race starts in:</h5>
        <h2><span class="highlighted-text">{{days}}</span> days <span class="highlighted-text">{{hours}}</span> hours <span class="highlighted-text">{{minutes}}</span> minutes <span class="highlighted-text">{{seconds}}</span> seconds</h2>
        <div class="btn-wrapper">
          <a :href="raceTrack.Circuit.url" target="_blank" rel="noopener noreferrer">
            <button class="btn">
              Wikipedia
            </button>
          </a>
          <a :href="'https://www.google.de/maps/@' + raceTrack.Circuit.Location.lat + ',' + raceTrack.Circuit.Location.long + ',16z'" target="_blank" rel="noopener noreferrer">
          <button class="btn" >
            {{raceTrack.Circuit.Location.locality + "/" + raceTrack.Circuit.Location.country}}
          </button>
          </a>
        </div>
      </div>
      <h3 v-else>
        {{strInfoMessage}}
      </h3>
    </div>
  </div>
</template>

<script>
import "@/main.css";


export default {
  name: "NextTrackBoxItem",
  props: {
    raceTrack: {
      type: Object,
    },
  },
  data() {
    return {
      strInfoMessage: "",     // message displayed when there is no countdown
      showCountdown: true,   // flag for showing countdown
      days: 0,               // numerical values for the countdown
      hours: 0,
      minutes: 0,
      seconds: 0,
      timer: null,
    };
  },
  created() {
    this.setCountdownRepresentation();
    this.timer = setInterval(this.setCountdownRepresentation, 1000);
  },
  unmounted(){
    clearInterval(this.timer);
  },
  methods: {
    setCountdownRepresentation() {
      // set current countdown value depending on current time and time of the next race
      var dateNow = new Date(Date.now());
      if (this.raceTrack !== null) {
        const dateRace = new Date(
          Date.parse(this.raceTrack.date + " " + this.raceTrack.time)
        );
        //compute time difference
        if (dateNow > dateRace) {
          this.strInfoMessage = "Event has started.";
          this.showCountdown = false;
        } else {
          //valid date, compute days, hours and minutes until the race starts
          const diff = dateRace.getTime() - dateNow.getTime();
          var diff_days = Math.floor(diff / (1000 * 3600 * 24));
          var diff_hours = Math.floor((diff / (1000 * 3600)) % 24);
          var diff_minutes = Math.floor((diff / (1000 * 60)) % 60);
          var diff_seconds = Math.floor((diff / 1000) % 60);
          this.days = diff_days;
          this.hours = diff_hours;
          this.minutes = diff_minutes;
          this.seconds = diff_seconds;
          this.strInfoMessage = diff_days +
            " days " +
            diff_hours +
            " hours " +
            diff_minutes +
            " minutes " +
            diff_seconds +
            " seconds";
          this.showCountdown = true;
        }
      } else {
        this.strInfoMessage = "Racetime unknown";
        this.showCountdown = false;
      }
    },
  },

  computed: {
    getDateRepresentation() {
      if (this.raceTrack !== null) {
        var dateRace = new Date( Date.parse(this.raceTrack.date + " " + this.raceTrack.time));
        return dateRace.toLocaleString();
      } else {
        return "Racetime unknown";
      }
      
    },
  },
};
</script>

