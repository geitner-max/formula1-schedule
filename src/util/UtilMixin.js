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
          }
    }
}