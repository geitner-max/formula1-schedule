<template>
    <div class="container-fluid radio-button-container mb-4 mt-4">
        <div class="form-check col-sm">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" :value="0" v-model="timeDifferenceType">
        <label class="form-check-label" for="flexRadioDefault1">
            Totaltime Difference
        </label>
        </div>
        <div class="form-check col-sm">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" :value="1" v-model="timeDifferenceType">
        <label class="form-check-label" for="flexRadioDefault2">
            Laptime Difference
        </label>
    </div>
    </div>
    <div class="container-fluid">
        <div class="row">
            <div class="col-sm">
                <select class="form-select" aria-label="select first driver" v-model="selectedFirstDriver">
                    <option :value="''">Select First Driver</option>
                    <option v-for="item of driverMapping" :key="item.driverId" :value="item.driverId">
                        {{driverToFullname(item)}}
                    </option>
                </select>
            </div>
            <div class="col-sm">
                <button type="button" class="btn btn-small btn-info" @click="onSwapDriverClick">Swap Driver</button>
            </div>
            <div class="col-sm">
                <select class="form-select" aria-label="select second driver" v-model="selectedSecondDriver">
                    <option :value="''">Select Second Driver</option>
                    <option v-for="item of driverMapping" :key="item.driverId" :value="item.driverId">
                        {{item.givenName + " " + item.familyName}}
                    </option>
                </select>
            </div>
        </div>
        <div v-if="lapTimes !== null && driverMapping !== null && laptimeResult !== null">
            <table class="table table-striped bi bi-sort-alpha-down" data-sortable="true" aria-label='Sort Icon'>
          <thead>
            <tr>
              <th scope="col" data-sortable="true">Lap</th>
              <th scope="col">{{(selectedFirstDriver !== "")?driverToFullname(driverMapping[selectedFirstDriver]) : ""}}</th>
              <th scope="col">{{(selectedSecondDriver !== "")?driverToFullname(driverMapping[selectedSecondDriver]) : ""}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="[index, item] of laptimeResult.entries()" :key="index">
              <th class="table-text-align">{{index + 1}}</th>
              <td class="table-text-align" scope="row">
                {{ item[0] }}
              </td>
              <td class="table-text-align" scope="row">
                <span :class="{'color-red': !item[1].startsWith('-'), 'color-green': item[1].startsWith('-')}">{{item[1]}}</span>
                </td>
            
            </tr>
          </tbody>
        </table>
        </div>
       
       
    </div>
</template>

<script>
import UtilMixin from '../../../util/UtilMixin';
export default {
    components: {

    },
    name: "DriverTimeDifferenceChart",
    setup() {

    },
    mixins: [UtilMixin],
    data() {
        return {
            //driverNames:["Hello", "World"],
            selectedFirstDriver: "",
            selectedSecondDriver: "",
            timeDifferenceType: 0,
        }
    },
    props: {
       driverMapping: {
           required: true,
       },
       lapTimes: {
           required: true,
       }
    },
    methods: {
        onSwapDriverClick() {
            const firstDriver = this.selectedFirstDriver;
            this.selectedFirstDriver = this.selectedSecondDriver;
            this.selectedSecondDriver = firstDriver;
        },
        driverToFullname(driverObj) {
            return driverObj.givenName + " " + driverObj.familyName;
        },
        
    },
    
    computed: {
        laptimeResult() {
            if (this.timeDifferenceType === 0) {
                return this.laptimeResultAbsolute;
            }else {
                return this.laptimeResultRelative;
            }
        },
        laptimeResultAbsolute() {
            // compute absolute values
            if (this.selectedFirstDriver !== "" && this.selectedSecondDriver !== ""){
                let maxRounds = Math.max(this.lapTimes[this.selectedFirstDriver].length, this.lapTimes[this.selectedSecondDriver].length);
                let resultTotalTimes = [];
               
                let driverList = [this.selectedFirstDriver, this.selectedSecondDriver];
                for (let driver of driverList) {
                    let sumDriver = 0;
                    let laptimes= [];
                    for (let laptime of this.lapTimes[driver]){
                        sumDriver += this.parseTime(laptime.time);
                        laptimes.push(sumDriver);
                    }
                    // fill up values
                    while(laptimes.length < maxRounds) {
                        laptimes.push(null);
                    }
                    resultTotalTimes.push(laptimes);
                }
                // calculate difference
                // total time comparison
                let resultTimesAbsolute = [];
                let timeSeconds = 0;
                for(let j = 0; j < maxRounds; j++) {
                    let resultRow = [];
                    for (let i = 0; i < resultTotalTimes.length; i++) {
                        timeSeconds = resultTotalTimes[i][j];
                        if (i == 0) {
                            resultRow.push(this.valueToTime(timeSeconds));
                        }else {
                            // compare with first entry
                            if (resultTotalTimes[0][j] === null || timeSeconds === null) {
                                resultRow.push("N/A")
                            }else {
                                let timeDiff = timeSeconds - resultTotalTimes[0][j];
                                resultRow.push(this.valueToTime(timeDiff));
                            }
                        }
                    }
                    resultTimesAbsolute.push(resultRow);
                }
                return resultTimesAbsolute;
            }
            
            
            return null;
        },
        laptimeResultRelative() {
            if (this.selectedFirstDriver !== "" && this.selectedSecondDriver !== ""){
                let maxRounds = Math.max(this.lapTimes[this.selectedFirstDriver].length, this.lapTimes[this.selectedSecondDriver].length);
                // relative time comparison
                let resultTimesRelative = [];
                let driverList = [this.selectedFirstDriver, this.selectedSecondDriver];
                let timeSeconds = 0;
                for(let j = 0; j < maxRounds; j++) {
                    let resultRow = [];
                    for (let i = 0; i < driverList.length; i++) {
                        if (this.lapTimes[driverList[i]].length <= j) {
                            resultRow.push("N/A");
                            continue;
                        }
                        timeSeconds = this.parseTime(this.lapTimes[driverList[i]][j].time);
                        if (i == 0) {
                            resultRow.push(this.valueToTime(timeSeconds));
                        }else {
                            // compare with first entry
                            if (this.lapTimes[driverList[0]].length <= j || timeSeconds === null) {
                                resultRow.push("N/A");
                            }else {
                                let timeZero = this.parseTime(this.lapTimes[driverList[0]][j].time);
                                console.log(timeSeconds, timeZero);
                                let timeDiff = timeSeconds - timeZero;
                                resultRow.push(this.valueToTime(timeDiff));
                            }
                        }
                    }
                    resultTimesRelative.push(resultRow);
                }
                return resultTimesRelative;
            }
            return null;
        }
    }
}

</script>