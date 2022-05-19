import { inject } from 'vue';
import UtilMixin from './UtilMixin';
import constructorStandingsData from './../assets/constructor_standings_response.json';
import driverStandingsData from './../assets/driver_standings_response.json';
import localRaceResult from './../assets/race_result_response.json';

export default {
    name: "FetchMixin",
    useLocalData: false,
    mixins: [UtilMixin],
    created() {
        this.axios = inject('axios');
    },
    methods: {
        async fetchCurrentConstructorStandings() {
        if(this.useLocalData){
            // use sample data
            this.setItemWithExpiry("currentConstructorStandings",constructorStandingsData, 1000 * 3600 * 12); // 12 hours valid
            return constructorStandingsData;
          } else {
            // fetch data from storage if available
            const data = this.getWithExpiry("currentConstructorStandings");
            if(!data) {
              // fetch request, if data expired
              const apiRequest = "http://ergast.com/api/f1/current/constructorStandings.json";
              let response = await this.axios.get(apiRequest);
              if (response.status !== 200) {
                  console.log("Error, no valid response received");
                  return null;
              }else {
                this.setItemWithExpiry("currentConstructorStandings",response.data, 1000 * 3600 * 12);
                return response.data;
              }
            }else{
              return data;
            }
          }
        },
        async fetchConstructorStandingsByYearAndRound(year, round) {
          // http://ergast.com/api/f1/2008/5/constructorStandings.json
          let data = this.getWithExpiry("constructorStandings");
          const key = year + "_" + round;

          if(data && Object.prototype.hasOwnProperty.call(data, key)) {
            // use local data
            return data[key];
          } else {
            // fetch data from api
            const apiRequest = "http://ergast.com/api/f1/" + year + "/" + round + "/constructorStandings.json";
            const response = await this.axios.get(apiRequest);
            if (response.status !== 200) {
                console.log("Error, no valid response received");
                return null;
            }else {
              // modify object
              if (!data) {
                data = {};
              }
              data[key] = response.data;
              this.setItemWithExpiry("constructorStandings", data, 1000 * 3600 * 12);
              return response.data;
            }
          }
        },
        async fetchCurrentDriverStandings() {
            if(this.useLocalData){
                this.setItemWithExpiry("currentDriverStandings",driverStandingsData, 1000 * 3600 * 12); // 12 hours valid
            return driverStandingsData;
            } else {
                // fetch data from storage if available
                const data = this.getWithExpiry("currentDriverStandings");
                if(!data) {
                  // fetch request, if data expired
                  const apiRequest = "http://ergast.com/api/f1/current/driverStandings.json";
                  let response = await this.axios.get(apiRequest);
                  if (response.status !== 200) {
                      console.log("Error, no valid response received");
                      return null;
                  }else {
                  this.setItemWithExpiry("currentDriverStandings",response.data, 1000 * 3600 * 12);
                  return response.data;
                  }
                }else{
                    return data;
                }
            }
        },
        async fetchRaceSchedule(year) {
          const apiRequest = "http://ergast.com/api/f1/" + year + ".json";
          // send request and process response
          let response = await this.axios.get(apiRequest); //.then((response) => {
          if(response.status !== 200){
            //invalid response code
            return {status: response.status, message: "Request for current Formula 1 schedule failed!"};
          }else{
            let raceTable = response.data.MRData.RaceTable.Races
            //look at response
            if(response.data.MRData.RaceTable.Races == null){
              return {status: 404, message: "Response has an invalid data format!"};
            }else if(response.data.MRData.RaceTable.Races.length === 0){
              //valid response, but the race scheduled hasn't been published yet.
              return {status: 404, message: "Formula 1 Schedule TBA"};
            }else{
              return {status: 200, value: raceTable};
            }
          }
        },
        async fetchRaceResult(year, round) {
          if(this.useLocalData) {
            return localRaceResult;
          }else {
            console.log(year, round);
            const apiRequest = `http://ergast.com/api/f1/${year}/${round}/results.json`;
            console.log(apiRequest);
            let response = await this.axios.get(apiRequest);
            if(response.status === 200) {
              return response.data;
            }else {
              return null;
            }
          }
        },
        async fetchLapTimesByYearRound(year, round, offset=0, limit=100) {
          const apiRequest = `http://ergast.com/api/f1/${year}/${round}/laps.json?limit=${limit}&offset=${offset}`;
          //http://ergast.com/api/f1/2011/5/laps.json?limit=30&offset=100
          let response = await this.axios.get(apiRequest);
          return response;
        }
    },
}