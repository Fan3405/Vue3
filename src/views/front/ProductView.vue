<template>
  這是單一產品頁面
  <div tabindex="-1" role="dialog" aria-hidden="true">
    <div role="document">
      <div class="border-0">
        <div class="bg-dark text-white">
          <h5 class="mb-0">
            <span>{{ product.title }}</span>
          </h5>
        </div>
        <div>
          <div class="row">
            <div class="col-sm-6">
              <img class="img-fluid" :src="product.imageUrl" alt="" />
            </div>
            <div class="col-sm-6">
              <span class="badge bg-primary rounded-pill">{{}}</span>
              <p>商品描述：{{ product.description }}</p>
              <p>商品內容：{{ product.content }}</p>
              <div v-if="product.price === product.origin_price" class="h5">
                {{ product.price }} 元
              </div>
              <div v-else>
                <del class="h6">原價 {{ product.origin_price }} 元</del>
                <div class="h5">現在只要 {{ product.price }} 元</div>
              </div>
              <div>
                <div class="input-group">
                  <!-- 盡量不要用input讓使用者輸入，可改成select並用v-model="qty"綁定值，
                        <input type="number" class="form-control" min="1"> -->
                  <select name="" id="" class="form-select" v-model="qty">
                    <option :value="i" v-for="i in 30" :key="`${i}123`">
                      {{ i }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="addToCart(product.id, qty)"
                  >
                    <span
                      class="spinner-border spinner-border-sm"
                      role="status"
                      v-if="addCartLoading === product.id"
                    ></span>
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
            <!-- col-sm-6 end -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swal from 'sweetalert2'; // 引入sweet alert2套件

const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env;
// 引入sweet alert2套件
export default {
  data() {
    return {
      product: {},
      qty: 1, // 定義預設值
      addCartLoading: null, // 設定loading效果用的，點擊加入購物車會先將id傳入之後再清空
      fullPage: false,
    };
  },
  methods: {
    getProduct() {
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
      // console.log(this.$route); // 透過動態路由取得參數id
      const { id } = this.$route.params; // 解構方式取得id，也可寫成const id = this.$route.params.id但解構寫法較正確
      this.$http
        .get(`${VITE_APP_URL}v2/api/${VITE_APP_PATH}/product/${id}`)
        .then((response) => {
          // console.log('單一產品列表', response.data.product); // 測試用
          this.product = response.data.product;
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
  mounted() {
    this.getProduct();
  },
};
</script>
