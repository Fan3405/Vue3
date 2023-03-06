import { defineStore } from 'pinia';
import axios from 'axios';
import Swal from 'sweetalert2';
import vueLoadingStore from './vueLoadingStore';

const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env;

const cartStore = defineStore('cart', {
  state: () => ({
    carts: {},
    total: 0,
    final_total: 0,
  }),
  actions: {
    getCarts() {
      const { showLoading, hideLoading } = vueLoadingStore();
      showLoading();
      axios
        .get(`${VITE_APP_URL}v2/api/${VITE_APP_PATH}/cart`)
        .then((response) => {
          this.carts = response.data.data.carts;
          this.total = response.data.data.total; // 總金額
          this.final_total = response.data.data.final_total; // 總金額(包含優惠券)
          hideLoading(); // 讀完資料關閉vue loading效果
        })
        .catch((error) => {
          Swal.fire({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
          //   loader.hide(); // 讀完資料關閉vue loading效果
        });
    },
    // eslint-disable-next-line camelcase
    addToCart(product_id, qty = 1) {
      // 需要傳入後端的資料格式，qty=1當沒有傳入該參數時，預設值為1
      const data = {
        // eslint-disable-next-line camelcase
        product_id,
        qty,
      };
      // eslint-disable-next-line camelcase
      this.addCartLoading = product_id; // 加入購物車先傳入id顯示loading效果用
      this.$http
        .post(
          `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/cart`,
          { data }, // {data:data}的縮寫，因為要傳入的資料格式是物件裡帶入data，所以要加括號
        )
        .then((response) => {
          Swal.fire({
            title: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.addCartLoading = null; // 清除id下次點擊比對id才能顯示loading效果
          this.$router.push('/cart'); // 加入購物車後轉址到cart購物車頁面
        })
        .catch((error) => {
          Swal.fire({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    },
  },
  getters: {},
});

export default cartStore;
