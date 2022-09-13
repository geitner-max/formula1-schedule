<template>
    <footer >
        <div class="footer-container">
          <span class="footer-text">Version 0.1.0</span>
          <span class="footer-text">Site Design by Maximilian Geitner 2022</span>
          <span class="footer-text"></span>
          <a class="a-footer" :href="varInternal">Contact: {{varProtected}}</a>
        </div>
      </footer>
</template>

<script>
export default {
    name: "PageFooter",
    data() {
        return {
            varProtected: "[Email Protected]",
            varInternal: "https://www.w3resource.com/cdn-cgi/l/email-protection"
        }
    },
    setup() {
        
    },
    mounted() {
        let part0 = "mailto:"
        let part1 = "maxiomilian.goeitnfer";
        let part2 = "outlook.de";
        part1 = part1.replace(/o/g,"").replace(/f/g, "");
        this.varProtected = part1 + "@" + part2;
        this.varInternal = part0 + this.varProtected;
    }
}
</script>