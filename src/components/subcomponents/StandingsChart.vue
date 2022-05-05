<template>
    <div class="chart-container">
        <Line 
            v-if="chartData !== null && chartOptions !== null"
            :chart-id="line-chart" 
            :chart-data="chartData"
            :chart-options="chartOptions"
            :width="400"
            :height="400"
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
            /*chartData: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                label: 'Data One',
                backgroundColor: '#f87979',
                data: [40, 39, 10, 40, 39, 80, 40]
                }
            ]
        },
        chartOptions: {
            responsive: true,
            maintainAspectRatio: false
        },*/
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