<template>
  <div class="box-container">
    <div v-if="raceTrack !== null">
      <h1>{{ raceTrack.raceName }}</h1>
      <h4>{{ raceTrack.Circuit.circuitName }} - {{ getDateRepresentation }}</h4>
      <br />
      <h5>Next Race starts in:</h5>
      <h3><span class="highlighted-text">{{days}}</span> days <span class="highlighted-text">{{hours}}</span> hours <span class="highlighted-text">{{minutes}}</span> minutes <span class="highlighted-text">{{seconds}}</span> seconds</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "NextTrackBoxItem",
  props: {
    raceTrack: {
      type: Object,
    },
  },
  data() {
    return {
      isFinished: true,
      countdownValue: "",
      hasCountdown: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      timer: "",
    };
  },
  created() {
    this.setCountdownRepresentation();
    this.timer = setInterval(this.setCountdownRepresentation, 1000);
  },
  methods: {
    setCountdownRepresentation() {
      var dateNow = new Date(Date.now());
      if (this.raceTrack !== null) {
        const dateRace = new Date(
          Date.parse(this.raceTrack.date + " " + this.raceTrack.time)
        );
        //compute time difference
        if (dateNow > dateRace) {
          this.countdownValue = "Event has started.";
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
          //return dateNow;
          this.countdownValue =
            diff_days +
            " days " +
            diff_hours +
            " hours " +
            diff_minutes +
            " minutes " +
            diff_seconds +
            " seconds";
        }
      } else {
        this.countdownValue = "Racetime unknown";
      }
    },
  },

  computed: {
    getDateRepresentation() {
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
};
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box-container {
  align-content: center;
}
.highlighted-text {
  color: #f55050;
}
h4{
  font-size: 28px;
}
h5 {
  font-size: 24px;
}
h3 {
  margin: 40px 0 0;
  font-size: 32px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
h1 {
  color: #42b983;
  font-size: 48px;
}
a {
  color: #42b983;
}
</style>
