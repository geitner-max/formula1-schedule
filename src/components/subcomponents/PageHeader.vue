<template>
    <div class="page-header">
        
        <button @click="onClickSchedule" class="header-button"> Schedule</button>
        
        <button @click="onClickStandings" class="header-button"> Standings</button>
        
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