<template>
  這是購物車頁面
  <!-- 購物車列表 -->
  <!-- 清空購物車deleteAllCarts不用帶參數可以省略()括號 -->
  <!-- 當購物車沒有資料時就不能點擊清空購物車:disabled="!cart?.carts?.length" -->
  <div class="text-end">
    <button
      class="btn btn-outline-danger"
      type="button"
      @click="deleteAllCarts"
      :disabled="!cart?.carts?.length"
    >
      清空購物車
    </button>
  </div>
  <table class="table align-middle">
    <thead>
      <tr>
        <th></th>
        <th>品名</th>
        <th style="width: 150px">數量/單位</th>
        <th>單價</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="cart?.carts?.length">
        <tr v-for="item in cart.carts" :key="item.id">
          <td>
            <!--在刪除時會顯示區塊不能點擊，避免重複觸發API :disabled="item.id===loadingItem"-->
            <button
              type="button"
              class="btn btn-outline-danger btn-sm"
              @click="deleteCartItem(item)"
              :disabled="item.id === loadingItem"
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                v-if="item.id === loadingItem"
              ></span>
              <span v-else>x</span>
            </button>
          </td>
          <td>
            {{ item.product.title }}
            <div class="text-success">已套用優惠券</div>
          </td>
          <td>
            <div class="input-group input-group-sm">
              <!-- 不要讓使用者用輸入的，改成select
                      <div class="input-group mb-3">
                        <input min="1" type="number" class="form-control" />
                        <span class="input-group-text" id="basic-addon2"
                          >{{ item.product.unit }}</span
                        >
                      </div> -->

              <!-- v-model="item.qty"綁定值 -->
              <!--在更新時會顯示灰色區塊不能點擊，等跑完才能再次修改:disabled="item.id===loadingItem"-->
              <select
                name=""
                id=""
                class="form-select"
                v-model="item.qty"
                @change="updateCartItem(item)"
                :disabled="item.id === loadingItem"
              >
                <option :value="i" v-for="i in 30" :key="i + '12345'">
                  {{ i }}
                </option>
              </select>
            </div>
          </td>
          <td class="text-end">
            <small class="text-success">折扣價：</small>
            {{ item.final_total }}
          </td>
        </tr>
      </template>
      <template v-else> 購物車目前是空的 </template>
    </tbody>

    <tfoot>
      <tr>
        <td colspan="3" class="text-end">總計</td>
        <td class="text-end">{{ cart.total }}</td>
      </tr>
      <tr>
        <td colspan="3" class="text-end text-success">折扣價</td>
        <td class="text-end text-success">{{ cart.final_total }}</td>
      </tr>
    </tfoot>
  </table>
  <div class="my-5 row justify-content-center">
    <VueForm ref="form" class="col-md-6" v-slot="{ errors }" @submit="onSubmit">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <!-- name="Email"E改大小寫都可以也可改中文 -->
        <VueField
          id="email"
          name="Email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors['Email'] }"
          placeholder="請輸入 Email"
          rules="required|email"
          v-model="data.user.email"
        ></VueField>
        <ErrorMessage name="Email" class="invalid-feedback"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="name" class="form-label">收件人姓名</label>
        <VueField
          id="name"
          name="姓名"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['姓名'] }"
          placeholder="請輸入姓名"
          rules="required"
          v-model="data.user.name"
        ></VueField>
        <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="tel" class="form-label">收件人電話</label>
        <VueField
          id="tel"
          name="電話"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['電話'] }"
          placeholder="請輸入電話"
          rules="required|min:8|max:10"
          v-model="data.user.tel"
        ></VueField>
        <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="address" class="form-label">收件人地址</label>
        <VueField
          id="address"
          name="地址"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['地址'] }"
          placeholder="請輸入地址"
          rules="required"
          v-model="data.user.address"
        ></VueField>
        <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="message" class="form-label">留言</label>
        <textarea
          id="message"
          class="form-control"
          cols="30"
          rows="10"
          v-model="data.message"
        ></textarea>
      </div>
      <div class="text-end">
        <button type="submit" class="btn btn-danger">送出訂單</button>
      </div>
    </VueForm>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
// 引入sweet alert2套件
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env;

export default {
  data() {
    return {
      productId: '',
      cart: [], // 購物車列表
      loadingItem: '', // 存id，當id存在時就不能操作
      addCartLoading: null, // 設定loading效果用的，點擊加入購物車會先將id傳入之後再清空
      data: {
        user: {
          email: '',
          name: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      fullPage: false,
    };
  },
  methods: {
    getCarts() {
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
        .get(`${VITE_APP_URL}v2/api/${VITE_APP_PATH}/cart`)
        .then((response) => {
          this.cart = response.data.data;
          // console.log('購物車列表:', response.data.data); 測試用
          // console.log(this.cart.carts.length); 測試用
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
    updateCartItem(item) {
      // 需要傳入後端的資料格式，data裡要帶的是產品id
      const data = {
        data: {
          product_id: item.product.id,
          qty: item.qty,
        },
      };
      // console.log(data, item.id); 測試用

      // 將id存起來
      this.loadingItem = item.id;

      // put裡要帶的是購物車id
      this.$http
        .put(`${VITE_APP_URL}v2/api/${VITE_APP_PATH}/cart/${item.id}`, data)
        .then((response) => {
          // console.log("更新購物車列表:", response.data); 測試用

          Swal.fire({
            title: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.getCarts();

          // 結束時再清空id
          this.loadingItem = '';
        })
        .catch((error) => {
          Swal.fire({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    },
    deleteCartItem(item) {
      // 將id存起來
      this.loadingItem = item.id;

      // delete裡要帶的是購物車id
      this.$http
        .delete(`${VITE_APP_URL}v2/api/${VITE_APP_PATH}/cart/${item.id}`)
        .then((response) => {
          // console.log("刪除購物車列表:", response.data); 測試用

          Swal.fire({
            title: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.getCarts();

          // 結束時再清空id
          this.loadingItem = '';
        })
        .catch((error) => {
          Swal.fire({
            title: error.response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    },
    deleteAllCarts() {
      this.$http
        .delete(`${VITE_APP_URL}v2/api/${VITE_APP_PATH}/carts`)
        .then((response) => {
          // console.log("刪除全部購物車列表:", response.data); 測試用

          Swal.fire({
            title: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
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
    onSubmit() {
      // 先把表單資料賦予到一個變數再使用，使用解構方式與const data = this.data;相同
      const { data } = this;
      this.$http
        .post(
          `${VITE_APP_URL}v2/api/${VITE_APP_PATH}/order`,
          { data }, // {data:data}的縮寫，因為要傳入的資料格式是物件裡帶入data，所以要加括號
        )
        .then((response) => {
          Swal.fire({
            title: response.data.message,
            icon: 'success',
            color: 'white',
            background: 'url(/photo-1513151233558-d860c5398176.gif)',
          });
          // 將表單資料清空
          this.$refs.form.resetForm();
          this.data.message = ''; // 將留言清空
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
    this.getCarts(); // 進入頁面先取得購物車列表
  },
};
</script>
