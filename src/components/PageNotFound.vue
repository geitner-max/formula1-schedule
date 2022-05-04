<template>
    <div class="root-container">
        <div style="margin-top: 100px;">
        <h1>404 - Page Not Found</h1>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageNotFound',   
    created() {
        this.$router.replace("/404");
    }
}
</script>