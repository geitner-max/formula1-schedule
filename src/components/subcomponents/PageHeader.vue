<template>
    <div class="page-header">
        

        <nav class="navbar navbar-expand-lg navbar-light">
            <div target="nav-collapse"></div>
            <ul>
                <li @click="onClickSchedule" type="button" class="btn btn-primary" variant="outline-primary"> Schedule</li>
                
                <li @click="onClickStandings" type="button" class="btn btn-primary" variant="outline-primary"> Standings</li>
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
        }
    },
}
</script>