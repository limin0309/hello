<template>
  <div class="order-detail">
    <s-header :title="'工单详情'" :isleftarrow="true"></s-header>
    <van-sidebar class="sideTitle">
      <van-sidebar-item title="标签名称" disabled />
    </van-sidebar>
    <div class="detail-content">
      <van-cell-group>
        <van-cell title="跟进状态" value="跟进中" />
        <van-cell title="成交价格" value="18.99万" />
        <van-cell title="售卖车商名称" value="xxxx分店" />
        <van-cell title="售卖车商联系人" value="张三" />
        <van-cell title="售卖车商电话" value="13512341234" />
        <van-cell title="到店时间" value="20201020" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { getDetail } from '@/service/good';
import sHeader from '@/components/SimpleHeader';
// import { prefix } from '@/common/js/utils';
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      detail: {
        goodsCarouselList: [],
      },
    });

    // onMounted(async () => {
    //   const { id } = route.params;
    //   const { data } = await getDetail(id);
    //   data.goodsCarouselList = data.goodsCarouselList.map(i => prefix(i));
    //   state.detail = data;
    // });

    nextTick(() => {
      // 一些和DOM有关的东西
      const content = document.querySelector('.detail-content');
      content.scrollTop = 0;
    });

    const goBack = () => {
      router.go(-1);
    };

    return {
      ...toRefs(state),
      goBack,
    };
  },
  components: {
    sHeader,
  },
};
</script>

<style lang="less" scoped>
.order-detail {
  .sideTitle {
    position: fixed;
    top: 40px;
    left: 10px;
  }
  .detail-content {
    margin-top: 50px;
    height: calc(100vh - 105px);
  }
}
</style>
