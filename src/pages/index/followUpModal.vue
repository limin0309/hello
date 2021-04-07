<template>
  <div class="order-list-wrap">
    <van-dialog
      v-model:show="show"
      title="跟进"
      show-cancel-button
      :before-close="onBeforeClose"
    >
      <van-form>
        <van-field
          v-model="status"
          readonly
          clickable
          name="picker"
          label="跟进状态"
          placeholder="点击选择跟进状态"
          @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-picker
            :columns="columns"
            value-key='value'
            @confirm="onConfirm"
            @cancel="showPicker = false"
          />
        </van-popup>
        <van-field
          v-model="vinCode"
          v-show="typeStatus=='1'"
          name="VIN码"
          label="VIN码"
          placeholder="VIN码"
          :rules="[{ required: true, message: '请填写VIN码' }]"
        />
      </van-form>
    </van-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { search } from './service/api';
export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['callback'],
  setup(props, ctx) {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      show: false,
      status: '',
      appraiseStatus:'',
      showPicker: false,
      vinCode: '',
      typeStatus:''
    });
    state.typeStatus= props.type
    state.show = props.show;
    const columns = [
      {
        key: 'C2B_c1_jcz',
        value: '检测中',
      },
      {
        key: 'C2B_c1_pmz',
        value: '拍卖中',
      },
      {
        key: 'C2B_c1_cj',
        value: '已成交',
      },
      {
        key: 'C2B_c1_zb',
        value: '战败',
      },
    ];
    const onConfirm = (value,index) => {
      console.log(value,'>>>>',index)
      state.status = columns[index].value;
      state.appraiseStatus=columns[index].key;
      state.showPicker = false;
    };
    const onBeforeClose = action => {
      console.log(action, 'action');
      if (action === 'confirm') {
        console.log('submitaaa', '卡卡一顿骚操作-去异步吧', state);
      } else {
        // 重置表单校验
        //  myform.resetValidation('picker');
        ctx.emit('callback');
      }
    };

    return {
      ...toRefs(state),
      columns,
      onConfirm,
      onBeforeClose,
    };
  },
};
</script>

<style lang="less" scoped></style>
