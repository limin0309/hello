<template>
  <div>

    <div v-if="notGetCode" class="errmsg">
      <p>错误提示：{{ notGetCodeMsg }}</p>
    </div>
    <div>
      <div class="order-list-wrap">
        <div class="order-list-content">
          <s-header
            :title="'工单列表'"
            :back="'/user'"
            :isleftarrow="true"
          ></s-header>
          <van-tabs
            type="card"
            color="#E4E4E4"
            class="tabStyle"
            @click="changeTab"
          >
            <van-tab title="检测中(1)" name="checking"></van-tab>
            <van-tab title="拍卖中(1)" name="Auction"></van-tab>
            <van-tab title="已成交(1)" name="DealDone"></van-tab>
            <van-tab title="战败(1)" name="Defeated"></van-tab>
          </van-tabs>
        </div>
        <div class="content">
          <van-pull-refresh
            v-model="refreshing"
            @refresh="onRefresh"
            class="order-list-refresh"
          >
            <van-list
              v-model:loading="loading"
              :finished="finished"
              :finished-text="orderList.length ? '没有更多了' : '搜索工单'"
              @load="onLoad"
              @offset="10"
            >
              <!-- <p v-for="item in list" :key="item">{{ item }}</p> -->
              <template v-if="orderList.length">
                <div
                  class="order-item"
                  v-for="(item, index) in orderList"
                  :key="index"
                  @click="orderDetail(item)"
                >
                  <div class="orderStatus">
                    <span>工单号 : {{ 'C101010101' }}</span> <span>检测中</span>
                  </div>
                  <div class="order-info">
                    <p class="people">
                      <span>{{ item.aaa || '张花花' }}</span>
                      <span>13612231222</span>
                    </p>
                    <p class="carName">
                      {{ '雪佛兰迈锐宝XL 2018款530T双离合锐耀版' }}
                    </p>
                    <span class="carInfo">{{
                      '北京|2018/09/01上牌|5.5万公里|白色|北京一站'
                    }}</span>
                    <p class="updateTime">
                      <span>{{ '工单更新时间：2021-03-26  16:30:19' }}</span>
                      <span>
                        <van-button
                          plain
                          type="primary"
                          size="small"
                          @click.stop="orderDetail(item, '111111')"
                          >跟进</van-button
                        >
                      </span>
                    </p>
                  </div>
                </div>
              </template>
              <img
                class="empty"
                v-else
                src="https://s.yezgea02.com/1604041313083/kesrtd.png"
                alt="搜索"
              />
            </van-list>
          </van-pull-refresh>
        </div>

        <follow-up-modal :type="'1'" :show="show" @callback="cancelShow">
        </follow-up-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { search, getUserInfo } from './service/api';
import sHeader from '@/components/SimpleHeader';
import followUpModal from './followUpModal';
import { parseQueryFromSearch, ISQYWX, basePageUrl } from '@/utils/utils';
import { Toast } from 'vant'

export default {
  components: {
    sHeader,
    followUpModal,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      keyword: route.query.keyword || '',
      refreshing: false,
      list: [],
      loading: false,
      finished: false,
      orderList: [
        { goodsName: 'kk', goodsIntro: 'uu', sellingPrice: '88' },
        { goodsName: 'kk', goodsIntro: 'uu', sellingPrice: '88' },
        { goodsName: 'kk', goodsIntro: 'uu', sellingPrice: '88' },
        { goodsName: 'kk', goodsIntro: 'uu', sellingPrice: '88' },
        { goodsName: 'kk', goodsIntro: 'uu', sellingPrice: '88' },
      ],
      totalPage: 0,
      page: 1,
      orderBy: '',
      show: false,
      value: '',
      showPicker: false,
      password: '',
      notGetCode: false, // 未能获取企业微信用户code码
      notGetCodeMsg: "未找到用户code码，无法获取用户信息",
      stateMap: {
        // 智慧门店
        aistore: `${basePageUrl}customer-flow/statistics`
      }
    });
    const columns = ['检测中', '拍卖中', '已成交', '战败'];

    // onMounted(() => {
    //   init()
    // })


    let { code='4mfNaZhA3Qxekqnl3YYh4zCWAKRttym6S36WAM6Eqao', state1='aistore', ...otherParams } = parseQueryFromSearch();
    console.log(code, state1);
    // 校验有没有配置 state 值
    const url = state.stateMap[state1];
    let domain = "taoche.com";
    if (process.env.NODE_ENV === "development") {
      domain = "localhost";
    }
    if (!url) {
      Toast("请配项目的state值！");
      return;
    }
    // 判断是否在企业微信，获取用户信息 设置token
      if (code) {
        const toast1 = Toast.loading({
          duration: 0,
          message: "正在校验用户信息...",
          forbidClick: true
        });
        getUserInfo(code)
          .then(res => {
            // {"code":0,"message":"成功","data":"b32568f54bbe4192b3c478e3849efaeb","success":true}
            toast1.clear();
            if (res.code === 0) {
              if (res.data) {
                Cookies.set("Authorization", res.data, { domain, expires: 1 });
                // 跳转
                init()
              } else {
                Toast("未能获取到token!");
              }
            } else {
              console.log('else 接口报错')
                Cookies.set("Authorization",'b32568f54bbe4192b3c478e3849efaeb', { domain, expires: 1 });
                // 跳转
                init()
              Toast(res.message);
            }
          })
          .catch(() => {
            toast1.clear();
          });
      } else {
        state.notGetCode = true;
      }

    const init = async () => {
      const { categoryId } = route.query;
      const {
        data,
        data: { list },
      } = await search({
        pageNumber: state.page,
        goodsCategoryId: categoryId,
        keyword: state.keyword, // 手机号 关键字
        orderBy: state.orderBy, // 选中的是什么tab
      });

      state.orderList = state.orderList.concat(list);
      state.totalPage = data.totalPage;
      state.loading = false;
      if (state.page >= data.totalPage) state.finished = true;
    };

    const goBack = () => {
      router.go(-1);
    };

    const orderDetail = (item, index) => {
      console.log(item, 'dddd', index);
      if (index) {
        console.log('chuli', '起弹窗');
        state.show = true;
      } else {
        router.push({ path: `/orderDetail/${item.goodsId}` });
      }
    };

    const cancelShow = () => {
      state.show = false;
    };
    const getSearch = () => {
      onRefresh();
    };

    const onLoad = () => {
      if (!state.refreshing && state.page < state.totalPage) {
        state.page = state.page + 1;
      }
      if (state.refreshing) {
        state.orderList = [];
        state.refreshing = false;
      }
      init();
    };

    const onRefresh = () => {
      state.refreshing = true;
      state.finished = false;
      state.loading = true;
      state.page = 1;
      onLoad();
    };

    const changeTab = name => {
      console.log('name', name);
      state.orderBy = name;
      onRefresh();
    };

    return {
      ...toRefs(state),
      columns,
      goBack,
      orderDetail,
      getSearch,
      changeTab,
      onLoad,
      onRefresh,
      cancelShow, // 取消展示跟进
    };
  },
};
</script>

<style lang="less" scoped>
@import '@/common/style/mixin';
.order-list-content {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: #fff;
  // .category-header {
  //   .fj();
  //   width: 100%;
  //   height: 50px;
  //   line-height: 50px;
  //   padding: 0 15px;
  //   .boxSizing();
  //   font-size: 15px;
  //   color: #656771;
  //   z-index: 10000;
  //   &.active {
  //     background: @primary;
  //   }
  //   .icon-left {
  //     font-size: 25px;
  //     font-weight: bold;
  //   }
  //   .header-search {
  //     display: flex;
  //     width: 76%;
  //     height: 20px;
  //     line-height: 20px;
  //     margin: 10px 0;
  //     padding: 5px 0;
  //     color: #232326;
  //     background: #f7f7f7;
  //     .borderRadius(20px);
  //     .nbSearch {
  //       padding: 0 5px 0 20px;
  //       font-size: 17px;
  //     }
  //     .search-title {
  //       font-size: 12px;
  //       color: #666;
  //       background: #f7f7f7;
  //     }
  //   }
  //   .icon-More {
  //     font-size: 20px;
  //   }
  //   .search-btn {
  //     height: 28px;
  //     margin: 8px 0;
  //     line-height: 28px;
  //     padding: 0 5px;
  //     color: #fff;
  //     background: @primary;
  //     .borderRadius(5px);
  //     margin-top: 10px;
  //   }
  // }
  // .tabStyle deep .van-tabs__nav--card{
  //     margin: 0;
  //   }

  .tabStyle {
    margin: 0;
    position: fixed; //
    top: 47px; //
    width: 100%; //
    ::v-deep {
      .van-tabs__wrap .van-tabs__nav--card {
        margin: 0;
        z-index: 99999;
      }
    }
  }
}
.content {
  height: calc(~'(100vh - 70px)');
  overflow: hidden;
  overflow-y: scroll;
  margin-top: 78px;
}
.order-list-refresh {
  .order-item {
    padding: 10px;
    border-bottom: 4px solid #dcdcdc;
    .orderStatus {
      .fj();
      font-size: 14px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
    }
    .order-info {
      padding: 5px;
      font-size: 14px;

      .boxSizing();
      p {
        margin: 0;
      }

      .people {
        .fj();
        width: 100%;
        font-size: 16px;
        color: #666;
        font-weight: 500;
      }
      .carName {
        width: 100%;
        max-height: 20px;
        padding: 10px 0;
        line-height: 25px;
        color: #666;
        overflow: hidden;
      }
      .carInfo {
        color: @titleColor;
        font-weight: 450;
      }
      .updateTime {
        .fj();
        align-items: center;
        color: @titleColor;
        font-weight: 450;
      }
    }
  }
  .empty {
    display: block;
    width: 150px;
    margin: 50px auto 20px;
  }
}
</style>
