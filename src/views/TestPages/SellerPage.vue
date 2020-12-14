<!-- 
测试路径： http://localhost:8080/#/sellerpage
该页面测试组件：Seller.vue
 -->

<template>
  <div class="common-page">
    <seller />
  </div>
</template>

<script>
import Seller from '@/components/charts/Seller.vue'
export default {
  components: { Seller },
}
</script>

<style lang="less" scoped>
</style>