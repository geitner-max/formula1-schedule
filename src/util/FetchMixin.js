import { inject } from 'vue';
import UtilMixin from './UtilMixin';
import constructorStandingsData from './../assets/constructor_standings_response.json';
import driverStandingsData from './../assets/driver_standings_response.json';
import localRaceResult from './../assets/race_result_response.json';
import lapTimes1 from './../assets/LapTimesResponse1.json';
import lapTimes2 from './../assets/LapTimesResponse2.json';
import lapTimes3 from './../assets/LapTimesResponse3.json';

export default {
    name: "FetchMixin",
    useLocalData: false,
    mixins: [UtilMixin],
    created() {
        this.axios = inject('axios');
    },
    data() {
      return {
        API_ENDPOINT: "https://ergast.com/api/f1",
      };
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
              const apiRequest = this.API_ENDPOINT + "/current/constructorStandings.json";
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
            const apiRequest = this.API_ENDPOINT + "/" + year + "/" + round + "/constructorStandings.json";
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
                  const apiRequest = this.API_ENDPOINT + "/current/driverStandings.json";
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
          const apiRequest = this.API_ENDPOINT + "/" + year + ".json";
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
          let val = false;
          if(this.useLocalData || val) {
            if(offset === 0) {
              return {status: 200, data: lapTimes1};
            }else if(offset === 100) {
              return {status: 200, data: lapTimes2};
            }else {
              return {status: 200, data: lapTimes3};
            }
          }else{
            const apiRequest = `${this.API_ENDPOINT}/${year}/${round}/laps.json?limit=${limit}&offset=${offset}`;
            //http://ergast.com/api/f1/2011/5/laps.json?limit=30&offset=100
            console.log(apiRequest);
            let response = await this.axios.get(apiRequest);
            return response;
          }
        },
        async fetchAllLapTimesByYearRound(year, round) {
          /// aggregate results from all individual API requests
          if(year === undefined || round === undefined) {
            return;
          }
          let result = [];
          let offset = 0;
          const limit = 100;
          let tempResult;
          // collect responses with Laptime data
          do{
            tempResult = await this.fetchLapTimesByYearRound(year, round, offset, limit);
            if(tempResult.status === 200 && tempResult.data !== null && tempResult.data.MRData.RaceTable.Races.length > 0) {
              tempResult = tempResult.data.MRData.RaceTable.Races[0].Laps;
              result.push(tempResult);
            }else {
              break;
            }
            offset += limit;
          }while(tempResult !== null);
          return result;
        },
    },
}