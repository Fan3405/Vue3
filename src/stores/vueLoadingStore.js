import { defineStore } from 'pinia';
import { useLoading } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

const vueLoadingStore = defineStore('vueLoading', {
  state: () => ({
    loading: {},
  }),
  actions: {
    showLoading() {
      this.loading = useLoading({
        // Optional parameters
        container: this.fullPage,
        canCancel: false, // 不可點擊關閉vue loading效果
        onCancel: this.onCancel,
        loader: 'dots', // 設定樣式
        width: 100, // 設定大小
        height: 100, // 設定大小
        color: 'gray', // 設定顏色
      });
      this.loading.show();
    },
    hideLoading() {
      this.loading.hide(); // 讀完資料關閉vue loading效果
    },
  },
  getters: {},
});
export default vueLoadingStore;
