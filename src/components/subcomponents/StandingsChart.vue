<template>
    <div class="chart-container">
        <Line 
            v-if="chartData !== null && chartOptions !== null"
            :chart-id="line-chart" 
            :chart-data="chartData"
            :chart-options="chartOptions"
            :width="500"
            :height="500"
        />

    </div>
</template>


<script>

import {Line} from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
)

export default {
    components: {
        Line,
    },
    data() {
        return {
          
        }
    },
    props: {
        chartData: {
            required: true,
            default: null,
        },
        chartOptions: {
            required: true,
            default: null,
        }
    },
    setup() {
        
    },
    mounted() {
       
    },
   
}
</script>