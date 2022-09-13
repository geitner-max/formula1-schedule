<template>
    <div class="page-header">
        

        <nav class="navbar navbar-expand-lg navbar-light">
            
            <ul>
                <router-link to="/" type="button" class="btn btn-primary" variant="outline-primary"> Schedule</router-link>
                
                <router-link to="/standings" type="button" class="btn btn-primary" variant="outline-primary">Standings</router-link>

                <router-link to="/analysis" type="button" class="btn btn-primary" variant="outline-primary">Analysis</router-link>
            </ul>
        </nav> 
    </div>
</template>

<script>
export default {
    name: "PageHeader",
    setup() {
        
    },
    methods: {
        onClickSchedule() {
            this.$router.push("/");
        },
        onClickStandings() {
            this.$router.push("/standings");
        },
        onClickAnalysis() {
            this.$router.push("/analysis");
        }
    },
}
</script>