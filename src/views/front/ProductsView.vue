<template>
  這是產品列表
  <table class="table align-middle">
    <thead>
      <tr>
        <th>圖片</th>
        <th>商品名稱</th>
        <th>價格</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" :key="product.id">
        <td style="width: 200px">
          <!-- 將圖片加入div背景圖片方法:style="{backgroundImage: `url(${product.imageUrl})`}"
                       直接插入圖片方法<img :src="product.imageUrl" alt="" /> -->
          <div
            style="
              height: 100px;
              background-size: cover;
              background-position: center;
            "
            :style="{ backgroundImage: `url(${product.imageUrl})` }"
          ></div>
        </td>
        <td>{{ product.title }}</td>
        <td>
          <div v-if="product.price === product.origin_price" class="h5">
            {{ product.price }} 元
          </div>

          <div v-else>
            <del class="h6">原價 {{ product.origin_price }} 元</del>
            <div class="h5">現在只要 {{ product.price }} 元</div>
          </div>
        </td>
        <td>
          <div class="btn-group btn-group-sm">
            <!-- 當傳入的id相同時會跑loading效果v-if="productId===product.id" -->
            <RouterLink
              :to="`/product/${product.id}`"
              class="btn btn-outline-secondary"
            >
              查看更多產品細節</RouterLink
            >
            <!-- 點擊加入購物車時會先顯示不能再次點擊按鈕:disabled="addCartLoading===product.id" -->
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="addToCart(product.id)"
              :disabled="addCartLoading === product.id"
            >
              <!-- 當傳入的id相同時會跑loading效果v-if="addCartLoading===product.id" -->
              <!-- <i
                class="fas fa-spinner fa-pulse"
                v-if="addCartLoading === product.id"
              ></i> -->
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                v-if="addCartLoading === product.id"
              ></span>
              加到購物車
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Swal from 'sweetalert2'; // 引入sweet alert2套件

// 用解構方式取得URL、PATH
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env;
export default {
  data() {
    return {
      products: [], // 產品列表
      addCartLoading: null, // 設定loading效果用的，點擊加入購物車會先將id傳入之後再清空
      fullPage: false,
    };
  },
  methods: {
    getProducts() {
      // vue loading效果
      const loader = this.$loading.show({
        // Optional parameters
        container: this.fullPage ? null : this.$refs.formContainer,
        canCancel: false, // 不可點擊關閉vue loading效果
        onCancel: this.onCancel,
        loader: 'dots', // 設定樣式
        width: 100, // 設定大小
        height: 100, // 設定大小
        color: 'gray', // 設定顏色
      });
      this.$http
        .get(`${VITE_APP_URL}v2/api/${VITE_APP_PATH}/products`)
        .then((response) => {
          // console.log('產品列表', response.data.products); 測試用
          this.products = response.data.products;
          loader.hide(); // 讀完資料關閉vue loading效果
        })
        .catch((error) => {
          Swal.fire({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
          loader.hide(); // 讀完資料關閉vue loading效果
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
  mounted() {
    this.getProducts();
  },
};
</script>
