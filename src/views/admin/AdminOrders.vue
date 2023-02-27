<template>
  這是後台訂單列表
  <Loading :z-index="1060"></Loading>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>購買時間</th>
        <th>Email</th>
        <th>購買款項</th>
        <th>應付金額</th>
        <th>是否付款</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="order in orders" :key="order.id">
        <tr v-if="orders.length" :class="{ 'text-secondary': !order.is_paid }">
          <!-- <td>{{ $filters.date(order.create_at) }}</td> -->
          <td><span v-text="order.user.email" v-if="order.user"></span></td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in order.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ order.total }}</td>
          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                :id="`paidSwitch${order.id}`"
                v-model="order.is_paid"
                @change="updatePaid(order)"
              />
              <label class="form-check-label" :for="`paidSwitch${order.id}`">
                <span v-if="order.is_paid">已付款</span>
                <span v-else>未付款</span>
              </label>
            </div>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="openModal(order)"
              >
                檢視
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                type="button"
                @click="openDelOrderModal(order)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env;
export default {
  data() {
    return { orders: [] };
  },
  methods: {
    getOrders() {
      this.$http
        .get(`${VITE_APP_URL}v2/api/${VITE_APP_PATH}/admin/orders`)
        .then((response) => {
          //   this.products = response.data.products;
          console.log(response.data);
          this.orders = response.data.orders;

          // 將分頁功能儲存
          //   this.page = response.data.pagination;
        });
    },
  },
  mounted() {
    this.getOrders();
  },
};
</script>
