import TeamColors from '../assets/teamcolors';

export default {
    name: "UtilMixin",
    methods: {
        storageAvailable(type) {
            var storage;
            try {
                storage = window[type];
                var x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            }
            catch(e) {
                return e instanceof DOMException && (
                    // everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededError' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                    // acknowledge QuotaExceededError only if there's something already stored
                    (storage && storage.length !== 0);
            }
        },
        // ttl in milliseconds
        setItemWithExpiry(key, value, ttl) {
            if(this.storageAvailable("localStorage")) {
                const time = new Date();
                localStorage.setItem(key, JSON.stringify({value: value, expiry: time.getTime() + ttl}));
            }
        },
        getWithExpiry(key) {
            // return item if in localStorage and not yet expired
            if(this.storageAvailable("localStorage")) {
                const itemJson = localStorage.getItem(key)
                if (!itemJson) return null;
                const item = JSON.parse(itemJson)
                const time = new Date();
                if(time.getTime() > item.expiry) return null; // item not valid
                return item.value;
            }
            return null;
        },
        getTeamcolor(teamname) {
            // colors in the chart
            if(Object.prototype.hasOwnProperty.call(TeamColors, teamname)) {
              return TeamColors[teamname];
            }else{
              console.log("Error color: ",teamname);
              return "#111";
            }
        },
        parseTime(time) {
            // convert value to seconds, e.g. 1:30.123
            let parts = time.split(":");
            let value = 0.0;
            if(parts.length === 3) {
                // HH:mm:ss.sss
                let parts2 = parts[2].split(".");
                value = 3600 * Number.parseInt(parts[0]) + 60.0 * Number.parseInt(parts[1]) + Number.parseInt(parts2[0]) + (Number.parseInt(parts2[1])/1000.0);
            }else if(parts.length === 2) {
                //mm:ss.sss
                let parts2 = parts[1].split(".");
                value = 60 * Number.parseInt(parts[0]) + Number.parseInt(parts2[0]) + (Number.parseInt(parts2[1])/1000.0);
            }
            return value;
        },
        valueToTime(timeSeconds, includeHours) {
            if (timeSeconds === null) {
                return "N/A"
            }
            
            const isNegative = timeSeconds < 0;
            timeSeconds = Math.abs(timeSeconds);
            timeSeconds = Math.round(timeSeconds * 1000) / 1000;
            let hours = Math.floor(timeSeconds / 3600);
            let minutes = Math.floor(timeSeconds / 60) % 60;
            let seconds = Math.floor(timeSeconds) % 60;
            let milliseconds = Math.floor(timeSeconds * 1000) % 1000;
            let result = "";
            if (isNegative) {
                result +="-";
            }
            if (includeHours) {
                result += String(hours).padStart(2, "0") + ":";
            }
            result += String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0") + "." + String(milliseconds).padStart(2, "0");
            return result;
        }
    }
}