<template>
  <div
    style="
      background-position: center 72%;
      background-size: cover;
      /* background-repeat: no-repeat; */
      /* background-attachment: fixed; */
      object-fit: cover;
      height: 300px;
      background-image: url('https://storage.googleapis.com/vue-course-api.appspot.com/zxcv123/1677849908265.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=fLDrB8x9v9yQBkz1XtyoXwgloH1OaEcK1KoecN1IK9ahVQygTs5Yv7DXIVMXaC%2BxV01H2LRod7sw6Ht73hkPJ1kavi4HDsnSzgoeTvMRrVP2HggMND8hZ7KQ3cKNFmsJuA81KtDCv1hYug59BVzrGd3awO9Me4T389t1nMHBOvhQNqNJ6oavqjAWcg9%2Fxpy46PFO9J%2B8Fx%2BePjNuthUqSvlaglIgZ8UGpULqLedR5jELiNXZq95kSw8HqFw%2FyzU3qCF6EAGAQ6%2FZX1akSHNzWj8f%2FnBuqBfMC3EOtbrrxd84QOtr5Em1rCQ41QqB500VQ3pYJkq%2BQ1lq7dTBgj7%2BYQ%3D%3D');
    "
  ></div>
  <main class="container">
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-9 text-center">
        <h2 class="text-darkGreen fw-bold p-4 mb-0 hrPromotions">限時特價商品</h2>
        <p class="fs-4 border border-danger d-inline-block text-danger px-3 py-1 rounded-pill clock"></p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <div class="list-group sticky-top top-150" id="list-tab" role="tablist">
          <h4 class="list-group-item bg-primary text-white m-0" aria-current="true">菜單分類</h4>
          <ul class="list-unstyled">
            <li>
              <a
                class="list-group-item list-group-item-action bg-primary bg-opacity-50 text-white"
                id="list-home-list"
                href="#"
                role="tab"
                aria-controls="list-home"
                >所有餐點
              </a>
            </li>

            <li>
              <a
                class="list-group-item list-group-item-action bg-primary bg-opacity-50 text-white"
                id="list-home-list"
                href="#"
                role="tab"
                aria-controls="list-home"
                >測試
              </a>
            </li>

            <li>
              <a
                class="list-group-item list-group-item-action bg-primary bg-opacity-50 text-white"
                id="list-home-list"
                href="#"
                role="tab"
                aria-controls="list-home"
                >測試
              </a>
            </li>

            <li>
              <a
                class="list-group-item list-group-item-action bg-primary text-white bg-opacity-50 bg-opacity-50 rounded-bottom"
                id="list-home-list"
                href="#"
                role="tab"
                aria-controls="list-home"
                >測試</a
              >
            </li>
          </ul>
        </div>
      </div>

      <div class="col-md-9">
        <div class="row my-4 g-4 mt-0">
          <div class="col-md-4 mt-0 mb-4" v-for="product in products" :key="product.id">
            <div class="card">
              <img :src="product.imageUrl" class="card-img-top object-fit" height="200" :alt="product.title" />
              <div class="card-body">
                <h5 class="card-title">
                  {{ product.title }}
                  <!-- float-end可以讓文字在span裡靠最右 -->
                  <span class="float-end"
                    >$
                    {{ product.price }}
                  </span>
                </h5>
                <!-- w-100把加入購物車按鈕設定滿寬 -->
                <RouterLink :to="`/product/${product.id}`" class="btn btn-outline-secondary w-100 mt-3">
                  查看更多產品細節</RouterLink
                >

                <!-- 點擊加入購物車時會先顯示不能再次點擊按鈕:disabled="addCartLoading===product.id" -->
                <!-- @click="() => addToCart(product.id)"前面加入箭頭函式表示要點擊才執行(在JS邏輯才會正確)，沒有加入表示立刻執行 -->
                <button
                  type="button"
                  class="btn btn-outline-primary w-100 mt-3"
                  @click="() => addToCart(product.id)"
                  :disabled="addCartLoading === product.id"
                >
                  <!-- 當傳入的id相同時會跑loading效果v-if="addCartLoading===product.id" -->
                  <!-- <i
                class="fas fa-spinner fa-pulse"
                v-if="addCartLoading === product.id"
              ></i> -->
                  <span class="spinner-border spinner-border-sm" role="status" v-if="addCartLoading === product.id"></span>
                  加到購物車
                </button>
              </div>
            </div>
          </div>
        </div>
        <PaginationComponent :pages="page" :get-data="getProducts"></PaginationComponent>
      </div>
    </div>
  </main>
</template>

<script>
import Swal from 'sweetalert2'; // 引入sweet alert2套件
import { mapActions } from 'pinia';
import cartStore from '../../stores/cartStore';
import PaginationComponent from '../../components/PaginationComponent.vue';

// 用解構方式取得URL、PATH
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env;
export default {
  data() {
    return {
      products: [], // 產品列表
      addCartLoading: null, // 設定loading效果用的，點擊加入購物車會先將id傳入之後再清空
      fullPage: false,

      currentPage: 1, // 做當前頁面使用

      page: {}, // 做分頁使用
    };
  },
  methods: {
    getProducts(page = 1) {
      this.currentPage = page;
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
        .get(`${VITE_APP_URL}v2/api/${VITE_APP_PATH}/products?page=${page}`)
        .then((response) => {
          // 將分頁功能儲存
          this.page = response.data.pagination;

          // 滾動到當前頁面的頂部
          window.scrollTo({
            top: 300,
            behavior: 'smooth',
          });

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
    ...mapActions(cartStore, ['getCarts']),
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
          this.getCarts();
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
  components: {
    PaginationComponent,
  },
};
</script>
